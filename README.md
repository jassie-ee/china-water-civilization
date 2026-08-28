# 中华水生态文明互动系统

以“水生态工程师”为体验视角的沉浸式互动网站。项目通过黄河与长江两条首批开放流域，串联源区生态、关键工程、治理决策与知识复盘，探索自然过程、工程治理与文明智慧之间的关系。

## 当前实现

- 沉浸式启动序章：原子汇聚、水滴形成、地球与青藏高原源头叙事，并自动进入流域总览。
- 黄河与长江流域总览：展示两条流域的叙事示意路径、源头动画、悬停/键盘聚焦与点击入口。
- 黄河、长江专门地图：上中下游区域高亮、工程与生态节点、节点详情弹窗，以及生态影像占位区。
- 治理闯关通用结构：工程节点在同一弹窗内完成连续答题、结果展示与单题复盘；生态节点只提供介绍。
- 都江堰、丹江口已支持 Supabase 云端正式题库；其余工程节点暂以本地演示练习验证同一套界面结构。
- 游客匿名会话、邮箱账户注册/登录、用户名编辑、退出与账户注销入口。
- 全局积分面板：显示总积分、黄河与长江积分，并支持按范围清空确认。

详细操作方式见 [网站使用说明](docs/website-guide.md)。Supabase 配置与题库导入见 [Supabase 接入说明](docs/supabase-setup.md)。

## 技术栈

- React 19、TypeScript、Vite
- React Router（Hash Router，适配 GitHub Pages）
- 原生 CSS 与 SVG
- Supabase（匿名会话、邮箱账户、正式题库与积分）
- ESLint、npm

## 本地启动

```bash
npm install
copy .env.example .env.local
npm run dev
```

在 `.env.local` 中按需填写以下公开前端配置；未配置时，网站仍可运行本地演示内容。

```text
VITE_SUPABASE_URL=https://<project-ref>.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=<publishable-key>
```

> 不要把 Supabase `service_role` 密钥写入前端环境变量、GitHub 或仓库。

## 常用命令

```bash
npm run dev       # 启动开发服务器
npm run build     # TypeScript 检查并构建生产包
npm run lint      # ESLint 检查
npm run preview   # 本地预览生产构建
```

## 路由

| 路径 | 页面 |
| --- | --- |
| `/` | 沉浸式启动序章 |
| `/basins` | 黄河与长江流域总览 |
| `/basins/yellow-river` | 黄河流域专门地图 |
| `/basins/yangtze-river` | 长江流域专门地图 |
| `/basins/yellow-river/nodes/:nodeId` | 兼容旧入口，回到对应节点弹窗 |

## 目录概要

```text
src/
├─ pages/                 # 启动页、总览页、黄河/长江地图与闯关界面
├─ components/            # 全局账户、积分、布局与水波交互
├─ data/                  # 流域、节点、地图路径和本地演示关卡配置
├─ services/              # Supabase 与治理数据访问层
├─ types/                 # 业务、地图、题库和进度类型
├─ assets/maps/           # 地图资料与后续几何资产入口
└─ styles/                # 全局变量、重置与基础样式

supabase/
├─ migrations/            # 数据库结构、挑战结算和进度重置迁移
├─ seeds/                 # 题库导入模板；实际答案种子文件不提交 Git
└─ functions/             # Edge Function，例如账户注销
```

## 当前限制与后续计划

- 目前地图是叙事示意图，不是 GIS 或正式测绘底图；正式地图资产与合规核验仍待单独阶段完成。
- 待补齐其余工程节点的 40 题正式题库，并导入 Supabase 后启用随机抽题与正式积分。
- 生态节点的视频区已预留，等待导入自制视频素材。
- “查看解析”已保留界面契约，AI 解析、自由提问、管理员题库后台和账户找回密码尚未实现。
- 当前邮箱验证策略仅面向竞赛 demo；公开服务前应恢复邮箱验证、补充安全审计与 E2E 测试。

## 开发原则

- 每次只实现一个小功能。
- 每个功能必须经过手动测试。
- 测试通过后再提交 Git。
- 核心功能稳定后统一进行 E2E 测试。
