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
OUT_AUDIO = ROOT / "public" / "five"
OUT_DATA = ROOT / "src" / "data"
OUT_AUDIO.mkdir(parents=True, exist_ok=True)
OUT_DATA.mkdir(parents=True, exist_ok=True)


def synth_bed(kind: str, dur_s: float) -> np.ndarray:
    """Synthesize a clean, non-fatiguing musical bed unique to each style."""
    n = int(dur_s * SR)
    t = np.linspace(0, dur_s, n, endpoint=False, dtype=np.float32)
    bed = np.zeros(n, dtype=np.float32)

    if kind == "marimba":
        # Cheerful C-major pentatonic plucks every 0.375s
        notes = [523.25, 659.25, 783.99, 659.25, 880.0, 783.99, 659.25, 587.33]
        step = 0.375
        for i in range(int(dur_s / step)):
            f = notes[i % len(notes)]
            s = int(i * step * SR)
            ln = min(int(0.32 * SR), n - s)
            lt = np.arange(ln, dtype=np.float32) / SR
            env = np.exp(-lt * 11.0)
            bed[s : s + ln] += (np.sin(2 * np.pi * f * lt) + 0.25 * np.sin(4 * np.pi * f * lt)) * env * 0.22
    elif kind == "synth":
        # Deep obsidian tech pulse (A minor)
        bass = 110.0
        step = 0.25
        for i in range(int(dur_s / step)):
            f = bass if (i // 4) % 2 == 0 else 98.0
            s = int(i * step * SR)
            ln = min(int(0.22 * SR), n - s)
            lt = np.arange(ln, dtype=np.float32) / SR
            env = np.exp(-lt * 14.0)
            bed[s : s + ln] += np.sin(2 * np.pi * f * lt) * env * 0.28
        bed += 0.04 * np.sin(2 * np.pi * 220.0 * t) * (0.5 + 0.5 * np.sin(2 * np.pi * 0.5 * t))
    elif kind == "electro":
        # Crisp forensic arpeggio
        notes = [220.0, 261.63, 329.63, 392.0]
        step = 0.20
        for i in range(int(dur_s / step)):
            f = notes[i % len(notes)]
            s = int(i * step * SR)
            ln = min(int(0.18 * SR), n - s)
            lt = np.arange(ln, dtype=np.float32) / SR
            env = np.exp(-lt * 16.0)
            bed[s : s + ln] += np.sin(2 * np.pi * f * lt) * env * 0.20
    elif kind == "chime":
        # Warm acoustic-style editorial chimes (Fmaj7)
        chords = [[349.23, 440.0, 523.25], [392.0, 493.88, 587.33]]
        step = 1.5
        for i in range(int(dur_s / step)):
            ch = chords[i % len(chords)]
            s = int(i * step * SR)
            ln = min(int(1.4 * SR), n - s)
            lt = np.arange(ln, dtype=np.float32) / SR
            env = np.exp(-lt * 2.8) * np.minimum(1.0, lt * 40.0)
            for f in ch:
                bed[s : s + ln] += np.sin(2 * np.pi * f * lt) * env * 0.12

    return np.stack([bed, bed], axis=1)


def load_sfx(fname: str) -> np.ndarray:
    path = SFX_DIR / fname
    tmp = OUT_AUDIO / f"{path.stem}_tmp.wav"
    subprocess.run(
        ["ffmpeg", "-y", "-i", str(path), "-ar", str(SR), "-ac", "2", str(tmp)],
        check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL
    )
    data, _ = sf.read(tmp, dtype="float32")
    tmp.unlink(missing_ok=True)
    if data.ndim == 1:
        data = np.stack([data, data], axis=1)
    return data


def place(mix: np.ndarray, clip: np.ndarray, start_s: float, gain: float):
    idx = int(start_s * SR)
    if idx >= len(mix):
        return
    end = min(len(mix), idx + len(clip))
    mix[idx:end] += clip[: end - idx] * gain


STYLES = {
    "s1": {
        "title": "What If You Remembered Every Second?",
        "voice": "en-US-ChristopherNeural",
        "rate": "+14%",
        "bed": "file:music-4cdabe20.mp3",
        "beats": [
            ("B1", "Imagine never forgetting a single page you read.", "paper_land-e0d75d32.mp3"),
            ("B2", "Every argument and date stored in razor-sharp detail.", "pop-99ba70e6.mp3"),
            ("B3", "What if you remembered every second?", "title_boom-91f4f23e.mp3"),
            ("B4", "Friends think it's cool—until mistakes replay forever.", "drone_hit-75f05067.mp3"),
            ("B5", "Forgetting isn't a bug. It keeps you sane.", "ding-a322cf81.mp3"),
        ],
    },
    "s2": {
        "title": "How Honeybees Dance to Share GPS",
        "voice": "en-US-JennyNeural",
        "rate": "+14%",
        "bed": "marimba",
        "beats": [
            ("B1", "A scout bee finds flowers and races straight home.", "bulb_pop-2ea0e2d7.mp3"),
            ("B2", "Inside the hive, the whole crew gathers close.", "pop-99ba70e6.mp3"),
            ("B3", "She dances a figure-eight angled toward the sun.", "sparkle-595dbfb7.mp3"),
            ("B4", "Her waggle encodes exact distance and direction.", "counter_tick-37ca9370.mp3"),
            ("B5", "The squad launches straight to nectar—zero GPS needed.", "ding-a322cf81.mp3"),
        ],
    },
    "s3": {
        "title": "How GPS Finds You With Light Speed",
        "voice": "en-US-GuyNeural",
        "rate": "+14%",
        "bed": "synth",
        "beats": [
            ("B1", "Thirty-one GPS satellites beam timestamps at light speed.", "glitch-4bc7163d.mp3"),
            ("B2", "Your phone measures nanosecond delays from four satellites.", "counter_tick-37ca9370.mp3"),
            ("B3", "Where four spheres intersect, your position locks in.", "pop-99ba70e6.mp3"),
            ("B4", "Without Einstein's relativity, GPS drifts eleven kilometers daily.", "power_down-46ef6bed.mp3"),
            ("B5", "Pure math and light speed within three meters.", "sparkle-595dbfb7.mp3"),
        ],
    },
    "s4": {
        "title": "Why 3nm Chips Pack Billions of Transistors",
        "voice": "en-US-AndrewNeural",
        "rate": "+14%",
        "bed": "electro",
        "beats": [
            ("B1", "A hair is eighty thousand nanometers—chip gates are three.", "power_hum-ae629acb.mp3"),
            ("B2", "Shrinking to three nanometers packs five times more switches.", "counter_tick-37ca9370.mp3"),
            ("B3", "Shorter signals slash wasted power and heat.", "clink-169430e3.mp3"),
            ("B4", "Engineers stack vertical fins like microscopic skyscrapers.", "bulb_pop-2ea0e2d7.mp3"),
            ("B5", "One hundred billion switches flipping billions of times.", "ding-a322cf81.mp3"),
        ],
    },
    "s5": {
        "title": "Why Flamingos Are Actually Born Grey",
        "voice": "en-GB-SoniaNeural",
        "rate": "+14%",
        "bed": "chime",
        "beats": [
            ("B1", "Baby flamingos hatch completely fluffy and grey.", "pop-99ba70e6.mp3"),
            ("B2", "Their neon pink colour comes purely from diet.", "paper_land-e0d75d32.mp3"),
            ("B3", "Brine shrimp and algae carry bright red-orange carotenoids.", "sparkle-595dbfb7.mp3"),
            ("B4", "Enzymes break them down, dyeing growing feathers coral pink.", "bulb_pop-2ea0e2d7.mp3"),
            ("B5", "In nature, you literally are what you eat.", "ding-a322cf81.mp3"),
        ],
    },
}


async def build_all():
    model = WhisperModel("base", device="cpu", compute_type="int8")
    meta = {}

    for slug, cfg in STYLES.items():
        beat_audios = []
        beat_ranges = []
        sfx_cues = []
        cursor_s = 0.25

        for bid, line, sfx_name in cfg["beats"]:
            mp3 = OUT_AUDIO / f"{slug}_{bid}.mp3"
            wav = OUT_AUDIO / f"{slug}_{bid}.wav"
            comm = edge_tts.Communicate(line, cfg["voice"], rate=cfg["rate"])
            await comm.save(str(mp3))
            subprocess.run(
                ["ffmpeg", "-y", "-i", str(mp3), "-ar", str(SR), "-ac", "2", str(wav)],
                check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL
            )
            data, _ = sf.read(wav, dtype="float32")
            if data.ndim == 1:
                data = np.stack([data, data], axis=1)
            mp3.unlink(missing_ok=True)
            wav.unlink(missing_ok=True)

            dur_s = len(data) / SR + 0.18
            pad = int(dur_s * SR) - len(data)
            if pad > 0:
                data = np.concatenate([data, np.zeros((pad, 2), dtype="float32")])

            a = int(round(cursor_s * FPS))
            b = int(round((cursor_s + dur_s) * FPS))
            beat_ranges.append({"id": bid, "a": a, "b": b, "line": line})
            sfx_cues.append((sfx_name, cursor_s + 0.08))
            beat_audios.append(data)
            cursor_s += dur_s

        # Pad to cleanly fit 16-20s range
        total_s = max(16.0, min(20.0, cursor_s + 0.45)) if cursor_s <= 19.5 else cursor_s + 0.45
        total_frames = int(round(total_s * FPS))
        total_samples = int(total_s * SR)

        voice_track = np.zeros((total_samples, 2), dtype=np.float32)
        lead = int(0.25 * SR)
        voice_cat = np.concatenate(beat_audios)
        end = min(total_samples, lead + len(voice_cat))
        voice_track[lead:end] = voice_cat[: end - lead]

        # Transcribe assembled voice track for exact word timestamps
        tmp_voice = OUT_AUDIO / f"{slug}_fullvoice.wav"
        sf.write(tmp_voice, voice_track, SR)
        segs, _ = model.transcribe(str(tmp_voice), word_timestamps=True)
        words = []
        for s in segs:
            if s.words:
                for w in s.words:
                    words.append({"word": w.word.strip(), "start": round(w.start, 3), "end": round(w.end, 3)})
        tmp_voice.unlink(missing_ok=True)
        (OUT_DATA / f"five_{slug}_words.json").write_text(json.dumps(words, indent=2), encoding="utf-8")

        # Build final mix
        mix = np.zeros((total_samples, 2), dtype=np.float32)
        if cfg["bed"].startswith("file:"):
            bed_clip = load_sfx(cfg["bed"].split(":", 1)[1])
            pos = 0
            while pos < total_samples:
                chunk = min(len(bed_clip), total_samples - pos)
                mix[pos : pos + chunk] += bed_clip[:chunk] * 0.14
                pos += chunk
        else:
            mix += synth_bed(cfg["bed"], total_s) * 0.30

        for fname, t_s in sfx_cues:
            place(mix, load_sfx(fname), t_s, 0.45)

        mix += voice_track * 1.0

        peak = np.max(np.abs(mix))
        if peak > 0.95:
            mix = mix * (0.95 / peak)

        raw_wav = OUT_AUDIO / f"{slug}_raw.wav"
        master_wav = OUT_AUDIO / f"{slug}_master.wav"
        sf.write(raw_wav, mix, SR)
        subprocess.run(
            ["ffmpeg", "-y", "-i", str(raw_wav), "-af", "loudnorm=I=-14:TP=-1.5:LRA=11", "-ar", str(SR), "-ac", "2", str(master_wav)],
            check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL
        )
        raw_wav.unlink(missing_ok=True)

        # Extend last beat to total_frames
        beat_ranges[-1]["b"] = total_frames
        meta[slug] = {
            "title": cfg["title"],
            "duration": round(total_s, 2),
            "frames": total_frames,
            "words": len(words),
            "beats": beat_ranges,
        }
        print(f"{slug}: {total_s:.2f}s ({total_frames} frames), {len(words)} words")

    (OUT_DATA / "five_meta.json").write_text(json.dumps(meta, indent=2), encoding="utf-8")


if __name__ == "__main__":
    asyncio.run(build_all())
