# 部署到 Vercel

本项目为 React + Vite 静态应用，不需要数据库或环境变量。仓库根目录的 `vercel.json` 已声明安装、构建和输出目录。

1. 打开 https://vercel.com/new，用 GitHub 登录，选择 **Import Git Repository**。
2. 授权 Vercel 访问 `USYDShawnTan/yi` 并导入。若列表中找不到仓库，在 GitHub App 授权设置中增加这个仓库。
3. 确认要部署的分支为 `feat/yixue-learning`。这是当前包含网站代码的分支；仓库最初没有 main 提交。若导入页不提供分支选择，在项目 **Settings → Environments → Production → Branch Tracking** 中指定该分支，再触发部署。界面名称可能随 Vercel 版本调整。
4. 配置如下：

   | 配置 | 值 |
   | --- | --- |
   | Framework Preset | Vite |
   | Root Directory | `./`（仓库根目录） |
   | Install Command | `npm ci` |
   | Build Command | `npm run build` |
   | Output Directory | `dist` |
   | Node.js Version | `24.x`（与云端验证版本一致） |
   | Environment Variables | 无需设置 |

5. 如沿用 PRD 的私有预览要求，先在 **Settings → Deployment Protection** 配置可用的身份访问保护，并确认覆盖将要访问的部署及域名。Vercel Authentication 的可用范围与套餐相关，不应假定生产域名自动受保护。不要在保护未确认时分享部署地址。
6. 点击 **Deploy**，等状态变为 **Ready**，打开 Vercel 提供的地址。
7. 依次验证首页、第一课作答并完成、刷新恢复、六十四卦搜索与详情，以及手机布局。对私有预览，还要用未登录的无痕窗口检查首页和静态资源确实无法读取。

GitHub 仓库私有并不等于部署后的网站私有。若套餐无法保护生产部署，可使用该套餐支持保护的 Preview 部署，或先调整托管访问控制方案。

## 后续更新

向 Vercel 所关联分支推送新提交，默认会自动触发新部署。若需要使用 `main` 作为生产分支，先通过正常 Git 工作流建立或合入该分支，再在 Vercel 改分支设置；无需为了部署在本项目中添加服务端代码。

## 常见问题

- **构建提示 Node 版本太旧**：项目设置中选择 Node.js 24.x，再重新部署。
- **输出目录不存在**：Build Command 必须为 `npm run build`，Output Directory 为 `dist`，Root Directory 为仓库根目录。
- **刷新课程地址**：本站使用 `/#/lessons/1` 这样的 hash 路由，无需添加 SPA rewrite。不要把链接改成 `/lessons/1`。
- **部署后没有之前的学习记录**：记录按浏览器与站点域名隔离，从云端、本机或旧部署域名切换到新域名不会自动迁移。
- **经文来源状态**：当前仍为带修订记录的备用底稿，维基文库固定版本校勘状态见 `TEST-REPORT.md`；部署不代表校勘已完成。

本说明给出部署步骤，不代表已创建 Vercel 项目、发布网站或验证其访问控制。
