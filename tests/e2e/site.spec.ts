import { test, expect, chromium } from "@playwright/test";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
const key = "yixue.progress.v1";
test("new reader, wrong answer, explanation, completion, persistence and reset", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("link", { name: "开始第一课", exact: true }).click();
  const quizzes = page.locator(".quiz");
  await expect(page.getByRole("button", { name: "完成本课" })).toBeDisabled();
  await quizzes.nth(0).getByRole("radio").nth(0).check();
  await quizzes
    .nth(0)
    .getByRole("button", { name: "提交答案", exact: true })
    .click();
  await expect(quizzes.nth(0)).toContainText("再看一眼");
  await expect(quizzes.nth(0)).toContainText("正确答案：B");
  await quizzes.nth(1).getByRole("radio").nth(2).check();
  await quizzes
    .nth(1)
    .getByRole("button", { name: "提交答案", exact: true })
    .click();
  await page.getByRole("button", { name: "完成本课", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "已完成本课", exact: true }),
  ).toBeVisible();
  await page.reload();
  await expect(quizzes.nth(0)).toContainText("正确答案：B");
  await page.getByRole("button", { name: "已完成本课", exact: true }).click();
  expect(
    await page.evaluate(
      (k) => JSON.parse(localStorage.getItem(k)!).completed,
      key,
    ),
  ).toEqual([1]);
  await quizzes.nth(0).getByRole("radio").nth(1).check();
  await expect(
    page.getByRole("button", { name: "已完成本课", exact: true }),
  ).toBeDisabled();
  await quizzes.nth(0).getByRole("button", { name: "重新提交" }).click();
  await expect(quizzes.nth(0)).toContainText("答对了");
  await page.getByRole("link", { name: "下一课 阴爻与阳爻" }).click();
  await expect(page).toHaveURL(/lessons\/2/);
  await page.goto("/#/progress");
  await expect(page.locator(".progress-summary")).toContainText("最近学习：02");
  await page.getByRole("button", { name: "重置学习记录" }).click();
  await page.getByRole("button", { name: "保留记录" }).click();
  expect(
    await page.evaluate(
      (k) => JSON.parse(localStorage.getItem(k)!).completed,
      key,
    ),
  ).toEqual([1]);
  await page.getByRole("button", { name: "重置学习记录" }).click();
  await page.getByRole("button", { name: "确认重置" }).click();
  await expect(page.locator(".progress-ring strong")).toContainText("0");
  expect(await page.evaluate((k) => localStorage.getItem(k), key)).toBeNull();
});
test("search, combined filters, empty state, and hexagram navigation", async ({
  page,
}) => {
  await page.goto("/#/hexagrams");
  await expect(page.locator(".hex-card")).toHaveCount(64);
  const search = page.getByRole("textbox", { name: "搜索卦名或序号" });
  await search.fill("訟");
  await expect(page.locator(".hex-card")).toHaveCount(1);
  await expect(page.locator(".hex-card h3")).toHaveText("讼");
  await search.fill(" 3 ");
  await page.getByLabel("筛选上卦").selectOption("坎");
  await page.getByLabel("筛选下卦").selectOption("震");
  await expect(page.locator(".hex-card")).toHaveCount(1);
  await page.reload();
  await expect(page.locator(".hex-card")).toHaveCount(1);
  await page.getByLabel("筛选上卦").selectOption("乾");
  await expect(
    page.getByRole("heading", { name: "还没有找到这一卦" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "查看全部六十四卦" }).click();
  await expect(page.locator(".hex-card")).toHaveCount(64);
  await page.locator(".hex-card").nth(0).click();
  await expect(page.locator(".line-texts li")).toHaveCount(6);
  await expect(page.locator(".extra-text")).toContainText("用九");
  await page.getByRole("button", { name: "九五，阳爻", exact: true }).click();
  await expect(page.locator(".hex-caption")).toContainText("第5位");
  await expect(page.locator(".line-texts li.active")).toContainText("飞龙在天");
  await page.getByRole("link", { name: "下一卦 · 02 坤" }).click();
  await expect(page.locator(".extra-text")).toContainText("用六");
  await page.getByRole("link", { name: "六十四卦索引" }).click();
  await expect(page.locator(".hex-card")).toHaveCount(64);
});
test("all routes and all 64 details have no broken internal links or runtime errors", async ({
  page,
}) => {
  test.setTimeout(120000);
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => {
    if (m.type() === "error") errors.push(m.text());
  });
  const paths = [
    "/",
    "/lessons",
    "/progress",
    "/about",
    ...Array.from({ length: 8 }, (_, i) => `/lessons/${i + 1}`),
    ...Array.from({ length: 64 }, (_, i) => `/hexagrams/${i + 1}`),
    "/hexagrams",
  ];
  for (const path of paths) {
    await page.goto("/#" + path);
    await expect(page.locator("main h1")).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "换一个方向，继续探索" }),
    ).toHaveCount(0);
    if (path.startsWith("/hexagrams/"))
      await expect(page.locator(".line-texts li")).toHaveCount(6);
    const links = await page
      .locator('a[href^="#/"]')
      .evaluateAll((els) =>
        els.map((e) => e.getAttribute("href")!.slice(1).split("?")[0]),
      );
    for (const link of links) expect(paths).toContain(link);
  }
  expect(errors).toEqual([]);
  await page.goto("/#/not-real");
  await expect(
    page.getByRole("heading", { name: "换一个方向，继续探索" }),
  ).toBeVisible();
});
for (const width of [360, 768, 1440])
  test(`responsive layout ${width}px across all page types`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    for (const route of [
      "/",
      "/lessons",
      "/lessons/1",
      "/lessons/3",
      "/hexagrams",
      "/hexagrams/1",
      "/hexagrams/64",
      "/progress",
      "/about",
      "/missing",
    ]) {
      await page.goto("/#" + route);
      await expect(page.locator("main h1")).toBeVisible();
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= window.innerWidth,
        ),
      ).toBe(true);
    }
    await page.evaluate(() => localStorage.clear());
    await page.goto("/");
    await page.reload();
    await page.screenshot({
      path: `docs/screenshots/home-${width}.png`,
      fullPage: true,
    });
  });
test("unavailable storage and corrupted records do not prevent learning", async ({
  browser,
}) => {
  for (const mode of ["corrupt", "disabled"]) {
    const context = await browser.newContext();
    await context.addInitScript(
      ({ key, mode }) => {
        if (mode === "corrupt") localStorage.setItem(key, "broken");
        else
          Object.defineProperty(window, "localStorage", {
            get() {
              throw new DOMException("blocked", "SecurityError");
            },
          });
      },
      { key, mode },
    );
    const page = await context.newPage();
    await page.goto("/#/lessons/1");
    await expect(page.locator(".notice")).toBeVisible();
    await page.locator(".quiz").nth(0).getByRole("radio").nth(1).check();
    await page
      .locator(".quiz")
      .nth(0)
      .getByRole("button", { name: "提交答案", exact: true })
      .click();
    await expect(page.locator(".quiz").nth(0)).toContainText("答对了");
    await context.close();
  }
});
test("storage write failure keeps answers and completion usable in memory", async ({
  page,
}) => {
  await page.addInitScript(() => {
    Storage.prototype.setItem = () => {
      throw new DOMException("full", "QuotaExceededError");
    };
  });
  await page.goto("/#/lessons/2");
  for (const quiz of await page.locator(".quiz").all()) {
    await quiz.getByRole("radio").first().check();
    await quiz.getByRole("button", { name: "提交答案", exact: true }).click();
  }
  await page.getByRole("button", { name: "完成本课", exact: true }).click();
  await expect(page.locator(".notice")).toContainText("无法保存");
  await expect(
    page.getByRole("button", { name: "已完成本课", exact: true }),
  ).toBeVisible();
});
test("keyboard navigation, local reading offline, and return to lesson", async ({
  page,
  context,
}) => {
  await page.goto("/#/lessons/6");
  const line = page.getByRole("button", { name: "九五，阳爻", exact: true });
  await line.focus();
  await page.keyboard.press("Enter");
  await expect(page.locator(".hex-caption")).toContainText("九五");
  await context.setOffline(true);
  await page.getByRole("link", { name: "阅读屯卦原文" }).click();
  await expect(page.locator("main h1")).toContainText("屯");
  await page.getByRole("link", { name: "返回第 6 课" }).click();
  await expect(page.locator("main h1")).toHaveText("爻位与爻题");
  const radio = page.locator(".quiz").first().getByRole("radio").nth(1);
  await radio.focus();
  await page.keyboard.press("Space");
  await page.keyboard.press("Tab");
  await expect(
    page
      .locator(".quiz")
      .first()
      .getByRole("button", { name: "提交答案", exact: true }),
  ).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator(".quiz").first()).toContainText("答对了");
});
test("closing and reopening Chromium preserves records on disk", async () => {
  const profile = await mkdtemp(join(tmpdir(), "yixue-browser-"));
  const options = {
    executablePath: process.env.CHROMIUM_PATH || "/usr/bin/chromium",
    headless: true,
    args: ["--no-sandbox"],
  };
  const first = await chromium.launchPersistentContext(profile, options);
  try {
    const page = await first.newPage();
    await page.goto("http://127.0.0.1:4173/#/lessons/1");
    const q = page.locator(".quiz").first();
    await q.getByRole("radio").nth(1).check();
    await q.getByRole("button", { name: "提交答案", exact: true }).click();
    await expect(q).toContainText("答对了");
  } finally {
    await first.close();
  }
  const second = await chromium.launchPersistentContext(profile, options);
  try {
    const page = await second.newPage();
    await page.goto("http://127.0.0.1:4173/#/lessons/1");
    await expect(page.locator(".quiz").first()).toContainText("答对了");
  } finally {
    await second.close();
    await rm(profile, { recursive: true, force: true });
  }
});
test("all sixteen questions work and all eight lessons can be completed", async ({
  page,
}) => {
  await page.goto("/");
  const correct = [
    [1, 2],
    [0, 1],
    [2, 0],
    [1, 2],
    [0, 1],
    [1, 2],
    [2, 0],
    [1, 2],
  ];
  for (let lesson = 1; lesson <= 8; lesson++) {
    await page.goto(`/#/lessons/${lesson}`);
    for (let i = 0; i < 2; i++) {
      const q = page.locator(".quiz").nth(i);
      await q
        .getByRole("radio")
        .nth(correct[lesson - 1][i])
        .check();
      await q.getByRole("button", { name: "提交答案", exact: true }).click();
      await expect(q.locator(".answer-feedback")).toContainText("答对了");
    }
    await page.getByRole("button", { name: "完成本课", exact: true }).click();
  }
  await page.goto("/");
  await expect(
    page.getByRole("link", { name: "温故知新", exact: true }),
  ).toBeVisible();
  expect(
    await page.evaluate(
      (k) => JSON.parse(localStorage.getItem(k)!).completed.length,
      key,
    ),
  ).toBe(8);
});
