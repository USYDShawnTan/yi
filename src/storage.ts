import type { Progress } from "./types";
import { lessons } from "./content";
export const STORAGE_KEY = "yixue.progress.v1";
export const emptyProgress = (): Progress => ({
  version: 1,
  completed: [],
  recent: null,
  answers: {},
});
const courseId = (n: unknown): n is number =>
  typeof n === "number" && Number.isInteger(n) && n >= 1 && n <= 8;
export function parseProgress(raw: string | null): Progress {
  if (raw === null) return emptyProgress();
  const p: unknown = JSON.parse(raw);
  if (!p || typeof p !== "object") throw Error("invalid progress");
  const v = p as Progress;
  if (
    v.version !== 1 ||
    !Array.isArray(v.completed) ||
    !v.completed.every(courseId) ||
    (v.recent !== null && !courseId(v.recent)) ||
    !v.answers ||
    typeof v.answers !== "object" ||
    Array.isArray(v.answers)
  )
    throw Error("invalid progress");
  const answers: Record<string, number> = {};
  for (const [id, a] of Object.entries(v.answers)) {
    const q = lessons.flatMap((l) => l.questions).find((q) => q.id === id);
    if (!q || !Number.isInteger(a) || a < 0 || a >= q.options.length)
      throw Error("invalid answer");
    answers[id] = a;
  }
  return {
    version: 1,
    completed: [...new Set(v.completed)],
    recent: v.recent,
    answers,
  };
}
export function readProgress(storage: Pick<Storage, "getItem">): {
  progress: Progress;
  notice: string;
} {
  try {
    return {
      progress: parseProgress(storage.getItem(STORAGE_KEY)),
      notice: "",
    };
  } catch {
    return {
      progress: emptyProgress(),
      notice: "本机记录无法读取或已损坏，已忽略无效记录。你仍可阅读和练习。",
    };
  }
}
