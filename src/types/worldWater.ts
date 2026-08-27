export type WorldWaterNodeId = 'nile-delta' | 'rhine-corridor' | 'maritime-route';

export interface WorldWaterChoice {
  id: string;
  label: string;
  text: string;
  stars: 1 | 2 | 3;
  feedback: string;
}

export interface WorldWaterNode {
  id: WorldWaterNodeId;
  order: number;
  region: string;
  title: string;
  subtitle: string;
  story: string;
  question: string;
  x: number;
  y: number;
  choices: WorldWaterChoice[];
}
