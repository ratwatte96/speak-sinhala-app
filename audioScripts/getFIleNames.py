import os

# Get all file names in the current directory
file_names = [f for f in os.listdir('.') if os.path.isfile(f)]

# Remove file extensions
file_names_without_ext = [os.path.splitext(f)[0] for f in file_names]

print(file_names_without_ext)
