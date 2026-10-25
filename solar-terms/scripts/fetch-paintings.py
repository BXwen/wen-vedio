"""Download the 24 selected CC0 Met paintings into remotion/public/paintings/<lon>.jpg."""
import json
import os
import sys
import urllib.request
import concurrent.futures as cf

sys.stdout.reconfigure(encoding="utf-8")

# Solar longitude -> Met object id, in card order (立春 315° first).
ORDER = [
    51503, 53601, 53602, 36155, 53603, 51689,   # 春
    49079, 51781, 72603, 51624, 45646, 54710,   # 夏
    51858, 36089, 49171, 51793, 44897, 36091,   # 秋
    45680, 54646, 53451, 40021, 57173, 671033,  # 冬
]
LONS = [315, 330, 345, 0, 15, 30, 45, 60, 75, 90, 105, 120,
        135, 150, 165, 180, 195, 210, 225, 240, 255, 270, 285, 300]

OUT = os.path.join(os.path.dirname(__file__), "..", "remotion", "public", "paintings")
os.makedirs(OUT, exist_ok=True)


def get(url: str):
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req, timeout=90) as r:
        return r.read()


def one(args):
    met_id, lon = args
    dest = os.path.join(OUT, f"{lon}.jpg")
    if os.path.exists(dest) and os.path.getsize(dest) > 50_000:
        return lon, "cached"
    obj = json.loads(get(f"https://collectionapi.metmuseum.org/public/collection/v1/objects/{met_id}"))
    if not obj.get("isPublicDomain"):
        return lon, f"NOT PUBLIC DOMAIN {met_id}"
    img = obj.get("primaryImage")
    if not img:
        return lon, f"NO IMAGE {met_id}"
    data = get(img)
    with open(dest, "wb") as f:
        f.write(data)
    return lon, f"{len(data) // 1024}KB from {met_id}"


with cf.ThreadPoolExecutor(8) as ex:
    for lon, msg in ex.map(one, zip(ORDER, LONS)):
        print(f"{lon:>4}°  {msg}")

meta = []
for met_id, lon in zip(ORDER, LONS):
    obj = json.loads(get(f"https://collectionapi.metmuseum.org/public/collection/v1/objects/{met_id}"))
    meta.append({
        "lon": lon,
        "metId": met_id,
        "file": f"{lon}.jpg",
        "title": obj.get("title"),
        "artist": obj.get("artistDisplayName") or "佚名",
        "date": obj.get("objectDate"),
        "medium": obj.get("medium"),
    })

with open(os.path.join(os.path.dirname(__file__), "..", "remotion", "src", "data", "paintings.json"), "w", encoding="utf-8") as f:
    json.dump(meta, f, ensure_ascii=False, indent=1)
print("wrote paintings.json with", len(meta), "entries")
