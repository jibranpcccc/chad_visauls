import asyncio
import json
import subprocess
from pathlib import Path
import numpy as np
import soundfile as sf
import edge_tts
from faster_whisper import WhisperModel

SR = 48000
FPS = 30
ROOT = Path(__file__).resolve().parent.parent
SFX_DIR = Path(r"C:\Users\jibra\.gemini\antigravity\scratch\video-repos\what-if-animation\studio\library\sfx")
PUB = ROOT / "public" / "pause-everyone"
EP_DIR = ROOT / "src" / "episodes" / "pause-everyone"
PUB.mkdir(parents=True, exist_ok=True)
EP_DIR.mkdir(parents=True, exist_ok=True)

BEATS = [
    ("S1", "Pause your sister mid-argument.", "pause", "switch_off-9588c15a.mp3"),
    ("S2", "Steal the last cookie right off the plate.", "pause", "cookie_crunch-265c6a17.mp3"),
    ("S3", "Freeze your friend Mo before he spills his drink.", "pause", "gasp-372b408b.mp3"),
    ("S4", "Even pause Mum before she sees the mess.", "pause", "pop-99ba70e6.mp3"),
    ("S5", "What if you could pause everyone else on Earth?", None, "title_boom-91f4f23e.mp3"),
    ("S6", "At first, it feels like a superpower.", None, "sparkle-595dbfb7.mp3"),
    ("S7", "Walk past The Suit into any restricted room.", "pause", "step-60144e17.mp3"),
    ("S8", "Finish your homework while the whole world waits.", "pause", "paper_land-e0d75d32.mp3"),
    ("S9", "Nap for six hours on a busy staircase.", "pause", "room_tone-e711a45f.mp3"),
    ("S10", "Until you realize one terrifying physics catch.", None, "drone_hit-75f05067.mp3"),
    ("S11", "If air molecules are frozen solid around you,", None, "power_down-46ef6bed.mp3"),
    ("S12", "you couldn't breathe, and light couldn't reach your eyes.", None, "glitch-4bc7163d.mp3"),
    ("S13", "Every step would feel like slamming into concrete.", None, "crack-3cbd3c57.mp3"),
    ("S14", "Unpause!", "unpause", "bulb_pop-2ea0e2d7.mp3"),
    ("S15", "Now everyone stares as you appear out of thin air,", None, "laugh-7d80a59f.mp3"),
    ("S16", "holding a cookie you definitely didn't pay for.", None, "ding-a322cf81.mp3"),
]


def load_audio(path: Path) -> np.ndarray:
    tmp = PUB / f"{path.stem}_tmp.wav"
    subprocess.run(
        ["ffmpeg", "-y", "-i", str(path), "-ar", str(SR), "-ac", "2", str(tmp)],
        check=True,
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
    )
    data, _ = sf.read(tmp, dtype="float32")
    tmp.unlink(missing_ok=True)
    if data.ndim == 1:
        data = np.stack([data, data], axis=1)
    return data


async def main_async():
    # Generate each beat individually so shot timings are 100% exact!
    segments_audio = []
    timeline_segs = []
    sfx_cues = []

    cursor_s = 0.25
    silence_gap = np.zeros((int(0.28 * SR), 2), dtype=np.float32)

    for shot_id, line, look, sfx_file in BEATS:
        mp3 = PUB / f"{shot_id}.mp3"
        wav = PUB / f"{shot_id}.wav"
        comm = edge_tts.Communicate(line, "en-US-ChristopherNeural", rate="-4%")
        await comm.save(str(mp3))
        subprocess.run(
            ["ffmpeg", "-y", "-i", str(mp3), "-ar", str(SR), "-ac", "2", str(wav)],
            check=True,
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL,
        )
        data, _ = sf.read(wav, dtype="float32")
        if data.ndim == 1:
            data = np.stack([data, data], axis=1)
        mp3.unlink(missing_ok=True)
        wav.unlink(missing_ok=True)

        # Trim trailing silence & ensure at least 3.6s per beat so total >= 60s
        dur_s = max(3.65, len(data) / SR + 0.45)
        pad_len = int(dur_s * SR) - len(data)
        if pad_len > 0:
            data = np.concatenate([data, np.zeros((pad_len, 2), dtype=np.float32)])

        a = int(round(cursor_s * FPS))
        b = int(round((cursor_s + dur_s) * FPS))
        seg = {"shot": shot_id, "a": a, "b": b, "t0": 0, "t1": b - a, "line": line}
        if look:
            seg["look"] = look
        timeline_segs.append(seg)
        sfx_cues.append((sfx_file, cursor_s + 0.12))
        segments_audio.append(data)
        cursor_s += dur_s

    total_frames = timeline_segs[-1]["b"]
    total_s = total_frames / FPS
    total_samples = int(total_s * SR)

    # Build voice.mp3
    voice_mix = np.zeros((total_samples, 2), dtype=np.float32)
    lead = int(0.25 * SR)
    voice_cat = np.concatenate(segments_audio)
    end = min(total_samples, lead + len(voice_cat))
    voice_mix[lead:end] = voice_cat[: end - lead]
    sf.write(PUB / "voice_raw.wav", voice_mix, SR)
    subprocess.run(
        ["ffmpeg", "-y", "-i", str(PUB / "voice_raw.wav"), "-b:a", "192k", str(PUB / "voice.mp3")],
        check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL
    )
    (PUB / "voice_raw.wav").unlink(missing_ok=True)

    # Build sfx.mp3
    sfx_mix = np.zeros((total_samples, 2), dtype=np.float32)
    for fname, t_s in sfx_cues:
        clip = load_audio(SFX_DIR / fname)
        idx = int(t_s * SR)
        e = min(total_samples, idx + len(clip))
        sfx_mix[idx:e] += clip[: e - idx] * 0.65
    sf.write(PUB / "sfx_raw.wav", sfx_mix, SR)
    subprocess.run(
        ["ffmpeg", "-y", "-i", str(PUB / "sfx_raw.wav"), "-b:a", "192k", str(PUB / "sfx.mp3")],
        check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL
    )
    (PUB / "sfx_raw.wav").unlink(missing_ok=True)

    # Build music.mp3
    music = load_audio(SFX_DIR / "music-4cdabe20.mp3")
    music_mix = np.zeros((total_samples, 2), dtype=np.float32)
    pos = 0
    while pos < total_samples:
        chunk = min(len(music), total_samples - pos)
        music_mix[pos : pos + chunk] = music[:chunk] * 0.22
        pos += chunk
    sf.write(PUB / "music_raw.wav", music_mix, SR)
    subprocess.run(
        ["ffmpeg", "-y", "-i", str(PUB / "music_raw.wav"), "-b:a", "192k", str(PUB / "music.mp3")],
        check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL
    )
    (PUB / "music_raw.wav").unlink(missing_ok=True)

    shots_meta = [
        {
            "id": seg["shot"],
            "size": "medium",
            "key": max(1, (seg["b"] - seg["a"]) // 2),
            "len": seg["b"] - seg["a"],
            "first": seg["a"],
            "line": seg["line"],
            "note": seg["line"],
        }
        for seg in timeline_segs
    ]
    timeline = {
        "slug": "pause-everyone",
        "title": "WHAT IF YOU COULD PAUSE EVERYONE ELSE?",
        "fps": FPS,
        "total": total_frames,
        "segments": timeline_segs,
        "shots": shots_meta,
        "fx": [
            {"kind": "flash", "color": "#DDF2FF", "o": 0.45, "f": timeline_segs[4]["a"]},
            {"kind": "flash", "color": "#FFFFFF", "o": 0.65, "f": timeline_segs[13]["a"]},
        ],
        "audio": {
            "voiceVol": 0.9,
            "sfxVol": 0.5,
            "musicVol": 0.14,
            "voice": "pause-everyone/voice.mp3",
            "sfx": "pause-everyone/sfx.mp3",
            "music": "pause-everyone/music.mp3",
        },
    }
    (EP_DIR / "timeline.json").write_text(json.dumps(timeline, indent=2), encoding="utf-8")
    print(f"pause-everyone built: {total_s:.2f}s ({total_frames} frames), {len(timeline_segs)} shots")


if __name__ == "__main__":
    asyncio.run(main_async())
