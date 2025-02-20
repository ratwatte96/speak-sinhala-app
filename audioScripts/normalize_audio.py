import argparse
import subprocess
import os

def normalize_audio(input_file, output_file, target_lufs=-23.0):
    """
    Normalizes an MP3 file to a target LUFS (default: -23 LUFS).
    """
    command = [
        "ffmpeg", "-i", input_file,
        "-af", f"loudnorm=I={target_lufs}:LRA=7:TP=-2",
        output_file, "-y"
    ]
    
    subprocess.run(command, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    print(f"Normalized: {input_file} → {output_file}")

def process_directory(target_lufs=-23.0):
    """
    Processes all MP3 files in the current directory and normalizes them.
    """
    current_dir = os.getcwd()
    output_dir = os.path.join(current_dir, "nRNormAudioClips")

    # Create output directory if it doesn't exist
    os.makedirs(output_dir, exist_ok=True)

    # Process each MP3 file
    for filename in os.listdir(current_dir):
        if filename.endswith(".mp3"):
            input_path = os.path.join(current_dir, filename)
            output_path = os.path.join(output_dir, filename)  # Same filename, new directory

            normalize_audio(input_path, output_path, target_lufs)

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Batch normalize loudness for all MP3 files in the current directory.")
    parser.add_argument("--lufs", type=float, default=-23.0, help="Target LUFS loudness (default: -23.0)")

    args = parser.parse_args()
    
    process_directory(args.lufs)
