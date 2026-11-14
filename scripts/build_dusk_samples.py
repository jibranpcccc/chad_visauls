import asyncio
import json
import os
import subprocess
import sys
from pathlib import Path

import edge_tts

ROOT = Path(r"C:\Users\jibra\.gemini\antigravity\scratch\chad_visauls")
SFX_LIB = Path(r"C:\Users\jibra\.gemini\antigravity\scratch\video-repos\what-if-animation\studio\library\sfx")
WORK = ROOT / "out" / "_audio_tmp"
WORK.mkdir(parents=True, exist_ok=True)

FPS = 30

VOICES = {
    "narr": ("en-US-ChristopherNeural", "+14%", "+0Hz"),
    "sis": ("en-US-AnaNeural", "+15%", "+4Hz"),
    "mo": ("en-US-AndrewNeural", "+14%", "+0Hz"),
    "nova": ("en-US-JennyNeural", "+14%", "+2Hz"),
    "suit": ("en-GB-RyanNeural", "+12%", "-2Hz"),
    "leo": ("en-US-GuyNeural", "+15%", "+2Hz"),
    "mom": ("en-US-AriaNeural", "+12%", "-1Hz"),
}


def resolve_sfx(name: str) -> Path | None:
    exact = SFX_LIB / f"{name}.mp3"
    if exact.exists():
        return exact
    matches = sorted(SFX_LIB.glob(f"{name}-*.mp3"))
    return matches[0] if matches else None


def run(cmd: list[str]):
    subprocess.run(cmd, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)


def ffprobe_dur(path: Path) -> float:
    out = subprocess.check_output(
        [
            "ffprobe",
            "-v",
            "error",
            "-show_entries",
            "format=duration",
            "-of",
            "default=noprint_wrappers=1:nokey=1",
            str(path),
        ],
        text=True,
    ).strip()
    return float(out)


async def synth_line(speaker: str, text: str, raw_path: Path):
    voice, rate, pitch = VOICES[speaker]
    comm = edge_tts.Communicate(text, voice=voice, rate=rate, pitch=pitch)
    await comm.save(str(raw_path))


def process_clip(raw_path: Path, clean_path: Path, muffle: bool = False, cut_end_sec: float | None = None):
    filters = [
        "silenceremove=start_periods=1:start_threshold=-42dB:detection=peak",
        "areverse",
        "silenceremove=start_periods=1:start_threshold=-42dB:detection=peak",
        "areverse",
        "loudnorm=I=-16:TP=-1.5:LRA=7",
    ]
    if muffle:
        filters.append("lowpass=f=700,highpass=f=220,volume=0.38")
    cmd = ["ffmpeg", "-y", "-i", str(raw_path), "-af", ",".join(filters)]
    if cut_end_sec is not None:
        cmd += ["-t", f"{cut_end_sec:.3f}"]
    cmd += ["-ar", "44100", "-ac", "2", str(clean_path)]
    run(cmd)


EPISODES = {
    "dusk-mute": {
        "title": "WHAT IF YOU COULD MUTE ANYONE?",
        "gap": 0.14,
        "lines": [
            ("l1", "narr", "Imagine a single button that mutes anyone in real life.", 0.10, False, None, [("select_draw", 12, 0.55), ("class_murmur", 0, 0.25)]),
            ("l2", "sis", "And then she literally stole my seat, wait are you even—", 0.10, False, 2.05, [("switch_off", 58, 0.9), ("pop", 60, 0.65)]),
            ("l3", "mo", "Finally. Pure, golden silence.", 0.22, False, None, [("shades", 2, 0.75), ("title_boom", 14, 0.85)]),
            ("l4", "narr", "No spoilers. No whining. Until someone tries to warn you.", 0.24, False, None, [("step", 8, 0.45), ("step", 24, 0.45)]),
            ("l5", "sis", "Mo! Watch out, loose step!", 0.10, True, None, [("tumble", 18, 0.9), ("crack", 24, 0.85)]),
            ("l6", "sis", "Unmuted. Miss my voice yet?", 0.36, False, None, [("ding", -4, 0.8)]),
            ("l7", "mo", "Put it back on mute.", 0.12, False, None, [("dizzy", 2, 0.6)]),
        ],
    },
    "dusk-pause": {
        "title": "WHAT IF ONE CLICK FROZE TIME?",
        "gap": 0.14,
        "lines": [
            ("l1", "narr", "One click pauses the entire room. Except for you.", 0.10, False, None, [("paper_land", 6, 0.6), ("counter_tick", 18, 0.5)]),
            ("l2", "nova", "Wait, the client needs those numbers right—", 0.10, False, 1.85, [("power_down", 48, 0.9), ("pop", 50, 0.65)]),
            ("l3", "suit", "Relax. Nobody moves until I finish my coffee.", 0.22, False, None, [("shades", 2, 0.75), ("title_boom", 16, 0.85)]),
            ("l4", "narr", "Zero friction. Frozen clocks. Only one tiny glitch.", 0.22, False, None, [("glitch", 42, 0.85)]),
            ("l5", "nova", "Cool trick. Wait, why did you steal my mug?", 0.18, False, None, [("sparkle", -4, 0.75), ("step", 14, 0.5)]),
            ("l6", "suit", "How are you still moving?!", 0.10, False, None, [("gasp", -2, 0.85), ("buzzer", 20, 0.5)]),
        ],
    },
    "dusk-glow": {
        "title": "WHAT IF EVERY LIE MADE YOU GLOW?",
        "gap": 0.14,
        "lines": [
            ("l1", "narr", "Imagine if every white lie lit you up like the sun.", 0.10, False, None, [("room_tone", 0, 0.25), ("cookie_crunch", 20, 0.5)]),
            ("l2", "mom", "Leo... did you eat all my warm cookies?", 0.12, False, None, [("cat_chirp", 2, 0.55)]),
            ("l3", "leo", "What? No! I wasn't even near the kitchen.", 0.10, False, None, [("bulb_pop", 28, 0.9), ("sparkle", 30, 0.7)]),
            ("l4", "narr", "Small fib, soft lantern. Big lie? Whole street sees it.", 0.22, False, None, [("title_boom", 6, 0.85), ("counter_tick", 28, 0.65)]),
            ("l5", "leo", "Okay, maybe one tiny bite! Totally not five!", 0.14, False, None, [("power_hum", 12, 0.5), ("buzzer", 46, 0.7)]),
            ("l6", "mom", "Leo, you're brighter than the streetlight outside.", 0.18, False, None, [("laugh", 42, 0.55)]),
        ],
    },
}


async def build_episode(slug: str, cfg: dict):
    ep_tmp = WORK / slug
    ep_tmp.mkdir(parents=True, exist_ok=True)
    pub_dir = ROOT / "public" / slug
    pub_dir.mkdir(parents=True, exist_ok=True)
    ep_dir = ROOT / "src" / "episodes" / slug
    ep_dir.mkdir(parents=True, exist_ok=True)

    cursor_sec = 0.0
    turns = []
    sfx_events = []

    for lid, spk, txt, pre_gap, muffle, cut_sec, sfx_list in cfg["lines"]:
        raw = ep_tmp / f"{lid}_raw.mp3"
        clean = ep_tmp / f"{lid}.wav"
        await synth_line(spk, txt, raw)
        process_clip(raw, clean, muffle=muffle, cut_end_sec=cut_sec)
        dur = ffprobe_dur(clean)

        cursor_sec += pre_gap
        start_sec = cursor_sec
        end_sec = start_sec + dur
        start_f = round(start_sec * FPS)
        end_f = round(end_sec * FPS)

        turns.append({
            "id": lid,
            "speaker": spk,
            "text": txt,
            "startSec": round(start_sec, 3),
            "endSec": round(end_sec, 3),
            "startF": start_f,
            "endF": end_f,
            "wav": str(clean),
        })

        for sfx_name, df, vol in sfx_list:
            sfx_file = resolve_sfx(sfx_name)
            if sfx_file is not None and vol > 0:
                t_sec = max(0.0, start_sec + df / FPS)
                sfx_events.append((sfx_file, t_sec, vol))

        cursor_sec = end_sec

    total_sec = round(cursor_sec + 0.55, 2)
    total_frames = int(round(total_sec * FPS))

    # Build voice.mp3 by overlaying all line wavs at exact timestamps
    voice_out = pub_dir / "voice.mp3"
    v_inputs = ["-f", "lavfi", "-t", f"{total_sec:.3f}", "-i", "anullsrc=channel_layout=stereo:sample_rate=44100"]
    v_filters = []
    mix_labels = ["[0:a]"]
    for idx, tr in enumerate(turns, start=1):
        v_inputs += ["-i", tr["wav"]]
        ms = int(round(tr["startSec"] * 1000))
        lbl = f"[v{idx}]"
        v_filters.append(f"[{idx}:a]adelay={ms}|{ms}{lbl}")
        mix_labels.append(lbl)
    v_filters.append(f"{''.join(mix_labels)}amix=inputs={len(mix_labels)}:duration=first:normalize=0,alimiter=limit=0.95[vout]")
    run(["ffmpeg", "-y", *v_inputs, "-filter_complex", ";".join(v_filters), "-map", "[vout]", "-b:a", "192k", str(voice_out)])

    # Build sfx.mp3
    sfx_out = pub_dir / "sfx.mp3"
    if sfx_events:
        s_inputs = ["-f", "lavfi", "-t", f"{total_sec:.3f}", "-i", "anullsrc=channel_layout=stereo:sample_rate=44100"]
        s_filters = []
        s_mix = ["[0:a]"]
        for idx, (sf, ts, vol) in enumerate(sfx_events, start=1):
            s_inputs += ["-i", str(sf)]
            ms = int(round(ts * 1000))
            lbl = f"[s{idx}]"
            s_filters.append(f"[{idx}:a]aformat=sample_rates=44100:channel_layouts=stereo,volume={vol:.2f},adelay={ms}|{ms}{lbl}")
            s_mix.append(lbl)
        s_filters.append(f"{''.join(s_mix)}amix=inputs={len(s_mix)}:duration=first:normalize=0,alimiter=limit=0.9[sout]")
        run(["ffmpeg", "-y", *s_inputs, "-filter_complex", ";".join(s_filters), "-map", "[sout]", "-b:a", "192k", str(sfx_out)])
    else:
        run(["ffmpeg", "-y", "-f", "lavfi", "-t", f"{total_sec:.3f}", "-i", "anullsrc=channel_layout=stereo:sample_rate=44100", "-b:a", "128k", str(sfx_out)])

    # Build music.mp3 (soft bed from library loop + gentle duck under dialogue turns)
    music_src = SFX_LIB / "music-4cdabe20.mp3"
    music_out = pub_dir / "music.mp3"
    fade_start = max(0.0, total_sec - 0.8)
    run([
        "ffmpeg", "-y",
        "-stream_loop", "-1", "-i", str(music_src),
        "-t", f"{total_sec:.3f}",
        "-af", f"aformat=sample_rates=44100:channel_layouts=stereo,volume=0.22,afade=t=in:st=0:d=0.35,afade=t=out:st={fade_start:.2f}:d=0.8",
        "-b:a", "192k",
        str(music_out),
    ])

    dialogue_meta = [
        {k: v for k, v in t.items() if k != "wav"}
        for t in turns
    ]
    (ep_dir / "dialogue.json").write_text(json.dumps({"totalFrames": total_frames, "totalSec": total_sec, "turns": dialogue_meta}, indent=2))
    print(f"[{slug}] built audio: {total_sec:.2f}s ({total_frames} frames), lines={len(turns)}, sfx={len(sfx_events)}")
    for d in dialogue_meta:
        print(f"  {d['id']} ({d['speaker']}): f{d['startF']}..f{d['endF']} ({d['startSec']}s..{d['endSec']}s) | {d['text']}")


async def main():
    for slug, cfg in EPISODES.items():
        await build_episode(slug, cfg)


if __name__ == "__main__":
    asyncio.run(main())
