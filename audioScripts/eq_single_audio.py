import argparse
import subprocess

def apply_eq(input_file, output_file, bass_reduction=150, de_esser_freq=6000):
    """
    Applies equalization to reduce bass and de-ess the audio.
    """
    command = [
        "ffmpeg", "-i", input_file,
        "-af", f"highpass=f={bass_reduction}, equalizer=f={de_esser_freq}:t=q:w=2:g=-5",
        output_file, "-y"
    ]
    
    subprocess.run(command, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    print(f"Processed EQ: {input_file} → {output_file}")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Apply EQ and De-Essing to a single MP3 file.")
    parser.add_argument("input", help="Path to the input MP3 file")
    parser.add_argument("output", help="Path to the output MP3 file")
    parser.add_argument("--bass", type=int, default=150, help="High-pass filter frequency to reduce bass (default: 150 Hz)")
    parser.add_argument("--de_ess", type=int, default=6000, help="De-esser frequency (default: 6000 Hz)")

    args = parser.parse_args()
    
    apply_eq(args.input, args.output, args.bass, args.de_ess)
