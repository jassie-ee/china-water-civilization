import AtomField from './AtomField';
import FormationGlow from './FormationGlow';
import MoleculeFormation from './MoleculeFormation';
import SpaceDescent from './SpaceDescent';
import WaterDrop from './WaterDrop';

import type { IntroPhase } from '../types';

import './IntroScene.css';

interface IntroSceneProps {
  phase: IntroPhase;
}

function IntroScene({ phase }: IntroSceneProps) {
  return (
    <div className={`intro-scene intro-scene--${phase}`} aria-hidden="true">
      <AtomField phase={phase} />
      <MoleculeFormation phase={phase} />
      <FormationGlow phase={phase} />
      <WaterDrop phase={phase} />
      <SpaceDescent phase={phase} />
    </div>
  );
}

export default IntroScene;
