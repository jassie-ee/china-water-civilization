export type WorldWaterStationId = 'survey' | 'red-sea' | 'karot' | 'guinea' | 'equatorial' | 'mekong';

export type WorldWaterStepId =
  | 'local-survey'
  | 'red-sea-desalination'
  | 'karot-hub'
  | 'guinea-hydropower'
  | 'equatorial-cleanup'
  | 'mekong-sharing'
  | 'mekong-allocation';

export type WorldWaterSelectionMode = 'single' | 'multiple';

export interface WorldWaterChoice {
  id: string;
  label: string;
  text: string;
  stars: 1 | 2 | 3;
  feedback: string;
}

export interface WorldWaterStation {
  id: WorldWaterStationId;
  order: number;
  region: string;
  title: string;
  x: number;
  y: number;
  stepIds: readonly WorldWaterStepId[];
}

export interface WorldWaterStep {
  id: WorldWaterStepId;
  order: number;
  stationId: WorldWaterStationId;
  region: string;
  stage: string;
  title: string;
  subtitle: string;
  story: string;
  question: string;
  selectionMode: WorldWaterSelectionMode;
  requiredChoiceIds: readonly string[];
  correctFeedback: string;
  partialFeedback: string;
  waterGain: number;
  choices: WorldWaterChoice[];
}
