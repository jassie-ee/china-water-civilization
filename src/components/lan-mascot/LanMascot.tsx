import { useLayoutEffect, useRef, type PointerEvent as ReactPointerEvent } from 'react';

import LanConversation from '@/components/lan/LanConversation';

import type { LanMascotRecord } from './LanMascotContext';
import { lanMascotExpressions } from './lanMascotExpressions';
import type { LanMascotPosition } from './lanMascotTypes';

import './LanMascot.css';

interface LanMascotProps {
  record: LanMascotRecord;
  onCloseDialogue: () => void;
  onOpenDialogue: () => void;
  onPositionChange: (position: LanMascotPosition) => void;
}

interface DragState {
  moved: boolean;
  originPosition: LanMascotPosition;
  pointerId: number;
  startRect: Pick<DOMRect, 'height' | 'width'>;
  mascotHeight: number;
  startX: number;
  startY: number;
}

const VIEWPORT_MARGIN = 8;
const HANDLE_BOTTOM_RATIO = 0.3;

function clamp(value: number, minimum: number, maximum: number): number {
  return Math.min(maximum, Math.max(minimum, value));
}

function getPositionWithinViewport(
  originPosition: LanMascotPosition,
  startRect: Pick<DOMRect, 'height' | 'width'>,
  mascotHeight: number,
  deltaX: number,
  deltaY: number,
): LanMascotPosition {
  const candidatePosition = {
    x: originPosition.x + (deltaX / window.innerWidth) * 100,
    y: originPosition.y + (deltaY / window.innerHeight) * 100,
  };
  const minimumX = ((VIEWPORT_MARGIN + startRect.width / 2) / window.innerWidth) * 100;
  const maximumX = Math.max(minimumX, ((window.innerWidth - VIEWPORT_MARGIN - startRect.width / 2) / window.innerWidth) * 100);
  const handleTopOffset = mascotHeight * (1 - HANDLE_BOTTOM_RATIO) - startRect.height - mascotHeight / 2;
  const minimumY = ((VIEWPORT_MARGIN - handleTopOffset) / window.innerHeight) * 100;
  const maximumY = Math.max(minimumY, ((window.innerHeight - VIEWPORT_MARGIN - startRect.height - handleTopOffset) / window.innerHeight) * 100);

  return {
    x: clamp(candidatePosition.x, minimumX, maximumX),
    y: clamp(candidatePosition.y, minimumY, maximumY),
  };
}

function LanMascot({ record, onCloseDialogue, onOpenDialogue, onPositionChange }: LanMascotProps) {
  const dragStateRef = useRef<DragState | null>(null);
  const didDragRef = useRef(false);
  const handleRef = useRef<HTMLButtonElement>(null);

  useLayoutEffect(() => {
    const constrainToViewport = (): void => {
      const handle = handleRef.current;
      if (handle === null || window.innerWidth === 0 || window.innerHeight === 0) return;

      const handleRect = handle.getBoundingClientRect();
      const mascotHeight = handle.parentElement?.getBoundingClientRect().height ?? handleRect.height;
      const nextPosition = getPositionWithinViewport(
        record.position,
        { height: handleRect.height, width: handleRect.width },
        mascotHeight,
        0,
        0,
      );

      if (Math.abs(nextPosition.x - record.position.x) > 0.01 || Math.abs(nextPosition.y - record.position.y) > 0.01) {
        onPositionChange(nextPosition);
      }
    };

    constrainToViewport();
    window.addEventListener('resize', constrainToViewport);
    return () => window.removeEventListener('resize', constrainToViewport);
  }, [onPositionChange, record.position]);

  const handlePointerDown = (event: ReactPointerEvent<HTMLButtonElement>): void => {
    if (event.pointerType === 'mouse' && event.button !== 0) return;

    const rect = event.currentTarget.getBoundingClientRect();
    const mascotHeight = event.currentTarget.parentElement?.getBoundingClientRect().height ?? rect.height;
    dragStateRef.current = {
      moved: false,
      originPosition: record.position,
      pointerId: event.pointerId,
      startRect: { height: rect.height, width: rect.width },
      mascotHeight,
      startX: event.clientX,
      startY: event.clientY,
    };
    didDragRef.current = false;
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLButtonElement>): void => {
    const dragState = dragStateRef.current;
    if (dragState === null || dragState.pointerId !== event.pointerId) return;

    const deltaX = event.clientX - dragState.startX;
    const deltaY = event.clientY - dragState.startY;
    if (!dragState.moved && Math.hypot(deltaX, deltaY) > 5) {
      dragState.moved = true;
      didDragRef.current = true;
    }

    if (!dragState.moved) return;

    onPositionChange(getPositionWithinViewport(dragState.originPosition, dragState.startRect, dragState.mascotHeight, deltaX, deltaY));
  };

  const handlePointerUp = (event: ReactPointerEvent<HTMLButtonElement>): void => {
    if (dragStateRef.current?.pointerId === event.pointerId) {
      dragStateRef.current = null;
    }
  };

  const handleClick = (): void => {
    if (didDragRef.current) {
      didDragRef.current = false;
      return;
    }

    if (record.isDialogueOpen) {
      onCloseDialogue();
    } else {
      onOpenDialogue();
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>): void => {
    if (event.key !== 'Enter' && event.key !== ' ') return;

    event.preventDefault();
    handleClick();
  };

  const { config, expressionId, isDialogueOpen, position } = record;
  const expression = lanMascotExpressions[expressionId];

  return (
    <div
      className={`lan-mascot lan-mascot--${expression.motion}${isDialogueOpen ? ' lan-mascot--dialogue-open' : ''}`}
      style={{ left: `${position.x}%`, top: `${position.y}%` }}
    >
      <button
        ref={handleRef}
        className="lan-mascot__handle"
        type="button"
        aria-label={config.spriteAlt}
        aria-expanded={isDialogueOpen}
        aria-controls={isDialogueOpen ? config.dialogueId : undefined}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
      >
        <img className="lan-mascot__sprite" src={expression.src} alt="" aria-hidden="true" draggable={false} />
      </button>
      {isDialogueOpen && (
        <LanConversation
          actionLabel={config.dialogue.actionLabel}
          anchor={{ x: position.x, y: position.y, dialogueSide: 'right', dialogueVertical: 'above' }}
          conversationId={config.dialogue.conversationId}
          dialogLabel={config.dialogue.dialogLabel}
          dialogueId={config.dialogueId}
          messages={config.dialogue.messages}
          placement="attached"
          unavailableNotice={config.dialogue.unavailableNotice}
          onAction={config.dialogue.onAction}
          onClose={onCloseDialogue}
        />
      )}
    </div>
  );
}

export default LanMascot;
