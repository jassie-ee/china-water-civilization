import type { IntroPhase } from '../types';

import './WaterDrop.css';

interface WaterDropProps {
  phase: IntroPhase;
}

function WaterDrop({ phase }: WaterDropProps) {
  return (
    <span className={`water-drop water-drop--${phase}`}>
      <span className="water-drop__shape" />
    </span>
  );
}

export default WaterDrop;
