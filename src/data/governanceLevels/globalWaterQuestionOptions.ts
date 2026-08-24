import type { GovernanceQuestionOption } from '@/types/governanceLevel';

/**
 * 通用"全球水治理"决策选项生成器。
 *
 * 复用现有的 3 选 1 星星制（1 / 2 / 3 星），把 PDF 第三章·走出国门里
 * "ABC 多选 / 单选 / 三选"的题面，重新组织成 system-coordination 框架下的
 * 低 / 中 / 高 三档答案。这样既能融入既有 GovernanceQuestionLevelConfig
 * 与前端答题界面，又保留 PDF 的故事感与最佳答案导向。
 *
 * 四个 metricChanges 沿用治理题库既有的四项指标：
 *   - floodSafety 防洪安全
 *   - sedimentControl 泥沙调控
 *   - ecologicalStability 生态稳定
 *   - engineeringBenefit 工程效益
 */
function createGlobalWaterDecisionOptions(low: string, middle: string, high: string, explanation: string): GovernanceQuestionOption[] {
  return [
    {
      id: 'single-goal',
      text: low,
      stars: 1,
      metricChanges: { floodSafety: -2, sedimentControl: -2, ecologicalStability: -5, engineeringBenefit: 3 },
      feedback: '单一目标得到优先，但系统约束被明显弱化。',
      explanation,
    },
    {
      id: 'partial-balance',
      text: middle,
      stars: 2,
      metricChanges: { floodSafety: 2, sedimentControl: 2, ecologicalStability: 1, engineeringBenefit: 2 },
      feedback: '已开始兼顾多种需求，但仍可通过监测和协同提高适应性。',
      explanation,
    },
    {
      id: 'system-coordination',
      text: high,
      stars: 3,
      metricChanges: { floodSafety: 4, sedimentControl: 3, ecologicalStability: 5, engineeringBenefit: 3 },
      feedback: '你将工程、生态与流域过程放入同一套决策框架。',
      explanation,
    },
  ];
}

export { createGlobalWaterDecisionOptions };