import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from 'react';
import { createPortal } from 'react-dom';

import lanConversationPanel from '@/assets/images/lan-conversation-panel-transparent.png';
import lanSubtitleInkWashOverlay from '@/assets/images/lan/lan-subtitle-ink-wash-overlay.png';

import './LanConversation.css';

export interface LanDialogueAnchor {
  x: number;
  y: number;
  dialogueSide: 'left' | 'right';
  dialogueVertical: 'above' | 'below';
}

export type LanConversationPlacement = 'free' | 'attached';
export type LanConversationPresentation = 'bubble' | 'subtitle';

interface LanConversationProps {
  actionLabel: string;
  anchor?: LanDialogueAnchor;
  conversationId: string;
  dialogLabel: string;
  dialogueId?: string;
  messages: string[];
  presentation?: LanConversationPresentation;
  placement?: LanConversationPlacement;
  unavailableNotice?: string;
  onAction: () => void;
  onClose: () => void;
}

function LanConversation({
  actionLabel,
  anchor,
  conversationId,
  dialogLabel,
  dialogueId = 'lan-dialogue',
  messages,
  presentation = 'bubble',
  placement = 'free',
  unavailableNotice,
  onAction,
  onClose,
}: LanConversationProps) {
  const [messageIndex, setMessageIndex] = useState(0);
  const [isRepairNoticeVisible, setIsRepairNoticeVisible] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const isFinalMessage = messageIndex === messages.length - 1;

  useEffect(() => {
    setMessageIndex(0);
    setIsRepairNoticeVisible(false);
    window.requestAnimationFrame(() => closeButtonRef.current?.focus());
  }, [conversationId]);

  const handleAction = (): void => {
    if (unavailableNotice !== undefined) {
      setIsRepairNoticeVisible(true);
      return;
    }

    onAction();
  };

  const resolvedAnchor = anchor ?? {
    x: 0,
    y: 0,
    dialogueSide: 'right' as const,
    dialogueVertical: 'above' as const,
  };
  const visibleNoticeLength = isRepairNoticeVisible ? Array.from(unavailableNotice ?? '').length : 0;
  const currentMessageLength = Array.from(messages[messageIndex] ?? '').length;
  const dialogueScale = Math.min(
    1.28,
    Math.max(0.8, 0.8 + (Math.max(currentMessageLength, visibleNoticeLength) - 12) / 100),
  );
  const dialogueWidth = `${(23 * dialogueScale).toFixed(2)}rem`;
  const conversationRef = useRef<HTMLElement>(null);
  const dialogueOffsetRef = useRef({ x: 0, y: 0 });
  const [dialogueOffset, setDialogueOffset] = useState({ x: 0, y: 0 });

  useLayoutEffect(() => {
    if (presentation === 'subtitle') return undefined;

    const conversation = conversationRef.current;
    if (conversation === null) return undefined;

    const constrainToViewport = (): void => {
      const rect = conversation.getBoundingClientRect();
      const appliedOffset = dialogueOffsetRef.current;
      const baseLeft = rect.left - appliedOffset.x;
      const baseRight = rect.right - appliedOffset.x;
      const baseTop = rect.top - appliedOffset.y;
      const baseBottom = rect.bottom - appliedOffset.y;
      const margin = 8;
      const nextOffset = {
        x: baseLeft < margin ? margin - baseLeft : baseRight > window.innerWidth - margin ? window.innerWidth - margin - baseRight : 0,
        y: baseTop < margin ? margin - baseTop : baseBottom > window.innerHeight - margin ? window.innerHeight - margin - baseBottom : 0,
      };

      if (Math.abs(nextOffset.x - appliedOffset.x) > 0.5 || Math.abs(nextOffset.y - appliedOffset.y) > 0.5) {
        dialogueOffsetRef.current = nextOffset;
        setDialogueOffset(nextOffset);
      }
    };

    constrainToViewport();
    window.addEventListener('resize', constrainToViewport);
    return () => window.removeEventListener('resize', constrainToViewport);
  }, [conversationId, currentMessageLength, dialogueOffset.x, dialogueOffset.y, dialogueWidth, isRepairNoticeVisible, placement, presentation, resolvedAnchor.x, resolvedAnchor.y]);

  const conversation = (
    <section
      ref={conversationRef}
      className={`lan-conversation lan-conversation--${resolvedAnchor.dialogueSide} lan-conversation--${resolvedAnchor.dialogueVertical}${placement === 'attached' ? ' lan-conversation--attached' : ''}${presentation === 'subtitle' ? ' lan-conversation--subtitle' : ''}`}
      id={dialogueId}
      role="dialog"
      aria-label={dialogLabel}
      style={{
        left: `${resolvedAnchor.x}%`,
        top: `${resolvedAnchor.y}%`,
        '--lan-dialogue-width': dialogueWidth,
        '--lan-dialogue-offset-x': `${dialogueOffset.x}px`,
        '--lan-dialogue-offset-y': `${dialogueOffset.y}px`,
      } as CSSProperties}
      onPointerDown={(event) => event.stopPropagation()}
    >
      <div className="lan-conversation__bubble">
        <img className="lan-conversation__art" src={presentation === 'subtitle' ? lanSubtitleInkWashOverlay : lanConversationPanel} alt="" aria-hidden="true" />
        <button ref={closeButtonRef} className="lan-conversation__close" type="button" onClick={onClose} aria-label="关闭小澜对话">
          <span aria-hidden="true">×</span>
        </button>
        <div className="lan-conversation__content">
          <p className="lan-conversation__message" aria-live="polite">{messages[messageIndex]}</p>
          {isRepairNoticeVisible && unavailableNotice !== undefined && (
            <p className="lan-conversation__notice" role="status">{unavailableNotice}</p>
          )}
          {isFinalMessage ? (
            <button className="lan-conversation__action" type="button" onClick={handleAction}>
              {actionLabel}<span aria-hidden="true">→</span>
            </button>
          ) : (
            <button className="lan-conversation__next" type="button" onClick={() => setMessageIndex((index) => index + 1)}>
              继续<span aria-hidden="true">→</span>
            </button>
          )}
        </div>
      </div>
    </section>
  );

  if (presentation === 'subtitle' && typeof document !== 'undefined' && document.body !== null) {
    return createPortal(conversation, document.body);
  }

  return conversation;
}

export default LanConversation;
