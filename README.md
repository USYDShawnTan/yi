# 易学 · 从一爻开始

基于 React 19、TypeScript、Vite 7、Tailwind CSS 4 的《周易》入门学习网站。静态部署，无数据库、无账号系统、无运行时第三方内容请求。

## 已实现

- 米白、墨绿、朱红的响应式设计，桌面、平板与手机布局。
- 8 节正式入门课、16 道单选练习、答案反馈与知识点解析；答错可完成，重做不重复计数。
- 64 卦索引与详情：卦象、上下卦、读音、150–250 字原创导读、卦辞、384 条爻辞、关键词、来源；用九与用六独立展示。
- 简繁名称、数字搜索和上下卦交集筛选，筛选保存在 URL，支持空结果与清空。
- 可点击与键盘操作的爻位图、课程相关卦跳转及返回、前后课程与卦序导航。
- 版本化 localStorage 保存完成记录、最近课程与提交答案；容忍存储损坏、禁用与写入失败；重置有确认窗口。
- Hash 路由支持深链接刷新、未知路径提示；无第三方分析与学习记录上传。

## 启动

需要 Node.js 22.12+（本次云端使用 24.19.0）、npm。仓库位置 `/workspace/yi`。

```sh
npm ci
npm run dev
```

Vite 默认端口 5173。若在服务运行时重装了依赖，先停止自己启动的旧服务，再用 `npm run dev -- --force` 重建依赖缓存并启动。`npm run build` 产出 `dist/`；`npm run preview` 在 4173 端口预览生产包。这两个服务均只用于开发检查，**没有访问控制，不能当作私有托管**。不要直接开放到公网。

```sh
npm run validate    # 内容完整性、独立结构对照、经文快照与修订记录校验
npm test            # 存储与搜索单元测试
npm run build       # TypeScript 检查与生产构建
npm run test:e2e    # Chromium 真实浏览器交互测试，自动启动生产包预览
```

浏览器测试默认使用云环境的 `/usr/bin/chromium`。其他机器设置 `CHROMIUM_PATH` 指向 Chromium，或修改 Playwright 配置使用已经安装的浏览器。测试不通过时保存截图和 trace 至 `test-results/`，HTML 报告位于 `playwright-report/`。

## 内容与来源

- `src/content.ts`：课程、练习、八卦与检索。
- `data/guides.txt`：64 篇原创导读正文与释词。
- `data/hexagrams.json`：部署用结构化卦数据，六爻从下到上存储。
- `data/sources.json`：数字底稿版本、下载完整性、许可、取得日期和限制。
- `data/sources/`：未改写的底稿快照、许可和另一文本的经文摘录。
- `data/corrections.json`：14 条显式修订，包含修订前后文本与依据。
- `tests/hexagram-reference.json`：从独立来源转录的卦序与上下卦对应事实，用于交叉验证。
- `docs/PRD.md`：原需求文档；`docs/TEST-REPORT.md`：实际验收结果。

更新导读后运行 `npm run content:import`，它仅从本地固定快照重建数据，应用修订记录，不联网。随后运行 `npm run validate`、构建与相关测试。不要在组件内硬编码另一份卦图；爻题与图形都来自内容数据。修改题目时保留稳定 ID，若改变选项含义或顺序，应同步设计学习记录迁移策略。

### 文本版本限制

PRD 指定维基文库《周易》固定版本，但当前云环境对 `zh.wikisource.org` 返回 CONNECT 403。因此本版使用经完整性验证的 `taoism-sdk@1.0.11` 备用数字底稿，另用 `c_yijing@0.0.6` 公版经文摘录检查明显误抄。**未取得维基文库各页 oldid，未通过 PRD A04 的固定来源逐条校勘**。正文有简繁混排、异体字及待校差异，不能当作学术定本。页面中明确显示版本状态。

数字底稿的 MIT 许可保留在 `data/sources/LICENSE-taoism-sdk.txt`；未复制其现代白话译注或 SDK 运行代码。课程、导读、练习与界面为本项目编写。

## 部署与私有预览

将 `dist/` 发布到具备身份访问控制的静态托管平台。应用无需后端，但私有访问限制必须由托管平台提供，不能依靠隐藏 URL 或前端密码。发布后必须分别验证授权访问成功、未授权访问失败，再交付链接。

Vercel 的逐步部署说明见 [docs/VERCEL.md](docs/VERCEL.md)，仓库包含可直接使用的 `vercel.json`。当前代码分支为 `feat/yixue-learning`；仓库最初没有提交或 main 分支，未改写 main。外部部署和私有访问控制尚未验证，PRD 中的既有 Site 信息仅作续接记录。

## 云端复用

任务环境本身已隔离，直接使用 `/workspace/yi`，除非用户明确要求，不额外创建 Git worktree。依赖可由环境快照保留；Vite 进程在新任务中需要重新启动。无需应用密钥。
