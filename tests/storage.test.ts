import { describe, it, expect } from "vitest";
import { emptyProgress, parseProgress, readProgress } from "../src/storage";
import { filterHexagrams } from "../src/content";
describe("local learning records", () => {
  it("initializes a new reader", () =>
    expect(parseProgress(null)).toEqual(emptyProgress()));
  it("restores valid answers and deduplicates completion", () =>
    expect(
      parseProgress(
        JSON.stringify({
          version: 1,
          completed: [1, 1, 2],
          recent: 2,
          answers: { "1-1": 0, "2-2": 1 },
        }),
      ),
    ).toEqual({
      version: 1,
      completed: [1, 2],
      recent: 2,
      answers: { "1-1": 0, "2-2": 1 },
    }));
  it.each([
    "broken",
    "null",
    "[]",
    '{"version":2}',
    JSON.stringify({ version: 1, completed: [99], recent: 1, answers: {} }),
    JSON.stringify({
      version: 1,
      completed: [],
      recent: 1,
      answers: { "1-1": 99 },
    }),
    JSON.stringify({
      version: 1,
      completed: [],
      recent: 1,
      answers: { unknown: 0 },
    }),
  ])("rejects corrupt records %s", (raw) =>
    expect(() => parseProgress(raw)).toThrow(),
  );
  it("recovers from inaccessible storage", () => {
    const r = readProgress({
      getItem() {
        throw Error("denied");
      },
    });
    expect(r.progress).toEqual(emptyProgress());
    expect(r.notice).toBeTruthy();
  });
  it("recovers from damaged JSON", () =>
    expect(readProgress({ getItem: () => "{bad" }).progress).toEqual(
      emptyProgress(),
    ));
});
describe("hexagram lookup", () => {
  it.each([
    ["讼", 6],
    ["訟", 6],
    [" 1 ", 1],
    ["01", 1],
    ["遯", 33],
    ["遁", 33],
    ["恆", 32],
    ["恒", 32],
  ])("looks up %s", (q, id) =>
    expect(filterHexagrams(String(q), "", "").map((h) => h.id)).toContain(id),
  );
  it("combines search and both trigrams", () => {
    expect(filterHexagrams("屯", "坎", "震").map((h) => h.id)).toEqual([3]);
    expect(filterHexagrams("屯", "乾", "震")).toEqual([]);
  });
  it("returns no match outside 1-64", () => {
    expect(filterHexagrams("65", "", "")).toEqual([]);
    expect(filterHexagrams("0", "", "")).toEqual([]);
  });
});
