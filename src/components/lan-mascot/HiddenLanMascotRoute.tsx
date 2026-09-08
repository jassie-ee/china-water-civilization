import { useLanMascot } from './useLanMascot';

const hiddenDialogue = {
  conversationId: 'hidden-route-dialogue',
  dialogLabel: '隐藏引导',
  messages: [],
  actionLabel: '',
  onAction: () => undefined,
};

interface HiddenLanMascotRouteProps {
  pageId: string;
  routePath: string;
}

/** 仅注册路由可见性，避免全局默认精灵在沉浸页面回退显示。 */
function HiddenLanMascotRoute({ pageId, routePath }: HiddenLanMascotRouteProps) {
  useLanMascot({
    pageId,
    routePath,
    dialogue: hiddenDialogue,
    dialogueId: `${pageId}-hidden-dialogue`,
    expressionId: 'happy',
    spriteAlt: '',
    visible: false,
  });

  return null;
}

export default HiddenLanMascotRoute;
