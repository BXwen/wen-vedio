/**
 * 24 paintings, one per solar term. All from the Metropolitan Museum of Art
 * open-access collection (isPublicDomain: true), Chinese department.
 * Curated so each image answers the term's weather and activity:
 * spring greens, summer high-key, autumn ochres, winter snow.
 */

export type Painting = {
  /** Met object id. */
  metId: number;
  /** File under public/paintings/, e.g. "315.jpg" keyed by solar longitude. */
  file: string;
  title: string;
  date: string;
  medium: string;
};

export const PAINTINGS: Painting[] = [
  // 春 — fresh green, mist, new growth
  { metId: 51503, file: "315.jpg", title: "Landscape", date: "Southern Song–Yuan", medium: "Fan mounted as an album leaf; ink and colour on silk" },
  { metId: 45072, file: "330.jpg", title: "Landscape", date: "16th century", medium: "Six-panel folding screen; ink on paper" },
  { metId: 41192, file: "345.jpg", title: "Landscape", date: "Song–Yuan", medium: "Fan painting" },
  { metId: 829244, file: "0.jpg", title: "Landscape", date: "Qing", medium: "Album leaf" },
  { metId: 77191, file: "15.jpg", title: "Landscape", date: "Qing", medium: "Album leaf; ink and colour on paper" },
  { metId: 54696, file: "30.jpg", title: "Landscape", date: "ca. 1885–89", medium: "Album leaf; ink and colour on silk" },
  // 夏 — dense, high key, saturated
  { metId: 49079, file: "45.jpg", title: "Mountain Landscape", date: "ca. 1761–63", medium: "Hanging scroll; ink and colour on silk" },
  { metId: 51781, file: "60.jpg", title: "Landscape", date: "dated 1635", medium: "Hanging scroll; ink and colour on silk" },
  { metId: 72603, file: "75.jpg", title: "Landscape", date: "early 19th century", medium: "Hanging scroll; ink and colour on silk" },
  { metId: 51624, file: "90.jpg", title: "Landscape", date: "dated 1834", medium: "Hanging scroll; ink and colour on paper" },
  { metId: 45646, file: "105.jpg", title: "Landscape", date: "17th century", medium: "Hanging scroll; ink on paper" },
  { metId: 54710, file: "120.jpg", title: "Landscape", date: "ca. 1887–92", medium: "Album leaf; ink and colour on silk" },
  // 秋 — ochre, dry, thinning
  { metId: 51502, file: "135.jpg", title: "Landscape", date: "Yuan–Ming", medium: "Album leaf; ink and colour on silk" },
  { metId: 51610, file: "150.jpg", title: "Landscape", date: "Ming", medium: "Miniature from album of eleven paintings" },
  { metId: 51613, file: "165.jpg", title: "Landscape", date: "Ming", medium: "Miniature from album of eleven paintings" },
  { metId: 51793, file: "180.jpg", title: "Landscape", date: "18th–19th century", medium: "Hanging scroll; ink and colour on paper" },
  { metId: 44897, file: "195.jpg", title: "Landscape", date: "Ming–Qing", medium: "Handscroll" },
  { metId: 45680, file: "210.jpg", title: "Bamboo and Rock", date: "Ming", medium: "Handscroll; ink on paper" },
  // 冬 — snow, bare, cold light
  { metId: 671033, file: "225.jpg", title: "Landscape", date: "17th century", medium: "Handscroll; ink on silk" },
  { metId: 54646, file: "240.jpg", title: "Snow Landscape", date: "ca. 1885–89", medium: "Album leaf; ink and colour on silk" },
  { metId: 53451, file: "255.jpg", title: "Snowy Landscape", date: "1744", medium: "Hanging scroll; ink and colour on paper" },
  { metId: 40021, file: "270.jpg", title: "Snow Clearing: Landscape after Li Cheng", date: "dated 1669", medium: "Hanging scroll; ink on paper" },
  { metId: 57173, file: "285.jpg", title: "Winter Landscape", date: "second quarter of the 17th century", medium: "Hanging scroll; ink on paper" },
  { metId: 65625, file: "300.jpg", title: "Snow Landscape", date: "Qing", medium: "Hanging scroll" },
];

/** Indexed the same way as TERMS (0 = 立春). */
export const paintingForTerm = (index: number): Painting => PAINTINGS[index];
