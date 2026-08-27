# 第三、第四章设计记录

## 1. 设计目标

第三、第四章沿用主线的「现代东方纸本地图」视觉，但不复刻第一、第二章的流域治理界面：

- 第三章把地图组织成一条横向航路，强调跨地域交流、共同建构与不照搬答案。
- 第四章把地图组织成一组低速运行的轨道，强调气候、资源、城市和协商之间的长期约束。
- 桌面端以 16:9 竞赛展示为主；移动端降级为纵向阅读和单列互动。
- 不自动播放剧情。用户点击节点或信号后才进入题面，选择后才出现反馈和下一步。

## 2. 视觉与动效规范

| 项目 | 规范 |
| --- | --- |
| 基底 | 复用主线 `shanhai-water-chronicle.png`，通过滤镜、深色水墨罩染和局部留白适配章节氛围 |
| 色彩 | 低饱和青绿、黛蓝、米灰为底；赭石/暖金只用于路径、焦点、进度和记忆星 |
| 排版 | 左侧编辑性标题，中部可探索图形，右侧叙事/选择面板；书法字体只承担章节标题和关键短句 |
| 线条 | SVG 等高线、航路、轨道使用细线和虚线，避免厚重卡片化 |
| 节点 | 未回应节点轻微呼吸；已回应节点转为青绿色实心；键盘焦点使用高亮描边 |
| 持续动效 | 第三章航路线条缓慢流动；第四章轨道低速旋转、经纬水线反向流动；只使用 `transform`、`opacity` 和 SVG stroke 偏移 |
| 动效降级 | `prefers-reduced-motion: reduce` 下停止旋转、流动和节点脉冲，保留静态路径、选中态与反馈 |

## 3. 页面结构

### 第三章：航 · 共建共享

文件：`src/pages/WorldWater/WorldWater.tsx`、`src/pages/WorldWater/WorldWater.css`

1. 左侧：章节命题、澜澜航记、图例。
2. 中部：`河口 → 河廊 → 海湾` 三节点航路，节点可自由点击。
3. 右侧：空状态导览、单题选择、完成回顾三种状态。
4. 内容节点：尼罗河三角洲、莱茵河廊道、海上水路。

### 第四章：望 · 共同家园

文件：`src/pages/CosmicFuture/CosmicFuture.tsx`、`src/pages/CosmicFuture/CosmicFuture.css`

1. 左侧：行星约束命题、澜澜望远镜、图例。
2. 中部：共同家园核心和四条轨道，信号围绕核心分布。
3. 右侧：空状态导览、单题选择、完成回顾三种状态。
4. 内容信号：气候韧性、资源边界、城市韧性、共同协商。

## 4. 内容与类型映射

| 内容层 | 文件 | 说明 |
| --- | --- | --- |
| 第三章类型 | `src/types/worldWater.ts` | `WorldWaterNode`、`WorldWaterChoice`、节点坐标和选择反馈 |
| 第三章题库 | `src/data/worldWater.ts` | 3 个世界水域节点，每题 3 个回应，按 1/2/3 记忆星评价 |
| 第四章类型 | `src/types/cosmicConstraint.ts` | `CosmicSignal`、`CosmicChoice`、未来信号坐标和选择反馈 |
| 第四章题库 | `src/data/cosmicConstraint.ts` | 4 个未来约束信号，每题 3 个回应，按 1/2/3 记忆星评价 |
| 互动壳 | `src/components/chapter/ChapterChoicePanel.tsx` | 两章共用，负责题面、选择锁定、反馈、继续和进度语义 |
| 积分 | `GovernanceProgressProvider` | 通过 `recordLevelResult` 接入已有全局积分；不改动第一、第二章题库和页面 |

## 5. 组件来源与适配矩阵

本轮遵循 design-consult 的 source-first 原则：先查看本地 library，再决定是否引入。第三、第四章最终采用轻量的项目内适配，以保持现有 React/Vite 依赖稳定。

| 参考/来源 | 借鉴点 | 项目内落点 | 处理方式 |
| --- | --- | --- | --- |
| 主线现有 `ChapterOverview` 与 `LanConversation` | 章节入口、澜澜叙事、焦点与关闭逻辑 | `src/routes/RouteTransition.tsx`、章节总览 | 复用，不重写第一、第二章 |
| 主线现有 `GovernanceProgressProvider` | 跨章节积分累计 | 两个新页面的 `recordLevelResult` | 复用已有状态接口 |
| 本地 design library 的 editorial waterline 原则 | 细线、虚线、持续水流、留白 | `WorldWater.css` 的航路 SVG；`CosmicFuture.css` 的水线与轨道 | 项目内 SVG 适配，不引入付费组件 |
| shadcn / 无障碍按钮模式 | 原生按钮、键盘焦点、禁用后的选择锁定 | `ChapterChoicePanel.tsx` 与节点按钮 | 采用语义 HTML 和 `:focus-visible` |
| React Bits / Aceternity library | 作为动效检索参考 | 本轮未直接安装组件 | 不使用 React Bits Pro、GSAP、WebGL 或未授权资源 |

## 6. 验收清单

- [x] `#/chapters` 的第三章入口跳转至 `#/chapter-3`。
- [x] `#/chapter-4` 可点击信号、选择回应、显示水脉回声并累计记忆星。
- [x] 第三章 3 节点、第四章 4 信号均有独立内容和完成态。
- [x] 桌面端三栏叙事布局和两章差异化中部图形已检查。
- [x] 移动端无横向溢出，顶部全局积分不遮挡章节标记。
- [x] 选择按钮有禁用态、选中态、键盘焦点和屏幕阅读器文本。
- [x] `prefers-reduced-motion` 下停用持续运动。
- [x] 构建、lint、浏览器控制台检查通过。
