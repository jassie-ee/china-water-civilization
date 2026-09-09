# 第三、第四章设计记录

## 1. 设计目标

第三、第四章沿用主线的「现代东方纸本地图」视觉，但不复刻第一、第二章的流域治理界面：

- 第三章把地图组织成一条横向航路，按“在地勘察 → 获取 → 调节 → 利用/净化 → 共管”展开，强调跨地域交流、共同建构与不照搬答案。
- 第四章把地图组织成一组低速运行的轨道，按“碎片拼合 → 开放思考 → 飞向宇宙 → 终极觉醒”展开，强调从地球水治理走向宇宙共生。
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

### 第三章：航 · 同舟共济

文件：`src/pages/WorldWater/WorldWater.tsx`、`src/pages/WorldWater/WorldWater.css`

1. 左侧：章节命题、澜澜航记、五处水脉/七道判断图例。
2. 中部：`在地勘察 → 红海 → 印度河 → 西非 → 湄澜` 五站航路，节点可自由点击。
3. 右侧：导览、多选/单选题面、反馈、完成回顾状态。
4. 内容顺序：治水先看什么；沙特海水淡化；巴基斯坦卡洛特枢纽；几内亚水电与赤道几内亚治污；湄澜信息共享与水量分配。
5. 进度语义：七道判断写入 `0 → 30` 水脉感悟；西非和湄澜节点分别承载两道题。

### 第四章：望 · 天地人和

文件：`src/pages/CosmicFuture/CosmicFuture.tsx`、`src/pages/CosmicFuture/CosmicFuture.css`

1. 左侧：终章命题、澜澜望远镜、三种记忆状态图例。
2. 中部：三块可点击的水脉碎片、三幕轨道和持续流动的宇宙水线。
3. 右侧：碎片拼合仪式、无标准答案的开放思考、飞行确认、终极觉醒和完成回顾。
4. 内容顺序：水脉连天地；水脉贯星河；天地人和万物生。
5. 进度语义：拼合后 `10/30`，完成开放思考后飞行阶段 `20/30`，终章觉醒后 `30/30`。

## 4. 内容与类型映射

| 内容层 | 文件 | 说明 |
| --- | --- | --- |
| 第三章类型 | `src/types/worldWater.ts` | `WorldWaterStation`、`WorldWaterStep`、单选/多选模式、站点坐标和水脉增量 |
| 第三章题库 | `src/data/worldWater.ts` | 5 个航路站点、7 道判断，按 PDF 中的在地勘察和全球治水案例组织 |
| 第四章类型 | `src/types/cosmicConstraint.ts` | `CosmicAct`、`CosmicChoice`、三幕轨道和开放思考选项 |
| 第四章题库 | `src/data/cosmicConstraint.ts` | 三幕内容与三项均可成立的宇宙共生开放问题 |
| 互动壳 | `src/components/chapter/ChapterChoicePanel.tsx` | 两章共用，负责单选/多选、选择锁定、提交、反馈、继续和进度语义 |
| 积分 | `GovernanceProgressProvider` | 通过 `recordLevelResult` 接入已有全局积分；不改动第一、第二章题库和页面 |

## 5. 组件来源与适配矩阵

本轮遵循 design-consult 的 source-first 原则：先查看本地 library，再决定是否引入。第三、第四章最终采用轻量的项目内适配，以保持现有 React/Vite 依赖稳定。

| 参考/来源 | 借鉴点 | 项目内落点 | 处理方式 |
| --- | --- | --- | --- |
| 主线现有 `ChapterOverview` 与 `LanConversation` | 章节入口、澜澜叙事、焦点与关闭逻辑 | `src/routes/RouteTransition.tsx`、章节总览 | 复用，不重写第一、第二章 |
| 主线现有 `GovernanceProgressProvider` | 跨章节积分累计 | 两个新页面的 `recordLevelResult` | 复用已有状态接口 |
| 本地 design library 的 editorial waterline 原则 | 细线、虚线、持续水流、留白 | `WorldWater.css` 的五站航路；`CosmicFuture.css` 的水线、轨道与碎片场 | 项目内 SVG 适配，不引入付费组件 |
| shadcn / 无障碍按钮模式 | 原生按钮、键盘焦点、禁用后的选择锁定 | `ChapterChoicePanel.tsx` 与节点按钮 | 采用语义 HTML 和 `:focus-visible` |
| React Bits / Aceternity library | 作为动效检索参考 | 本轮未直接安装组件 | 不使用 React Bits Pro、GSAP、WebGL 或未授权资源 |
| [Aceternity Background Ripple Effect](https://ui.aceternity.com/components/background-ripple-effect) | 点击后扩散的邻近反馈 | `src/components/chapter/InkRipple.tsx`、`src/components/chapter/ink-ripple.css` | 本地适配为三层不规则水墨圈；落在第三章节点和第四章碎片坐标；不复制整面网格，不引入 Tailwind/Motion |
| [Aceternity Tracing Beam](https://ui.aceternity.com/components/tracing-beam) | 沿 SVG 路径追踪的动态短线 | `src/pages/WorldWater/WorldWater.tsx`、`src/pages/WorldWater/WorldWater.css`；`src/pages/CosmicFuture/CosmicFuture.tsx`、`src/pages/CosmicFuture/CosmicFuture.css` | 将滚动触发改为选择/阶段触发；保留 SVG stroke offset，使用暖金低亮度，`prefers-reduced-motion` 下静态显示 |
| [Aceternity Stateful Button](https://ui.aceternity.com/components/stateful-button) | action → recording → complete 状态反馈 | `src/components/chapter/StatefulActionButton.tsx`、`src/components/chapter/stateful-action-button.css` | 本地适配为 220ms 的真实状态提交；复用于选择面板、章节 CTA；保留语义按钮、焦点和禁用态 |

## 6. 验收清单

- [x] `#/chapters` 的第三章入口跳转至 `#/chapter-3`。
- [x] `#/chapter-3` 包含五站七问，多选题可先勾选再提交，并显示对应反馈。
- [x] `#/chapter-4` 按碎片拼合、开放思考、飞行、终极觉醒顺序推进。
- [x] 第三章五站、第四章三幕均有独立内容和完成态。
- [x] 桌面端三栏叙事布局和两章差异化中部图形已检查。
- [x] 移动端无横向溢出，顶部全局积分不遮挡章节标记。
- [x] 选择按钮有禁用态、选中态、键盘焦点和屏幕阅读器文本。
- [x] 第三章节点和第四章碎片点击后有局部水墨波纹；波纹不拦截后续点击。
- [x] 当前节点/阶段显示追踪水线；按钮显示“记录中/完成”状态后再进入下一阶段。
- [x] `prefers-reduced-motion` 下停用持续运动。
- [x] 构建与 lint 检查通过；开发服务器支持热更新预览。

## 7. 2026-08-28 design-consult 更新：第三、第四章的差异化设计

### 7.1 本轮范围与设计结论

本轮只针对第三章“航·同舟共济”和第四章“望·天地人和”。第一、第二章的路由、题库、页面、素材和现有交互均不在修改范围内。

当前两章的工程骨架已经可用，但视觉叙事仍共享“左侧标题—中部图形—右侧面板”的同一节奏。下一轮设计不再通过换颜色制造差异，而是改变两章的交互语法：

| 章节 | 设计母题 | 用户动作 | 页面记忆点 |
| --- | --- | --- | --- |
| 第三章 | 航路编年册 / field ledger | 选站点 → 阅读现场问题 → 留下一条判断 | 选择会在同一张山海图上留下可追踪的水线 |
| 第四章 | 星河反卷 / orbital ritual | 拼合碎片 → 开放思考 → 启动航行 → 回看约束 | 轨道不是背景装饰，而是随着阶段重组的“约束仪式” |

关键设计决策：第三章采用 SAFE A“航路编年册”，第四章采用受控风险方向 RISK B“星河反卷”。

### 7.2 设计方向提案与取舍

#### 方向 A：航路编年册（第三章，选定）

- 把地图视为可查询的航路索引，不把五个站点做成五张平铺卡片。
- 非当前站点只保留低亮度名称、坐标和顺序；当前站点才出现清晰的水墨节点、局部路线和右侧记录线。
- 右侧面板应像“现场记录页”，由站点选择重新排版标题、问题和证据摘要，不使用统一圆角卡片堆叠。
- 积分和进度放在页边或水线旁作为编年注记，保留语义文字，避免仅靠填充进度条表达状态。
- 第三章的连续性来自“路线被逐段记录”，不是来自自动轮播或无限循环背景。

#### 方向 B：双页水脉档案（备选）

- 左侧作为一张完整视觉板，右侧作为单页注释，减少中心节点数量。
- 适合做展览式静态浏览，但会削弱五站七问的路径感，因此暂不采用。

#### 方向 C：星河反卷（第四章，选定）

- 三枚碎片是页面的主交互对象，轨道是状态机的可视化，而不是持续自转的宇宙背景。
- `assembly` 阶段保持三枚碎片分离；选中后通过位移进入核心，不做自动飞入和镜头缩放。
- `reflection` 阶段核心转为开放问题的视觉锚点，选项仍使用原生语义按钮。
- `voyage` 阶段只激活当前轨道，其他轨道降为背景线；新标记在用户行动后出现，不自动滚动出场。
- `awakening/complete` 阶段将三个轨道收束成一张连接图，奖励以小型编年文字呈现，不增加大型徽章、彩色庆典弹窗或游戏化仪表盘。

### 7.3 六维设计系统

#### 1. 信息架构

- 第三章的主流程：`五站航路 → 当前站记录 → 题目判断 → 水感累计 → 完成回看`。
- 第四章的主流程：`三枚碎片 → 拼合 → 开放思考 → 飞行 → 终极觉醒`。
- 桌面端保留三栏叙事框架，但第三章以“路线索引”为中心，第四章以“状态轨道”为中心。两章不再使用完全相同的中心视觉比例。
- 第三章保留五站七问和已有 `WorldWaterStation/WorldWaterStep`；第四章保留三幕和已有 `CosmicAct/CosmicChoice`。本轮不扩写题库，不改变既有路由和积分接口。

#### 2. 视觉层级

- 一级：当前章命题和当前阶段标题，使用短中文书法标题；避免把长段诗意文案当作视觉主角。
- 二级：地图路线或轨道核心，承担“我现在在哪里”的定位功能。
- 三级：右侧问题、反馈、继续操作，是完成任务的主阅读区。
- 四级：站点序号、进度、状态、来源等元信息，保持小而清晰的编年注记。
- 第三章建议布局比例为 `20% / 47% / 33%`；第四章建议为 `18% / 58% / 24%`，让第四章中部轨道成为明确主角。
- 任何信息不得只通过亮度、颜色或动画表达；选中、已答、不可用状态同时有文字、图标/形状或 `aria` 语义。

#### 3. 排版

- 章标题继续使用现有 `--font-calligraphy`（STKaiti/KaiTi/serif）作为身份识别，只用于短标题和少量题签。
- 正文使用可读的中文无衬线栈，例如 `"Noto Sans SC", "Microsoft YaHei", sans-serif`；不要把书法字体用于长段正文。
- 编号、坐标、站点状态使用等宽栈，例如 `"IBM Plex Mono", "Cascadia Mono", monospace`，不可用时回退到系统等宽字体。
- 正文 14–16px，行高 1.7–1.9；桌面一级标题 40–76px，二级标题 24–36px；关键状态不低于 12px。
- 第三章标题偏“记录”，第四章标题偏“观测”；两章的字体家族不变，通过字距、编号方式和排版密度区分，而不是换成另一套风格。

#### 4. 色彩

页面继续使用深色山海图册基底，颜色只服务于层级、路径、焦点和反馈。实现时应逐步把页面 CSS 中的裸色收敛为语义变量。

```css
--chapter-bg: oklch(18% 0.03 205);
--chapter-surface: oklch(22% 0.035 200 / 0.88);
--chapter-ink: oklch(93% 0.045 92);
--chapter-body: oklch(88% 0.035 105 / 0.84);
--chapter-muted: oklch(76% 0.035 170 / 0.68);
--chapter-water: oklch(67% 0.095 182);
--chapter-water-soft: oklch(78% 0.065 163);
--chapter-mineral: oklch(78% 0.115 82);
--chapter-ochre: oklch(61% 0.115 70);
--chapter-line: oklch(80% 0.035 110 / 0.24);
--chapter-focus: oklch(94% 0.12 95);
--chapter-danger: oklch(62% 0.18 28);
```

- 非灰色控制在 12 个以内；`--chapter-danger` 只用于错误或不可恢复状态，不作为装饰。
- 正文与背景目标对比度至少 4.5:1；UI 边界、焦点环与大字号文字至少 3:1。
- 第三章以水青和赭金区分水线与记录印记；第四章同色系不变，只通过轨道层级和阶段明度区分。
- 禁止使用紫/靛蓝渐变、霓虹发光、玻璃拟态和大面积蓝色渐变来制造“科技感”。

#### 5. 空间与形状

- 延续纸本地图的直角、细线、印记和不规则路径；普通内容面板不再增加统一大圆角。
- 控件命中区域最小 44×44px，视觉边界可以更细，但不可牺牲触控范围。
- 使用 4px 间距基线：`4 / 8 / 12 / 16 / 20 / 24 / 32 / 40 / 48px`。
- 第三章的空间关系是横向路线、边缘注记、局部引线；第四章的空间关系是核心、轨道、阶段焦点。不要把两章都处理成同尺寸节点网格。
- 桌面端使用 `min-height: 100svh`，避免固定高度内容被底部进度线遮挡；移动端允许自然纵向滚动。

#### 6. 动效与反馈

动效以“解释状态变化”为唯一理由。首屏不自动播放叙事，不使用逐帧幻灯片，也不让全部轨道持续旋转。

```css
--dur-quick: 120ms;
--dur-state: 220ms;
--dur-panel: 320ms;
--dur-route: 420ms;
--dur-phase: 620ms;
--ease-out: cubic-bezier(.2, .75, .25, 1);
--ease-in: cubic-bezier(.65, 0, 1, .35);
--ease-in-out: cubic-bezier(.45, 0, .55, 1);
```

| 层级 | 时长 | 触发 | 实现规则 |
| --- | --- | --- | --- |
| M0 静态首屏 | 0ms | 页面进入 | 直接显示可读最终状态，不等待动画完成 |
| M1 水线追踪 | 320–420ms | 选择第三章站点或第四章阶段 | SVG `stroke-dashoffset`、`transform`、`opacity`；不改变布局尺寸 |
| M2 内容交换 | 260–360ms | 右侧面板内容变化 | 离场先淡出，入场位移 8–12px；不默认使用模糊 |
| M3 选择反馈 | 120–220ms | 按下、选中、提交 | 使用 `StatefulActionButton` 的状态语义与局部 InkRipple，一次完成后停止 |
| M4 阶段重组 | 500–650ms | 第四章 assembly/reflection/voyage/awakening | 只移动核心、当前碎片和激活轨道；不做无限旋转和自动镜头推进 |

`prefers-reduced-motion: reduce` 时直接渲染目标状态，取消无限动画、路径追逐、漂浮和自动轮播，但保留焦点、选中、禁用、反馈文字和进度语义。

### 7.4 第三章交互状态规格

| 状态 | 地图区域 | 右侧区域 | 可访问性与反馈 |
| --- | --- | --- | --- |
| 默认 | 五站可辨识，只有一个“待探”主提示 | 显示章节导语和操作说明 | 站点使用真实 `button`，提供名称、序号和状态 |
| hover/focus | 当前节点轻微放大，局部水线显现 | 不抢夺焦点，不自动打开面板 | `:focus-visible` 有 2px 以上焦点环，焦点不被底部线遮挡 |
| selected | 当前站点变为主色，绘制一条到记录区的短追踪线 | 标题、证据摘要和问题换成当前站点内容 | `aria-current` 或 `aria-pressed` 与视觉一致；不只靠颜色 |
| answered | 节点显示已记录序号/符号，路线保留痕迹 | 选择锁定，显示反馈和“继续” | 反馈包含文字，错误不使用红色作为唯一提示 |
| finished | 五站水线形成完整路线，但不弹大型庆典 | 显示完成记录和回看入口 | 完成状态可被读屏读取，键盘可继续或回到站点 |

第三章不要同时高亮五个站点的全部说明；一次只让一个站点成为视觉主语。`ChapterChoicePanel` 继续复用，但视觉上应像记录页，不再向圆角卡片靠拢。

### 7.5 第四章交互状态规格

| 阶段 | 中部视觉 | 右侧动作 | 约束 |
| --- | --- | --- | --- |
| assembly | 三枚碎片分离，核心留白 | 点击碎片并确认拼合 | 未解锁动作显示禁用语义，不能只用低透明度 |
| reflection | 核心标题变为“开放问题”，轨道降低明度 | 原生单选/多选与提交 | 均可成立的选项不伪造对错排名 |
| voyage | 只有当前轨道被激活，路线标记在行动后出现 | 启动飞行/继续 | 不自动推进、不自动滚动、不用“加载中”假装叙事 |
| awakening | 轨道收束为连接图，核心与澜澜回应 | 查看终章与回看 | 奖励使用短文本和细线印记，不增加游戏徽章墙 |
| complete | 保留最终连接关系 | 重新回看/返回章节总览 | 最终状态静止可读，关闭动效后不丢信息 |

第四章现有无限轨道运动需要在实现阶段改为阶段驱动：`assembly` 可以有极低频的单环呼吸，`voyage` 只让激活环运动，`complete` 完全静止。澜澜的神态切换沿用现有 `resting/listening/recorded/resolved`，不另造一套角色图层。

### 7.6 library source-first 组件映射

以下结论来自本地 component library 的实际源码和索引，而不是只根据网站名称判断。能够搬运的部分先记录来源、许可和依赖；本轮只完成设计决策，不安装依赖、不直接改页面代码。

| 来源与本地路径 | 许可/依赖 | 适用位置 | 决策 |
| --- | --- | --- | --- |
| shadcn `new-york-v4/ui/button.tsx`；`.claude/skills/design-shared/component-library/sources/shadcn-ui/apps/v4/registry/new-york-v4/ui/button.tsx` | MIT；`class-variance-authority`、Radix Slot | 两章的站点、碎片、选项、CTA | 采用行为和 API 思路；项目内继续使用原生 `button`，重写为直角纸本 tokens，暂不引入整套依赖 |
| shadcn `new-york-v4/ui/progress.tsx`；同一 `sources/shadcn-ui` | MIT；Radix UI | 两章页脚水感/阶段进度 | 采用语义 `value/max` 和 transform 指示器；视觉改为细水线与文字注记，拒绝默认圆角进度条 |
| shadcn `new-york-v4/ui/dialog.tsx`；同一 `sources/shadcn-ui` | MIT；Radix UI、lucide-react | 第三章长站点记录或第四章约束详情的可选详情层 | 只在右侧主面板放不下来源时再启用；保留 Escape、焦点回收和遮罩语义，不作为默认主布局 |
| React Bits Free `FadeContent.tsx`；`.claude/skills/design-shared/component-library/sources/react-bits-free-sparse/src/ts-tailwind/Animations/FadeContent/FadeContent.tsx` | MIT + Commons Clause；GSAP、ScrollTrigger | 右侧面板交换、阶段内容入场 | 仅取“有原因的面板换页”行为；当前项目无 GSAP 且不是滚动叙事，本轮不直接安装，后续若采用必须局部 scope、清理 timeline 和提供 reduced-motion |
| React Bits Free `CurvedLoop.tsx`；`.claude/skills/design-shared/component-library/sources/react-bits-free-sparse/src/ts-tailwind/TextAnimations/CurvedLoop/CurvedLoop.tsx` | MIT + Commons Clause；无额外依赖 | 文字沿水线排列的实验候选 | 当前拒绝。它默认自动 marquee，而本项目已明确不需要自动播放；最多借鉴静态 SVG `textPath` 的排版方式 |
| React Bits Free `ScrollReveal.tsx`；同一 `TextAnimations/ScrollReveal` | MIT + Commons Clause；GSAP、ScrollTrigger | 滚动叙事候选 | 当前拒绝。第三、第四章是点击驱动的单屏体验，不应人为制造滚动依赖 |
| Uiverse Galaxy 本地 HTML 条目 | 来源为 mirror-index；条目可用性与授权需逐项核验 | 仅作为未来按钮探索库 | 当前拒绝用于第三、第四章：实际本地条目存在霓虹、渐变、glitch、紫色 pill 和弱语义选择器；没有必要把不匹配的视觉搬进项目 |
| awesome-gpt-image-2 本地 prompt library；`.claude/skills/design-shared/component-library/sources/awesome-gpt-image-2` | 仓库 MIT；第三方案例图/提示词权利逐项核验 | 背景、场景板、角色表情和局部图形 | 只采用模板方法，不复制案例图；每次生成记录 prompt、来源、用途和许可边界 |

实施时每个外部组件都必须补齐：`source / item / license / target / keep / rewrite / dependencies / verification`。没有本地源码或无法确认许可的条目只能作为灵感，不能当作已接入组件对外宣称。

### 7.7 图片与素材提示词映射

图片只负责氛围、地貌和少量可裁切的视觉证据；所有文字、按钮、题目和进度都由 DOM/SVG 渲染，避免生成图中文字不可控。第三、第四章共享同一“山海图册”视觉母体，但通过构图和动作区分。

| 素材 | prompt library 模板 | 生成约束 | 页面落点 |
| --- | --- | --- | --- |
| 两章 16:9 背景 | `history-classical-themes` + `illustration-art-style` + `scene-storytelling` | 现代东方纸本地图，低饱和青绿/黛蓝/赭石/米灰/少量暖金，细等高线、淡墨晕染、深色留白；无文字、人物、建筑特写、UI、边框、霓虹、照片写实 | 两章 backdrop，重点保证右侧和中部有可读留白 |
| 第三章局部航路板 | `scene-storytelling` + `infographic-engine` | 把“跨地域水路被记录”作为事件；3–5 个可辨识地貌关系即可；不生成标签和长文字，避免旅游明信片构图 | 第三章地图纹理或局部 overlay |
| 第四章约束板 | `infographic-engine` + `scene-storytelling` | 以墨线、矿物金点和三条非对称轨道表示资源/气候/未来治理约束；不做银河霓虹、HUD、科幻仪表盘 | 第四章阶段底图或核心纹理 |
| 澜澜角色 | `character-design-sheet` + `illustration-art-style` | 固定脸部、发丝、服装和金色水滴坠；透明 PNG 必须是真实 alpha；脸部/皮肤保持不透明有色；不得绘制棋盘格、白底或把脸一起抠除 | 现有 `ChapterSpirit`，只做神态和轻微位移 |
| 小型奖励/印记 | `illustration-art-style` + `infographic-engine` | 单一水纹、印章、罗盘或细线符号；无文字；透明素材用真实 alpha；不做徽章墙和大量收藏卡 | 完成态页边注记，非主视觉 |

模板案例（例如 `case 456`、`case 338`、`case 238`）在本地库中均标记为 `imageReferenceOnly`，只能用于构图研究，不能直接复制案例图片，也不能由案例推断第三方授权。

### 7.8 实施验收矩阵

进入 `design-build` 后，必须至少在 1440×900、1280×720、900×1200 和 390×844 检查以下状态：

| 检查面 | 第三章 | 第四章 |
| --- | --- | --- |
| 默认态 | 五站、导语、操作提示一眼可读；不自动播放 | 三碎片、核心、当前阶段一眼可读；不持续旋转 |
| 交互态 | 站点 focus/selected/answered/finished 均有文字或符号辅助 | 碎片 focus、拼合、开放思考、飞行、觉醒均可辨识 |
| 键盘 | Tab 顺序为顶部返回 → 站点 → 选择 → 提交/继续；焦点不被底部线遮挡 | Tab 顺序为碎片 → 选项 → 阶段 CTA；禁用项不进入错误操作路径 |
| 触控 | 节点和选项命中区 ≥44px，无横向溢出 | 碎片、CTA、回看入口命中区 ≥44px，无横向溢出 |
| 动效 | 水线只在选择后短暂追踪；面板交换不抖动 | 阶段切换有一次性重组；不自动跳题、不自动滚动 |
| reduced-motion | 静态显示最终路线和反馈 | 静态显示目标轨道与阶段内容，取消无限运动 |
| 视觉 | 右侧正文对比度 ≥4.5:1，元信息不小于 12px | 核心、当前轨道和开放问题层级清晰，不依赖发光 |
| 工程 | 控制台无错误，build/lint 通过 | 控制台无错误，build/lint 通过；第一、第二章文件和路由 diff 为零 |

### 7.9 设计评审面板

| 评审视角 | 预评分 | 结论 |
| --- | ---: | --- |
| 品牌守护 | 4/5 | 深色山海图册、澜澜和水脉语气保持一致；第一、第二章范围明确隔离 |
| 视觉叙事 | 4/5 | 第三章讲“留下路线记录”，第四章讲“阶段重组约束”，差异来自结构而非换色 |
| UI 设计 | 3/5 | 现有层级可用，但站点标签、右侧面板和进度样式仍需按本方案收敛为语义 tokens |
| UX 架构 | 4/5 | 原生按钮、选择锁定、reduced-motion 基础已具备；实施时需重点复核焦点遮挡与禁用语义 |
| 记忆点 | 4/5 | “每一次选择都会在同一张活地图上留下水的去向”是可复述的独特交互，不依赖粒子特效 |

**状态：PASS（设计咨询完成，实施待开始）。** 当前唯一需要在实现阶段复核的风险是：第四章轨道运动必须从装饰性持续运动收敛为阶段驱动，第三章右侧面板必须避免重新长成通用卡片。

### 7.10 交接

- 设计产出：本文件第 7 节及前文第三、第四章基础规范。
- 下一负责人：`design-build`，只实现 `src/pages/WorldWater`、`src/pages/CosmicFuture` 及明确列出的共享章节组件。
- 不得修改：第一章、第二章页面/题库/素材；全局积分协议；主线路由结构。
- 进入实现前的唯一确认：按“航路编年册 + 星河反卷”方案开始第三、第四章的代码收敛。

### 7.11 组件落地记录：React Bits Free

本轮将 library 中已核对源码、无额外依赖的动效组件真正落入第三、第四章：

| 组件 | 本地来源 | 页面落点 | 保留/改写 |
| --- | --- | --- | --- |
| `Click Spark` | `.claude/skills/design-shared/component-library/sources/react-bits-free-sparse/src/ts-tailwind/Animations/ClickSpark/ClickSpark.tsx` | 保留在 `src/components/chapter/` 作为备用 library 适配 | 原始径向火花会产生点状/断续视觉，本轮不再用于第三、第四章主界面 |
| `Magnet` | `.claude/skills/design-shared/component-library/sources/react-bits-free-sparse/src/ts-tailwind/Animations/Magnet/Magnet.tsx` | 第三章“开始勘察”、第四章三个阶段 CTA | 保留靠近吸附的形状响应；改为章节缓动与有限强度，仅 fine pointer 启用，触控和 reduced-motion 自动降级 |
| `WaterMist`（本地适配） | React Bits Free `SplashCursor` 与 `RippleDistortion` 的事件扩散思路；来源分别为 `sources/react-bits-free-sparse/src/ts-tailwind/Animations/SplashCursor`、`Animations/RippleDistortion` | 第三章航路面、第四章轨道面、阶段 CTA | 不直接搬运全屏流体或 OGL 变形；改为局部 2D canvas，一次点击先扩散柔雾，再绘制连续椭圆水纹；无持续 RAF，`prefers-reduced-motion` 时关闭 |
| `FlowingContours`（本地适配） | React Bits Free `Waves` open-code：`sources/react-bits-free-sparse/src/ts-tailwind/Backgrounds/Waves/Waves.tsx` | 第四章轨道面 | 保留连续场线与指针缓动的核心行为；减少为 5 条地图等高线，改用二次曲线、低饱和墨青、低频速度，并在 `prefers-reduced-motion` 时只绘制静态首帧 |
| `EnergyOrb`（本地适配） | ThreeUI `GlobeCollection` 的 `Energy Orb`：用户提供源码，官方入口 `https://threeui.com/browse` | `src/components/chapter/EnergyOrb.tsx`；第四章中心地球 | 只保留自包含 WebGL 球体、fbm 雾场和 2D 星点层；去掉 ThreeUI 背景、其他 Globe 变体和运行时依赖，改为墨青/青绿/矿物金色阶、低密度星点与 reduced-motion 静态帧；许可证未在用户提供源码中声明，需按 ThreeUI 条款确认 |

四个适配均在 `src/components/chapter/` 内保留来源注释和 MIT + Commons Clause 记录；没有引入新的运行时依赖。组件只在 `WorldWater` 与 `CosmicFuture` 使用，第一、第二章不接入。验收重点是：地图/轨道不被 wrapper 压缩、CTA 仍保持 44px 命中区、连续背景动效低频且不抢信息、互动反馈在 reduced-motion 下可降级。

### 7.12 第四章线与地球的二次借鉴

本次针对截图中“虚线过粗、中心地球像装饰占位”的问题，重新核对了 library 的几何组件：

| 借鉴对象 | 可取部分 | 不直接使用的原因 | 本地改法 |
| --- | --- | --- | --- |
| React Bits Free `Orbit Images` | 椭圆/圆形路径的几何组织、轨道与中心内容分层 | 依赖 `motion/react`，默认持续运动过强；不直接搬运行时 | 保留“轨道路径 + 中心内容”的结构，改成第四章自己的 SVG 路径与低频呼吸状态 |
| React Bits Free `Magic Rings` | 多层环线、衰减、点击 burst 的层级关系 | 依赖 `three`，视觉默认偏霓虹；与山海图册纸本语气不合 | 用低饱和青绿/矿物金、连续细线和单次 trace 替换发光环 |
| React Bits Free `Orb` | 球体的光暗体积和 hover 层级 | 依赖 `ogl`，是抽象彩色球，不提供地理内容 | 在 `CosmicFuture.tsx` 中绘制带经纬线、陆块、岛屿和水脉路线的 cartographic globe，文字仍由 DOM/SVG 控制 |

第四章轨道现在统一使用连续细线，并叠加 `FlowingContours` 的低频场线变形，不再用大段 `stroke-dasharray` 伪造运动；真正需要强调的水线只在阶段行动后短暂追踪。中心地球增加球面底色、经纬弧线、低饱和陆块和水脉路线，同时做极小幅度呼吸与路线流动，作为“地球约束”的信息图符号，而不是泛化的发光圆球。

本次嵌入 ThreeUI 的 Energy Orb 时，只取中心球体本身：WebGL 的体积雾化作为动态底色，原有经纬线、陆块、岛屿和水脉路线作为纸本地图信息叠加层，未引入 `@designcodeio/threeui`、iframe 或其他 Globe Collection 变体。项目适配文件为 `src/components/chapter/EnergyOrb.tsx` 与 `src/components/chapter/energyOrbShaders.ts`；验证重点为 WebGL 不遮挡核心文字、透明画布不产生黑底、页面无横向溢出、源码构建通过，以及 `prefers-reduced-motion` 时只保留静态球面。

## 8. 2026-09-09 ask-matt 组件与素材深化方案

### 8.1 设计结论

本轮按 `ask-matt` 的“先审查现有系统，再决定是否新增能力”路线复核第三、第四章。结论是：不再叠加一套陌生的组件库，也不把 HY3D 精灵直接铺到地图上。现有组件已经覆盖基础行为，下一步应该把它们收敛成两种可复述的交互语言：

| 章节 | 交互隐喻 | 视觉主语 | 设计目标 |
| --- | --- | --- | --- |
| 第三章「同舟共济」 | 航路编年册 | 水线、站点、局部地貌标注 | 每次选择都在同一张世界水路图上留下可追溯的记录 |
| 第四章「天地人和」 | 星河观测台 | 核心球、轨道、阶段碎片 | 每个阶段只激活一条有意义的约束，不让轨道成为装饰性转盘 |

素材只增强“水线如何出现”“阶段如何被唤醒”和“澜澜如何指引”三件事；题目、说明、按钮、进度和状态全部继续由 DOM/SVG 输出，避免把不可控文字烘进图片。

### 8.2 组件与按钮深化矩阵

| 组件/来源 | 第三章落点 | 第四章落点 | 本轮深化 | 不做什么 |
| --- | --- | --- | --- | --- |
| `ChapterSceneStage` | 五个世界水域场景背景 | 宇宙约束场景背景 | 背景满幅铺开；只在画面真正需要时加入局部 alpha overlay | 不再叠加一整块纯色面板遮住地图 |
| `ChapterSceneAnnotations` | “山地来水 / 枢纽 / 灌溉”等局部标注 | “资源 / 气候 / 共生”等阶段标注 | 标注成为地图的一部分：短引线、暗底描边、选中后才展开副标题 | 不在右侧重复整段地图文字 |
| `Magnet`（React Bits Free 本地适配） | “开始勘察”“记录此站” | “进入观测”“完成觉醒” | 吸附半径更小、只作用于 fine pointer，最大位移 4px；hover 只改变线端与字色 | 不让所有节点和文字一起吸附 |
| `StatefulActionButton` | `idle → recording → complete` 的记录按钮 | `idle → recording → complete` 的阶段按钮 | 用短横线、状态词和一次性水纹表达状态；保留原生按钮语义 | 不使用大胶囊、霓虹渐变或无意义 loading |
| `InkRipple` + `WaterMist` | 站点选择后，水线从节点向记录区短追踪 | 阶段确认后，当前轨道出现一次雾化扩散 | 一次触发、320–420ms 完成、随后静止；同一交互只允许一个焦点反馈 | 不做全屏持续粒子、逐帧跳动的水纹 |
| `FlowingContours` | 不作为主动画，只保留背景等高线 | 作为第四章低频场线 | 只有当前阶段的轨道得到轻微呼吸；完成态静止 | 不让三条轨道同时旋转 |
| `EnergyOrb`（ThreeUI Energy Orb 本地适配） | 不接入，避免抢地图主语 | 中央“连天地”观测核心 | 保持透明 WebGL 球，叠加现有经纬/陆块/水脉 SVG；默认低亮度、低密度星点 | 不把它做成泛化发光球或全屏背景 |
| `ChapterGuide` + `ChapterSpirit` | 澜澜指向当前站点，完成后转为记录神态 | 澜澜指向当前阶段，觉醒后转为回应神态 | 精灵只承担“下一步去哪”和“为什么”的引导，尺寸保持小于地图主节点 | 不再让精灵成为页面第二个大主视觉 |

按钮形制统一为“纸本标记”而非通用 SaaS 控件：1px 细边、短横线、直角或小切角、暖金只用于当前行动。桌面端建议尺寸如下：

| 按钮类型 | 命中区 | 视觉高度 | 默认状态 | 选中/完成状态 |
| --- | ---: | ---: | --- | --- |
| 地图站点按钮 | `48 × 48px` | `16–20px` 的点/印记 | 暗青填充 + 暖金细环 | 水青实心点 + `已记录` 符号 |
| 章节主 CTA | 至少 `176 × 48px` | `48px` | 透明底、暖金下划线 | 文字变为“已进入航路/已打开观测” |
| 第四章碎片按钮 | 至少 `56 × 56px` | `44–52px` | 独立碎片、低明度 | 聚拢到核心，保留 1 次位移反馈 |
| 选项按钮 | 至少 `44px` 高 | 内容自适应 | 透明横线分隔 | 左侧字母/符号和文字同时变化 |

交互顺序必须可读：`hover/focus → selected → answered/assembled → next`。每个状态都要有文字或形状辅助，不能只改变透明度或颜色；`prefers-reduced-motion` 时直接显示目标状态，保留焦点环、反馈文字与 `aria-pressed` / `aria-current`。

### 8.3 第三章：把地图做成“可记录的水路”

第三章不再继续增加信息面板，而是把地图本身当作主界面。建议的单次交互序列：

1. 用户 hover 或键盘聚焦一个站点，站点只放大约 1.05 倍，出现一条极短引线和两行标注；不自动打开右侧内容。
2. 用户点击站点，`InkRipple` 在站点位置出现一次，水线沿 SVG 路径追踪到记录线，持续约 420ms。
3. 右侧 `ChapterChoicePanel` 只交换当前站点的标题、证据和问题；离场 8px + 淡出，入场 8px + 淡入，不使用模糊和大面积遮罩。
4. 提交后，节点变为“已记”状态，底部进度增加一小段，澜澜只做一次指向或点水动作；用户仍然可以回看已记录站点。

第三章的可生成素材只作为地图上的“水迹证据”：

| 素材 ID | 推荐尺寸/帧率 | WorkBuddy 提示词方向 | 页面位置与触发 |
| --- | --- | --- | --- |
| `c3-waterline-trace-loop.webp` | `960×540`，透明 alpha，12–16 帧，8–12fps | “现代东方纸本地图上的一条极细水墨水线，青绿与矿物金边缘，局部雾化、线条连续、无文字、无 UI、无边框、透明背景、首尾无跳变、低幅度循环” | 仅在站点选中后覆盖路线局部；默认不播放 |
| `c3-field-mark-loop.webp` | `256×256`，透明 alpha，10–12 帧 | “一枚小型水纹/测绘墨点，像纸面上被水滴触碰后留下的细环，低饱和青灰与一点暖金，无文字、无卡片、透明背景、动作极小、可循环” | 当前站点的标注点；一次反馈后静止在低透明度 |
| `c3-guide-observe.webp` | `512×512`，透明 alpha，12–16 帧 | “澜澜水滴精灵轻轻抬手指向地图，保持原有脸部和服饰，动作克制，水袖只做轻微摆动，无背景、无文字、真实透明 alpha” | 只有当用户需要引导时替换 `ChapterSpirit` 的动作层；不是默认主视觉 |

如果 WorkBuddy 不能直接给出真实 alpha，先输出纯品红背景的中间视频，再按现有抠像管线处理；最终交付给前端的仍必须是“真实透明 alpha 的动画 WebP”，不能把品红或棋盘格交给页面。

### 8.4 第四章：把阶段做成“可观测的约束”

第四章的核心不是更多轨道，而是“当前阶段为什么被激活”。建议按阶段使用单一主动作：

| 阶段 | 页面主动作 | 视觉反馈 | 按钮文案/语义 |
| --- | --- | --- | --- |
| `assembly` | 点击三枚碎片 | 碎片靠近核心，第一轨道一次性描边 | `拼合水脉碎片` |
| `reflection` | 选择开放问题 | 核心球降低亮度，问题区域成为阅读主语 | `记录我的判断` |
| `voyage` | 启动观测航线 | 只让当前轨道有 1 次流动，路线点亮 | `进入星河观测` |
| `awakening` | 完成最后判断 | 三条关系线汇聚，澜澜切换回应神态 | `完成天地人和` |
| `complete` | 回看或返回 | 所有轨道静止，保留最终连接图 | `回看观测记录` |

第四章可委托的素材：

| 素材 ID | 推荐尺寸/规格 | WorkBuddy 提示词方向 | 页面位置与触发 |
| --- | --- | --- | --- |
| `c4-observatory-mist.webp` | `960×540`，真实透明 alpha，12–20 帧，8fps 左右 | “深黛蓝山海图册上的极细淡墨雾，沿椭圆轨道缓慢聚散，青灰、米灰、少量矿物金，不出现星空霓虹、文字或 UI，透明背景，首尾平滑” | 第四章观测台底层，只有进入/切换阶段时播放一轮 |
| `c4-constraint-constellation.webp` | `640×640`，透明 alpha，12–16 帧 | “三枚极细矿物金与青绿色墨点在纸面上形成非对称水脉关系，像手绘测绘线被轻轻唤醒，无文字、无卡片、透明背景、低频呼吸” | `awakening` 阶段的关系线辅助层，不覆盖核心文字 |
| `c4-awakening-seal.webp` | `512×512`，透明 alpha，静态或 8 帧 | “东方纸本地图的完成印记，抽象水纹与天地相连的细线，暖金与青灰，克制、留白、无文字、透明背景” | 完成态右下角页边注记，不做大徽章 |

第四章不建议立刻再生成一只 HY3D 澜澜。当前的 2D 精灵更适合做指引，中心观测核心已经由 `EnergyOrb` 和 SVG 地图承担。若确实需要一个可拖拽的 HY3D 物件，优先生成“水脉观测球/小型水滴仪”而不是人物：

| 模型 ID | 规格 | 生成要求 | 接入方式 |
| --- | --- | --- | --- |
| `c4-water-observatory-orb.glb` | GLB、Meshopt；约 25k–60k 三角面；1K 或 2K 贴图 | 低多边形水墨地球/水滴仪，青灰釉面、细金线、无文字、无底座 UI；原点居中、尺寸归一、可单独旋转 | 只在用户点击“观测核心”后懒加载；默认静止，拖拽才启用 `OrbitControls`；退出阶段立即 dispose |

不建议把完整澜澜 GLB 直接塞进地图首页：它会与地貌、路线和文字竞争，且首屏会增加 GLB 加载与 WebGL 预算。完整精灵 GLB 保持在现有 `/demos/3d-pipeline` 验证页，章节内继续用轻量透明动画。

### 8.5 Three.js 接入边界

现有 `src/components/three/GlbViewer.tsx` 已有 Meshopt 解码、ACES 曝光、`IntersectionObserver`、页面隐藏暂停、动画混合器和卸载释放能力。真正接入第四章时只需要增加一个章节级薄包装，不应在两个页面各自复制一套 Three.js 生命周期：

```text
CosmicFuture
  └─ ChapterObservatoryOverlay (lazy, phase === voyage/awakening 或用户点击)
       └─ GlbViewer (透明 canvas, autoRotate=false, exposure 0.90–1.00)
```

约束如下：

- 默认用现有 `EnergyOrb`；HY3D 只作为用户主动打开的“观测层”，不在首屏同时运行 WebGL 球和 GLB。
- 模型只接收阶段状态和 `onReady/onError`，不直接修改题库或全局积分。
- 初始视角固定在纸本地图合适的正面，拖拽旋转是明确的“观测”动作；不自动旋转，不让镜头自行推进。
- 进入不可见区域或切换阶段时停止渲染并释放几何、材质和纹理；失败时回退到 `EnergyOrb`，页面仍然完整可用。
- 目标是单个 3D 物件、一个透明画布、一个交互焦点；不要把 3D 当成背景特效层。

### 8.6 组件实现优先级

| 优先级 | 任务 | 影响范围 | 验收证据 |
| --- | --- | --- | --- |
| P0 | 收敛第三章站点/右侧面板/主 CTA 的状态和文字层级 | `WorldWater` | 站点选择、答题、完成三态均可读；无重叠、无大面积遮罩 |
| P0 | 收敛第四章碎片/阶段 CTA/轨道激活规则 | `CosmicFuture` | 每阶段只有一个主动作；`complete` 静止；键盘顺序正确 |
| P0 | 统一按钮、命中区、焦点环和 reduced-motion | 共享 chapter 组件 | 1440×900、1280×720 下按钮不裁切，命中区 ≥44px |
| P1 | 接入 `c3-waterline-trace-loop.webp` 与 `c4-observatory-mist.webp` | 两章新素材目录 | 实际 alpha、首尾无跳变、静止时无残影，不影响文字对比度 |
| P1 | 让澜澜只在引导/完成节点切换动作 | `ChapterGuide` / `ChapterSpirit` | 精灵尺寸小于地图主节点，动作变化能解释下一步 |
| P2 | 第四章可选 HY3D 观测球 | `GlbViewer` 薄包装 | 点击后才加载；失败回退；退出释放；build 体积可接受 |

### 8.7 WorkBuddy 委托单的统一验收清单

交给 WorkBuddy 的每一项素材都要同时提出以下硬条件：

- 画面比例和主体位置固定，首尾帧构图一致；
- 不生成文字、标题、按钮、边框、卡片、棋盘格或白底；
- 动画为“循环动画、固定镜头、动作流畅”，低幅度、无镜头推拉；
- 最终前端资产优先真实 alpha；若走品红抠像，品红必须纯 `#FF00FF`，导出后检查边缘和脸部颜色；
- 交付同时提供原始素材、最终 WebP、尺寸、fps、帧数、透明方式和预览图；
- 每项素材附 `asset-id / prompt / source / intended-state`，存入 `src/assets/images/chapter-3/` 或 `src/assets/images/chapter-4/`，不混入第一、第二章目录。

### 8.8 ask-matt 评审结论与下一步

| 评审面 | 结论 |
| --- | --- |
| 设计方向 | PASS：第三章“记录水路”，第四章“观测约束”，语义清楚且不依赖堆特效 |
| 组件选择 | PASS：继续使用现有本地适配；shadcn 只借行为，React Bits/ThreeUI 只保留已核对且有明确落点的部分 |
| WebP 委托 | READY：先生成第三章水线、第四章雾层两项，再决定是否补精灵动作 |
| HY3D 委托 | OPTIONAL：只建议第四章观测球，不建议把澜澜 GLB 直接塞入地图 |
| 范围保护 | PASS：实现阶段只允许触碰第三、第四章页面、共享 chapter 组件和对应新素材目录 |

**状态：DESIGN READY。** 下一步进入 `design-build` 时，先做 P0 的按钮/状态/标注收敛；素材生成改走 GPT Image 的透明底/局部编辑流程，HY3D 观测球在新素材和交互验收通过后再决定是否投入。

### 8.9 2026-09-09 素材回退与透明底约束

本轮 WorkBuddy 生成的 `c3-guide-observe.webp`、`c3-waterline-trace-loop.webp` 与 `c4-observatory-mist.webp` 已从第三、第四章页面撤出：它们保留在对应素材目录作为备份，但不再被页面 import 或渲染，避免角色脸部/动作与既有澜澜形象不一致。

后续需要新增网页叠加素材时，统一优先使用 GPT Image 的生图或局部编辑，并把“真实透明 RGBA、无文字、无 UI、无额外人物/人脸、主体边缘完整”作为交付门槛。无法直接输出 alpha 时，才使用纯品红或纯黑中间底做抠像；导出前必须在深色地图上检查脸部、衣袖、细线和半透明雾层，确认没有色块、白边或陌生角色残影后才能接入页面。
