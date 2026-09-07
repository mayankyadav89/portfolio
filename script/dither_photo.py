from PIL import Image
from pathlib import Path
import numpy as np

input_path = Path("assets/banner/mayank_300x340.png")
output_path = Path("assets/banner/mayank_dithered.png")

img = Image.open(input_path).convert("L")
pixels = np.array(img, dtype=np.float32)

height, width = pixels.shape

for y in range(height):
    for x in range(width):
        old_pixel = pixels[y, x]

        new_pixel = 255 if old_pixel >= 128 else 0
        pixels[y, x] = new_pixel

        error = old_pixel - new_pixel

        if x + 1 < width:
            pixels[y, x + 1] += error * 7 / 16

        if y + 1 < height:
            if x > 0:
                pixels[y + 1, x - 1] += error * 3 / 16

            pixels[y + 1, x] += error * 5 / 16

            if x + 1 < width:
                pixels[y + 1, x + 1] += error * 1 / 16

pixels = np.clip(pixels, 0, 255).astype(np.uint8)

result = Image.fromarray(pixels, mode="L")
result.save(output_path)

print("Dithering complete!")
print("Grid:", width, "x", height)
print("Total points:", width * height)
print("Saved to:", output_path)