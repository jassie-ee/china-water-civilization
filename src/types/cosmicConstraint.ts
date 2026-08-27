export type CosmicSignalId = 'climate' | 'resources' | 'cities' | 'co-governance';

export interface CosmicChoice {
  id: string;
  label: string;
  text: string;
  stars: 1 | 2 | 3;
  feedback: string;
}

export interface CosmicSignal {
  id: CosmicSignalId;
  order: number;
  signal: string;
  title: string;
  subtitle: string;
  story: string;
  question: string;
  x: number;
  y: number;
  choices: CosmicChoice[];
}
