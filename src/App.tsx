import { useEffect, useRef, useState } from "react";
import {
  Link,
  NavLink,
  Route,
  Routes,
  useLocation,
  useParams,
  useSearchParams,
} from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
  ArrowLeft,
  BookOpen,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Compass,
  ExternalLink,
  Leaf,
  List,
  Menu,
  Search,
  ShieldCheck,
  Sparkles,
  Sprout,
  Trash2,
  X,
} from "lucide-react";
import {
  lessons,
  hexagrams,
  trigrams,
  filterHexagrams,
  imageOf,
  numberLabel,
} from "./content";
import {
  ContinueButton,
  HexagramGraphic,
  HexCard,
  LessonCard,
  PageHeading,
  SectionHeading,
} from "./components";
import { useProgress } from "./progress";
import type { Question } from "./types";
import corrections from "../data/corrections.json";
function App() {
  const location = useLocation();
  const [menu, setMenu] = useState(false);
  const main = useRef<HTMLElement>(null);
  const { notice, progress } = useProgress();
  useEffect(() => {
    setMenu(false);
    window.scrollTo({ top: 0, behavior: "instant" });
    main.current?.focus({ preventScroll: true });
    const lesson = location.pathname.match(/^\/lessons\/(\d+)$/);
    const hex = location.pathname.match(/^\/hexagrams\/(\d+)$/);
    document.title = `${lesson ? lessons[Number(lesson[1]) - 1]?.title || "未找到课程" : hex ? (hexagrams[Number(hex[1]) - 1]?.name || "未找到") + "卦" : { "/": "从一爻开始", "/lessons": "入门课程", "/hexagrams": "六十四卦", "/progress": "学习记录", "/about": "关于易学" }[location.pathname] || "未找到页面"} · 易学`;
  }, [location.pathname]);
  return (
    <>
      <a
        className="skip-link"
        href="#main-content"
        onClick={(e) => {
          e.preventDefault();
          main.current?.focus();
        }}
      >
        跳到正文
      </a>
      <header className="site-header">
        <div className="header-inner">
          <Link to="/" className="brand" aria-label="易学首页">
            <span className="brand-seal">易</span>
            <span className="brand-name">
              易学<span>YI XUE</span>
            </span>
          </Link>
          <nav
            className={menu ? "main-nav open" : "main-nav"}
            aria-label="主导航"
          >
            <NavLink to="/" end>
              首页
            </NavLink>
            <NavLink to="/lessons">入门课程</NavLink>
            <NavLink to="/hexagrams">六十四卦</NavLink>
            <NavLink to="/progress">
              学习记录
              {progress.completed.length > 0 && (
                <span className="nav-count">{progress.completed.length}</span>
              )}
            </NavLink>
          </nav>
          <Link className="header-about" to="/about">
            关于易学
            <ArrowUpRight size={14} />
          </Link>
          <button
            className="menu-toggle icon-button"
            aria-label={menu ? "关闭导航" : "打开导航"}
            aria-expanded={menu}
            onClick={() => setMenu(!menu)}
          >
            {menu ? <X /> : <Menu />}
          </button>
        </div>
      </header>
      {notice && (
        <div className="notice" role="status">
          {notice}
        </div>
      )}
      <main id="main-content" ref={main} tabIndex={-1}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/lessons" element={<LessonIndex />} />
          <Route path="/lessons/:id" element={<LessonRoute />} />
          <Route path="/hexagrams" element={<HexIndex />} />
          <Route path="/hexagrams/:id" element={<HexRoute />} />
          <Route path="/progress" element={<ProgressPage />} />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <footer className="site-footer">
        <div className="footer-top">
          <Link to="/" className="footer-brand">
            易学<span>在变化中，读懂经典。</span>
          </Link>
          <div>
            <Link to="/about">关于与内容来源</Link>
            <Link to="/progress">本机学习记录</Link>
          </div>
        </div>
        <div className="footer-bottom">
          <span>以原典为起点，以理解为归处。</span>
          <span>
            <ShieldCheck size={13} />
            无需账号 · 进度仅保存在此浏览器
          </span>
        </div>
      </footer>
    </>
  );
}
function HeroArt() {
  return (
    <div
      className="hero-art"
      aria-label="乾卦的六个阳爻，周围排列八卦，山峦象征阅读之路"
      role="img"
    >
      <div className="art-circle outer" />
      <div className="art-circle inner" />
      <div className="art-axis horizontal" />
      <div className="art-axis vertical" />
      <span className="art-caption">观 象 · 读 辞 · 明 理</span>
      <div className="art-trigrams">
        {trigrams.map((t, i) => (
          <div key={t.name} className={`orbit-item orbit-${i}`}>
            <span>{t.symbol}</span>
            <small>
              {t.name} · {t.image}
            </small>
          </div>
        ))}
      </div>
      <div className="central-hex">
        <span className="central-label">乾 · 为天</span>
        <HexagramGraphic bits={[1, 1, 1, 1, 1, 1]} label="乾卦，六爻皆阳" />
        <span className="central-verse">天行健 · 自强不息</span>
      </div>
      <svg
        className="mountains"
        viewBox="0 0 560 170"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M0 170V145L62 126L93 132L158 79L218 115L282 46L346 103L386 80L452 126L501 102L560 139V170Z"
          fill="#b6b9a5"
          opacity=".2"
        />
        <path
          d="M0 170V154L80 151L152 116L202 128L278 96L350 130L400 118L466 151L560 134V170Z"
          fill="#8d9a83"
          opacity=".2"
        />
        <path
          d="M0 170V161Q90 138 160 155T310 149T440 155T560 152V170"
          fill="#788975"
          opacity=".18"
        />
        <path
          d="M160 79L173 108L202 112M282 46L294 79L320 83L346 103M386 80L400 110"
          stroke="#8d9a83"
          opacity=".28"
        />
      </svg>
      <span className="art-seal">
        观<br />象
      </span>
    </div>
  );
}
function Home() {
  const { progress } = useProgress();
  return (
    <div className="home">
      <section className="hero wrap">
        <div className="hero-copy">
          <p className="eyebrow">
            <span />
            一部经典，一条循序渐进的路
          </p>
          <h1>
            读懂变化，
            <br />从<span className="hero-accent">一爻</span>开始。
          </h1>
          <p className="hero-description">
            不必急着读懂一切。
            <br />
            从阴阳、八卦到六十四卦，
            <br />
            用八节短课，走进《周易》的原典世界。
          </p>
          <div className="hero-actions">
            <ContinueButton />
            <Link className="text-link" to="/hexagrams">
              先看看六十四卦
              <ArrowUpRight size={16} />
            </Link>
          </div>
          <div className="hero-meta">
            <span>
              <BookOpen size={14} />8 节入门短课
            </span>
            <i />
            <span>
              <Clock3 size={14} />
              每天 10 分钟
            </span>
            <i />
            <span>零基础友好</span>
          </div>
        </div>
        <HeroArt />
      </section>
      <section className="principles wrap" aria-label="学习方法">
        <div>
          <span className="principle-icon">
            <Compass size={21} />
          </span>
          <div>
            <h3>循序入门</h3>
            <p>有路线，也可以按兴趣探索</p>
          </div>
        </div>
        <div>
          <span className="principle-icon">
            <BookOpen size={21} />
          </span>
          <div>
            <h3>回到原典</h3>
            <p>分清原文与导读，读出自己的理解</p>
          </div>
        </div>
        <div>
          <span className="principle-icon">
            <Sprout size={21} />
          </span>
          <div>
            <h3>学有所获</h3>
            <p>每课两道练习，让理解慢慢扎根</p>
          </div>
        </div>
      </section>
      <section className="course-section wrap">
        <SectionHeading
          number="01 / LEARNING PATH"
          title="八节课，搭起阅读的阶梯"
          subtitle="从认识一条爻，到独立读一卦。每一步，都算数。"
          to="/lessons"
          linkLabel="全部课程"
        />
        <div className="course-overview">
          <span>
            <span className="status-dot" />
            你的入门之旅
          </span>
          <div className="overview-track">
            <span
              style={{ width: `${(progress.completed.length / 8) * 100}%` }}
            />
          </div>
          <span>
            已完成 <b>{progress.completed.length}</b> / 8 课
          </span>
          <Link to="/progress" aria-label="查看学习记录">
            <ArrowUpRight size={16} />
          </Link>
        </div>
        <div className="lesson-grid">
          {lessons.map((l) => (
            <LessonCard key={l.id} lesson={l} />
          ))}
        </div>
      </section>
      <section className="explore-section">
        <div className="wrap">
          <SectionHeading
            number="02 / THE SIXTY-FOUR HEXAGRAMS"
            title="六十四卦，六十四种观看的角度"
            subtitle="看卦象，读卦辞，从一幅图开始与经典相遇。"
            to="/hexagrams"
            linkLabel="探索全部 64 卦"
          />
          <div className="featured-hex">
            {[1, 2, 3, 4, 11, 24].map((n) => (
              <HexCard key={n} hex={hexagrams[n - 1]} />
            ))}
          </div>
        </div>
      </section>
      <section className="closing wrap">
        <span className="closing-mark">“</span>
        <blockquote>
          学易，不急于求一个答案，
          <br />
          先学会更仔细地看。
        </blockquote>
        <p>
          这是一个关于经典阅读的学习空间。
          <br className="mobile-break" /> 从容一点，让理解自然发生。
        </p>
        <Link className="text-link" to="/about">
          了解我们的内容与初衷
          <ArrowRight size={16} />
        </Link>
        <Leaf className="closing-leaf" strokeWidth={0.7} size={100} />
      </section>
    </div>
  );
}
function LessonIndex() {
  const { progress } = useProgress();
  return (
    <div className="wrap page">
      <PageHeading
        eyebrow="LEARNING PATH / 入门课程"
        title="从第一爻，到独立阅读"
        description="八节短课，一条清晰的路线。所有课程自由开放，也欢迎从感兴趣的地方开始。"
      />
      <div className="lesson-index-intro">
        <div>
          <BookOpen size={22} />
          <span>8 节课程 · 16 道理解练习</span>
        </div>
        <span>已完成 {progress.completed.length} / 8 课</span>
      </div>
      <div className="lesson-list">
        {lessons.map((l) => (
          <Link to={`/lessons/${l.id}`} className="lesson-row" key={l.id}>
            <span className="row-number">{numberLabel(l.id)}</span>
            <div>
              <span className="eyebrow">{l.category}</span>
              <h2>{l.title}</h2>
              <p>{l.goal}</p>
            </div>
            <div className="row-meta">
              <span>
                <Clock3 size={14} />
                {l.minutes} 分钟
              </span>
              <span>
                {progress.completed.includes(l.id) ? (
                  <>
                    <CheckCircle2 size={15} />
                    已完成
                  </>
                ) : (
                  "开始学习"
                )}
                <ArrowRight size={16} />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
function LessonRoute() {
  const { id } = useParams();
  const lesson = lessons.find((l) => String(l.id) === id);
  return lesson ? <LessonPage key={id} id={lesson.id} /> : <NotFound />;
}
function LessonPage({ id }: { id: number }) {
  const lesson = lessons[id - 1];
  const h = hexagrams[lesson.example.hex - 1];
  const { progress, visit, complete } = useProgress();
  const [drafts, setDrafts] = useState<Record<string, number>>(() =>
    Object.fromEntries(
      lesson.questions
        .filter((q) => progress.answers[q.id] !== undefined)
        .map((q) => [q.id, progress.answers[q.id]]),
    ),
  );
  useEffect(() => visit(id), [id, visit]);
  const canFinish = lesson.questions.every(
    (q) =>
      progress.answers[q.id] !== undefined &&
      progress.answers[q.id] === drafts[q.id],
  );
  const done = progress.completed.includes(id);
  return (
    <div className="wrap page">
      <Link className="back-link" to="/lessons">
        <ArrowLeft size={15} />
        入门课程
      </Link>
      <div className="lesson-layout">
        <aside className="lesson-sidebar">
          <p className="eyebrow">你的阅读路线</p>
          <ol>
            {lessons.map((l) => (
              <li key={l.id}>
                <Link
                  aria-current={l.id === id ? "page" : undefined}
                  to={`/lessons/${l.id}`}
                >
                  <span>
                    {progress.completed.includes(l.id) ? (
                      <Check size={14} />
                    ) : (
                      numberLabel(l.id)
                    )}
                  </span>
                  {l.title}
                </Link>
              </li>
            ))}
          </ol>
          <p className="sidebar-note">
            <ShieldCheck size={15} />
            学习进度仅保存在本机
          </p>
        </aside>
        <article className="reading">
          <header className="reading-header">
            <p className="eyebrow">
              LESSON {numberLabel(id)} / {lesson.category}
            </p>
            <h1>{lesson.title}</h1>
            <p>{lesson.subtitle}</p>
            <div className="reading-meta">
              <span>
                <Clock3 size={14} />约 {lesson.minutes} 分钟 · 含阅读与练习
              </span>
              <span>{id} / 8 课</span>
              {done && (
                <span className="completed-label">
                  <CheckCircle2 size={14} />
                  已完成
                </span>
              )}
            </div>
          </header>
          <div className="goal-box">
            <span className="eyebrow">这一课，你将学会</span>
            <p>{lesson.goal}</p>
          </div>
          {lesson.sections.map((s, i) => (
            <section className="prose-section" key={s.title}>
              <h2>
                <span>{numberLabel(i + 1)}</span>
                {s.title}
              </h2>
              <p>{s.body}</p>
            </section>
          ))}
          {id === 3 && (
            <div className="trigram-table">
              {trigrams.map((t) => (
                <div key={t.name}>
                  <HexagramGraphic bits={t.bits} label={`${t.name}卦`} />
                  <strong>{t.name}</strong>
                  <span>{t.image}</span>
                </div>
              ))}
            </div>
          )}
          <section className="example-box">
            <div>
              <span className="eyebrow">看一看 · 试一试</span>
              <h2>{lesson.example.title}</h2>
              <p>{lesson.example.text}</p>
              <Link
                className="text-link"
                to={`/hexagrams/${h.id}?lesson=${id}`}
              >
                阅读{h.name}卦原文
                <ArrowUpRight size={15} />
              </Link>
            </div>
            <HexagramGraphic
              bits={h.bits}
              titles={h.lines.map((l) => l.title)}
              label={`${h.name}卦互动图`}
              interactive
            />
          </section>
          <section className="practice">
            <div className="practice-heading">
              <span className="eyebrow">PAUSE & REFLECT / 理解练习</span>
              <h2>停一停，看看你读懂了什么</h2>
              <p>两道小练习。答错也没关系，读完解析再试一次。</p>
            </div>
            {lesson.questions.map((q, i) => (
              <Quiz
                key={q.id}
                question={q}
                number={i + 1}
                onSelect={(value) =>
                  setDrafts((p) => ({ ...p, [q.id]: value }))
                }
              />
            ))}
            <div className="completion-box">
              <div>
                <strong>
                  {done
                    ? "这一课，已经走过了"
                    : canFinish
                      ? "准备好，走向下一步"
                      : "完成两道练习，留下这一步"}
                </strong>
                <p>
                  {done
                    ? "随时可以回来温习，也可以继续下一课。"
                    : canFinish
                      ? "点击完成，记录你的学习进度。"
                      : "提交两道题后即可标记完成，不设分数门槛。"}
                </p>
              </div>
              <button
                className="button"
                disabled={!canFinish}
                onClick={() => complete(id)}
              >
                {done ? <Check size={16} /> : <CheckCircle2 size={16} />}{" "}
                {done ? "已完成本课" : "完成本课"}
              </button>
            </div>
            <p className="sr-only" role="status">
              {done ? "本课已完成，学习记录已更新。" : ""}
            </p>
          </section>
          <div className="related">
            <span>相关卦</span>
            {lesson.related.map((n) => (
              <Link to={`/hexagrams/${n}?lesson=${id}`} key={n}>
                {hexagrams[n - 1].name}
                <ArrowUpRight size={13} />
              </Link>
            ))}
          </div>
          {id === 8 && (
            <p className="review-links">
              需要回看？<Link to="/lessons/3">八卦结构</Link>
              <Link to="/lessons/4">上下卦</Link>
              <Link to="/lessons/6">爻位与爻题</Link>
            </p>
          )}
          <nav className="reading-pagination" aria-label="课程翻页">
            {id > 1 ? (
              <Link to={`/lessons/${id - 1}`}>
                <ArrowLeft size={17} />
                <span>
                  <small>上一课</small>
                  {lessons[id - 2].title}
                </span>
              </Link>
            ) : (
              <span />
            )}
            {id < 8 ? (
              <Link to={`/lessons/${id + 1}`}>
                <span>
                  <small>下一课</small>
                  {lessons[id].title}
                </span>
                <ArrowRight size={17} />
              </Link>
            ) : (
              <Link to="/progress">
                查看学习记录
                <ArrowRight size={17} />
              </Link>
            )}
          </nav>
        </article>
      </div>
    </div>
  );
}
function Quiz({
  question: q,
  number,
  onSelect,
}: {
  question: Question;
  number: number;
  onSelect: (value: number) => void;
}) {
  const { progress, answer } = useProgress();
  const submitted = progress.answers[q.id];
  const [selected, setSelected] = useState<number | undefined>(submitted);
  const [edited, setEdited] = useState(false);
  const hasResult = submitted !== undefined && !edited;
  const correct = submitted === q.answer;
  return (
    <form
      className="quiz"
      onSubmit={(e) => {
        e.preventDefault();
        if (selected !== undefined) {
          answer(q.id, selected);
          setEdited(false);
        }
      }}
    >
      <fieldset>
        <legend>
          <span className="question-number">{numberLabel(number)}</span>
          {q.prompt}
        </legend>
        <div className="quiz-options">
          {q.options.map((option, i) => (
            <label
              className={`quiz-option ${selected === i ? "chosen" : ""} ${hasResult && i === q.answer ? "correct" : ""}`}
              key={option}
            >
              <input
                type="radio"
                name={q.id}
                value={i}
                checked={selected === i}
                onChange={() => {
                  setSelected(i);
                  setEdited(true);
                  onSelect(i);
                }}
              />
              <span className="option-letter">{"ABC"[i]}</span>
              <span>{option}</span>
              {hasResult && i === q.answer && <Check size={16} />}
            </label>
          ))}
        </div>
      </fieldset>
      <div className="quiz-controls">
        <button
          type="submit"
          className="button outline small"
          disabled={selected === undefined || hasResult}
        >
          {hasResult
            ? "已提交"
            : submitted !== undefined
              ? "重新提交"
              : "提交答案"}
        </button>
        <span>{hasResult ? "可更改选项，重新作答" : "单选 · 选择后提交"}</span>
      </div>
      {hasResult && (
        <div
          className={`answer-feedback ${correct ? "success" : "retry"}`}
          role="status"
        >
          <strong>
            {correct ? <CheckCircle2 size={17} /> : <BookOpen size={17} />}{" "}
            {correct ? "答对了，理解又多了一点" : "再看一眼，理解比答对更重要"}
          </strong>
          <p>
            你的答案：{"ABC"[submitted]} · 正确答案：{"ABC"[q.answer]}（
            {q.options[q.answer]}）
          </p>
          <p>{q.explanation}</p>
          <small>对应知识点：{q.knowledge}</small>
        </div>
      )}
    </form>
  );
}
function HexIndex() {
  const [params, setParams] = useSearchParams();
  const search = params.get("q") || "",
    upper = params.get("upper") || "",
    lower = params.get("lower") || "";
  const found = filterHexagrams(search, upper, lower);
  const set = (key: string, value: string) => {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    setParams(next, { replace: true });
  };
  return (
    <div className="wrap page hex-index">
      <PageHeading
        eyebrow="THE SIXTY-FOUR HEXAGRAMS / 六十四卦"
        title="一卦一境，慢慢读懂"
        description="依通行卦序排列。由卦象入手，循着原文，观察每一种处境中的变化。"
      />
      <div className="filter-bar">
        <label className="search-field">
          <Search size={19} />
          <input
            aria-label="搜索卦名或序号"
            placeholder="搜索卦名或序号，如：乾、1"
            value={search}
            onChange={(e) => set("q", e.target.value)}
          />
          {search && (
            <button
              aria-label="清除搜索"
              className="icon-button"
              onClick={() => set("q", "")}
            >
              <X size={16} />
            </button>
          )}
        </label>
        <label className="filter-select">
          上卦
          <select
            aria-label="筛选上卦"
            value={upper}
            onChange={(e) => set("upper", e.target.value)}
          >
            <option value="">全部</option>
            {trigrams.map((t) => (
              <option key={t.name} value={t.name}>
                {t.name} · {t.image}
              </option>
            ))}
          </select>
        </label>
        <label className="filter-select">
          下卦
          <select
            aria-label="筛选下卦"
            value={lower}
            onChange={(e) => set("lower", e.target.value)}
          >
            <option value="">全部</option>
            {trigrams.map((t) => (
              <option key={t.name} value={t.name}>
                {t.name} · {t.image}
              </option>
            ))}
          </select>
        </label>
        <button
          className="clear-filters"
          disabled={!params.size}
          onClick={() => setParams({})}
        >
          清空条件
        </button>
      </div>
      <div className="results-meta">
        <span role="status">共 {found.length} 卦</span>
        <span>
          按卦序排列 <List size={14} />
        </span>
      </div>
      {found.length ? (
        <div className="hex-grid">
          {found.map((h) => (
            <HexCard hex={h} key={h.id} />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <Search size={32} />
          <h2>还没有找到这一卦</h2>
          <p>试试简体或繁体卦名、1—64 的序号，或减少筛选条件。</p>
          <button className="button outline" onClick={() => setParams({})}>
            查看全部六十四卦
            <ArrowRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
}
function HexRoute() {
  const { id } = useParams();
  const h = hexagrams.find((h) => String(h.id) === id);
  return h ? <HexDetail key={id} id={h.id} /> : <NotFound />;
}
function HexDetail({ id }: { id: number }) {
  const h = hexagrams[id - 1];
  const [params] = useSearchParams();
  const from = Number(params.get("lesson"));
  const fromLesson = lessons.find((l) => l.id === from);
  const [active, setActive] = useState<number | null>(null);
  return (
    <div className="wrap page hex-detail">
      <div className="detail-back">
        <Link className="back-link" to="/hexagrams">
          <ArrowLeft size={15} />
          六十四卦索引
        </Link>
        {fromLesson && (
          <Link className="back-link" to={`/lessons/${from}`}>
            <BookOpen size={15} />
            返回第 {from} 课
          </Link>
        )}
      </div>
      <header className="hex-detail-header">
        <div>
          <p className="eyebrow">
            HEXAGRAM {numberLabel(h.id)} / 第 {h.id} 卦
          </p>
          <h1>
            {h.name}
            <span>{h.pinyin}</span>
          </h1>
          <p className="hex-theme">{h.theme}</p>
          <div className="hex-structure">
            <span>
              上卦 · {h.upper}为{imageOf(h.upper)}
            </span>
            <span>
              下卦 · {h.lower}为{imageOf(h.lower)}
            </span>
          </div>
        </div>
        <HexagramGraphic
          bits={h.bits}
          label={`${h.name}卦，点击查看爻位`}
          titles={h.lines.map((l) => l.title)}
          interactive
          onSelect={setActive}
        />
      </header>
      <div className="hex-reading-layout">
        <article>
          <section className="guide-box">
            <span className="eyebrow">
              <Sparkles size={14} />
              原创入门导读
            </span>
            <h2>从这里读起</h2>
            <p>{h.guide}</p>
            <small>本站辅助讲解，不替代原典，也不是唯一解释。</small>
          </section>
          <section className="classic-section">
            <div className="classic-heading">
              <h2>卦辞</h2>
              <span>原典 · 整卦之辞</span>
            </div>
            <blockquote>{h.judgment}</blockquote>
          </section>
          <section className="classic-section">
            <div className="classic-heading">
              <h2>爻辞</h2>
              <span>原典 · 从初爻到上爻</span>
            </div>
            <ol className="line-texts">
              {h.lines.map((l, i) => (
                <li key={l.title} className={active === i ? "active" : ""}>
                  <button
                    aria-label={`选择${l.title}`}
                    aria-pressed={active === i}
                    onClick={() => setActive(i)}
                  >
                    <span className="line-symbol">
                      {h.bits[i] ? "⚊" : "⚋"}
                    </span>
                    <span>{l.title}</span>
                  </button>
                  <p>{l.text}</p>
                </li>
              ))}
            </ol>
            {h.extra && (
              <div className="extra-text">
                <span className="tag">附加经文 · 不计入六爻</span>
                <h3>{h.extra.title}</h3>
                <p>{h.extra.text}</p>
              </div>
            )}
          </section>
        </article>
        <aside className="hex-aside">
          <section>
            <span className="eyebrow">READING NOTES</span>
            <h3>释词小笺</h3>
            {h.keywords.map((k) => (
              <div className="keyword" key={k.term}>
                <strong>{k.term}</strong>
                <p>{k.meaning}</p>
              </div>
            ))}
            <div className="keyword">
              <strong>九 / 六</strong>
              <p>爻题中的九表示阳爻，六表示阴爻。位置从下向上计数。</p>
            </div>
            <Link className="text-link" to="/lessons/6">
              复习爻位与爻题
              <ArrowUpRight size={14} />
            </Link>
          </section>
          <section className="source-note">
            <h3>文本与来源</h3>
            <p>
              原文沿用当前数字底稿字形，可能包含简繁混排；已发现的修订有单独记录。当前为备用文本版，尚未完成维基文库固定版本逐条核验。
            </p>
            <a
              href={`https://zh.wikisource.org/wiki/${encodeURIComponent("周易/" + h.traditional)}`}
              target="_blank"
              rel="noreferrer"
            >
              参考维基文库页面
              <ExternalLink size={13} />
            </a>
            <Link to="/about">
              查看版本与使用说明
              <ArrowRight size={13} />
            </Link>
          </section>
        </aside>
      </div>
      <nav className="reading-pagination" aria-label="卦序翻页">
        {id > 1 ? (
          <Link to={`/hexagrams/${id - 1}`}>
            <ArrowLeft size={18} />
            <span>
              <small>上一卦 · {numberLabel(id - 1)}</small>
              {hexagrams[id - 2].name}
            </span>
          </Link>
        ) : (
          <span />
        )}
        {id < 64 ? (
          <Link to={`/hexagrams/${id + 1}`}>
            <span>
              <small>下一卦 · {numberLabel(id + 1)}</small>
              {hexagrams[id].name}
            </span>
            <ArrowRight size={18} />
          </Link>
        ) : (
          <Link to="/hexagrams">
            返回索引
            <ArrowRight size={18} />
          </Link>
        )}
      </nav>
    </div>
  );
}
function ResetDialog({
  close,
  confirm,
}: {
  close: () => void;
  confirm: () => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const d = dialog.current;
    d?.showModal();
    return () => d?.close();
  }, []);
  return (
    <dialog
      ref={dialog}
      className="reset-dialog"
      aria-labelledby="reset-title"
      onCancel={close}
    >
      <button
        className="icon-button dialog-close"
        aria-label="关闭确认窗口"
        onClick={close}
      >
        <X size={20} />
      </button>
      <Trash2 size={28} />
      <h2 id="reset-title">重新开始这段旅程？</h2>
      <p>
        将清除当前浏览器的课程完成状态、最近课程和已提交答案。此操作无法撤销。
      </p>
      <div className="dialog-actions">
        <button autoFocus className="button outline" onClick={close}>
          保留记录
        </button>
        <button className="button" onClick={confirm}>
          确认重置
        </button>
      </div>
    </dialog>
  );
}
function ProgressPage() {
  const { progress, reset } = useProgress();
  const [confirming, setConfirming] = useState(false);
  return (
    <div className="wrap page progress-page">
      <PageHeading
        eyebrow="YOUR JOURNEY / 学习记录"
        title="走过的每一步，都在这里"
        description="不赶进度，不设排名。按自己的节奏，把理解慢慢积累下来。"
      />
      <div className="progress-summary">
        <div
          className="progress-ring"
          style={{
            background: `conic-gradient(var(--rust) ${(progress.completed.length / 8) * 360}deg, var(--line) 0)`,
          }}
        >
          <span>
            <strong>
              {progress.completed.length}
              <small>/8</small>
            </strong>
            <small>已完成课程</small>
          </span>
        </div>
        <div>
          <p className="eyebrow">
            {progress.completed.length === 8
              ? "A NEW BEGINNING / 温故知新"
              : "ONE STEP AT A TIME"}
          </p>
          <h2>
            {progress.completed.length === 8
              ? "入门之旅已完成，阅读才刚开始"
              : progress.recent
                ? "从上次停留的地方，继续吧"
                : "你的阅读之旅，从这里开始"}
          </h2>
          <p>
            {progress.recent
              ? `最近学习：${numberLabel(progress.recent)} · ${lessons[progress.recent - 1].title}`
              : "用第一节短课，为经典阅读找到一个入口。"}
          </p>
          <ContinueButton small />
        </div>
      </div>
      <div className="progress-lessons">
        {lessons.map((l) => (
          <Link to={`/lessons/${l.id}`} key={l.id}>
            <span
              className={`progress-status ${progress.completed.includes(l.id) ? "done" : ""}`}
            >
              {progress.completed.includes(l.id) ? (
                <Check size={17} />
              ) : (
                numberLabel(l.id)
              )}
            </span>
            <div>
              <h3>{l.title}</h3>
              <span>
                {progress.completed.includes(l.id)
                  ? "已完成 · 可以重读"
                  : Object.keys(progress.answers).some((k) =>
                        k.startsWith(l.id + "-"),
                      ) || progress.recent === l.id
                    ? "学习中"
                    : "还未开始"}
              </span>
            </div>
            <ArrowUpRight size={18} />
          </Link>
        ))}
      </div>
      <div className="storage-explanation">
        <div>
          <ShieldCheck size={21} />
          <div>
            <h3>你的学习记录，留在你这里</h3>
            <p>
              记录仅保存在当前浏览器，不上传服务器。更换设备、浏览器或清理浏览器数据后不会自动恢复。
            </p>
          </div>
        </div>
        <button className="reset-button" onClick={() => setConfirming(true)}>
          <Trash2 size={15} />
          重置学习记录
        </button>
      </div>
      {confirming && (
        <ResetDialog
          close={() => setConfirming(false)}
          confirm={() => {
            reset();
            setConfirming(false);
          }}
        />
      )}
    </div>
  );
}
function About() {
  return (
    <div className="wrap page about-page">
      <PageHeading
        eyebrow="ABOUT YI XUE / 关于易学"
        title="以原典为起点，以理解为归处"
        description="一个面向初学者的《周易》阅读空间。让古老的文字，成为今天可以耐心阅读的经典。"
      />
      <div className="about-content">
        <section>
          <h2>我们想做的事</h2>
          <p>
            易学以读懂原典为目标，提供八节入门课程、六十四卦资料与理解练习。你可以循序学习，也可以自由探索。本站不提供起卦、命运预测或自动解卦；每一份导读都为帮助阅读而写。
          </p>
        </section>
        <section>
          <h2>原典、传文与导读</h2>
          <p>
            卦详情中的“卦辞”“爻辞”是原典文字；乾卦用九、坤卦用六独立展示。《彖》《象》《文言》等不混入这些栏目，课程引用时明确标注。标有“原创入门导读”的文字、课程讲解与练习解析为本站编写，是辅助理解的一种视角。
          </p>
        </section>
        <section className="source-info">
          <span className="eyebrow">TEXT EDITION / 文本版本</span>
          <h2>来源清晰，阅读才有依据</h2>
          <p>
            当前数字底稿为 <strong>taoism-sdk 1.0.11</strong> 中的
            gua64.json，取得日期为 2026 年 10 月 22
            日。导入时仅提取卦辞、六爻辞及用九、用六，爻题和分隔符拆分为独立字段。通过另一份独立文本
            c_yijing 0.0.6 交叉检查，对重复、误抄及缺字等做了{" "}
            {corrections.length} 处明确修订，详见源码
            data/corrections.json；其余保留底稿字形与标点。下载包已通过 SHA-512
            完整性校验，原始快照和变更说明随源码保存。
          </p>
          <p>
            原计划采用维基文库《周易》各卦的固定版本。由于当前云环境拒绝访问该来源，
            <strong>固定版本逐条校勘尚未完成</strong>
            。当前版本适合功能预览；经文存在异体字、标点或底稿错误的可能，不能视为已完成学术校勘的定本。
          </p>
          <div className="source-links">
            <a
              href="https://www.npmjs.com/package/taoism-sdk/v/1.0.11"
              target="_blank"
              rel="noreferrer"
            >
              当前数字底稿
              <ExternalLink size={14} />
            </a>
            <a
              href="https://zh.wikisource.org/wiki/周易"
              target="_blank"
              rel="noreferrer"
            >
              维基文库《周易》
              <ExternalLink size={14} />
            </a>
          </div>
          <p className="small-text">
            数字资料许可：MIT · Copyright (c) 2023 elfpuck。完整许可见源码
            data/sources/LICENSE-taoism-sdk.txt。古代原典与现代整理材料的来源分别记录，未采用现代白话译注。
          </p>
        </section>
        <section>
          <h2>只属于这个浏览器的学习记录</h2>
          <p>
            我们用浏览器本地存储保存已完成课程、最近课程和最近一次提交的答案。无需注册，不上传学习记录，也不使用第三方行为追踪。存储不可用时，阅读与练习仍可继续；清理浏览器数据或换设备后，记录不会自动同步。
          </p>
        </section>
        <section>
          <h2>从容开始</h2>
          <p>
            第一轮不必记住所有名词。认识阴阳爻，分清上下卦，将一句爻辞放回正确的位置，就已经迈出重要的一步。
          </p>
          <ContinueButton />
        </section>
      </div>
    </div>
  );
}
function NotFound() {
  return (
    <div className="wrap empty-state not-found">
      <Compass size={42} />
      <p className="eyebrow">404 / 此处还没有一条路</p>
      <h1>换一个方向，继续探索</h1>
      <p>这个页面或编号不存在，可以从首页重新开始。</p>
      <Link className="button" to="/">
        返回首页
        <ArrowRight size={16} />
      </Link>
    </div>
  );
}
export default App;
