import type { AtomConfig, IntroPhase } from './types';

const coreAtoms: AtomConfig[] = [
  { id: 'oxygen-core', kind: 'oxygen', positionClass: 'atom-particle--core-oxygen', isCoreAtom: true },
  { id: 'hydrogen-left', kind: 'hydrogen', positionClass: 'atom-particle--core-hydrogen-left', isCoreAtom: true },
  { id: 'hydrogen-right', kind: 'hydrogen', positionClass: 'atom-particle--core-hydrogen-right', isCoreAtom: true },
];

const backgroundAtoms: AtomConfig[] = [
  { id: 'hydrogen-northwest', kind: 'hydrogen', positionClass: 'atom-particle--background-one', isCoreAtom: false },
  { id: 'oxygen-northeast', kind: 'oxygen', positionClass: 'atom-particle--background-two', isCoreAtom: false },
  { id: 'hydrogen-southwest', kind: 'hydrogen', positionClass: 'atom-particle--background-three', isCoreAtom: false },
  { id: 'oxygen-southeast', kind: 'oxygen', positionClass: 'atom-particle--background-four', isCoreAtom: false },
];

const phaseDelays: Record<Exclude<IntroPhase, 'transitioning-to-basins'>, number> = {
  'atoms-floating': 2200,
  'atoms-converging': 2800,
  'energy-forming': 1600,
  'water-drop-formed': 1100,
  'water-drop-falling': 2200,
  'earth-approaching': 1900,
  'china-focusing': 1300,
};

const introPhaseSequence: IntroPhase[] = [
  'atoms-floating',
  'atoms-converging',
  'energy-forming',
  'water-drop-formed',
  'water-drop-falling',
  'earth-approaching',
  'china-focusing',
  'transitioning-to-basins',
];

const reducedMotionPhaseDelays: Record<Exclude<IntroPhase, 'transitioning-to-basins'>, number> = {
  'atoms-floating': 120,
  'atoms-converging': 120,
  'energy-forming': 120,
  'water-drop-formed': 180,
  'water-drop-falling': 160,
  'earth-approaching': 180,
  'china-focusing': 180,
};

const basinTransitionDelay = 650;
const reducedMotionBasinTransitionDelay = 180;

export {
  backgroundAtoms,
  basinTransitionDelay,
  coreAtoms,
  introPhaseSequence,
  phaseDelays,
  reducedMotionBasinTransitionDelay,
  reducedMotionPhaseDelays,
};
