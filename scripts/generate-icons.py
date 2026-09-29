from pathlib import Path
from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parent.parent

def icon(size: int, name: str) -> None:
    scale = size / 64
    image = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(image)
    draw.rounded_rectangle((0, 0, size - 1, size - 1), radius=15 * scale, fill="#087f72")
    width = max(3, round(6 * scale))
    draw.line((18*scale, 14*scale, 18*scale, 32*scale), fill="white", width=width)
    draw.line((9*scale, 23*scale, 27*scale, 23*scale), fill="white", width=width)
    draw.line((38*scale, 39*scale, 55*scale, 39*scale), fill="white", width=width)
    draw.line((38*scale, 50*scale, 55*scale, 50*scale), fill="white", width=width)
    image.save(ROOT / name, optimize=True)

icon(48, "favicon.png")
icon(192, "favicon-192.png")
icon(180, "apple-touch-icon.png")
