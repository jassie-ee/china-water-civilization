import type { LanMascotConfig, LanMascotPosition } from './lanMascotTypes';

export const defaultLanMascotPosition: LanMascotPosition = { x: 16, y: 80 };

export const defaultLanMascotConfig: LanMascotConfig = {
  pageId: 'global-default',
  dialogue: {
    conversationId: 'global-default-dialogue',
    dialogLabel: '水精灵导览',
    messages: ['你好，我是水精灵。', '点击页面中的章节或设置，我会继续为你导览。'],
    actionLabel: '知道了',
    onAction: () => undefined,
  },
  dialogueId: 'lan-dialogue-global-default',
  expressionId: 'happy',
  initialPosition: defaultLanMascotPosition,
  spriteAlt: '水精灵，点击打开或关闭导览对话，也可以拖动',
};
