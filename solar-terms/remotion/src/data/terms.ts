import type { SeasonKey } from "../lib/theme";
import raw from "./terms-2026.json";

export type SolarTerm = {
  /** 0..23, 立春 first. */
  index: number;
  /** 节气名, e.g. 立春 */
  name: string;
  /** Solar ecliptic longitude in degrees. */
  lon: number;
  /** Beijing time of the exact instant, "YYYY-MM-DD HH:MM". */
  beijing: string;
  /** Just the date part, "MM月DD日". */
  dateLabel: string;
  /** Just the clock part, "HH:MM". */
  timeLabel: string;
  /** Three pentads (三候), each a 4-6 glyph phrase. */
  pentads: [string, string, string];
  /** One line of phenological description for the card. */
  note: string;
  season: SeasonKey;
  /** Season name, e.g. 春生. */
  seasonLabel: string;
};

type RawTerm = { name: string; lon: number; utc: string; beijing: string };

const PENTADS: Record<string, [string, string, string]> = {
  立春: ["东风解冻", "蛰虫始振", "鱼陟负冰"],
  雨水: ["獭祭鱼", "候雁北", "草木萌动"],
  惊蛰: ["桃始华", "仓庚鸣", "鹰化为鸠"],
  春分: ["玄鸟至", "雷乃发声", "始电"],
  清明: ["桐始华", "田鼠化为鴽", "虹始见"],
  谷雨: ["萍始生", "鸣鸠拂羽", "戴胜降桑"],
  立夏: ["蝼蝈鸣", "蚯蚓出", "王瓜生"],
  小满: ["苦菜秀", "靡草死", "麦秋至"],
  芒种: ["螳螂生", "鵙始鸣", "反舌无声"],
  夏至: ["鹿角解", "蜩始鸣", "半夏生"],
  小暑: ["温风至", "蟋蟀居壁", "鹰始鸷"],
  大暑: ["腐草为萤", "土润溽暑", "大雨时行"],
  立秋: ["凉风至", "白露降", "寒蝉鸣"],
  处暑: ["鹰乃祭鸟", "天地始肃", "禾乃登"],
  白露: ["鸿雁来", "玄鸟归", "群鸟养羞"],
  秋分: ["雷始收声", "蛰虫坯户", "水始涸"],
  寒露: ["鸿雁来宾", "雀入大水", "菊有黄华"],
  霜降: ["豺乃祭兽", "草木黄落", "蛰虫咸俯"],
  立冬: ["水始冰", "地始冻", "雉入大水"],
  小雪: ["虹藏不见", "天气上升", "闭塞成冬"],
  大雪: ["鹖鴠不鸣", "虎始交", "荔挺出"],
  冬至: ["蚯蚓结", "麋角解", "水泉动"],
  小寒: ["雁北乡", "鹊始巢", "雉始雊"],
  大寒: ["鸡始乳", "征鸟厉疾", "水泽腹坚"],
};

const NOTES: Record<string, string> = {
  立春: "一年的第一个刻度。太阳走到黄经 315°。",
  雨水: "冰化成水，水开始往回走。",
  惊蛰: "地下的虫被雷声叫醒。",
  春分: "昼夜等长。太阳直射赤道。",
  清明: "天清地明，万物都看得清了。",
  谷雨: "雨生百谷，春天最后一场雨。",
  立夏: "夏天从这一天开始计数。",
  小满: "麦粒将满未满。",
  芒种: "有芒的麦子要收，有芒的稻子要种。",
  夏至: "白昼最长。太阳走到最北。",
  小暑: "热开始了，但还不是最热。",
  大暑: "一年中最热的一段。",
  立秋: "暑气未退，秋已经立住了。",
  处暑: "暑气到此为止。",
  白露: "夜里凉下来，草叶上结出露水。",
  秋分: "昼夜再次等长。太阳回到赤道。",
  寒露: "露水开始发冷。",
  霜降: "秋天最后一个刻度，霜落下来。",
  立冬: "水开始结冰，冬天立住了。",
  小雪: "雪还小，落下来就化了。",
  大雪: "雪大起来，天地一起变白。",
  冬至: "白昼最短。太阳走到最南，然后回头。",
  小寒: "冷开始了，但还不是最冷。",
  大寒: "一年中最冷的一段。走完这一格，太阳回到立春。",
};

const SEASON_OF = (index: number): SeasonKey =>
  (["spring", "summer", "autumn", "winter"] as SeasonKey[])[Math.floor(index / 6)];

const SEASON_LABEL: Record<SeasonKey, string> = {
  spring: "春生",
  summer: "夏长",
  autumn: "秋收",
  winter: "冬藏",
};

const parseLabel = (beijing: string) => {
  const [date, time] = beijing.split(" ");
  const [, month, day] = date.split("-");
  return {
    dateLabel: `${Number(month)}月${Number(day)}日`,
    timeLabel: time,
  };
};

export const TERMS: SolarTerm[] = (raw as RawTerm[]).map((r, index) => {
  const season = SEASON_OF(index);
  const { dateLabel, timeLabel } = parseLabel(r.beijing);
  return {
    index,
    name: r.name,
    lon: r.lon,
    beijing: r.beijing,
    dateLabel,
    timeLabel,
    pentads: PENTADS[r.name],
    note: NOTES[r.name],
    season,
    seasonLabel: SEASON_LABEL[season],
  };
});

export const termByIndex = (index: number): SolarTerm => TERMS[index];
