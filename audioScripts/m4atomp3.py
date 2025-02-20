import os
from pydub import AudioSegment

def convert_mp4a_to_mp3(input_folder, output_folder):
    # Ensure the output folder exists
    os.makedirs(output_folder, exist_ok=True)
    
    for file_name in os.listdir(input_folder):
        if file_name.endswith(".m4a"):
            input_path = os.path.join(input_folder, file_name)
            output_path = os.path.join(output_folder, file_name.replace(".m4a", ".mp3"))
            
            try:
                # Load the .m4a file
                audio = AudioSegment.from_file(input_path, format="m4a")
                # Export it as .mp3
                audio.export(output_path, format="mp3", bitrate="320k")  # Adjust bitrate as needed
                print(f"Converted: {file_name} -> {os.path.basename(output_path)}")
            except Exception as e:
                print(f"Error converting {file_name}: {e}")

# Specify input and output folders
input_folder = r"C:\Users\Rahul Ratwatte\OneDrive\Desktop\Bank Statements\attachments"
output_folder = r"C:\Users\Rahul Ratwatte\Code\speak-sinhala\audioScripts\soundsMp3"

convert_mp4a_to_mp3(input_folder, output_folder)
