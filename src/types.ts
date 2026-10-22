export type TrigramName = "乾" | "兑" | "离" | "震" | "巽" | "坎" | "艮" | "坤";
export interface Hexagram {
  id: number;
  name: string;
  traditional: string;
  pinyin: string;
  upper: TrigramName;
  lower: TrigramName;
  bits: number[];
  judgment: string;
  lines: { title: string; text: string }[];
  extra?: { title: string; text: string };
  guide: string;
  theme: string;
  keywords: { term: string; meaning: string }[];
  source: string;
}
export interface Question {
  id: string;
  prompt: string;
  options: string[];
  answer: number;
  explanation: string;
  knowledge: string;
}
export interface Lesson {
  id: number;
  title: string;
  subtitle: string;
  goal: string;
  minutes: number;
  category: string;
  sections: { title: string; body: string }[];
  example: { title: string; text: string; hex: number };
  related: number[];
  questions: Question[];
}
export interface Progress {
  version: 1;
  completed: number[];
  recent: number | null;
  answers: Record<string, number>;
}
