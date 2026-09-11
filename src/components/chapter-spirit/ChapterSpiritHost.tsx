import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react';
import { createPortal } from 'react-dom';

import LanConversation from '@/components/lan/LanConversation';

import { chapterSpiritAnimations, chapterSpiritStillImages } from './chapterSpiritAnimations';
import { useChapterSpiritContext } from './ChapterSpiritContext';

import './ChapterSpirit.css';

const VIEWPORT_MARGIN = 8;
const PURIFY_FORWARD_DURATION_MS = 8000;

function clamp(value: number, minimum: number, maximum: number): number { return Math.min(maximum, Math.max(minimum, value)); }

function ChapterSpiritHost() {
  const { activeSpirit, closeDialogue, openDialogue, setPosition } = useChapterSpiritContext();
  const handleRef = useRef<HTMLButtonElement>(null);
  const dragRef = useRef<{ pointerId: number; x: number; y: number; origin: { x: number; y: number }; moved: boolean } | null>(null);
  const [displayAction, setDisplayAction] = useState(activeSpirit?.action ?? 'happy');
  const [animationKey, setAnimationKey] = useState(0);
  const activeAction = activeSpirit?.action;
  const activePageId = activeSpirit?.config.pageId;

  useEffect(() => {
    if (activeAction === undefined) return;
    setDisplayAction(activeAction);
    setAnimationKey((current) => current + 1);
    if (activeAction !== 'purify') return undefined;
    const timeout = window.setTimeout(() => { setDisplayAction('happy'); setAnimationKey((current) => current + 1); }, PURIFY_FORWARD_DURATION_MS);
    return () => window.clearTimeout(timeout);
  }, [activeAction, activePageId]);

  useEffect(() => {
    if (activeSpirit === null || !activeSpirit.isDialogueOpen || activeSpirit.config.dialoguePresentation === 'stage') return undefined;

    const { config } = activeSpirit;
    const handleOutsidePointerDown = (event: PointerEvent): void => {
      if (!(event.target instanceof Node)) return;
      if (handleRef.current?.contains(event.target) || document.getElementById(config.dialogueId)?.contains(event.target)) return;

      closeDialogue(config.pageId);
      config.onDialogueClose?.();
    };

    document.addEventListener('pointerdown', handleOutsidePointerDown, true);
    return () => document.removeEventListener('pointerdown', handleOutsidePointerDown, true);
  }, [activeSpirit, closeDialogue]);

  if (activeSpirit === null || activeSpirit.config.visible === false) return null;
  const { config, position } = activeSpirit;
  const handleClose = (): void => { closeDialogue(config.pageId); config.onDialogueClose?.(); window.requestAnimationFrame(() => handleRef.current?.focus()); };
  const handlePointerDown = (event: ReactPointerEvent<HTMLButtonElement>): void => {
    if (event.pointerType === 'mouse' && event.button !== 0) return;
    dragRef.current = { pointerId: event.pointerId, x: event.clientX, y: event.clientY, origin: position, moved: false };
    event.currentTarget.setPointerCapture(event.pointerId);
  };
  const handlePointerMove = (event: ReactPointerEvent<HTMLButtonElement>): void => {
    const drag = dragRef.current;
    if (drag === null || drag.pointerId !== event.pointerId) return;
    const dx = event.clientX - drag.x; const dy = event.clientY - drag.y;
    if (Math.hypot(dx, dy) > 5) drag.moved = true;
    if (!drag.moved) return;
    const rect = event.currentTarget.getBoundingClientRect();
    setPosition(config.pageId, {
      x: clamp(drag.origin.x + (dx / window.innerWidth) * 100, ((VIEWPORT_MARGIN + rect.width / 2) / window.innerWidth) * 100, ((window.innerWidth - VIEWPORT_MARGIN - rect.width / 2) / window.innerWidth) * 100),
      y: clamp(drag.origin.y + (dy / window.innerHeight) * 100, ((VIEWPORT_MARGIN + rect.height / 2) / window.innerHeight) * 100, ((window.innerHeight - VIEWPORT_MARGIN - rect.height / 2) / window.innerHeight) * 100),
    });
  };
  const handleClick = (): void => {
    if (dragRef.current?.moved) { dragRef.current = null; return; }
    if (config.dialoguePresentation === 'stage') return;
    if (activeSpirit.isDialogueOpen) handleClose(); else openDialogue(config.pageId);
  };
  const handleAction = (): void => { config.dialogue.onAction(); if (config.dialogue.closeOnAction) handleClose(); };
  const src = chapterSpiritAnimations[displayAction];
  const stillSrc = chapterSpiritStillImages[displayAction];
  return <>
    <div className="chapter-spirit-host">
      <div className="chapter-spirit-global" style={{ left: `${position.x}%`, top: `${position.y}%` }}>
        <button ref={handleRef} className="chapter-spirit-global__handle" type="button" aria-label={config.spriteAlt}
          aria-expanded={config.dialoguePresentation === 'stage' ? undefined : activeSpirit.isDialogueOpen}
          aria-controls={activeSpirit.isDialogueOpen ? config.dialogueId : undefined}
          onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={() => { dragRef.current = null; }} onPointerCancel={() => { dragRef.current = null; }} onClick={handleClick}>
          <picture><source media="(prefers-reduced-motion: reduce)" srcSet={stillSrc} /><img key={`${displayAction}-${animationKey}`} className="chapter-spirit-global__image" src={src} alt="" draggable={false} /></picture>
        </button>
      </div>
    </div>
    {activeSpirit.isDialogueOpen && config.dialoguePresentation !== 'stage' && createPortal(
      <LanConversation actionLabel={config.dialogue.actionLabel} choices={config.dialogue.choices} choicePresentation={config.dialogue.choicePresentation}
        heading={config.dialogue.heading} media={config.dialogue.media} anchor={{ x: position.x, y: position.y, dialogueSide: 'right', dialogueVertical: 'above' }}
        conversationId={config.dialogue.conversationId} dialogLabel={config.dialogue.dialogLabel} dialogueId={config.dialogueId} messages={config.dialogue.messages}
        placement={config.dialoguePresentation === 'modal' ? 'modal' : 'free'} closeOnBackdrop={config.dialogue.closeOnBackdrop} closeOnEscape={config.dialogue.closeOnEscape}
        showClose={config.dialogue.showClose} unavailableNotice={config.dialogue.unavailableNotice} onAction={handleAction} onClose={handleClose} />, document.body,
    )}
  </>;
}

export default ChapterSpiritHost;
