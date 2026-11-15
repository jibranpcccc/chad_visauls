import asyncio
import json
import subprocess
from pathlib import Path

import edge_tts
import numpy as np
import soundfile as sf
from faster_whisper import WhisperModel

ROOT = Path(r"C:\Users\jibra\.gemini\antigravity\scratch\chad_visauls")
SFX_LIB = Path(r"C:\Users\jibra\.gemini\antigravity\scratch\video-repos\what-if-animation\studio\library\sfx")
WORK = ROOT / "out" / "_niche_audio_tmp"
WORK.mkdir(parents=True, exist_ok=True)

FPS = 30

VOICES = {
    "narr": ("en-US-ChristopherNeural", "+14%", "+0Hz"),
    "pip": ("en-US-AndrewNeural", "+15%", "+3Hz"),
    "mom": ("en-US-AriaNeural", "+12%", "-1Hz"),
    "nova": ("en-US-JennyNeural", "+14%", "+2Hz"),
    "suit": ("en-GB-RyanNeural", "+12%", "-2Hz"),
    "leo": ("en-US-GuyNeural", "+15%", "+1Hz"),
    "sis": ("en-US-AnaNeural", "+12%", "+2Hz"),
}

WHISPER_MODEL = None


def get_whisper():
    global WHISPER_MODEL
    if WHISPER_MODEL is None:
        WHISPER_MODEL = WhisperModel("tiny.en", device="cpu", compute_type="int8")
    return WHISPER_MODEL


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
        ["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "default=noprint_wrappers=1:nokey=1", str(path)],
        text=True,
    ).strip()
    return float(out)


async def synth_line(speaker: str, text: str, raw_path: Path):
    voice, rate, pitch = VOICES[speaker]
    for attempt in range(4):
        try:
            comm = edge_tts.Communicate(text, voice=voice, rate=rate, pitch=pitch)
            await comm.save(str(raw_path))
            return
        except Exception:
            if attempt == 3:
                raise
            await asyncio.sleep(1.0 + attempt)


def process_clip(raw_path: Path, clean_path: Path, muffle: bool = False):
    filters = [
        "silenceremove=start_periods=1:start_threshold=-42dB:detection=peak:stop_periods=-1:stop_duration=0.20:stop_threshold=-40dB",
        "areverse",
        "silenceremove=start_periods=1:start_threshold=-42dB:detection=peak",
        "areverse",
        "loudnorm=I=-16:TP=-1.5:LRA=7",
    ]
    if muffle:
        filters.append("lowpass=f=750,highpass=f=240,volume=0.58")
    cmd = ["ffmpeg", "-y", "-i", str(raw_path), "-af", ",".join(filters), "-ar", "44100", "-ac", "2", str(clean_path)]
    run(cmd)


def extract_mouth_rms(wav_path: Path) -> list[float]:
    data, sr = sf.read(str(wav_path))
    if data.ndim > 1:
        data = data.mean(axis=1)
    win = max(1, int(sr / FPS))
    n_frames = max(1, int(np.ceil(len(data) / win)))
    vals = []
    for i in range(n_frames):
        seg = data[i * win : (i + 1) * win]
        rms = float(np.sqrt(np.mean(seg * seg))) if len(seg) else 0.0
        vals.append(rms)
    peak = max(vals) if vals else 1.0
    if peak < 1e-4:
        return [0.0] * len(vals)
    return [round(min(1.0, max(0.0, (v / peak) * 1.45 if v > peak * 0.08 else 0.0)), 3) for v in vals]


def extract_words(wav_path: Path, start_sec: float) -> list[dict]:
    model = get_whisper()
    segs, _ = model.transcribe(str(wav_path), word_timestamps=True, language="en")
    out = []
    for s in segs:
        if not s.words:
            continue
        for w in s.words:
            ws = start_sec + float(w.start)
            we = start_sec + float(w.end)
            out.append({
                "word": w.word.strip(),
                "startSec": round(ws, 3),
                "endSec": round(we, 3),
                "startF": int(round(ws * FPS)),
                "endF": int(round(we * FPS)),
            })
    return out


EPISODES = {
    "niche-whatif": {
        "lines": [
            ("l1", "narr", "Imagine a button that rewinds just five seconds.", 0.12, False, [("room_tone", "start", 0, 0.25), ("counter_tick", "word:five", 0, 0.45)]),
            ("l2", "pip", "Oops, sorry!", 0.14, False, [("shatter", "start", 0, 0.72)]),
            ("l3", "pip", "Rewind!", 0.18, False, [("rewind_start", "start", 0, 0.78), ("rewind", "start", 4, 0.65), ("clock_back", "end", 0, 0.55)]),
            ("l4", "narr", "Zero mess. Zero blame. Until you spam it.", 0.18, False, [("title_boom", "start", 2, 0.70), ("counter_tick", "word:spam", 0, 0.50)]),
            ("l5", "mom", "Pip, why is the cat floating backward?", 0.12, False, [("cat_yowl", "word:cat", 0, 0.60)]),
            ("l6", "pip", "Wait, is that a physics glitch?", 0.10, False, [("gulp", "start", 0, 0.65), ("buzzer", "end", 1, 0.55)]),
        ],
    },
    "niche-psych": {
        "lines": [
            ("l1", "narr", "When someone snaps at you, never argue back.", 0.12, False, [("room_tone", "start", 0, 0.22)]),
            ("l2", "suit", "Your report is late and totally useless!", 0.10, False, [("paper_land", "start", 2, 0.55)]),
            ("l3", "nova", "Totally useless?", 0.14, False, [("pop", "start", 0, 0.55), ("ding", "end", -2, 0.48)]),
            ("l4", "narr", "Repeat their last three words. Watch their brain freeze.", 0.18, False, [("title_boom", "start", 2, 0.68), ("power_down", "word:freeze", 0, 0.55)]),
            ("l5", "suit", "Well, I mean, the font was actually okay.", 0.12, False, [("gasp", "start", 0, 0.45)]),
            ("l6", "nova", "Thought so.", 0.10, False, [("shades", "start", 0, 0.60), ("sparkle", "end", -1, 0.55)]),
        ],
    },
    "niche-horror": {
        "lines": [
            ("l1", "narr", "Rule one: never answer the second knock at night.", 0.12, False, [("drone_hit", "start", 0, 0.60)]),
            ("l2", "sis", "Leo, open up! I forgot my keys!", 0.14, True, [("big_step", "start", 0, 0.65), ("big_step", "start", 10, 0.55)]),
            ("l3", "leo", "Coming! Hang on!", 0.10, False, [("step", "start", 2, 0.50)]),
            ("l4", "narr", "Then his phone buzzed. A text from his sister.", 0.18, False, [("glitch", "start", 0, 0.65), ("title_boom", "word:text", 0, 0.68)]),
            ("l5", "sis", "Leo, I'm right outside.", 0.12, True, [("power_hum", "start", 0, 0.45)]),
            ("l6", "leo", "Wait, who is at the door?!", 0.10, False, [("gasp", "start", 0, 0.72), ("drone_hit", "end", 1, 0.75)]),
        ],
    },
}


async def build_episode(slug: str, cfg: dict):
    ep_dir = ROOT / "src" / "episodes" / slug
    ep_dir.mkdir(parents=True, exist_ok=True)
    pub_dir = ROOT / "public" / slug
    pub_dir.mkdir(parents=True, exist_ok=True)

    cursor_sec = 0.12
    turns = []
    sfx_events = []
    line_rms = {}

    for lid, spk, txt, gap_before, muffle, sfx_list in cfg["lines"]:
        raw = WORK / f"{slug}_{lid}_raw.mp3"
        clean = WORK / f"{slug}_{lid}.wav"
        await synth_line(spk, txt, raw)
        process_clip(raw, clean, muffle=muffle)
        dur = ffprobe_dur(clean)

        start_sec = cursor_sec + gap_before
        end_sec = start_sec + dur
        start_f = int(round(start_sec * FPS))
        end_f = int(round(end_sec * FPS))

        rms_arr = extract_mouth_rms(clean)
        line_rms[lid] = (spk, start_f, rms_arr)
        words = extract_words(clean, start_sec)

        turns.append({
            "id": lid,
            "speaker": spk,
            "text": txt,
            "startSec": round(start_sec, 3),
            "endSec": round(end_sec, 3),
            "startF": start_f,
            "endF": end_f,
            "words": words,
            "wav": str(clean),
        })

        for sfx_name, anchor, df, vol in sfx_list:
            sfx_file = resolve_sfx(sfx_name)
            if sfx_file is None or vol <= 0:
                continue
            anchor_f = start_f
            if anchor == "end":
                anchor_f = end_f
            elif anchor.startswith("word:"):
                target = anchor.split(":", 1)[1].lower()
                matched = [w for w in words if target in w["word"].lower().strip(".,!?-")]
                if matched:
                    anchor_f = matched[0]["startF"]
            t_f = max(0, anchor_f + df)
            sfx_events.append((sfx_name, sfx_file, t_f / FPS, t_f, vol))

        cursor_sec = end_sec

    total_sec = round(cursor_sec + 0.55, 2)
    total_frames = int(round(total_sec * FPS))

    mouth_frames: dict[str, list[float]] = {}
    for _lid, (spk, sf_idx, rms_arr) in line_rms.items():
        if spk not in mouth_frames:
            mouth_frames[spk] = [0.0] * total_frames
        for i, val in enumerate(rms_arr):
            gf = sf_idx + i
            if 0 <= gf < total_frames:
                mouth_frames[spk][gf] = max(mouth_frames[spk][gf], val)

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

    sfx_out = pub_dir / "sfx.mp3"
    s_inputs = ["-f", "lavfi", "-t", f"{total_sec:.3f}", "-i", "anullsrc=channel_layout=stereo:sample_rate=44100"]
    s_filters = []
    s_mix = ["[0:a]"]
    for idx, (_nm, sf_path, ts, _tf, vol) in enumerate(sfx_events, start=1):
        s_inputs += ["-i", str(sf_path)]
        ms = int(round(ts * 1000))
        lbl = f"[s{idx}]"
        s_filters.append(f"[{idx}:a]aformat=sample_rates=44100:channel_layouts=stereo,volume={vol:.2f},adelay={ms}|{ms}{lbl}")
        s_mix.append(lbl)
    s_filters.append(f"{''.join(s_mix)}amix=inputs={len(s_mix)}:duration=first:normalize=0,alimiter=limit=0.9[sout]")
    run(["ffmpeg", "-y", *s_inputs, "-filter_complex", ";".join(s_filters), "-map", "[sout]", "-b:a", "192k", str(sfx_out)])

    music_src = SFX_LIB / "music-4cdabe20.mp3"
    music_out = pub_dir / "music.mp3"
    fade_start = max(0.0, total_sec - 0.8)
    # Give horror a darker lowpass music bed, psych a crisp light bed
    m_filter = f"aformat=sample_rates=44100:channel_layouts=stereo,volume=0.22,afade=t=in:st=0:d=0.35,afade=t=out:st={fade_start:.2f}:d=0.8"
    if slug == "niche-horror":
        m_filter = f"aformat=sample_rates=44100:channel_layouts=stereo,lowpass=f=650,volume=0.18,afade=t=in:st=0:d=0.35,afade=t=out:st={fade_start:.2f}:d=0.8"
    run([
        "ffmpeg", "-y",
        "-stream_loop", "-1", "-i", str(music_src),
        "-t", f"{total_sec:.3f}",
        "-af", m_filter,
        "-b:a", "192k",
        str(music_out),
    ])

    dialogue_meta = [{k: v for k, v in t.items() if k != "wav"} for t in turns]
    sfx_meta = [{"sfx": nm, "frame": tf, "sec": round(ts, 3)} for nm, _sf, ts, tf, _vol in sfx_events]
    (ep_dir / "dialogue.json").write_text(json.dumps({
        "totalFrames": total_frames,
        "totalSec": total_sec,
        "turns": dialogue_meta,
        "sfx": sfx_meta,
        "mouthFrames": mouth_frames,
    }, indent=2))

    print(f"\n=== [{slug}] {total_sec:.2f}s ({total_frames} frames) ===")
    for d in dialogue_meta:
        print(f"  {d['id']} ({d['speaker']}): f{d['startF']}..f{d['endF']} | {d['text']}")
        print(f"    words: " + " ".join(f"{w['word']}@{w['startF']}" for w in d["words"]))
    print("  SFX:", [(s["sfx"], s["frame"]) for s in sfx_meta])


async def main():
    for slug, cfg in EPISODES.items():
        await build_episode(slug, cfg)


if __name__ == "__main__":
    asyncio.run(main())
