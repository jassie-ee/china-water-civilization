import type { GovernanceQuestionLevelConfig } from './governanceLevel';
import type { GovernanceProgressState, GovernanceProgressUpdate } from './governanceProgress';
import type { BasinId } from './basin';

export type GovernanceProgressScope = 'all' | BasinId;

/** 后端接入时使用的账户关卡结果写入载荷。 */
export interface GovernanceLevelResultInput {
  accountId: string;
  currentProgress: GovernanceProgressState;
  levelId: string;
  completedStars: number;
}

export interface GovernanceLevelResult {
  progress: GovernanceProgressState;
  update: GovernanceProgressUpdate;
}

/**
 * 页面只依赖此接口；本地 demo 与未来 API 实现可以在不改动 UI 的情况下替换。
 * 关卡配置在 demo 阶段随前端代码发布，因此采用同步查询；远端实现可在启动时预载并缓存。
 */
export interface GovernanceDataSource {
  getQuestionLevelConfig: (levelId: string) => GovernanceQuestionLevelConfig | null;
  getQuestionLevelConfigs: () => readonly GovernanceQuestionLevelConfig[];
  loadProgress: (accountId: string) => Promise<GovernanceProgressState>;
  recordLevelResult: (input: GovernanceLevelResultInput) => Promise<GovernanceLevelResult>;
  clearProgress: (accountId: string, currentProgress: GovernanceProgressState, scope: GovernanceProgressScope) => Promise<GovernanceProgressState>;
}
