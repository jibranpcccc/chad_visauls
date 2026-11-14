import asyncio
import os
import subprocess
from pathlib import Path
import numpy as np
import soundfile as sf
import edge_tts

SR = 48000
DURATION = 15.0
TOTAL_SAMPLES = int(SR * DURATION)

ROOT = Path(__file__).resolve().parent.parent
SFX_DIR = Path(r"C:\Users\jibra\.gemini\antigravity\scratch\video-repos\what-if-animation\studio\library\sfx")
OUT_AUDIO = ROOT / "public" / "audio"
OUT_AUDIO.mkdir(parents=True, exist_ok=True)

LINES = [
    ("v1", "What if gravity stopped for three seconds? You would drift sideways instantly!", 0.20),
    ("v2", "Seventy-four soldiers marched in step and broke an entire iron bridge.", 5.20),
    ("v3", "Render crisp animations one hundred percent in code, synced to every word.", 10.20),
]

SFX_CUES = [
    ("title_boom-91f4f23e.mp3", 0.05, 0.45),
    ("power_down-46ef6bed.mp3", 1.15, 0.50),
    ("pop-99ba70e6.mp3", 1.65, 0.50),
    ("ding-a322cf81.mp3", 3.00, 0.45),
    ("big_step-3a4b1795.mp3", 5.05, 0.50),
    ("big_step-3a4b1795.mp3", 6.10, 0.50),
    ("crack-3cbd3c57.mp3", 7.65, 0.55),
    ("glitch-4bc7163d.mp3", 10.00, 0.45),
    ("pop-99ba70e6.mp3", 10.60, 0.45),
    ("pop-99ba70e6.mp3", 11.40, 0.45),
    ("sparkle-595dbfb7.mp3", 12.20, 0.45),
]


async def gen_tts():
    for name, text, _ in LINES:
        mp3_path = OUT_AUDIO / f"{name}.mp3"
        wav_path = OUT_AUDIO / f"{name}.wav"
        comm = edge_tts.Communicate(text, "en-US-ChristopherNeural", rate="+12%")
        await comm.save(str(mp3_path))
        subprocess.run(
            ["ffmpeg", "-y", "-i", str(mp3_path), "-ar", str(SR), "-ac", "2", str(wav_path)],
            check=True,
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL,
        )


def load_audio(path: Path) -> np.ndarray:
    if path.suffix.lower() == ".mp3":
        tmp_wav = OUT_AUDIO / (path.stem + "_tmp.wav")
        subprocess.run(
            ["ffmpeg", "-y", "-i", str(path), "-ar", str(SR), "-ac", "2", str(tmp_wav)],
            check=True,
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL,
        )
        data, _ = sf.read(tmp_wav, dtype="float32")
        tmp_wav.unlink(missing_ok=True)
    else:
        data, _ = sf.read(path, dtype="float32")
    if data.ndim == 1:
        data = np.stack([data, data], axis=1)
    return data


def place(mix: np.ndarray, clip: np.ndarray, start_s: float, gain: float):
    idx = int(start_s * SR)
    if idx >= TOTAL_SAMPLES:
        return
    end = min(TOTAL_SAMPLES, idx + len(clip))
    mix[idx:end] += clip[: end - idx] * gain


def main():
    asyncio.run(gen_tts())
    mix = np.zeros((TOTAL_SAMPLES, 2), dtype=np.float32)

    # Background music bed (looped & ducked)
    music = load_audio(SFX_DIR / "music-4cdabe20.mp3")
    pos = 0
    while pos < TOTAL_SAMPLES:
        chunk = min(len(music), TOTAL_SAMPLES - pos)
        mix[pos : pos + chunk] += music[:chunk] * 0.14
        pos += chunk

    # Subtle room ambience
    amb = load_audio(SFX_DIR / "room_tone-e711a45f.mp3")
    place(mix, amb, 0.0, 0.12)

    # SFX cues
    for fname, t_s, gain in SFX_CUES:
        clip = load_audio(SFX_DIR / fname)
        place(mix, clip, t_s, gain)

    # Voiceover lines
    for name, _, t_s in LINES:
        v = load_audio(OUT_AUDIO / f"{name}.wav")
        place(mix, v, t_s, 1.0)

    # Soft clip safety before loudnorm
    peak = np.max(np.abs(mix))
    if peak > 0.95:
        mix = mix * (0.95 / peak)

    raw_mix = OUT_AUDIO / "all-styles-raw.wav"
    master_wav = OUT_AUDIO / "all-styles-master.wav"
    sf.write(raw_mix, mix, SR)

    subprocess.run(
        [
            "ffmpeg", "-y", "-i", str(raw_mix),
            "-af", "loudnorm=I=-14:TP=-1.5:LRA=11",
            "-ar", str(SR), "-ac", "2",
            str(master_wav),
        ],
        check=True,
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
    )
    print(f"Mastered audio ready: {master_wav}")


if __name__ == "__main__":
    main()
