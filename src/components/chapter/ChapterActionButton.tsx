import type { ButtonHTMLAttributes, ReactNode } from 'react';

import './chapter-action-button.css';

export type ChapterActionIntent = 'survey' | 'record' | 'continue' | 'assemble' | 'voyage' | 'complete' | 'replay';
export type ChapterActionState = 'idle' | 'recording' | 'complete';

interface ChapterActionButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  children: ReactNode;
  intent?: ChapterActionIntent;
  state?: ChapterActionState;
}

const intentMarks: Record<ChapterActionIntent, string> = {
  survey: '勘',
  record: '记',
  continue: '行',
  assemble: '合',
  voyage: '航',
  complete: '和',
  replay: '回',
};

function ChapterActionButton({
  children,
  className,
  intent = 'record',
  state = 'idle',
  type = 'button',
  ...buttonProps
}: ChapterActionButtonProps) {
  const classNames = ['chapter-action-button', className].filter(Boolean).join(' ');
  const trailingMark = state === 'complete' ? '✓' : state === 'recording' ? '…' : '→';

  return (
    <button
      {...buttonProps}
      className={classNames}
      data-intent={intent}
      data-state={state}
      type={type}
    >
      <span className="chapter-action-button__sigil" aria-hidden="true">
        <span>{intentMarks[intent]}</span>
      </span>
      <span className="chapter-action-button__label" aria-live="polite">{children}</span>
      <span className="chapter-action-button__trail" aria-hidden="true">{trailingMark}</span>
    </button>
  );
}

export default ChapterActionButton;
