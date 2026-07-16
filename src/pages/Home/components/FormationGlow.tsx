import type { IntroPhase } from '../types';

import './FormationGlow.css';

interface FormationGlowProps {
  phase: IntroPhase;
}

function FormationGlow({ phase }: FormationGlowProps) {
  return <span className={`formation-glow formation-glow--${phase}`} />;
}

export default FormationGlow;
