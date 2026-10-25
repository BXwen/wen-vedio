"""Compute exact 2026 solar-term instants from JPL DE421, output data/terms-2026.json."""
import json, math
import numpy as np
from skyfield.api import load
from skyfield.framelib import ecliptic_frame

ts = load.timescale()
eph = load("de421.bsp")
earth, sun = eph["earth"], eph["sun"]

def lon_deg(jd: float) -> float:
    t = ts.tt_jd(jd)
    _, lon, _ = earth.at(t).observe(sun).apparent().frame_latlon(ecliptic_frame)
    return lon.degrees

def unwrap(a: float, ref: float) -> float:
    """Return a mapped into (ref-180, ref+180]."""
    return ref + ((a - ref + 180) % 360) - 180

def delta(jd: float, target: float) -> float:
    """Signed degrees from target to the sun, in (-180, 180]."""
    return ((lon_deg(jd) - target + 180) % 360) - 180

def bisect(target: float, lo: float, hi: float) -> float:
    for _ in range(70):
        mid = (lo + hi) / 2
        if delta(lo, target) * delta(mid, target) <= 0:
            hi = mid
        else:
            lo = mid
    return (lo + hi) / 2

# Longitude -> Chinese term name. 315 = 立春, then +15 each.
NAMES = ["春分", "清明", "谷雨", "立夏", "小满", "芒种", "夏至", "小暑", "大暑", "立秋",
         "处暑", "白露", "秋分", "寒露", "霜降", "立冬", "小雪", "大雪", "冬至", "小寒",
         "大寒", "立春", "雨水", "惊蛰"]

start_jd = ts.utc(2025, 12, 1).tt
end_jd = ts.utc(2027, 2, 1).tt
events = []
prev_jd, prev_lon = start_jd, lon_deg(start_jd)
for jd in np.arange(start_jd + 0.2, end_jd, 0.2):
    cur_lon = lon_deg(jd)
    # did we pass any multiple of 15?
    for target in range(0, 360, 15):
        before = ((prev_lon - target + 180) % 360) - 180
        after = ((cur_lon - target + 180) % 360) - 180
        if before <= 0 < after and (after - before) < 15:
            t = ts.tt_jd(bisect(target, prev_jd, jd))
            events.append((t, target))
    prev_jd, prev_lon = jd, cur_lon

out = []
for t, ang in events:
    out.append({
        "name": NAMES[(ang // 15) % 24],
        "lon": ang,
        "utc": t.utc_iso(),
        "beijing": t.utc_datetime().astimezone(__import__("datetime").timezone(__import__("datetime").timedelta(hours=8))).strftime("%Y-%m-%d %H:%M"),
    })

# keep the 24 consecutive terms of the 2026 cycle, starting 立春 2026
idx = next(i for i, e in enumerate(out) if e["name"] == "立春" and e["beijing"].startswith("2026"))
cycle = out[idx:idx + 24]
json.dump(cycle, open("data/terms-2026.json", "w", encoding="utf-8"), ensure_ascii=False, indent=1)
for e in cycle:
    print(e["name"], e["lon"], e["beijing"])
