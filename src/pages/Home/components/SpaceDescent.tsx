import type { IntroPhase } from '../types';

import EarthVisual from './EarthVisual';

import './SpaceDescent.css';

interface SpaceDescentProps {
  phase: IntroPhase;
}

function SpaceDescent({ phase }: SpaceDescentProps) {
  return (
    <div className={`space-descent space-descent--${phase}`} aria-hidden="true">
      <EarthVisual phase={phase} />
    </div>
  );
}

export default SpaceDescent;
