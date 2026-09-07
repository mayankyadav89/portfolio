from PIL import Image
from pathlib import Path

photo_path = Path("assets/photos/mayank.jpg")

img = Image.open(photo_path)

print("Photo loaded successfully!")
print("Format:", img.format)
print("Size:", img.size)
print("Mode:", img.mode)