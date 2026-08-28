import type { GovernanceQuestionOption } from '@/types/governanceLevel';

/** 保持长江各节点的方案星级与四项指标表达一致，题目本身仍由节点配置独立维护。 */
function createYangtzeDecisionOptions(low: string, middle: string, high: string, explanation: string): GovernanceQuestionOption[] {
  return [
    { id: 'single-goal', text: low, stars: 1, metricChanges: { floodSafety: -2, sedimentControl: -2, ecologicalStability: -5, engineeringBenefit: 3 }, feedback: '单一目标得到优先，但系统约束被明显弱化。', explanation },
    { id: 'partial-balance', text: middle, stars: 2, metricChanges: { floodSafety: 2, sedimentControl: 2, ecologicalStability: 1, engineeringBenefit: 2 }, feedback: '已开始兼顾多种需求，但仍可通过监测和协同提高适应性。', explanation },
    { id: 'system-coordination', text: high, stars: 3, metricChanges: { floodSafety: 4, sedimentControl: 3, ecologicalStability: 5, engineeringBenefit: 3 }, feedback: '你将工程、生态与流域过程放入同一套决策框架。', explanation },
  ];
}

export { createYangtzeDecisionOptions };
