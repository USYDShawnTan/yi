import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { hexagrams, lessons, trigrams } from "../src/content";
import reference from "../tests/hexagram-reference.json";
import source from "../data/sources.json";
import corrections from "../data/corrections.json";
const raw = JSON.parse(
  readFileSync(
    new URL("../data/sources/taoism-sdk-1.0.11-gua64.json", import.meta.url),
    "utf8",
  ),
);
assert.equal(
  createHash("sha256")
    .update(
      readFileSync(
        new URL(
          "../data/sources/taoism-sdk-1.0.11-gua64.json",
          import.meta.url,
        ),
      ),
    )
    .digest("hex"),
  source.sha256,
);
assert.equal(hexagrams.length, 64);
assert.equal(lessons.length, 8);
assert.equal(lessons.flatMap((l) => l.questions).length, 16);
assert.deepEqual(
  hexagrams.map((h) => h.id),
  Array.from({ length: 64 }, (_, i) => i + 1),
);
assert.equal(new Set(hexagrams.map((h) => h.bits.join(""))).size, 64);
for (const h of hexagrams) {
  assert.equal(h.lines.length, 6, `${h.name}: six lines`);
  assert.equal(h.bits.length, 6);
  assert(h.bits.every((b) => b === 0 || b === 1));
  const ref = reference.rows.find((r) => r.id === h.id)!;
  assert.equal(h.upper, ref.upper, `${h.name}: upper trigram`);
  assert.equal(h.lower, ref.lower, `${h.name}: lower trigram`);
  assert.deepEqual(
    h.bits.slice(0, 3),
    trigrams.find((t) => t.name === h.lower)!.bits,
  );
  assert.deepEqual(
    h.bits.slice(3),
    trigrams.find((t) => t.name === h.upper)!.bits,
  );
  assert(
    h.guide.length >= 150 && h.guide.length <= 250,
    `${h.name}: guide length`,
  );
  assert(h.keywords.length > 0);
  assert(h.pinyin);
  assert(h.traditional);
  const original = Object.values(raw).find((r: any) => r.order === h.id) as any;
  const judgmentCorrection = corrections.find(
    (c) => c.hexagram === h.id && c.field === "judgment",
  );
  assert.equal(
    h.judgment,
    judgmentCorrection?.after ?? original.guaci,
    `${h.name}: recorded guaci`,
  );
  h.lines.forEach((l, i) => {
    const polarity = h.bits[i] ? "九" : "六";
    const title =
      i === 0
        ? "初" + polarity
        : i === 5
          ? "上" + polarity
          : polarity + "一二三四五六"[i];
    assert.equal(l.title, title, `${h.name}: ${i + 1} line title`);
    const m = original.yaoci[i].match(
      /^(初[九六]|[九六][二三四五]|上[九六])[：，,、](.*)$/,
    );
    const correction = corrections.find(
      (c) => c.hexagram === h.id && c.field === `lines.${i}`,
    );
    if (correction) {
      assert.deepEqual(correction.before, { title: m[1], text: m[2] });
      assert.deepEqual(l, correction.after);
    } else {
      assert.equal(l.title, m[1]);
      assert.equal(l.text, m[2]);
    }
    assert(l.text.length > 0);
    assert(
      !/初[九六][：]|[九六][二三四五][：]|上[九六][：]/.test(l.text),
      "No duplicated line headings",
    );
  });
  if (h.id <= 2) {
    assert(h.extra);
    assert.equal(h.extra.title, h.id === 1 ? "用九" : "用六");
    assert.equal(`${h.extra.title}：${h.extra.text}`, original.yaoci[6]);
  } else assert.equal(h.extra, undefined);
}
const questions = lessons.flatMap((l) => l.questions);
assert.equal(new Set(questions.map((q) => q.id)).size, 16);
for (const l of lessons) {
  assert.equal(l.questions.length, 2);
  assert(l.sections.length >= 3);
  assert(l.sections.reduce((n, s) => n + s.body.length, 0) > 300);
  assert(hexagrams.some((h) => h.id === l.example.hex));
  l.related.forEach((id) => assert(hexagrams.some((h) => h.id === id)));
  for (const q of l.questions) {
    assert(q.answer >= 0 && q.answer < q.options.length);
    assert(q.options.length >= 2);
    assert(q.explanation.length > 15);
    assert(q.knowledge);
  }
}
console.log(
  "PASS: 8 lessons, 16 questions, 64 guides, 384 line texts, 2 extras.",
);
console.log(
  "PASS: all trigram mappings match independent reference; every text matches pinned fallback snapshot plus explicit corrections.",
);
console.log(
  "NOT VERIFIED: Wikisource fixed-revision comparison (network access denied).",
);
