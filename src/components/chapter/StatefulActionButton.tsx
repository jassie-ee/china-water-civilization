import { useEffect, useRef, useState, type ReactNode } from 'react';

import usePrefersReducedMotion from '@/hooks/usePrefersReducedMotion';

import ChapterActionButton, { type ChapterActionIntent } from './ChapterActionButton';

type StatefulActionButtonState = 'idle' | 'recording' | 'complete';

interface StatefulActionButtonProps {
  children: ReactNode;
  className?: string;
  completeLabel?: string;
  disabled?: boolean;
  intent?: ChapterActionIntent;
  onCommit: () => void;
  recordingLabel?: string;
  'aria-label'?: string;
}

/**
 * Local adaptation of the library's stateful button: feedback is immediate,
 * brief, and tied to a real state transition rather than an artificial loader.
 */
function StatefulActionButton({
  children,
  className,
  completeLabel = '已记录',
  disabled = false,
  intent = 'record',
  onCommit,
  recordingLabel = '记录中',
  'aria-label': ariaLabel,
}: StatefulActionButtonProps) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [state, setState] = useState<StatefulActionButtonState>('idle');
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => () => {
    if (timeoutRef.current !== null) window.clearTimeout(timeoutRef.current);
  }, []);

  const handleClick = (): void => {
    if (disabled || state !== 'idle') return;

    setState('recording');
    if (prefersReducedMotion) {
      setState('complete');
      onCommit();
      return;
    }

    timeoutRef.current = window.setTimeout(() => {
      timeoutRef.current = null;
      setState('complete');
      onCommit();
    }, 220);
  };

  const label = state === 'recording' ? recordingLabel : state === 'complete' ? completeLabel : children;

  return (
    <ChapterActionButton
      aria-label={ariaLabel}
      className={`chapter-stateful-button${className === undefined ? '' : ` ${className}`}`}
      aria-busy={state === 'recording'}
      disabled={disabled || state !== 'idle'}
      intent={intent}
      onClick={handleClick}
      state={state}
    >
      {label}
    </ChapterActionButton>
  );
}

export default StatefulActionButton;
