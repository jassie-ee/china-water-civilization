import { useEffect, useRef, useState } from 'react';

import lanConversationPanel from '@/assets/images/lan-conversation-panel-transparent.png';

import LanAvatar from './LanAvatar';
import './LanConversation.css';

export interface LanDialogueAnchor {
  x: number;
  y: number;
  dialogueSide: 'left' | 'right';
  dialogueVertical: 'above' | 'below';
}

interface LanConversationProps {
  actionLabel: string;
  anchor: LanDialogueAnchor;
  conversationId: string;
  dialogLabel: string;
  messages: string[];
  unavailableNotice?: string;
  onAction: () => void;
  onClose: () => void;
}

function LanConversation({
  actionLabel,
  anchor,
  conversationId,
  dialogLabel,
  messages,
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

  return (
    <section
      className={`lan-conversation lan-conversation--${anchor.dialogueSide} lan-conversation--${anchor.dialogueVertical}`}
      id="lan-dialogue"
      role="dialog"
      aria-label={dialogLabel}
      style={{ left: `${anchor.x}%`, top: `${anchor.y}%` }}
      onPointerDown={(event) => event.stopPropagation()}
    >
      <LanAvatar />
      <div className="lan-conversation__bubble">
        <img className="lan-conversation__art" src={lanConversationPanel} alt="" aria-hidden="true" />
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
}

export default LanConversation;
