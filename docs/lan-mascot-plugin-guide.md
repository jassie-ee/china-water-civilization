# 小澜精灵通用插件调用说明

本文供后续页面协作者使用。精灵、对话框和脚底场景已经封装为全局通用组件，页面只需要调用 Hook 和传入配置，不要在页面中自行写图片路径、拖动逻辑或对话框布局。

## 一、插件结构

```text
src/components/lan-mascot/
├─ LanMascotProvider.tsx             全局状态：页面注册、位置、表情、对话状态
├─ LanMascotHost.tsx                 精灵 Host：渲染精灵、拖动和对话框
├─ LanFootingHost.tsx                脚底 Host：渲染当前页面注册的脚底场景
├─ LanMascot.tsx                     精灵主体、拖动、边界限制、对话调用
├─ LanMascot.css                     精灵和脚底场景的通用尺寸、动画、定位样式
├─ LanFootingScene.tsx               脚底图展示和点击预览入口
├─ LanFootingOriginalPreview.tsx     脚底原图直出预览，点击图片外部或按 Esc 关闭
├─ useLanMascot.ts                   精灵 Hook
├─ useLanFooting.ts                  脚底场景 Hook
├─ lanMascotExpressions.ts           精灵表情注册表
├─ lanMascotScenes.ts                脚底场景注册表
├─ lanMascotTypes.ts                 精灵和对话配置类型
├─ lanFootingTypes.ts                脚底场景配置类型
└─ index.ts                          对外统一导出入口

src/components/lan/
├─ LanConversation.tsx                通用对话框结构和交互
└─ LanConversation.css                通用对话框布局和响应式样式
```

全局挂载已经在 [AppLayout.tsx](../src/components/layout/AppLayout.tsx) 完成：

```tsx
<LanMascotProvider>
  {children}
  <LanFootingHost />
  <LanMascotHost />
</LanMascotProvider>
```

后续页面不需要再次挂载 Provider 或 Host，只需要在页面组件中调用 Hook。

## 二、页面最小接入方式

```tsx
import { useCallback, useMemo } from 'react';

import {
  useLanFooting,
  useLanMascot,
  type LanMascotConfig,
} from '@/components/lan-mascot';

function ExamplePage() {
  const handleAction = useCallback(() => {
    // 点击对话框 CTA 后执行页面跳转或打开内容
  }, []);

  const mascotConfig = useMemo<LanMascotConfig>(() => ({
    pageId: 'example-page',
    routePath: '/example',
    expressionId: 'happy',
    spriteAlt: '小澜水精灵，可拖动并打开导览对话',
    dialogueId: 'lan-dialogue-example-page',
    dialogue: {
      conversationId: 'example-page-intro',
      dialogLabel: '小澜页面导览',
      messages: [
        '你好，这里是本页面的导览。',
        '你可以点击按钮继续探索。',
      ],
      actionLabel: '开始探索',
      onAction: handleAction,
    },
  }), [handleAction]);

  const {
    openDialogue,
    closeDialogue,
    setExpression,
  } = useLanMascot(mascotConfig);

  // 页面需要脚底场景时单独调用；不需要时直接删除这一段。
  useLanFooting({
    pageId: 'example-page',
    routePath: '/example',
    sceneId: 'harbor',
  });

  // 页面事件中可以显式调用：
  // openDialogue();
  // closeDialogue();
  // setExpression('thinking');

  return <main>{/* 页面自身内容 */}</main>;
}
```

## 三、精灵 Hook：`useLanMascot`

文件：[useLanMascot.ts](../src/components/lan-mascot/useLanMascot.ts)

### 必填配置

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `pageId` | `string` | 页面唯一 ID。精灵和脚底场景必须使用相同的值。 |
| `routePath` | `string`（可选） | React Router 的 `pathname`，例如 `/example`，不要写 `#/example`；需要按路由区分时填写。 |
| `expressionId` | `LanMascotExpressionId` | 初始表情：`turbid`、`thinking`、`happy`。 |
| `spriteAlt` | `string` | 精灵按钮的无障碍描述。 |
| `dialogueId` | `string` | 当前页面对话框的唯一 DOM ID。 |
| `dialogue` | `LanMascotDialogue` | 对话内容和 CTA 行为。 |

### 可选配置

- `initialPosition`: 初始位置，使用百分比坐标，例如 `{ x: 16, y: 80 }`。省略时使用默认左下位置。
- `onDialogueClose`: 对话框关闭后的页面回调，例如恢复章节印记焦点。

Hook 返回三个方法：

```ts
const {
  openDialogue,
  closeDialogue,
  setExpression,
} = useLanMascot(config);

openDialogue();
closeDialogue();
setExpression('thinking');
```

精灵位置、拖动、视口边界限制、动画和对话框跟随都由通用组件处理。页面不要自行给精灵增加 `position: fixed`、拖动事件或边界计算。

## 四、脚底场景 Hook：`useLanFooting`

文件：[useLanFooting.ts](../src/components/lan-mascot/useLanFooting.ts)

脚底场景必须与精灵分开调用：

```tsx
useLanMascot(mascotConfig);

useLanFooting({
  pageId: 'example-page',
  routePath: '/example',
  sceneId: 'river-bank',
});
```

### 当前可用场景 ID

| `sceneId` | 对应资源 | 含义 |
| --- | --- | --- |
| `complete-map` | `complete-map.png` | 完整拼图 |
| `river-bank` | `river-bank.png` | 河堤 |
| `farmland` | `farmland.png` | 田园 |
| `harbor` | `harbor.png` | 海港 |
| `starry-sky` | `starry-sky.png` | 星空 |

精灵和脚底场景使用相同的 `pageId`、`routePath` 后，脚底场景会自动同步精灵的位置。拖动精灵时，脚底图也会一起移动。

页面不调用 `useLanFooting()` 时，不会显示任何脚底图片。

### 页面内切换脚底图片

脚底图不需要修改 Host 或布局，只需要让 `sceneId` 来自页面状态：

```tsx
import { useState } from 'react';

import { useLanFooting, type LanFootingSceneId } from '@/components/lan-mascot';

const [sceneId, setSceneId] = useState<LanFootingSceneId>('harbor');

useLanFooting({
  pageId: 'example-page',
  routePath: '/example',
  sceneId,
});

// 页面事件中切换
setSceneId('starry-sky');
```

## 五、添加或替换图片资源

### 替换已有精灵表情

直接替换以下目录中的同名文件即可，不要修改页面组件：

```text
src/assets/images/lan/mascots/
├─ turbid.png
├─ thinking.png
└─ happy.png
```

表情注册位置：[lanMascotExpressions.ts](../src/components/lan-mascot/lanMascotExpressions.ts)

### 新增精灵表情

1. 将图片放入 `src/assets/images/lan/mascots/`。
2. 在 `lanMascotExpressions.ts` 中导入图片并增加注册项。
3. 类型 `LanMascotExpressionId` 会根据注册表自动更新。
4. 页面即可在 `expressionId` 或 `setExpression()` 中使用新的 ID。

```ts
import calm from '@/assets/images/lan/mascots/calm.png';

export const lanMascotExpressions = {
  // 现有表情...
  calm: { src: calm, motion: 'happy' },
} as const;
```

### 替换或新增脚底场景

资源目录：

```text
src/assets/images/lan/footings/
```

注册位置：[lanMascotScenes.ts](../src/components/lan-mascot/lanMascotScenes.ts)

新增场景时只需导入图片并增加注册项，页面通过新的 `sceneId` 调用：

```ts
import mountain from '@/assets/images/lan/footings/mountain.png';

export const lanFootingScenes = {
  // 现有场景...
  mountain: { src: mountain, alt: '山水场景' },
} as const;
```

脚底展示层会自动处理压扁比例、外圈高亮、透明度、位置同步、点击预览和响应式边界。

## 六、对话框复用规则

对话框统一由 [LanConversation.tsx](../src/components/lan/LanConversation.tsx) 渲染，背景图也在该文件中统一引用：

```text
src/assets/images/lan-conversation-panel-transparent.png
```

页面只配置以下内容：

- `conversationId`: 当前对话内容身份，切换章节或内容时需要变化。
- `dialogLabel`: 对话框无障碍名称。
- `messages`: 按顺序显示的消息数组。
- `actionLabel`: 最后一条消息的 CTA 文案。
- `onAction`: CTA 点击后的页面行为。
- `unavailableNotice`: 可选的提示文案。

不要在页面中重新引入对话框背景图，也不要复制 `LanConversation` 的 JSX 或 CSS。

## 七、交互和布局保证

- 精灵默认位于左下区域，并且仍可自由拖动。
- 精灵和对话框不能被拖到视口外。
- 对话框自动贴在精灵右上方，并根据可用空间调整宽度。
- 对话框会跟随精灵移动，不需要页面额外同步坐标。
- 脚底图与精灵共享位置状态，但配置和资源完全独立。
- 脚底场景只覆盖自身可视区域，不应阻挡页面其他入口。
- 点击脚底图后直接显示原图；点击图片外部或按 `Esc` 关闭。
- 精灵动画支持 `prefers-reduced-motion`，减少动画模式下保持静态。
- 页面只注册自己的 `pageId` 和 `routePath`，不要直接操作 Context 内部状态。

## 八、协作者提交前检查

1. 新页面是否调用了 `useLanMascot()`？
2. 页面需要脚底图时，是否额外调用了 `useLanFooting()`？
3. 两个 Hook 的 `pageId` 和 `routePath` 是否完全一致？
4. 页面中是否没有直接写精灵、对话框或脚底图的图片路径？
5. 表情和脚底图是否通过注册表 ID 调用？
6. 是否没有重复挂载 `LanMascotProvider`、`LanMascotHost` 或 `LanFootingHost`？
7. 是否验证了拖动、对话打开/关闭、CTA、移动端和键盘操作？

项目根目录执行：

```bash
npm.cmd run lint
npm.cmd run build
```

当前水脉记忆页的完整调用示例位于：[ChapterOverview.tsx](../src/pages/ChapterOverview/ChapterOverview.tsx)。
