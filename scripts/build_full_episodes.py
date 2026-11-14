import asyncio
import json
import subprocess
from pathlib import Path
import numpy as np
import soundfile as sf
import edge_tts
from faster_whisper import WhisperModel

SR = 48000
ROOT = Path(__file__).resolve().parent.parent
SFX_DIR = Path(r"C:\Users\jibra\.gemini\antigravity\scratch\video-repos\what-if-animation\studio\library\sfx")
OUT_AUDIO = ROOT / "public" / "audio"
OUT_DATA = ROOT / "src" / "data"
OUT_AUDIO.mkdir(parents=True, exist_ok=True)
OUT_DATA.mkdir(parents=True, exist_ok=True)

EPISODES = {
    "style1": {
        "voice": "en-US-ChristopherNeural",
        "rate": "+4%",
        "text": (
            "What if Earth stopped spinning for just five seconds? "
            "Right now, you don't feel it, but the ground beneath your feet is racing east at over sixteen hundred kilometers per hour. "
            "If the planet suddenly slammed on the brakes, the atmosphere and everything on the surface would not stop with it. "
            "Your coffee mug, your desk, and you would instantly launch sideways faster than the speed of sound. "
            "Oceans would surge out of their basins in colossal walls of water, while supersonic winds tore across every continent. "
            "Five seconds later, Earth snaps back to full speed, slamming everything in the opposite direction. "
            "Almost nowhere on the planet would survive. "
            "Unless, of course, you were standing right at the North Pole, where the ground barely moves at all, and you'd just spin gently in place."
        ),
        "sfx": [
            ("title_boom-91f4f23e.mp3", 0.1, 0.45),
            ("room_tone-e711a45f.mp3", 0.0, 0.15),
            ("clock_back-d5e3cec1.mp3", 5.5, 0.35),
            ("power_down-46ef6bed.mp3", 12.0, 0.55),
            ("fall_whoosh-07978690.mp3", 18.5, 0.55),
            ("shatter-cde6184c.mp3", 23.0, 0.45),
            ("roof_wind-cedc7edc.mp3", 27.0, 0.45),
            ("drone_hit-75f05067.mp3", 34.0, 0.45),
            ("rewind-d66d6ba6.mp3", 40.0, 0.50),
            ("land-c5089052.mp3", 44.5, 0.50),
            ("ding-a322cf81.mp3", 50.5, 0.45),
            ("sparkle-595dbfb7.mp3", 55.5, 0.40),
        ],
    },
    "style2": {
        "voice": "en-US-AndrewNeural",
        "rate": "+2%",
        "text": (
            "In eighteen thirty-one, seventy-four soldiers knocked down an entire iron suspension bridge just by walking across it. "
            "The Broughton Suspension Bridge was the pride of Manchester, built from heavy iron chains anchored into stone towers. "
            "One morning, a rifle corps marched onto the wooden deck in crisp, rhythmic lockstep. "
            "Left, right, left, right. With every unified boot stomp, the bridge began to sway slightly underneath them. "
            "That wasn't an accident, it was physics. Just like pushing a kid on a playground swing at the exact right moment, "
            "each step added a little more energy to the bridge's natural frequency. "
            "Soon the deck was bouncing violently, and the soldiers actually started whistling to match the rhythm. "
            "Then came a deafening crack. A main anchor bolt snapped in half, dumping the entire deck into the river. "
            "Luckily, the water was shallow and nobody died. Unluckily for soldiers everywhere, it created a permanent military rule: "
            "whenever troops cross a bridge, they must break step."
        ),
        "sfx": [
            ("title_boom-91f4f23e.mp3", 0.1, 0.45),
            ("big_step-3a4b1795.mp3", 12.5, 0.50),
            ("step-60144e17.mp3", 14.0, 0.45),
            ("big_step-3a4b1795.mp3", 15.5, 0.50),
            ("step-60144e17.mp3", 17.0, 0.45),
            ("pop-99ba70e6.mp3", 24.5, 0.45),
            ("bulb_pop-2ea0e2d7.mp3", 31.0, 0.45),
            ("crack-3cbd3c57.mp3", 38.0, 0.65),
            ("shatter-cde6184c.mp3", 40.5, 0.55),
            ("gasp-372b408b.mp3", 44.5, 0.45),
            ("ding-a322cf81.mp3", 52.0, 0.45),
            ("paper_land-e0d75d32.mp3", 56.0, 0.45),
        ],
    },
    "style3": {
        "voice": "en-US-ChristopherNeural",
        "rate": "+5%",
        "text": (
            "How does Discord store over four trillion messages without melting its servers? "
            "Back in twenty seventeen, Discord ran on MongoDB, handling a hundred million messages. "
            "As traffic exploded into the billions, hot servers hit a wall, and read latencies spiked out of control. "
            "So the team migrated to Apache Cassandra, expecting effortless horizontal scale. "
            "Instead, they walked straight into a garbage collection nightmare. "
            "Because Cassandra runs on the Java Virtual Machine, cleaning up deleted tombstones triggered stop-the-world pauses lasting over ten seconds. "
            "Channels froze, alerts fired every night, and engineers spent months fighting memory leaks. "
            "Their final solution was ScyllaDB, a drop-in Cassandra replacement rewritten from scratch in C plus plus. "
            "With zero garbage collection and a shard-per-core architecture, Discord cut its cluster from one hundred seventy-seven nodes down to just seventy-two, "
            "dropping tail latency from one hundred twenty milliseconds down to a rock-solid five."
        ),
        "sfx": [
            ("glitch-4bc7163d.mp3", 0.1, 0.45),
            ("counter_tick-37ca9370.mp3", 3.5, 0.40),
            ("pop-99ba70e6.mp3", 9.0, 0.45),
            ("buzzer-0dc58156.mp3", 16.5, 0.40),
            ("power_hum-ae629acb.mp3", 22.0, 0.30),
            ("glitch-4bc7163d.mp3", 28.5, 0.45),
            ("drone_hit-75f05067.mp3", 34.5, 0.45),
            ("bulb_pop-2ea0e2d7.mp3", 40.5, 0.45),
            ("sparkle-595dbfb7.mp3", 47.0, 0.45),
            ("ding-a322cf81.mp3", 54.0, 0.45),
        ],
    },
}


def load_audio(path: Path, tmp_dir: Path) -> np.ndarray:
    if path.suffix.lower() == ".mp3":
        tmp_wav = tmp_dir / (path.stem + "_tmp.wav")
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
    if idx >= len(mix):
        return
    end = min(len(mix), idx + len(clip))
    mix[idx:end] += clip[: end - idx] * gain


async def gen_all_tts():
    for slug, cfg in EPISODES.items():
        mp3 = OUT_AUDIO / f"{slug}_voice.mp3"
        wav = OUT_AUDIO / f"{slug}_voice.wav"
        comm = edge_tts.Communicate(cfg["text"], cfg["voice"], rate=cfg["rate"])
        await comm.save(str(mp3))
        subprocess.run(
            ["ffmpeg", "-y", "-i", str(mp3), "-ar", str(SR), "-ac", "2", str(wav)],
            check=True,
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL,
        )


def main():
    asyncio.run(gen_all_tts())
    model = WhisperModel("base", device="cpu", compute_type="int8")
    music = load_audio(SFX_DIR / "music-4cdabe20.mp3", OUT_AUDIO)

    meta = {}
    for slug, cfg in EPISODES.items():
        wav_path = OUT_AUDIO / f"{slug}_voice.wav"
        voice_data, _ = sf.read(wav_path, dtype="float32")
        if voice_data.ndim == 1:
            voice_data = np.stack([voice_data, voice_data], axis=1)

        voice_dur = len(voice_data) / SR
        total_dur = max(60.0, voice_dur + 1.5)
        total_samples = int(total_dur * SR)

        # Whisper word timestamps
        segments, _ = model.transcribe(str(wav_path), word_timestamps=True)
        words = []
        for seg in segments:
            if seg.words:
                for w in seg.words:
                    words.append({
                        "word": w.word.strip(),
                        "start": round(w.start + 0.3, 3),
                        "end": round(w.end + 0.3, 3),
                    })
        (OUT_DATA / f"words_{slug}.json").write_text(json.dumps(words, indent=2), encoding="utf-8")

        # Mix audio
        mix = np.zeros((total_samples, 2), dtype=np.float32)
        pos = 0
        while pos < total_samples:
            chunk = min(len(music), total_samples - pos)
            mix[pos : pos + chunk] += music[:chunk] * 0.13
            pos += chunk

        for fname, t_s, gain in cfg["sfx"]:
            clip = load_audio(SFX_DIR / fname, OUT_AUDIO)
            place(mix, clip, t_s, gain)

        place(mix, voice_data, 0.3, 1.0)

        peak = np.max(np.abs(mix))
        if peak > 0.95:
            mix = mix * (0.95 / peak)

        raw_wav = OUT_AUDIO / f"{slug}_raw.wav"
        master_wav = OUT_AUDIO / f"{slug}_master.wav"
        sf.write(raw_wav, mix, SR)
        subprocess.run(
            [
                "ffmpeg", "-y", "-i", str(raw_wav),
                "-af", "loudnorm=I=-14:TP=-1.5:LRA=11",
                "-ar", str(SR), "-ac", "2",
                str(master_wav),
            ],
            check=True,
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL,
        )
        raw_wav.unlink(missing_ok=True)
        frames = int(np.ceil(total_dur * 30))
        meta[slug] = {"duration": round(total_dur, 2), "frames": frames, "words": len(words)}
        print(f"{slug}: {total_dur:.2f}s ({frames} frames), {len(words)} words")

    (OUT_DATA / "episodes_meta.json").write_text(json.dumps(meta, indent=2), encoding="utf-8")


if __name__ == "__main__":
    main()
