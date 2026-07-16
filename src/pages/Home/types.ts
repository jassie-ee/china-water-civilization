type IntroPhase =
  | 'atoms-floating'
  | 'atoms-converging'
  | 'energy-forming'
  | 'water-drop-formed'
  | 'water-drop-falling'
  | 'earth-approaching'
  | 'china-focusing'
  | 'transitioning-to-basins';

type AtomKind = 'hydrogen' | 'oxygen';

interface AtomConfig {
  id: string;
  kind: AtomKind;
  positionClass: string;
  isCoreAtom: boolean;
}

export type { AtomConfig, AtomKind, IntroPhase };
