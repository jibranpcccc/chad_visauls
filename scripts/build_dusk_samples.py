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
        filters.append("lowpass=f=700,highpass=f=220,volume=0.45")
    cmd = ["ffmpeg", "-y", "-i", str(raw_path), "-af", ",".join(filters)]
    if cut_end_sec is not None:
        cmd += ["-t", f"{cut_end_sec:.3f}"]
    cmd += ["-ar", "44100", "-ac", "2", str(clean_path)]
    run(cmd)


def extract_rms_frames(wav_path: Path) -> list[float]:
    data, sr = sf.read(str(wav_path), dtype="float32")
    if data.ndim > 1:
        data = data.mean(axis=1)
    spf = int(round(sr / FPS))
    n_frames = max(1, int(np.ceil(len(data) / spf)))
    rms = np.zeros(n_frames, dtype=np.float32)
    for i in range(n_frames):
        seg = data[i * spf : (i + 1) * spf]
        if len(seg) > 0:
            rms[i] = float(np.sqrt(np.mean(seg * seg)))
    peak = float(np.percentile(rms, 96)) if np.any(rms > 0) else 1.0
    if peak < 1e-5:
        return [0.0] * n_frames
    norm = np.clip(rms / peak, 0.0, 1.0)
    # Gate low noise floor and smooth slightly for organic jaw motion
    gated = np.where(norm < 0.14, 0.0, np.clip((norm - 0.10) * 1.15, 0.0, 1.0))
    out = []
    for i in range(n_frames):
        prev_v = gated[i - 1] if i > 0 else gated[i]
        cur_v = gated[i]
        out.append(round(float(0.35 * prev_v + 0.65 * cur_v), 3))
    return out


def transcribe_words(wav_path: Path, offset_sec: float) -> list[dict]:
    model = get_whisper()
    segments, _ = model.transcribe(str(wav_path), word_timestamps=True, language="en")
    words = []
    for seg in segments:
        if seg.words:
            for w in seg.words:
                words.append({
                    "word": w.word.strip(),
                    "startF": int(round((offset_sec + w.start) * FPS)),
                    "endF": int(round((offset_sec + w.end) * FPS)),
                })
    return words


# SFX cues can be anchored relative to 'start' or 'end' of a line!
# Format: (id, speaker, text, pre_gap, muffle, cut_sec, [(sfx_name, anchor 'start'|'end'|'word:xyz', df, vol)])
EPISODES = {
    "dusk-mute": {
        "lines": [
            ("l1", "narr", "Imagine a single button that mutes anyone in real life.", 0.12, False, None, [("class_murmur", "start", 0, 0.25), ("select_draw", "word:button", -1, 0.65)]),
            ("l2", "sis", "And then she literally stole my seat, wait are you even listening", 0.10, False, 1.95, [("switch_off", "end", -1, 0.95), ("pop", "end", 1, 0.65)]),
            ("l3", "mo", "Finally. Pure, golden silence.", 0.26, False, None, [("shades", "start", 0, 0.8), ("title_boom", "word:silence", 0, 0.85)]),
            ("l4", "narr", "No spoilers. No whining. Until someone tries to warn you.", 0.22, False, None, [("step", "start", 8, 0.45), ("step", "start", 24, 0.45)]),
            ("l5", "sis", "Mo! Watch out, loose step!", 0.10, True, None, [("tumble", "end", 2, 0.95), ("crack", "end", 8, 0.85)]),
            ("l6", "sis", "Unmuted. Miss my voice yet?", 0.45, False, None, [("ding", "start", -2, 0.85)]),
            ("l7", "mo", "Put it back on mute.", 0.12, False, None, [("dizzy", "start", 2, 0.55)]),
        ],
    },
    "dusk-pause": {
        "lines": [
            ("l1", "narr", "One click pauses the entire room. Except for you.", 0.12, False, None, [("paper_land", "start", 4, 0.6), ("counter_tick", "word:pauses", 0, 0.55)]),
            ("l2", "nova", "Wait, the client needs those numbers right now!", 0.10, False, 1.80, [("power_down", "end", -1, 0.95), ("pop", "end", 1, 0.65)]),
            ("l3", "suit", "Relax. Nobody moves until I finish my coffee.", 0.24, False, None, [("shades", "start", 0, 0.8), ("title_boom", "word:finish", 0, 0.85)]),
            ("l4", "narr", "Zero friction. Frozen clocks. Only one tiny glitch.", 0.22, False, None, [("glitch", "word:glitch", -2, 0.9)]),
            ("l5", "nova", "Cool trick. Wait, why did you steal my mug?", 0.18, False, None, [("sparkle", "start", -3, 0.75), ("step", "word:wait", 0, 0.5)]),
            ("l6", "suit", "How are you still moving?!", 0.10, False, None, [("gasp", "start", -2, 0.85), ("buzzer", "end", 2, 0.5)]),
        ],
    },
    "dusk-glow": {
        "lines": [
            ("l1", "narr", "Imagine if every white lie lit you up like the sun.", 0.12, False, None, [("room_tone", "start", 0, 0.25), ("cookie_crunch", "start", 14, 0.55)]),
            ("l2", "mom", "Leo... did you eat all my warm cookies?", 0.12, False, None, [("cat_chirp", "start", 2, 0.55)]),
            ("l3", "leo", "What? No! I wasn't even near the kitchen.", 0.10, False, None, [("bulb_pop", "word:no", 1, 0.95), ("sparkle", "word:no", 2, 0.7)]),
            ("l4", "narr", "Small fib, soft lantern. Big lie? Whole street sees it.", 0.22, False, None, [("title_boom", "start", 2, 0.85), ("counter_tick", "word:big", 0, 0.65)]),
            ("l5", "leo", "Okay, maybe one tiny bite! Totally not five!", 0.14, False, None, [("power_hum", "start", 8, 0.45), ("buzzer", "word:five", 0, 0.8)]),
            ("l6", "mom", "Leo, you're brighter than the streetlight outside.", 0.18, False, None, [("laugh", "end", 2, 0.55)]),
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
    line_rms = {}
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
        start_f = int(round(start_sec * FPS))
        end_f = int(round(end_sec * FPS))

        words = transcribe_words(clean, start_sec)
        rms_frames = extract_rms_frames(clean)
        line_rms[lid] = (spk, start_f, rms_frames)

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

    # Build per-speaker per-frame mouth envelope
    mouth_frames: dict[str, list[float]] = {}
    for lid, (spk, sf_idx, rms_arr) in line_rms.items():
        if spk not in mouth_frames:
            mouth_frames[spk] = [0.0] * total_frames
        for i, val in enumerate(rms_arr):
            gf = sf_idx + i
            if 0 <= gf < total_frames:
                mouth_frames[spk][gf] = max(mouth_frames[spk][gf], val)

    # Build voice.mp3
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
        for idx, (_nm, sf_path, ts, _tf, vol) in enumerate(sfx_events, start=1):
            s_inputs += ["-i", str(sf_path)]
            ms = int(round(ts * 1000))
            lbl = f"[s{idx}]"
            s_filters.append(f"[{idx}:a]aformat=sample_rates=44100:channel_layouts=stereo,volume={vol:.2f},adelay={ms}|{ms}{lbl}")
            s_mix.append(lbl)
        s_filters.append(f"{''.join(s_mix)}amix=inputs={len(s_mix)}:duration=first:normalize=0,alimiter=limit=0.9[sout]")
        run(["ffmpeg", "-y", *s_inputs, "-filter_complex", ";".join(s_filters), "-map", "[sout]", "-b:a", "192k", str(sfx_out)])

    # Build music.mp3
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
