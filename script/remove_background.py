from rembg import remove
from pathlib import Path

INPUT = Path("assets/photos/mayank.jpg")
OUTPUT = Path("assets/banner/mayank_cutout.png")

with open(INPUT, "rb") as input_file:
    input_data = input_file.read()

output_data = remove(input_data)

with open(OUTPUT, "wb") as output_file:
    output_file.write(output_data)

print("Background removal complete!")
print("Input:", INPUT)
print("Output:", OUTPUT)