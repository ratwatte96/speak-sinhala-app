import argparse
import subprocess
import librosa
import noisereduce as nr
import soundfile as sf
import os

def reduce_noise(input_file, output_file, strength=1.0):
    """Applies noise reduction to an audio file."""
    
    # Convert MP3 to WAV for processing
    temp_wav = "temp.wav"
    subprocess.run(["ffmpeg", "-i", input_file, temp_wav, "-y"], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

    # Load WAV file
    y, sr = librosa.load(temp_wav, sr=None)

    # Apply noise reduction
    y_denoised = nr.reduce_noise(y=y, sr=sr, prop_decrease=strength)

    # Save processed audio to WAV
    denoised_wav = "denoised.wav"
    sf.write(denoised_wav, y_denoised, sr)

    # Convert back to MP3
    subprocess.run(["ffmpeg", "-i", denoised_wav, "-q:a", "2", output_file, "-y"], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

    # Clean up temporary files
    os.remove(temp_wav)
    os.remove(denoised_wav)

    print(f"Processed: {input_file} → {output_file}")

def process_directory(strength=1.0):
    """Processes all MP3 files in the current directory."""
    
    current_dir = os.getcwd()
    output_dir = os.path.join(current_dir, "nrAudioClips")

    # Create output directory if it doesn't exist
    os.makedirs(output_dir, exist_ok=True)

    # Process each MP3 file
    for filename in os.listdir(current_dir):
        if filename.endswith(".mp3"):
            input_path = os.path.join(current_dir, filename)
            output_path = os.path.join(output_dir, filename)  # Same filename, new directory

            reduce_noise(input_path, output_path, strength)

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Batch reduce noise for all MP3 files in the current directory.")
    parser.add_argument("--strength", type=float, default=1.0, help="Noise reduction strength (default: 1.0)")

    args = parser.parse_args()
    
    process_directory(args.strength)
