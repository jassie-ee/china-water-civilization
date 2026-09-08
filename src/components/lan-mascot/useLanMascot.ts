import { useCallback, useLayoutEffect } from 'react';

import { useLanMascotContext } from './LanMascotContext';
import type { LanMascotExpressionId } from './lanMascotExpressions';
import type { LanMascotConfig } from './lanMascotTypes';

export function useLanMascot(config: LanMascotConfig) {
  const { activeMascot, closeDialogue, openDialogue, registerMascot, setExpression, setPosition } = useLanMascotContext();

  useLayoutEffect(() => {
    registerMascot(config);
  }, [config, registerMascot]);

  const closeCurrentDialogue = useCallback(() => closeDialogue(config.pageId), [closeDialogue, config.pageId]);
  const openCurrentDialogue = useCallback(() => openDialogue(config.pageId), [config.pageId, openDialogue]);
  const setCurrentExpression = useCallback(
    (expressionId: LanMascotExpressionId) => setExpression(config.pageId, expressionId),
    [config.pageId, setExpression],
  );
  const setCurrentPosition = useCallback(
    (position: { x: number; y: number }) => setPosition(config.pageId, position),
    [config.pageId, setPosition],
  );

  return {
    closeDialogue: closeCurrentDialogue,
    openDialogue: openCurrentDialogue,
    setExpression: setCurrentExpression,
    setPosition: setCurrentPosition,
    isDialogueOpen: activeMascot?.config.pageId === config.pageId && activeMascot.isDialogueOpen,
  };
}
