import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
  type ReactNode,
} from "react";
import type { Progress } from "./types";
import {
  emptyProgress,
  readProgress,
  STORAGE_KEY,
  parseProgress,
} from "./storage";
interface Context {
  progress: Progress;
  notice: string;
  visit: (id: number) => void;
  answer: (id: string, value: number) => void;
  complete: (id: number) => void;
  reset: () => void;
}
const ProgressContext = createContext<Context | null>(null);
export function ProgressProvider({ children }: { children: ReactNode }) {
  const [initial] = useState(() => {
    try {
      return readProgress(window.localStorage);
    } catch {
      return {
        progress: emptyProgress(),
        notice: "浏览器存储不可用，当前学习记录仅在本次访问中保留。",
      };
    }
  });
  const [progress, setProgress] = useState(initial.progress);
  const [notice, setNotice] = useState(initial.notice);
  const current = useRef(progress);
  const update = useCallback((fn: (p: Progress) => Progress) => {
    const next = fn(current.current);
    if (next === current.current) return;
    current.current = next;
    setProgress(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      setNotice(
        "当前无法保存学习记录，刷新后可能丢失。阅读和练习仍可正常使用。",
      );
    }
  }, []);
  const visit = useCallback(
    (id: number) => update((p) => (p.recent === id ? p : { ...p, recent: id })),
    [update],
  );
  const answer = useCallback(
    (id: string, value: number) =>
      update((p) => ({ ...p, answers: { ...p.answers, [id]: value } })),
    [update],
  );
  const complete = useCallback(
    (id: number) =>
      update((p) =>
        p.completed.includes(id)
          ? p
          : { ...p, completed: [...p.completed, id] },
      ),
    [update],
  );
  const reset = useCallback(() => {
    const next = emptyProgress();
    current.current = next;
    setProgress(next);
    try {
      localStorage.removeItem(STORAGE_KEY);
      setNotice("学习记录已重置。可以重新开始了。");
    } catch {
      setNotice(
        "本次访问的记录已重置，但浏览器拒绝清除已保存的数据。请在浏览器设置中清除本站数据。",
      );
    }
  }, []);
  useEffect(() => {
    const sync = (e: StorageEvent) => {
      if (e.key !== STORAGE_KEY && e.key !== null) return;
      try {
        const p = parseProgress(e.newValue);
        current.current = p;
        setProgress(p);
      } catch {
        setNotice("另一个页面的记录无效，已保留本页记录。");
      }
    };
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);
  return (
    <ProgressContext.Provider
      value={{ progress, notice, visit, answer, complete, reset }}
    >
      {children}
    </ProgressContext.Provider>
  );
}
export function useProgress() {
  const value = useContext(ProgressContext);
  if (!value) throw Error("ProgressProvider required");
  return value;
}
