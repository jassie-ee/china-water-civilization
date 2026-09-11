export type CosmicActId = 'earth-heaven' | 'galaxy-voyage' | 'all-things';
export type CosmicActKind = 'assembly' | 'voyage' | 'awakening';

export interface CosmicChoice {
  id: string;
  label: string;
  text: string;
  stars: 1 | 2 | 3;
  feedback: string;
}

export interface CosmicAct {
  id: CosmicActId;
  order: number;
  kind: CosmicActKind;
  signal: string;
  title: string;
  subtitle: string;
  story: string;
  x: number;
  y: number;
}
