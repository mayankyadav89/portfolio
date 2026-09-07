from PIL import Image
from pathlib import Path
import json
import random
import math

GRID_WIDTH = 300
GRID_HEIGHT = 340
PARTICLE_COUNT = 12953

LOGOS = {
    "ethereum": Path("assets/logos/ethereum.png"),
    "mrig": Path("assets/logos/mrig.png"),
}


def generate_particles(image_path, output_path):
    img = Image.open(image_path).convert("RGBA")

    # Fit logo inside canvas while preserving aspect ratio
    img.thumbnail((260, 300), Image.Resampling.LANCZOS)

    canvas = Image.new("RGBA", (GRID_WIDTH, GRID_HEIGHT), (0, 0, 0, 0))

    x_offset = (GRID_WIDTH - img.width) // 2
    y_offset = (GRID_HEIGHT - img.height) // 2

    canvas.alpha_composite(img, (x_offset, y_offset))

    pixels = canvas.load()

    candidates = []

    for y in range(GRID_HEIGHT):
        for x in range(GRID_WIDTH):

            r, g, b, alpha = pixels[x, y]

            # Ignore transparent pixels
            if alpha < 40:
                continue

            brightness = (
                0.299 * r +
                0.587 * g +
                0.114 * b
            )

            # Stronger weight for visible/darker pixels
            weight = (brightness / 255) ** 1.2

            candidates.append((x, y, weight))

    if not candidates:
        raise ValueError(f"No visible pixels found in {image_path}")

    random.seed(42)

    particles = []

    # Weighted sampling
    weights = [max(c[2], 0.01) for c in candidates]

    for _ in range(PARTICLE_COUNT):
        x, y, _ = random.choices(candidates, weights=weights, k=1)[0]

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

    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(data, f)

    print(f"{output_path.name} generated!")
    print("Particles:", len(particles))


for name, logo_path in LOGOS.items():

    output = Path(
        f"assets/banner/{name}_particles.json"
    )

    generate_particles(
        logo_path,
        output
    )

print()
print("All logo particle targets generated!")