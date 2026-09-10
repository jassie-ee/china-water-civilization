# 第三、第四章 PDF 内容对齐与轻量补强实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在不重做现有版式、不触碰第一、第二章的前提下，把第三、第四章与场景设计 PDF 的题目语义、精灵对白、转场提示、奖励反馈和终章完成状态补齐。

**Architecture:** 继续沿用现有的 data-first 章节结构、`ChapterChoicePanel`、`ChapterGuide` 和现有背景图层。将 PDF 中缺失的叙事信息作为章节数据元信息注入现有页面，避免新建一套平行交互。素材只允许替换第三、第四章对应目录中的背景图，不改变路由、主舞台和第一、第二章资源。

**Tech Stack:** React 19, TypeScript 5.9, Vite, 现有 CSS 动效与 `prefers-reduced-motion` hook, localStorage（仅用于第四章完成状态）。

---

## 1. 约束、来源与验收边界

### 1.1 主要来源

- 作品总览：`D:/微信聊天/xwechat_files/wxid_mkx3ecbqzmgj22_6d19/msg/file/2026-09/水脉千年：中华水文化数字互动作品.pdf`
- 详细场景：`D:/微信聊天/xwechat_files/wxid_mkx3ecbqzmgj22_6d19/msg/file/2026-09/水脉千年-场景设计 (4)_20260829093541.pdf`
- 第三章 PDF 对照范围：详细场景 PDF 第 39–59 页
- 第四章 PDF 对照范围：详细场景 PDF 第 61–74 页

### 1.2 必须保持不变

- 不修改第一章、第二章页面、路由、题库和资源。
- 不重排第三、第四章的主布局，不恢复右侧大块纯色面板。
- 不重新引入 WorkBuddy 生成的陌生精灵或人脸素材。
- 不把移动端适配混入本轮；本轮只验收桌面端 1280×720、1440×900、1920×1080。

### 1.3 完成标准

- 第三章七道题的题面与 PDF 语义一致，尤其是几内亚水电题。
- 第三章每站有一条短精灵引导、一条文化/现场回响或转场提示，且不会造成文字堆叠。
- 第三章完成页明确显示“水脉碎片③「同舟共济之纹」”。
- 第四章开放题显示 `0 / 1` 或 `1 / 1`，而不是 `0 / 3` 或 `1 / 3`。
- 第四章宇宙航行路线包含 PDF 要求的月球、火星、木星、土星、冰卫星海洋和远方水迹。
- 第四章终章四句对白与四段哲理文字按顺序出现。
- 第四章完成状态刷新后仍保留“天地人和”完成标记或完整星河拼图展示。
- `npm run lint` 与 `npm run build` 通过。
- Git diff 只包含本计划允许的第三、第四章文件和章节专属素材。

## 2. 文件边界与职责

### 现有文件

- Modify: `src/types/worldWater.ts` — 为水站步骤增加短叙事元信息类型。
- Modify: `src/data/worldWater.ts` — 修正几内亚题目，并补齐七站的短对白/回响/转场文案。
- Modify: `src/pages/WorldWater/WorldWater.tsx` — 在现有题目和完成页中插入轻量叙事提示与碎片奖励。
- Modify: `src/pages/WorldWater/WorldWater.css` — 只增加短文案的层级、对比度和不遮挡规则。
- Modify: `src/types/cosmicConstraint.ts` — 为宇宙航行站点和终章对白提供数据字段。
- Modify: `src/data/cosmicConstraint.ts` — 补齐宇宙路线、四段对白和四段哲理文字。
- Modify: `src/pages/CosmicFuture/CosmicFuture.tsx` — 修正开放题计数、消费数据字段、加入终章顺序揭示和完成状态读取。
- Modify: `src/pages/CosmicFuture/CosmicFuture.css` — 增加终章顺序揭示、路线节点和完成徽记的轻量样式。
- Modify: `src/components/chapter/ChapterChoicePanel.tsx` — 仅在需要时把“记录”文案抽成可选 label；默认行为和第一、第二章保持不变。
- Modify: `docs/DESIGN.md` — 记录 PDF 对齐后的第三、第四章交互契约。

### 新文件

- Create: `src/utils/chapterCompletion.ts` — 只保存第三、第四章的完成标记，不改变已有治理积分存储。

### 允许替换的素材目录

- `src/assets/images/scenes/chapter-3/`
- `src/assets/images/scenes/chapter-4/`

不得修改其他 `src/assets/images` 目录中的文件。

## 3. 实施任务

### Task 1: 建立内容对齐数据契约

**Files:**
- Modify: `src/types/worldWater.ts`
- Modify: `src/types/cosmicConstraint.ts`

- [x] **Step 1: 为第三章增加叙事字段**

在 `src/types/worldWater.ts` 的 `WorldWaterStep` 前增加：

```ts
export interface WorldWaterNarrative {
  spiritLine: string;
  fieldEcho: string;
  transition: string;
}
```

在 `WorldWaterStep` 中增加：

```ts
narrative: WorldWaterNarrative;
```

- [x] **Step 2: 为第四章增加航行与终章字段**

在 `src/types/cosmicConstraint.ts` 增加：

```ts
export interface CosmicNarrative {
  spiritLines: readonly string[];
  philosophyLines: readonly string[];
}
```

在 `CosmicAct` 中增加可选字段，避免影响前三章或其他调用方：

```ts
routeStops?: readonly string[];
narrative?: CosmicNarrative;
```

- [x] **Step 3: 运行类型检查，确认新增字段的错误范围明确**

运行：

```bash
npm run build
```

预期：只提示 `worldWater.ts` 中现有步骤缺少 `narrative`，以及后续需要补齐的第四章字段；不应出现第一、第二章文件错误。

### Task 2: 修正第三章七道题与 PDF 的语义差异

**Files:**
- Modify: `src/data/worldWater.ts:136-155`

- [x] **Step 1: 将几内亚水电题改为 PDF 的四个正确选项**

把 `guinea-hydropower` 的 `requiredChoiceIds` 改为：

```ts
requiredChoiceIds: ['river-power', 'ecological-flow', 'transmission-grid', 'fish-spawning-release'],
```

把四个选项改为：

```ts
choices: [
  { id: 'river-power', label: 'A', text: '利用河流落差为村镇提供稳定电力。', stars: 3, feedback: '' },
  { id: 'ecological-flow', label: 'B', text: '保留下游必要的生态流量，让河流继续呼吸。', stars: 3, feedback: '' },
  { id: 'transmission-grid', label: 'C', text: '配套输电线路，让水能真正抵达当地生活。', stars: 3, feedback: '' },
  { id: 'fish-spawning-release', label: 'D', text: '根据鱼类繁殖期调整放水节奏。', stars: 3, feedback: '' },
],
```

同时把反馈改为：

```ts
correctFeedback: '水能不是只追求发电量：村镇用电、下游生态、输电线路和鱼类繁殖期，都要一起进入设计。',
partialFeedback: '把河流变成电力时，也要把电送到当地，并给下游生态和鱼类留下节奏。',
```

- [x] **Step 2: 搜索旧选项 ID，避免残留引用**

运行：

```bash
rg -n "clean-energy|local-benefit|long-term-monitor" src
```

预期：没有第三章运行时代码或数据继续依赖这三个旧 ID。

- [x] **Step 3: 检查其余六题不做无关改写**

逐项确认沙特、巴基斯坦、赤道几内亚和湄澜的选项仍分别对应 PDF 的获取水、调节水、净化水、共管水上/水下语义。

### Task 3: 给第三章补齐短叙事，不增加大面板

**Files:**
- Modify: `src/data/worldWater.ts`
- Modify: `src/pages/WorldWater/WorldWater.tsx`
- Modify: `src/pages/WorldWater/WorldWater.css`

- [x] **Step 1: 为七个步骤写入短叙事数据**

按以下内容填入每个 `WorldWaterStep.narrative`；每条只显示一行精灵话和一行现场回响：

| step id | `spiritLine` | `fieldEcho` | `transition` |
|---|---|---|---|
| `local-survey` | `先看水土，也看人的生活；答案就在当地。` | `因地制宜，从现场开始。` | `从一张总图，走进第一处水脉。` |
| `red-sea-desalination` | `缺水的地方，先把海水变成可以抵达生活的水。` | `沙特 · 红海取水` | `从旱地出发，寻找可持续的水源。` |
| `karot-hub` | `一座枢纽不只蓄水，也要把旱涝之间的节奏接起来。` | `巴基斯坦 · 调蓄枢纽` | `水被留住，也要在需要时回到田野。` |
| `guinea-hydropower` | `水能变成电，也要把河的生命留在河里。` | `几内亚 · 水电与生态` | `让水的落差抵达村镇，而不是离开河流。` |
| `equatorial-cleanup` | `净水不是一把铲子挖到底，而是让污染在正确的环节被拦下。` | `赤道几内亚 · 河口净化` | `从污染源头，到湿地最后一道净化。` |
| `mekong-sharing` | `一条跨境的河，先要让信息及时抵达每一段岸。` | `湄澜六国 · 信息共享` | `水线上游下游，先连起共同的判断。` |
| `mekong-allocation` | `水量可以协商，责任也要一起承担。` | `湄澜六国 · 共同分配` | `五处现场，回到同一张全球水图。` |

- [x] **Step 2: 在现有题目区域下方接入一行叙事提示**

在 `WorldWater.tsx` 的 `ChapterChoicePanel` 外层、现有反馈和继续按钮附近增加：

```tsx
<div className="world-water-page__narrative" aria-live="polite">
  <p><span>澜澜：</span>{activeStep.narrative.spiritLine}</p>
  <p className="world-water-page__narrative-echo">
    {activeStep.narrative.fieldEcho} · {activeStep.narrative.transition}
  </p>
</div>
```

只在 `activeStep !== null` 时渲染，完成页使用独立奖励文案，不重复显示叙事提示。

- [x] **Step 3: 保证文字不压过地图**

在 `WorldWater.css` 中只增加以下约束：

```css
.world-water-page__narrative {
  max-width: 34rem;
  margin-top: 0.8rem;
  color: var(--chapter-ink-strong, #f4ecd5);
  font-size: clamp(0.78rem, 0.72rem + 0.16vw, 0.94rem);
  line-height: 1.65;
  text-shadow: 0 1px 12px rgba(8, 22, 24, 0.8);
}

.world-water-page__narrative p {
  margin: 0;
}

.world-water-page__narrative p + p {
  margin-top: 0.18rem;
  color: rgba(244, 236, 213, 0.72);
  font-size: 0.82em;
}
```

### Task 4: 补齐第三章结尾奖励与全球水图反馈

**Files:**
- Modify: `src/pages/WorldWater/WorldWater.tsx:431-440`
- Modify: `src/pages/WorldWater/WorldWater.css`

- [x] **Step 1: 将完成页替换为明确的 PDF 奖励文案**

保留现有标题和按钮，在完成页正文后增加：

```tsx
<div className="world-water-page__reward" role="status">
  <span className="world-water-page__reward-mark" aria-hidden="true">③</span>
  <div>
    <strong>水脉碎片「同舟共济之纹」</strong>
    <span>五处水脉已汇入全球水系图。</span>
  </div>
</div>
```

并把原有能力反馈改为：

```tsx
<p>七道判断已写入航记，水脉感悟抵达 <strong>{waterFeel} / 30</strong>。</p>
```

- [x] **Step 2: 为奖励增加低对比度边框和金色编号**

只在 `WorldWater.css` 增加奖励块样式，不新增卡片背景：

```css
.world-water-page__reward {
  display: flex;
  align-items: center;
  gap: 0.7rem;
  margin-top: 1.1rem;
  color: #f1d27c;
  border-top: 1px solid rgba(241, 210, 124, 0.42);
  padding-top: 0.75rem;
}

.world-water-page__reward-mark {
  display: grid;
  width: 2rem;
  height: 2rem;
  place-items: center;
  border: 1px solid currentColor;
  border-radius: 50%;
  font-family: var(--font-mono, monospace);
}

.world-water-page__reward strong,
.world-water-page__reward span {
  display: block;
}

.world-water-page__reward span:last-child {
  margin-top: 0.16rem;
  color: rgba(244, 236, 213, 0.68);
  font-size: 0.78rem;
}
```

### Task 5: 补齐第四章宇宙路线与终章叙事数据

**Files:**
- Modify: `src/data/cosmicConstraint.ts`
- Modify: `src/types/cosmicConstraint.ts`

- [x] **Step 1: 扩展宇宙航行路线**

把 `galaxy-voyage` 的 `story` 改为：

```ts
story: '镜头从地球出发，沿着复原的水线经过月球、火星、木星、土星与冰卫星的海洋，最后驶向更远的水迹。地球上的共生经验，开始寻找宇宙的回声。',
routeStops: ['地球', '月球', '火星', '木星', '土星', '冰卫星海洋', '远方水迹'],
```

- [x] **Step 2: 为终章写入 PDF 的四段精灵对白**

在 `all-things` 中增加：

```ts
narrative: {
  spiritLines: [
    '道生一，一生二，二生三，三生万物——原来水就是这样呀，从一滴水珠开始，汇成遍布宇宙的生命脉络。',
    '治水治到最后，治的不是水，是学会和天地万物好好相处。',
    '原来水从来不是地球的专属，它是遍布宇宙的生命密码。',
    '我们在地球上学会的和水共生的道理，放到浩瀚星河中，依然成立。',
  ],
  philosophyLines: ['人法地', '地法天', '天法道', '道法自然'],
},
```

### Task 6: 修正第四章计数、路线展示与终章逐条揭示

**Files:**
- Modify: `src/pages/CosmicFuture/CosmicFuture.tsx:430-470`
- Modify: `src/pages/CosmicFuture/CosmicFuture.css`

- [x] **Step 1: 修正开放题计数**

把：

```tsx
totalCount={3}
```

改为：

```tsx
totalCount={1}
```

三个选项仍然保留，表示一道开放题的三种立场，不表示三道题。

- [x] **Step 2: 用数据驱动宇宙路线节点**

在 `activeAct` 计算完成后增加：

```tsx
const routeStops = activeAct.routeStops ?? [];
```

将写死的四个节点替换为：

```tsx
<div className="cosmic-future-page__voyage-route" aria-label="飞行路线">
  {routeStops.map((stop, index) => (
    <Fragment key={stop}>
      <span>{stop}</span>
      {index < routeStops.length - 1 && <i aria-hidden="true" />}
    </Fragment>
  ))}
</div>
```

文件顶部补充：

```tsx
import { Fragment } from 'react';
```

如果当前页面已有 `galaxy-voyage` 查找逻辑，复用该变量，不新增第二份 act 配置。

- [x] **Step 3: 在终章完成页加入四段对白**

把当前单一 quote 替换为；终章使用的就是当前页面已经计算好的 `activeAct`（此时对应 `all-things`）：

```tsx
<div className="cosmic-future-page__spirit-lines" aria-live="polite">
  {activeAct.narrative?.spiritLines.map((line, index) => (
    <p key={line} style={{ '--line-index': index } as CSSProperties}>{line}</p>
  ))}
</div>
```

- [x] **Step 4: 按顺序显示四段哲理文字**

在完成页奖励文案前增加：

```tsx
<div className="cosmic-future-page__philosophy" aria-label="终章哲理">
  {activeAct.narrative?.philosophyLines.map((line, index) => (
    <span key={line} style={{ '--line-index': index } as CSSProperties}>{line}</span>
  ))}
</div>
```

CSS 使用每段递增延迟，不新增复杂动画库：

```css
.cosmic-future-page__spirit-lines p,
.cosmic-future-page__philosophy span {
  animation: chapter-line-reveal 700ms both;
  animation-delay: calc(var(--line-index) * 240ms);
}

.cosmic-future-page__philosophy {
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem 1.1rem;
  margin-top: 1.1rem;
  color: #f1d27c;
  font-family: var(--font-display, serif);
  font-size: clamp(1.05rem, 0.9rem + 0.55vw, 1.65rem);
}

@keyframes chapter-line-reveal {
  from { opacity: 0; transform: translateY(0.35rem); }
  to { opacity: 1; transform: translateY(0); }
}

@media (prefers-reduced-motion: reduce) {
  .cosmic-future-page__spirit-lines p,
  .cosmic-future-page__philosophy span {
    animation: none;
  }
}
```

### Task 7: 保存第四章完成状态，不改变既有治理积分

**Files:**
- Create: `src/utils/chapterCompletion.ts`
- Modify: `src/pages/CosmicFuture/CosmicFuture.tsx`

- [x] **Step 1: 创建章节完成状态工具**

新建 `src/utils/chapterCompletion.ts`：

```ts
const chapterCompletionStorageKey = 'chinese-water-ecological-civilization:chapter-completion';

interface ChapterCompletionState {
  chapter3: boolean;
  chapter4: boolean;
}

const emptyChapterCompletion: ChapterCompletionState = {
  chapter3: false,
  chapter4: false,
};

function loadChapterCompletion(): ChapterCompletionState {
  if (typeof window === 'undefined') return emptyChapterCompletion;

  try {
    const storedValue = window.localStorage.getItem(chapterCompletionStorageKey);
    if (storedValue === null) return emptyChapterCompletion;

    const parsedValue: unknown = JSON.parse(storedValue);
    if (typeof parsedValue !== 'object' || parsedValue === null) return emptyChapterCompletion;

    const value = parsedValue as Partial<ChapterCompletionState>;
    return {
      chapter3: value.chapter3 === true,
      chapter4: value.chapter4 === true,
    };
  } catch {
    return emptyChapterCompletion;
  }
}

function markChapterComplete(chapter: keyof ChapterCompletionState): ChapterCompletionState {
  const nextState = { ...loadChapterCompletion(), [chapter]: true };
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(chapterCompletionStorageKey, JSON.stringify(nextState));
  }
  return nextState;
}

export type { ChapterCompletionState };
export { loadChapterCompletion, markChapterComplete };
```

- [x] **Step 2: 在第四章进入页面时恢复完成状态**

在 `CosmicFuture` 的 state 初始化处使用同一个完成状态来源：

```tsx
const [initialChapter4Complete] = useState(() => loadChapterCompletion().chapter4);
const [isChapter4Complete, setIsChapter4Complete] = useState(initialChapter4Complete);
const [phase, setPhase] = useState<CosmicPhase>(initialChapter4Complete ? 'complete' : 'assembly');
const [assembledShardIds, setAssembledShardIds] = useState<number[]>(
  initialChapter4Complete ? [0, 1, 2] : [],
);
```

执行 `handleComplete` 时调用 `markChapterComplete('chapter4')` 并设置 `setIsChapter4Complete(true)`。完成页额外显示“完整星河拼图已保存”。

- [x] **Step 3: 手动验证刷新后的表现**

完成第四章后刷新 `/chapter-4`，预期完成标记和完整地图提示仍在；清除站点 localStorage 后预期恢复未完成状态。

### Task 8: 只在必要时替换语义背景素材

**Files:**
- Replace only if visual review confirms the current image is semantically or technically insufficient:
  - `src/assets/images/scenes/chapter-3/mekong-delta.webp`
  - `src/assets/images/scenes/chapter-4/cosmic-voyage.webp`
  - `src/assets/images/scenes/chapter-4/awakening.webp`

- [x] **Step 1: 先用现有页面验收，不先生成新图**

确认文字标注已经能对应画面后，再决定是否替换素材。若替换，保持原文件名和导入路径，避免修改 React 结构。

- [x] **Step 2: 第三章收束图验收标准**

图像需要能看出多国水脉/跨境河流/信息与生态协作，不能出现文字、人物、陌生人脸、卡片 UI 或 WorkBuddy 精灵；右侧和底部留出地图标注呼吸空间。

- [x] **Step 3: 第四章终章图验收标准**

图像需要能看出地球、星河、连续水脉和“天地人和”的收束关系；保持低饱和青绿、黛蓝、赭石和暖金细线，不放文字，不放人物脸，不加入独立纯色面板。

### Task 9: 桌面端回归与范围检查

**Files:**
- Verify: `src/pages/WorldWater/WorldWater.tsx`
- Verify: `src/pages/WorldWater/WorldWater.css`
- Verify: `src/pages/CosmicFuture/CosmicFuture.tsx`
- Verify: `src/pages/CosmicFuture/CosmicFuture.css`
- Verify: `src/data/worldWater.ts`
- Verify: `src/data/cosmicConstraint.ts`

- [x] **Step 1: 运行静态检查**

```bash
npm run lint
npm run build
```

预期：两条命令均成功退出，TypeScript 无错误。

- [x] **Step 2: 检查第三章主流程**

在 `/chapter-3` 完成 7 道题，确认：

1. 几内亚题显示“河流落差、生态流量、输电线路、鱼类繁殖期”。
2. 题目区域只出现一条短精灵提示和一条现场回响。
3. 完成页出现“水脉碎片③「同舟共济之纹」”。
4. 1440×900 和 1920×1080 下文字不压住关键地图节点。

- [x] **Step 3: 检查第四章主流程**

在 `/chapter-4` 完成三块碎片、开放题和终章按钮，确认：

1. 开放题显示 `0 / 1` → `1 / 1`。
2. 航行路线完整显示七个节点，不横向溢出。
3. 四句精灵对白和四段哲理文字按顺序出现。
4. 刷新后完成标记仍然存在。

- [x] **Step 4: 检查第一、第二章没有变更**

运行：

```bash
git diff --name-only -- src/pages/Home src/pages/ChapterOverview src/pages/BasinOverview src/pages/BasinDetail src/pages/GovernanceLevel src/pages/YellowRiver src/pages/YangtzeRiver
```

预期：无输出。若素材替换，差异只能位于 `src/assets/images/scenes/chapter-3/` 或 `src/assets/images/scenes/chapter-4/`。

- [x] **Step 5: 提交为两个可回退的小提交**

```bash
git add src/types/worldWater.ts src/data/worldWater.ts src/pages/WorldWater src/components/chapter/ChapterChoicePanel.tsx
git commit -m "fix(chapter-3): align global water route with scene script"

git add src/types/cosmicConstraint.ts src/data/cosmicConstraint.ts src/pages/CosmicFuture src/utils/chapterCompletion.ts docs/DESIGN.md
git commit -m "fix(chapter-4): complete cosmic waterline narrative"
```

素材替换如果发生，单独提交：

```bash
git add src/assets/images/scenes/chapter-3 src/assets/images/scenes/chapter-4
git commit -m "assets(chapters): refine semantic scene backgrounds"
```

## 4. 自检结论

- PDF 内容覆盖：第三章 7 道题、第四章 3 幕和 1 道开放题均有对应任务。
- 叙事缺口：第三章站点对白/转场、第三章碎片奖励、第四章完整宇宙路线、终章四句对白和四段哲理均有对应任务。
- 交互缺口：第四章 `1 / 3` 计数和完成状态持久化均有对应任务。
- 视觉缺口：只保留章节专属背景的可选替换，不引入新的大面板或陌生精灵素材。
- 范围保护：第一、第二章以路径检查作为硬性验收条件。
