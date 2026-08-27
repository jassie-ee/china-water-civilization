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

## 6. 验收清单

- [x] `#/chapters` 的第三章入口跳转至 `#/chapter-3`。
- [x] `#/chapter-3` 包含五站七问，多选题可先勾选再提交，并显示对应反馈。
- [x] `#/chapter-4` 按碎片拼合、开放思考、飞行、终极觉醒顺序推进。
- [x] 第三章五站、第四章三幕均有独立内容和完成态。
- [x] 桌面端三栏叙事布局和两章差异化中部图形已检查。
- [x] 移动端无横向溢出，顶部全局积分不遮挡章节标记。
- [x] 选择按钮有禁用态、选中态、键盘焦点和屏幕阅读器文本。
- [x] `prefers-reduced-motion` 下停用持续运动。
- [x] 构建与 lint 检查通过；开发服务器支持热更新预览。
