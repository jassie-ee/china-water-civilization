import { useRef, useState, type CSSProperties } from 'react';

import LanConversation from '@/components/lan/LanConversation';

import ChapterSpirit, { type ChapterSpiritAction, type ChapterSpiritChapter, type ChapterSpiritMood } from './ChapterSpirit';

import './chapter-guide.css';

interface ChapterGuideProps {
  action?: ChapterSpiritAction;
  actionLabel: string;
  animationSrc?: string;
  chapter: ChapterSpiritChapter;
  conversationId: string;
  dialogLabel: string;
  dialogueId: string;
  messages: string[];
  mood: ChapterSpiritMood;
  onAction: () => void;
  position: { x: number; y: number };
}

function ChapterGuide({
  action = 'happy',
  actionLabel,
  animationSrc,
  chapter,
  conversationId,
  dialogLabel,
  dialogueId,
  messages,
  mood,
  onAction,
  position,
}: ChapterGuideProps) {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const guideStyle = {
    '--guide-x': `${position.x}%`,
    '--guide-y': `${position.y}%`,
  } as CSSProperties;

  const closeDialogue = (): void => {
    setIsOpen(false);
    window.requestAnimationFrame(() => triggerRef.current?.focus());
  };

  const handleAction = (): void => {
    onAction();
    setIsOpen(false);
  };

  return (
    <div className="chapter-guide" style={guideStyle}>
      <button
        ref={triggerRef}
        className="chapter-guide__trigger"
        type="button"
        aria-label="打开澜澜导览"
        aria-expanded={isOpen}
        aria-controls={isOpen ? dialogueId : undefined}
        onClick={() => setIsOpen((current) => !current)}
      >
        <ChapterSpirit animationSrc={animationSrc} chapter={chapter} mood={mood} action={action} />
      </button>
      {isOpen && (
        <LanConversation
          actionLabel={actionLabel}
          anchor={{ x: 100, y: 0, dialogueSide: 'right', dialogueVertical: 'above' }}
          conversationId={conversationId}
          dialogLabel={dialogLabel}
          dialogueId={dialogueId}
          messages={messages}
          placement="attached"
          onAction={handleAction}
          onClose={closeDialogue}
        />
      )}
    </div>
  );
}

export default ChapterGuide;
