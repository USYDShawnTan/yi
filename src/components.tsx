import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  ArrowRight,
  Check,
  Clock3,
  BookOpen,
} from "lucide-react";
import { numberLabel, imageOf } from "./content";
import type { Hexagram, Lesson } from "./types";
import { useProgress } from "./progress";
export function HexagramGraphic({
  bits,
  label,
  interactive = false,
  titles = [],
  onSelect,
}: {
  bits: number[];
  label: string;
  interactive?: boolean;
  titles?: string[];
  onSelect?: (i: number) => void;
}) {
  const [selected, setSelected] = useState<number | null>(null);
  return (
    <div className={`hexagram ${interactive ? "interactive" : ""}`}>
      <div
        className="hex-lines"
        role={interactive ? "group" : "img"}
        aria-label={label}
      >
        {[...bits]
          .map((bit, i) => ({ bit, i }))
          .reverse()
          .map(({ bit, i }) => {
            const line = (
              <>
                <span />
                {bit === 0 && <span />}
              </>
            );
            const cls = `hex-line ${bit === 0 ? "yin" : "yang"} ${i === 3 && bits.length === 6 ? "group-end" : ""} ${selected === i ? "selected" : ""}`;
            return interactive ? (
              <button
                type="button"
                key={i}
                className={cls}
                aria-pressed={selected === i}
                aria-label={`${titles[i] || `第${i + 1}爻`}，${bit ? "阳爻" : "阴爻"}`}
                onClick={() => {
                  setSelected(i);
                  onSelect?.(i);
                }}
              >
                {line}
              </button>
            ) : (
              <div aria-hidden="true" key={i} className={cls}>
                {line}
              </div>
            );
          })}
      </div>
      {interactive && (
        <p className="hex-caption" aria-live="polite">
          {selected === null
            ? "点选一爻，认识它的位置"
            : `${titles[selected]} · 第${selected + 1}位 · ${bits[selected] ? "阳爻" : "阴爻"} · ${selected < 3 ? "下卦" : "上卦"}`}
        </p>
      )}
    </div>
  );
}
export function HexCard({ hex }: { hex: Hexagram }) {
  return (
    <Link to={`/hexagrams/${hex.id}`} className="hex-card">
      <div className="hex-card-top">
        <span className="mono">{numberLabel(hex.id)}</span>
        <ArrowUpRight size={16} />
      </div>
      <HexagramGraphic
        bits={hex.bits}
        label={`${hex.name}卦，上${hex.upper}下${hex.lower}`}
      />
      <div className="hex-card-name">
        <h3>{hex.name}</h3>
        <span>{hex.pinyin}</span>
      </div>
      <p>
        {hex.upper === hex.lower
          ? `${hex.upper}为${imageOf(hex.upper)}`
          : `${imageOf(hex.upper)}${imageOf(hex.lower)}${hex.name}`}
        <span>
          上{hex.upper} · 下{hex.lower}
        </span>
      </p>
    </Link>
  );
}
export function LessonCard({ lesson }: { lesson: Lesson }) {
  const { progress } = useProgress();
  const done = progress.completed.includes(lesson.id);
  return (
    <Link
      className={`lesson-card ${done ? "is-complete" : ""}`}
      to={`/lessons/${lesson.id}`}
    >
      <div className="lesson-card-top">
        <span className="lesson-number">{numberLabel(lesson.id)}</span>
        <span className="tag">
          {done ? (
            <>
              <Check size={12} />
              已完成
            </>
          ) : (
            lesson.category
          )}
        </span>
      </div>
      <h3>{lesson.title}</h3>
      <p>{lesson.subtitle}</p>
      <div className="lesson-card-foot">
        <span>
          <Clock3 size={13} />
          {lesson.minutes} 分钟
        </span>
        <ArrowUpRight size={18} />
      </div>
    </Link>
  );
}
export function PageHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="page-heading">
      <p className="eyebrow">{eyebrow}</p>
      <h1>{title}</h1>
      <p className="heading-description">{description}</p>
    </div>
  );
}
export function SectionHeading({
  number,
  title,
  subtitle,
  to,
  linkLabel,
}: {
  number: string;
  title: string;
  subtitle: string;
  to?: string;
  linkLabel?: string;
}) {
  return (
    <div className="section-heading">
      <div>
        <p className="eyebrow">{number}</p>
        <h2>{title}</h2>
        <p>{subtitle}</p>
      </div>
      {to && (
        <Link className="text-link" to={to}>
          {linkLabel}
          <ArrowRight size={16} />
        </Link>
      )}
    </div>
  );
}
export function ContinueButton({ small = false }: { small?: boolean }) {
  const { progress } = useProgress();
  return (
    <Link
      className={small ? "button small" : "button"}
      to={`/lessons/${progress.recent || 1}`}
    >
      {small ? <BookOpen size={16} /> : null}
      {progress.completed.length === 8
        ? "温故知新"
        : progress.recent
          ? "继续学习"
          : "开始第一课"}
      <ArrowRight size={16} />
    </Link>
  );
}
