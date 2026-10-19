#!/usr/bin/env python3
"""自分たちの写真を、栞サイト用に縮小・圧縮して photos/ に入れる。

使い方:
    python3 tools/prep_photo.py <元の写真> <名前>
例:
    python3 tools/prep_photo.py ~/Desktop/IMG_1234.HEIC w2-library
    → photos/w2-library.jpg を作る（同じ名前があれば上書き）

・長い辺を1300px以内に縮小し、JPEG（品質66）で保存します（1枚100〜250KBくらい）
・位置情報(GPS)などのメタデータは消します（家の場所が写真から分からないように）
・iPhoneのHEICは、macOSの sips で一度JPEGにしてから処理します
・必要なもの: Pillow（pip install pillow）

そのあと photos.js で、その写真の credit 行を消せば差し替え完了です。
"""
import subprocess
import sys
import tempfile
from pathlib import Path

try:
    from PIL import Image, ImageOps
except ImportError:
    sys.exit("Pillow が必要です:  python3 -m pip install pillow")

ROOT = Path(__file__).resolve().parent.parent
MAX_W, MAX_H = 1080, 1300


def main():
    if len(sys.argv) != 3:
        sys.exit(__doc__)
    src = Path(sys.argv[1]).expanduser()
    name = sys.argv[2].removesuffix(".jpg")
    if not src.exists():
        sys.exit(f"写真が見つかりません: {src}")

    with tempfile.TemporaryDirectory() as tmp:
        if src.suffix.lower() in (".heic", ".heif"):
            jpg = Path(tmp) / "converted.jpg"
            subprocess.run(["sips", "-s", "format", "jpeg", str(src), "--out", str(jpg)],
                           check=True, capture_output=True)
            src = jpg
        im = ImageOps.exif_transpose(Image.open(src)).convert("RGB")
        im.thumbnail((MAX_W, MAX_H), Image.LANCZOS)
        out = ROOT / "photos" / f"{name}.jpg"
        im.save(out, "JPEG", quality=66, optimize=True, progressive=True)  # exif は付けない

    print(f"できました: photos/{out.name}  ({im.width}x{im.height}, {out.stat().st_size // 1024}KB)")
    print(f'photos.js の "{name}" の credit 行を消すのを忘れずに。')


if __name__ == "__main__":
    main()
