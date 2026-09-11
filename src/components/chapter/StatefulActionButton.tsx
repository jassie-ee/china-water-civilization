import { useEffect, useRef, useState, type ReactNode } from 'react';

import usePrefersReducedMotion from '@/hooks/usePrefersReducedMotion';

import './stateful-action-button.css';

type StatefulActionButtonState = 'idle' | 'recording' | 'complete';

interface StatefulActionButtonProps {
  children: ReactNode;
  className?: string;
  completeLabel?: string;
  disabled?: boolean;
  onCommit: () => void;
  recordingLabel?: string;
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
  onCommit,
  recordingLabel = '记录中',
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
    <button
      className={`chapter-stateful-button${className === undefined ? '' : ` ${className}`}`}
      type="button"
      data-state={state}
      aria-busy={state === 'recording'}
      disabled={disabled || state !== 'idle'}
      onClick={handleClick}
    >
      <span className="chapter-stateful-button__label">{label}</span>
      <span className="chapter-stateful-button__icon" aria-hidden="true">{state === 'complete' ? '✓' : '→'}</span>
    </button>
  );
}

export default StatefulActionButton;
