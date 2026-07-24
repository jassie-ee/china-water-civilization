export type GovernanceMetricId =
  | 'floodSafety'
  | 'sedimentControl'
  | 'ecologicalStability'
  | 'engineeringBenefit';

export interface GovernanceMetricValues {
  floodSafety: number;
  sedimentControl: number;
  ecologicalStability: number;
  engineeringBenefit: number;
}

/** 通用问答关卡可由任意流域的治理任务复用。 */
export interface GovernanceQuestionLevelConfig {
  levelId: string;
  title: string;
  description: string;
  initialMetrics: GovernanceMetricValues;
  evaluation: GovernanceQuestionEvaluation;
  questions: GovernanceQuestion[];
}

export interface GovernanceQuestion {
  id: string;
  scenario: string;
  questionText: string;
  options: GovernanceQuestionOption[];
}

export interface GovernanceQuestionOption {
  id: string;
  text: string;
  stars: GovernanceQuestionStarCount;
  metricChanges: GovernanceMetricValues;
  feedback: string;
  explanation: string;
}

export type GovernanceQuestionStarCount = 1 | 2 | 3;

export interface GovernanceQuestionEvaluation {
  title: string;
  description: string;
}

/** 单题作答完成后保存的记录，供本关星级汇总与结果页复用。 */
export interface GovernanceQuestionAnswerRecord {
  questionNumber: number;
  questionId: string;
  selectedOptionId: string;
  earnedStars: GovernanceQuestionStarCount;
  metricChanges: GovernanceMetricValues;
}
