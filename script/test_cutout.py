from PIL import Image
from pathlib import Path

path = Path("assets/banner/mayank_cutout.png")

img = Image.open(path)

print("Cutout loaded successfully!")
print("Format:", img.format)
print("Size:", img.size)
print("Mode:", img.mode)
print("Has transparency:", img.mode == "RGBA")