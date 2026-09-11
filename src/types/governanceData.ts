import type { GovernanceProgressState, GovernanceProgressUpdate } from './governanceProgress';

/** 浏览器本地治理关卡结果写入载荷。 */
export interface GovernanceLevelResultInput {
  currentProgress: GovernanceProgressState;
  levelId: string;
  completedStars: number;
}

export interface GovernanceLevelResult {
  progress: GovernanceProgressState;
  update: GovernanceProgressUpdate;
}

export interface GovernanceDataSource {
  loadProgress: () => Promise<GovernanceProgressState>;
  recordLevelResult: (input: GovernanceLevelResultInput) => Promise<GovernanceLevelResult>;
}
