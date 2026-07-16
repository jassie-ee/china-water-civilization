import type { IntroPhase } from '../types';

import './EarthVisual.css';

interface EarthVisualProps {
  phase: IntroPhase;
}

function EarthVisual({ phase }: EarthVisualProps) {
  return (
    <div className={`earth-visual earth-visual--${phase}`} aria-hidden="true">
      <div className="earth-visual__globe">
        <span className="earth-visual__continent earth-visual__continent--asia" />
        <span className="earth-visual__continent earth-visual__continent--china" />
      </div>
    </div>
  );
}

export default EarthVisual;
