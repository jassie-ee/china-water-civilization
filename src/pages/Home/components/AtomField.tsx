import { backgroundAtoms } from '../constants';
import type { IntroPhase } from '../types';

import AtomParticle from './AtomParticle';

import './AtomField.css';

interface AtomFieldProps {
  phase: IntroPhase;
}

function AtomField({ phase }: AtomFieldProps) {
  return (
    <div className={`atom-field atom-field--${phase}`}>
      <span className="atom-field__star atom-field__star--one" />
      <span className="atom-field__star atom-field__star--two" />
      <span className="atom-field__star atom-field__star--three" />
      <span className="atom-field__star atom-field__star--four" />
      {backgroundAtoms.map((atom) => <AtomParticle key={atom.id} atom={atom} />)}
    </div>
  );
}

export default AtomField;
