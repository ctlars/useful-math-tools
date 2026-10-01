from pathlib import Path

from PIL import Image


ROOT = Path(__file__).resolve().parent.parent
IMAGE_DIR = ROOT / "assets" / "images"
ICON_SOURCE = IMAGE_DIR / "useful-math-tools-icon.png"
LOGO_SOURCE = IMAGE_DIR / "useful-math-tools-logo.png"


def trim_transparent_canvas(path: Path) -> Image.Image:
    image = Image.open(path).convert("RGBA")
    bounds = image.getchannel("A").getbbox()
    if bounds:
        image = image.crop(bounds)
    image.save(path, optimize=True)
    return image


def square_icon(source: Image.Image, size: int) -> Image.Image:
    # A little clear space keeps the arrow and glow readable at browser-icon sizes.
    inset = max(1, round(size * 0.045))
    available = size - (inset * 2)
    image = source.copy()
    image.thumbnail((available, available), Image.Resampling.LANCZOS)
    canvas = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    canvas.alpha_composite(image, ((size - image.width) // 2, (size - image.height) // 2))
    return canvas


icon_source = trim_transparent_canvas(ICON_SOURCE)
trim_transparent_canvas(LOGO_SOURCE)

for size, name in (
    (16, "favicon-16x16.png"),
    (32, "favicon-32x32.png"),
    (48, "favicon.png"),
    (180, "apple-touch-icon.png"),
    (192, "favicon-192.png"),
):
    square_icon(icon_source, size).save(ROOT / name, optimize=True)

square_icon(icon_source, 64).save(
    ROOT / "favicon.ico",
    format="ICO",
    sizes=[(16, 16), (32, 32), (48, 48), (64, 64)],
)
