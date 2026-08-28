import { useCallback, useLayoutEffect } from 'react';

import { useLanMascotContext } from './LanMascotContext';
import type { LanMascotExpressionId } from './lanMascotExpressions';
import type { LanMascotConfig } from './lanMascotTypes';

export function useLanMascot(config: LanMascotConfig) {
  const { closeDialogue, openDialogue, registerMascot, setExpression } = useLanMascotContext();

  useLayoutEffect(() => {
    registerMascot(config);
  }, [config, registerMascot]);

  const closeCurrentDialogue = useCallback(() => closeDialogue(config.pageId), [closeDialogue, config.pageId]);
  const openCurrentDialogue = useCallback(() => openDialogue(config.pageId), [config.pageId, openDialogue]);
  const setCurrentExpression = useCallback(
    (expressionId: LanMascotExpressionId) => setExpression(config.pageId, expressionId),
    [config.pageId, setExpression],
  );

  return {
    closeDialogue: closeCurrentDialogue,
    openDialogue: openCurrentDialogue,
    setExpression: setCurrentExpression,
  };
}
