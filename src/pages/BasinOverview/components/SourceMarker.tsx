import type { BasinOverviewPhase } from '@/types/basin';

interface SourceMarkerProps {
  phase: BasinOverviewPhase;
}

function SourceMarker({ phase }: SourceMarkerProps) {
  return (
    <g className={`source-marker source-marker--${phase}`} aria-hidden="true">
      <circle className="source-marker__energy" cx="302" cy="342" r="26" />
      <circle className="source-marker__ripple source-marker__ripple--one" cx="302" cy="342" r="16" />
      <circle className="source-marker__ripple source-marker__ripple--two" cx="302" cy="342" r="16" />
      <path className="source-marker__drop" d="M302 282 C287 303 282 311 282 322 A20 20 0 0 0 322 322 C322 311 317 303 302 282 Z" />
      <circle className="source-marker__point" cx="302" cy="342" r="4" />
      <text className="source-marker__label" x="326" y="337">江河之源</text>
    </g>
  );
}

export default SourceMarker;
