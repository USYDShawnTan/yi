// Offline, deterministic import. No application-time requests to content sources.
import { readFileSync, writeFileSync } from "node:fs";
import assert from "node:assert/strict";
import type { Hexagram, TrigramName } from "../src/types";
const read = (path: string) =>
  readFileSync(new URL("../data/" + path, import.meta.url), "utf8");
const raw = JSON.parse(read("sources/taoism-sdk-1.0.11-gua64.json"));
const guides = read("guides.txt")
  .trim()
  .split("\n")
  .map((line) => line.split("|"));
const traditional =
  "乾 坤 屯 蒙 需 訟 師 比 小畜 履 泰 否 同人 大有 謙 豫 隨 蠱 臨 觀 噬嗑 賁 剝 復 無妄 大畜 頤 大過 坎 離 咸 恆 遯 大壯 晉 明夷 家人 睽 蹇 解 損 益 夬 姤 萃 升 困 井 革 鼎 震 艮 漸 歸妹 豐 旅 巽 兌 渙 節 中孚 小過 既濟 未濟".split(
    " ",
  );
const tri: Record<string, TrigramName> = {
  "111": "乾",
  "110": "巽",
  "101": "离",
  "100": "艮",
  "011": "兑",
  "010": "坎",
  "001": "震",
  "000": "坤",
};
const records = Object.values(raw).sort(
  (a: any, b: any) => a.order - b.order,
) as any[];
const result: Hexagram[] = records.map((v) => {
  const id = v.order,
    g = guides[id - 1],
    upper = tri[v.key.slice(0, 3)],
    lower = tri[v.key.slice(3)];
  const intro = `本卦为下${lower}上${upper}，六爻从下向上排列。先用卦图辨认上下两组三爻，再把卦辞与各条爻辞分开阅读。`;
  const [term, meaning] = g[3].split(":");
  const item: Hexagram = {
    id,
    name: g[0],
    traditional: traditional[id - 1],
    pinyin: id === 8 ? "bǐ" : id === 40 ? "xiè" : v.py,
    upper,
    lower,
    bits: [...v.key].reverse().map(Number),
    judgment: v.guaci,
    lines: v.yaoci.slice(0, 6).map((line: string) => {
      const m = line.match(
        /^(初[九六]|[九六][二三四五]|上[九六])[：，,、](.*)$/,
      )!;
      assert(m);
      return { title: m[1], text: m[2] };
    }),
    guide: intro + g[2],
    theme: g[1],
    keywords: [{ term, meaning }],
    source: "taoism-sdk@1.0.11",
  };
  if (id <= 2) {
    const [title, text] = v.yaoci[6].split("：");
    item.extra = { title, text };
  }
  return item;
});
for (const c of JSON.parse(read("corrections.json"))) {
  const h = result[c.hexagram - 1];
  if (c.field === "judgment") {
    assert.deepEqual(h.judgment, c.before);
    h.judgment = c.after;
  } else {
    const i = Number(c.field.split(".")[1]);
    assert.deepEqual(h.lines[i], c.before);
    h.lines[i] = c.after;
  }
}
writeFileSync(
  new URL("../data/hexagrams.json", import.meta.url),
  JSON.stringify(result, null, 2) + "\n",
);
console.log(
  "Imported 64 hexagrams from pinned local snapshot; applied documented corrections.",
);
