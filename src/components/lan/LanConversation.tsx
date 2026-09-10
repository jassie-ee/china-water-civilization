import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type PointerEvent as ReactPointerEvent } from 'react';

import lanConversationPanel from '@/assets/images/lan-conversation-panel-transparent.png';

import './LanConversation.css';

export interface LanDialogueAnchor {
  x: number;
  y: number;
  dialogueSide: 'left' | 'right';
  dialogueVertical: 'above' | 'below';
}

export type LanConversationPlacement = 'free' | 'attached' | 'stage' | 'modal';

interface LanConversationProps {
  actionLabel: string;
  anchor?: LanDialogueAnchor;
  conversationId: string;
  dialogLabel: string;
  dialogueId?: string;
  messages: string[];
  choices?: Array<{
    id: string;
    label: string;
    description?: string;
    imageSrc?: string;
    onSelect: () => void;
  }>;
  choicePresentation?: 'list' | 'species' | 'dispatch';
  media?: {
    src: string;
    title: string;
  };
  heading?: string;
  placement?: LanConversationPlacement;
  closeOnBackdrop?: boolean;
  closeOnEscape?: boolean;
  showClose?: boolean;
  unavailableNotice?: string;
  onAction: () => void;
  onClose: () => void;
}

function LanConversation({
  actionLabel,
  choices,
  choicePresentation = 'list',
  anchor,
  conversationId,
  dialogLabel,
  dialogueId = 'lan-dialogue',
  heading,
  media,
  messages,
  placement = 'free',
  closeOnBackdrop = false,
  closeOnEscape = false,
  showClose = true,
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

  useEffect(() => {
    if (!closeOnEscape) return undefined;

    const handleKeyDown = (event: KeyboardEvent): void => {
      if (event.key !== 'Escape') return;
      event.preventDefault();
      onClose();
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [closeOnEscape, onClose]);

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
    1.2,
    Math.max(0.82, 0.82 + (Math.max(currentMessageLength, visibleNoticeLength) - 12) / 110),
  );
  const dialogueWidth = `${(27 * dialogueScale).toFixed(2)}rem`;
  const conversationRef = useRef<HTMLElement>(null);
  const dialogueOffsetRef = useRef({ x: 0, y: 0 });
  const [dialogueOffset, setDialogueOffset] = useState({ x: 0, y: 0 });
  const choicesRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (placement === 'stage' || placement === 'modal') return undefined;
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
  }, [conversationId, currentMessageLength, dialogueOffset.x, dialogueOffset.y, dialogueWidth, isRepairNoticeVisible, placement, resolvedAnchor.x, resolvedAnchor.y]);

  const handleChoicePointerMove = (event: ReactPointerEvent<HTMLButtonElement>): void => {
    const choiceRect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - choiceRect.left) / choiceRect.width - .5) * 2;
    const y = ((event.clientY - choiceRect.top) / choiceRect.height - .5) * 2;
    event.currentTarget.style.setProperty('--lan-choice-tilt-x', `${(-y * 3).toFixed(2)}deg`);
    event.currentTarget.style.setProperty('--lan-choice-tilt-y', `${(x * 4).toFixed(2)}deg`);

    const groupRect = choicesRef.current?.getBoundingClientRect();
    if (groupRect !== undefined) {
      choicesRef.current?.style.setProperty('--lan-choice-flow-x', `${((event.clientX - groupRect.left) / groupRect.width * 100).toFixed(2)}%`);
    }
  };

  const conversation = (
    <section
      ref={conversationRef}
      className={`lan-conversation lan-conversation--${resolvedAnchor.dialogueSide} lan-conversation--${resolvedAnchor.dialogueVertical} lan-conversation--${placement}`}
      id={dialogueId}
      role="dialog"
      aria-modal={placement === 'modal' || undefined}
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
        <img className="lan-conversation__art" src={lanConversationPanel} alt="" aria-hidden="true" />
        {showClose && <button ref={closeButtonRef} className="lan-conversation__close" type="button" onClick={onClose} aria-label="关闭小澜对话">
          <span aria-hidden="true">×</span>
        </button>}
        <div className="lan-conversation__content">
          {heading !== undefined && <h2 className="lan-conversation__heading">{heading}</h2>}
          {media !== undefined && (
            <video className="lan-conversation__media" controls autoPlay playsInline preload="metadata" aria-label={media.title}>
              <source src={media.src} />
              您的浏览器暂不支持视频播放。
            </video>
          )}
          <p className="lan-conversation__message" aria-live="polite">{messages[messageIndex]}</p>
          {isRepairNoticeVisible && unavailableNotice !== undefined && (
            <p className="lan-conversation__notice" role="status">{unavailableNotice}</p>
          )}
          {isFinalMessage && choices !== undefined && choices.length > 0 ? (
            <div ref={choicesRef} className={`lan-conversation__choices lan-conversation__choices--${choicePresentation}`} role="group" aria-label="选择回答">
              {choices.map((choice) => (
                <button key={choice.id} className="lan-conversation__choice" type="button" onClick={choice.onSelect} onPointerMove={handleChoicePointerMove} onPointerLeave={(event) => {
                  event.currentTarget.style.setProperty('--lan-choice-tilt-x', '0deg');
                  event.currentTarget.style.setProperty('--lan-choice-tilt-y', '0deg');
                }}>
                  {choice.imageSrc ? <img src={choice.imageSrc} alt="" /> : choicePresentation === 'species' ? <span className="lan-conversation__choice-placeholder" aria-hidden="true">物种图像</span> : null}
                  <strong>{choice.label}</strong>
                  {choice.description && <small>{choice.description}</small>}
                </button>
              ))}
            </div>
          ) : isFinalMessage ? (
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

  if (placement !== 'modal') return conversation;

  return (
    <div
      className="lan-conversation__backdrop"
      onPointerDown={(event) => {
        if (closeOnBackdrop && event.target === event.currentTarget) onClose();
      }}
    >
      {conversation}
    </div>
  );
}

export default LanConversation;
