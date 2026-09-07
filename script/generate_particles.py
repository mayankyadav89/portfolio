from PIL import Image
from pathlib import Path
import json
import random

INPUT = Path("assets/banner/mayank_cutout.png")
OUTPUT = Path("assets/banner/mayank_particles.json")

GRID_WIDTH = 300
GRID_HEIGHT = 340

img = Image.open(INPUT).convert("RGBA")

# Resize while preserving the complete image
img = img.resize(
    (GRID_WIDTH, GRID_HEIGHT),
    Image.Resampling.LANCZOS
)

pixels = img.load()

particles = []

random.seed(42)

for y in range(GRID_HEIGHT):
    for x in range(GRID_WIDTH):

        r, g, b, alpha = pixels[x, y]

        # Completely transparent = no particle
        if alpha < 40:
            continue

        # Convert RGB to grayscale
        brightness = (
            0.299 * r +
            0.587 * g +
            0.114 * b
        )

        # Light pixels get fewer particles
        darkness = (255 - brightness) / 255

        probability = darkness ** 1.5

        if random.random() < probability:
            particles.append({
                "x": x,
                "y": y
            })

data = {
    "width": GRID_WIDTH,
    "height": GRID_HEIGHT,
    "count": len(particles),
    "particles": particles
}

with open(OUTPUT, "w", encoding="utf-8") as f:
    json.dump(data, f)

print("Clean particle generation complete!")
print("Grid:", GRID_WIDTH, "x", GRID_HEIGHT)
print("Active particles:", len(particles))
print("Saved to:", OUTPUT)