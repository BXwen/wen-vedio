import { describe, expect, it } from "vitest";
import { PAINTINGS } from "./paintings";
import { TERMS } from "./terms";

describe("data", () => {
  it("everyTermHasDistinctPainting", () => {
    expect(PAINTINGS).toHaveLength(24);
    const files = new Set(PAINTINGS.map((p) => p.file));
    expect(files.size).toBe(24);
  });

  it("paintingsAreOrderedBySolarLongitude", () => {
    // 立春 is 315°, then the year runs 330, 345, 0, 15 ... 300.
    expect(PAINTINGS[0].file).toBe("315.jpg");
    expect(PAINTINGS[23].file).toBe("300.jpg");
    TERMS.forEach((t, i) => {
      expect(PAINTINGS[i].file).toBe(`${t.lon}.jpg`);
    });
  });

  it("everyTermHasThreePentads", () => {
    for (const t of TERMS) {
      expect(t.pentads).toHaveLength(3);
      for (const p of t.pentads) expect(p.length).toBeGreaterThanOrEqual(2);
    }
  });

  it("termsAreSplitIntoFourSeasonsOfSix", () => {
    expect(TERMS.slice(0, 6).every((t) => t.season === "spring")).toBe(true);
    expect(TERMS.slice(6, 12).every((t) => t.season === "summer")).toBe(true);
    expect(TERMS.slice(12, 18).every((t) => t.season === "autumn")).toBe(true);
    expect(TERMS.slice(18).every((t) => t.season === "winter")).toBe(true);
  });

  it("longitudesAdvanceFifteenDegreesPerTerm", () => {
    TERMS.forEach((t, i) => {
      expect(t.lon).toBe((315 + i * 15) % 360);
    });
  });

  it("everyTermHasAnExactBeijingTime", () => {
    for (const t of TERMS) {
      expect(t.beijing).toMatch(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/);
      expect(t.timeLabel).toMatch(/^\d{2}:\d{2}$/);
      expect(t.dateLabel).toMatch(/^\d{1,2}月\d{1,2}日$/);
    }
  });
});
