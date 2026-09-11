# 小澜动态精灵调用说明

全站精灵统一使用 `@/components/chapter-spirit` 的 `useChapterSpirit`。它渲染五个动态 WebP 动作，负责全局拖拽、视口边界和对话框；页面不要自行放置精灵图片或编写拖拽逻辑。

```tsx
const spirit = useMemo<ChapterSpiritConfig>(() => ({
  pageId: 'example-guide',
  routePath: '/example',
  action: 'point-water',
  initialPosition: { x: 16, y: 82 },
  spriteAlt: '小澜水精灵，可拖动并打开导览',
  dialogueId: 'example-dialogue',
  dialoguePresentation: 'floating',
  dialogue: {
    conversationId: 'example-idle',
    dialogLabel: '小澜导览',
    messages: ['先观察这里的水脉。'],
    actionLabel: '继续',
    onAction: handleContinue,
  },
}), [handleContinue]);

const { closeDialogue, isDialogueOpen, openDialogue, setPosition } = useChapterSpirit(spirit);
```

可用动作：`happy`、`sleeve`、`point-water`、`hold-water`、`purify`。`purify` 只用于修复、答对或完成状态，播放正向净化后会稳定切回 `happy`。

在系统减少动态效果下，组件自动改用同动作的静态 WebP。脚底场景仍使用 `useLanFooting`，仅与当前全局精灵的位置同步，不依赖 PNG 精灵。
