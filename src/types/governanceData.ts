import type { GovernanceQuestionLevelConfig } from './governanceLevel';
import type { GovernanceProgressState, GovernanceProgressUpdate } from './governanceProgress';
import type { BasinId } from './basin';

export type GovernanceProgressScope = 'all' | BasinId;

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

/** 答题结果页复用的公开题面；正确答案不会进入答题过程。 */
export interface RemoteGovernanceQuestion {
  id: string;
  scenario: string;
  questionText: string;
  options: Array<{ id: string; text: string; order: number }>;
}

export interface RemoteGovernanceChallenge {
  attemptId: string;
  /** 开始本轮前已结算的本关累计治理星级。 */
  levelStars: number;
  questions: RemoteGovernanceQuestion[];
}

export interface RemoteGovernanceAnswerResult {
  isCorrect: boolean;
  awardedStars: 0 | 3;
  /** 仅第八题完成整轮结算后才返回累计治理星级。 */
  levelStars: number | null;
  isComplete: boolean;
  explanation: string;
}

/** 已完成关卡才返回的复盘数据，正确答案不会出现在答题过程。 */
export interface RemoteGovernanceQuestionReview {
  questionId: string;
  selectedOptionId: string;
  correctOptionId: string;
  awardedStars: 0 | 3;
  explanation: string;
}

export interface RemoteGovernanceChallengeReview {
  attemptId: string;
  questions: RemoteGovernanceQuestionReview[];
}

/**
 * 页面只依赖此接口；本地 demo 与未来 API 实现可以在不改动 UI 的情况下替换。
 * 关卡配置在 demo 阶段随前端代码发布，因此采用同步查询；远端实现可在启动时预载并缓存。
 */
export interface GovernanceDataSource {
  getQuestionLevelConfig: (levelId: string) => GovernanceQuestionLevelConfig | null;
  getQuestionLevelConfigs: () => readonly GovernanceQuestionLevelConfig[];
  loadProgress: () => Promise<GovernanceProgressState>;
  recordLevelResult: (input: GovernanceLevelResultInput) => Promise<GovernanceLevelResult>;
  clearProgress: (currentProgress: GovernanceProgressState, scope: GovernanceProgressScope) => Promise<GovernanceProgressState>;
}
