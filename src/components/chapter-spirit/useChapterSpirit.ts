import { useCallback, useLayoutEffect, useMemo, useRef } from 'react';

import { useChapterSpiritContext } from './ChapterSpiritContext';
import type { ChapterSpiritConfig } from './chapterSpiritTypes';

export function useChapterSpirit(config: ChapterSpiritConfig) {
  const { activeSpirit, closeDialogue, openDialogue, registerSpirit, setPosition } = useChapterSpiritContext();
  const latestConfigRef = useRef(config);
  latestConfigRef.current = config;
  const messageKey = config.dialogue.messages.join('\u0000');
  const choiceKey = config.dialogue.choices?.map((choice) => choice.id).join('\u0000') ?? '';
  const registeredConfig = useMemo<ChapterSpiritConfig>(() => ({
    ...config,
    dialogue: {
      ...config.dialogue,
      messages: [...config.dialogue.messages],
      choices: config.dialogue.choices === undefined ? undefined : [...config.dialogue.choices],
      // The host keeps one stable callback while this ref always invokes the page's latest action.
      onAction: () => latestConfigRef.current.dialogue.onAction(),
    },
  }), [
    choiceKey,
    config.action,
    config.dialogue.actionLabel,
    config.dialogue.choicePresentation,
    config.dialogue.closeOnAction,
    config.dialogue.closeOnBackdrop,
    config.dialogue.closeOnEscape,
    config.dialogue.conversationId,
    config.dialogue.dialogLabel,
    config.dialogue.heading,
    config.dialogue.media?.src,
    config.dialogue.media?.title,
    config.dialogue.showClose,
    config.dialogue.unavailableNotice,
    config.dialogueId,
    config.dialoguePresentation,
    config.initialPosition?.x,
    config.initialPosition?.y,
    config.pageId,
    config.routePath,
    config.spriteAlt,
    config.visible,
    messageKey,
  ]);

  useLayoutEffect(() => { registerSpirit(registeredConfig); }, [registerSpirit, registeredConfig]);
  return {
    closeDialogue: useCallback(() => closeDialogue(config.pageId), [closeDialogue, config.pageId]),
    openDialogue: useCallback(() => openDialogue(config.pageId), [openDialogue, config.pageId]),
    setPosition: useCallback((position: { x: number; y: number }) => setPosition(config.pageId, position), [config.pageId, setPosition]),
    isDialogueOpen: activeSpirit?.config.pageId === config.pageId && activeSpirit.isDialogueOpen,
  };
}
