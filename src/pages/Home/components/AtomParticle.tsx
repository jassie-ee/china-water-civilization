import type { AtomConfig } from '../types';

import './AtomParticle.css';

interface AtomParticleProps {
  atom: AtomConfig;
}

function AtomParticle({ atom }: AtomParticleProps) {
  return (
    <span className={`atom-particle atom-particle--${atom.kind} ${atom.positionClass}`}>
      <span className="atom-particle__orbit" />
      <span className="atom-particle__core" />
      <span className="atom-particle__electron" />
      {atom.isCoreAtom && <span className="atom-particle__symbol">{atom.kind === 'oxygen' ? 'O' : 'H'}</span>}
    </span>
  );
}

export default AtomParticle;
