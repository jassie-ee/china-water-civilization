# 中华水生态文明互动系统

## 项目简介

面向“中华水生态文明”的沉浸式交互网站前端工程。后续将以水生态工程师的体验视角，逐步扩展流域选择、生态工程节点、治理决策与多维度评价等能力。

## 当前开发阶段

阶段 1：沉浸式启动页。首页现已提供水滴与涟漪场景、文化引导、可切换声景，以及进入流域地图占位页的过渡交互；正式地图、治理节点、评分与报告功能尚未开发。

## 技术栈

- React
- TypeScript
- Vite
- React Router
- CSS
- ESLint
- npm

## 常用命令

安装依赖：

```bash
npm install
```

启动开发环境：

```bash
npm run dev
```

构建生产版本：

```bash
npm run build
```

执行代码检查：

```bash
npm run lint
```

## 目录结构

```text
src/
├─ assets/                 # 图片、图标与字体资源
├─ components/
│  ├─ common/              # 可复用基础组件
│  └─ layout/              # 页面布局组件
├─ data/                   # 静态数据
├─ hooks/                  # 自定义 Hooks
├─ pages/                  # 路由页面
│  ├─ Home/
│  ├─ BasinMap/
│  └─ NotFound/
├─ routes/                 # 路由配置
├─ styles/                 # 全局样式与设计变量
├─ types/                  # TypeScript 类型定义
├─ utils/                  # 工具函数
├─ App.tsx
└─ main.tsx
```

`@` 路径别名指向 `src`，例如：`import AppRouter from '@/routes/AppRouter'`。

## 后续开发原则

- 每次只实现一个小功能；
- 每个功能必须经过手动测试；
- 测试通过后再提交 Git；
- 核心功能稳定后统一进行 E2E 测试。
