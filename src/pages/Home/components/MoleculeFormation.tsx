import { coreAtoms } from '../constants';
import type { IntroPhase } from '../types';

import AtomParticle from './AtomParticle';

import './MoleculeFormation.css';

interface MoleculeFormationProps {
  phase: IntroPhase;
}

function MoleculeFormation({ phase }: MoleculeFormationProps) {
  return (
    <div className={`molecule-formation molecule-formation--${phase}`}>
      {coreAtoms.map((atom) => <AtomParticle key={atom.id} atom={atom} />)}
    </div>
  );
}

export default MoleculeFormation;
