from PIL import Image
from pathlib import Path

input_path = Path("assets/photos/mayank.jpg")
output_path = Path("assets/banner/mayank_300x340.png")

GRID_WIDTH = 300
GRID_HEIGHT = 340

img = Image.open(input_path).convert("RGB")

# Resize image to the target particle grid
resized = img.resize((GRID_WIDTH, GRID_HEIGHT), Image.Resampling.LANCZOS)

resized.save(output_path)

print("Resize complete!")
print("Input:", img.size)
print("Output:", resized.size)
print("Saved to:", output_path)