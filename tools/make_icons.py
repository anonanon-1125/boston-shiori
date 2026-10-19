#!/usr/bin/env python3
"""ホーム画面用アイコンを描いて icons/ に書き出す（作り直したいときだけ使う）。

使い方: python3 tools/make_icons.py
必要なもの: Pillow（pip install pillow）
"""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFilter

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "icons"

NAVY = (31, 53, 87)
PAPER = (250, 243, 230)
BRICK = (165, 73, 47)
CRANBERRY = (155, 39, 64)
MUSTARD = (241, 197, 72)
S = 2048  # 大きく描いてから縮小する


def bezier(p0, p1, p2, p3, n=80):
    pts = []
    for i in range(n + 1):
        t = i / n
        x = (1 - t) ** 3 * p0[0] + 3 * (1 - t) ** 2 * t * p1[0] + 3 * (1 - t) * t ** 2 * p2[0] + t ** 3 * p3[0]
        y = (1 - t) ** 3 * p0[1] + 3 * (1 - t) ** 2 * t * p1[1] + 3 * (1 - t) * t ** 2 * p2[1] + t ** 3 * p3[1]
        pts.append((x, y))
    return pts


def k(v):  # 1024基準の座標を描画サイズに
    return v * S / 1024


def draw_icon(pad=0.0):
    """pad: 外側の余白（maskable用に中身を小さくする割合）"""
    bg = Image.new("RGB", (S, S), NAVY)
    # ほんのり明るいグラデーション
    glow = Image.new("L", (S, S), 0)
    ImageDraw.Draw(glow).ellipse([k(120), k(60), k(900), k(840)], fill=60)
    glow = glow.filter(ImageFilter.GaussianBlur(k(160)))
    bg.paste(Image.new("RGB", (S, S), (52, 78, 118)), (0, 0), glow)

    art = Image.new("RGBA", (S, S), (0, 0, 0, 0))
    d = ImageDraw.Draw(art)

    # 栞の本体
    x0, x1, top, bottom, notch = k(362), k(662), k(196), k(838), k(742)
    shadow = Image.new("RGBA", (S, S), (0, 0, 0, 0))
    ImageDraw.Draw(shadow).polygon(
        [(x0 + k(18), top + k(22)), (x1 + k(18), top + k(22)), (x1 + k(18), bottom + k(22)),
         ((x0 + x1) / 2 + k(18), notch + k(22)), (x0 + k(18), bottom + k(22))], fill=(10, 20, 40, 110))
    shadow = shadow.filter(ImageFilter.GaussianBlur(k(18)))
    art.alpha_composite(shadow)
    d.rounded_rectangle([x0, top, x1, top + k(120)], radius=k(36), fill=PAPER)
    d.polygon([(x0, top + k(40)), (x1, top + k(40)), (x1, bottom), ((x0 + x1) / 2, notch), (x0, bottom)], fill=PAPER)

    # 上の穴
    cx = (x0 + x1) / 2
    d.ellipse([cx - k(24), top + k(52), cx + k(24), top + k(100)], fill=NAVY)

    # レンガの家（ブラウンストーン）
    hx0, hx1, hy0, hy1 = k(420), k(604), k(428), k(704)
    d.rectangle([hx0, hy0, hx1, hy1], fill=BRICK)
    d.rectangle([hx0 - k(14), hy0 - k(18), hx1 + k(14), hy0 + k(4)], fill=BRICK)  # 軒
    for wy in (k(460), k(544)):
        for wx in (k(448), k(540)):
            d.rounded_rectangle([wx, wy, wx + k(38), wy + k(56)], radius=k(5), fill=MUSTARD if (wx, wy) == (k(540), k(544)) else PAPER)
    # 玄関
    d.rounded_rectangle([k(488), k(626), k(536), k(704)], radius=k(22), fill=PAPER)
    d.rectangle([k(472), k(698), k(552), k(712)], fill=BRICK)

    # ハート
    hx, hy, r = cx, k(352), k(26)
    d.ellipse([hx - 2 * r, hy - r, hx, hy + r], fill=CRANBERRY)
    d.ellipse([hx, hy - r, hx + 2 * r, hy + r], fill=CRANBERRY)
    d.polygon([(hx - 2 * r + k(3), hy + k(10)), (hx + 2 * r - k(3), hy + k(10)), (hx, hy + 2.2 * r)], fill=CRANBERRY)

    # ひも と ふさ
    string = bezier((cx, top + k(76)), (cx + k(30), k(60)), (k(760), k(70)), (k(760), k(250)))
    d.line(string, fill=CRANBERRY, width=int(k(14)), joint="curve")
    d.rounded_rectangle([k(736), k(244), k(784), k(292)], radius=k(14), fill=CRANBERRY)
    for i, dx in enumerate((-18, -6, 6, 18)):
        d.line([(k(760 + dx), k(286)), (k(760 + dx * 1.4), k(400 + (i % 2) * 14))], fill=CRANBERRY, width=int(k(10)))

    # 雪
    for (sx, sy, sr) in [(220, 300, 13), (270, 640, 10), (820, 560, 12), (180, 470, 8), (850, 760, 9), (300, 160, 9)]:
        d.ellipse([k(sx - sr), k(sy - sr), k(sx + sr), k(sy + sr)], fill=(240, 236, 228, 230))

    art = art.rotate(-9, resample=Image.BICUBIC, center=(S / 2, S / 2))
    if pad:
        inner = int(S * (1 - 2 * pad))
        art = art.resize((inner, inner), Image.LANCZOS)
        layer = Image.new("RGBA", (S, S), (0, 0, 0, 0))
        layer.alpha_composite(art, (int(S * pad), int(S * pad)))
        art = layer
    out = bg.convert("RGBA")
    out.alpha_composite(art)
    return out.convert("RGB")


def main():
    OUT.mkdir(exist_ok=True)
    full = draw_icon()
    safe = draw_icon(pad=0.1)  # Androidの丸アイコンなどで切れないように
    full.resize((180, 180), Image.LANCZOS).save(OUT / "apple-touch-icon.png", optimize=True)
    full.resize((192, 192), Image.LANCZOS).save(OUT / "icon-192.png", optimize=True)
    full.resize((512, 512), Image.LANCZOS).save(OUT / "icon-512.png", optimize=True)
    safe.resize((512, 512), Image.LANCZOS).save(OUT / "icon-maskable-512.png", optimize=True)
    full.resize((32, 32), Image.LANCZOS).save(OUT / "favicon-32.png", optimize=True)
    print("icons/ に書き出しました")


if __name__ == "__main__":
    main()
