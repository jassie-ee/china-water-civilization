import type { CSSProperties } from 'react';

import './ink-ripple.css';

export interface InkRippleTrigger {
  id: number;
  x: number;
  y: number;
  tone?: 'gold' | 'water';
}

interface InkRippleProps {
  trigger: InkRippleTrigger | null;
}

/**
 * Local adaptation of the library's click-ripple behavior: one quiet ink
 * pulse at the point where the player touched the waterline.
 */
function InkRipple({ trigger }: InkRippleProps) {
  if (trigger === null) return null;

  const style = {
    left: `${trigger.x}%`,
    top: `${trigger.y}%`,
  } as CSSProperties;

  return (
    <span
      key={trigger.id}
      className={`chapter-ink-ripple chapter-ink-ripple--${trigger.tone ?? 'water'}`}
      style={style}
      aria-hidden="true"
    >
      <i />
      <i />
      <i />
    </span>
  );
}

export default InkRipple;
