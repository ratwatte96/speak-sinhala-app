import argparse
import subprocess
import os

def trim_silence(input_file, output_file, silence_threshold=-50, min_silence_duration=0.1):
    """
    Trims silence from the start of an MP3 file.

    :param input_file: Path to the input MP3 file
    :param output_file: Path to save the trimmed file
    :param silence_threshold: Silence detection level in dB (default: -50 dB)
    :param min_silence_duration: Minimum duration of silence to remove in seconds (default: 0.1s)
    """
    command = [
        "ffmpeg", "-i", input_file,
        "-af", f"silenceremove=start_periods=1:start_threshold={silence_threshold}dB:start_duration={min_silence_duration}",
        output_file, "-y"
    ]
    
    subprocess.run(command, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    print(f"Trimmed Silence: {input_file} → {output_file}")

def process_directory(silence_threshold=-50, min_silence_duration=0.1):
    """
    Processes all MP3 files in the current directory and trims silence from the start.
    """
    current_dir = os.getcwd()
    output_dir = os.path.join(current_dir, "trimmedAudioClips")

    # Create output directory if it doesn't exist
    os.makedirs(output_dir, exist_ok=True)

    # Process each MP3 file
    for filename in os.listdir(current_dir):
        if filename.endswith(".mp3"):
            input_path = os.path.join(current_dir, filename)
            output_path = os.path.join(output_dir, filename)  # Same filename, new directory

            trim_silence(input_path, output_path, silence_threshold, min_silence_duration)

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Batch trim silence from the start of all MP3 files in the directory.")
    parser.add_argument("--threshold", type=int, default=-50, help="Silence threshold in dB (default: -50 dB)")
    parser.add_argument("--duration", type=float, default=0.1, help="Minimum silence duration to remove (default: 0.1s)")

    args = parser.parse_args()
    
    process_directory(args.threshold, args.duration)
