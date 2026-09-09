import type { GovernanceMetricValues, GovernanceQuestionLevelConfig } from '@/types/governanceLevel';

const initialMetrics: GovernanceMetricValues = {
  floodSafety: 50,
  sedimentControl: 50,
  ecologicalStability: 50,
  engineeringBenefit: 50,
};

/**
 * 黄土高原采用专属的视频后精灵互动，而非通用治理关卡。
 * 此配置仅让该互动的治理星级正确归集到黄河，并纳入既有清空范围。
 */
const loessPlateauQuestionLevel: GovernanceQuestionLevelConfig = {
  levelId: 'loess-plateau',
  basinId: 'yellow-river',
  title: '黄土高原：守土减沙',
  description: '从坡面植被恢复理解黄河泥沙治理的源头逻辑。',
  initialMetrics,
  evaluation: {
    title: '从山上守住泥沙',
    description: '把坡面土壤稳住，才能从源头减少进入黄河的泥沙。',
  },
  questions: [
    {
      id: 'loess-plateau-source-control',
      scenario: '黄土高原生态互动的星级归集信息。',
      questionText: '要从根上解决泥沙，得从哪儿下手？',
      options: [
        { id: 'plant-upstream', text: '在上游山坡种树种草，先把土稳住', stars: 3, metricChanges: { floodSafety: 2, sedimentControl: 8, ecologicalStability: 7, engineeringBenefit: 1 }, feedback: '从山上守住土壤，泥沙就不易进入河流。', explanation: '实际互动只在这一正确选项首次答对时记录 3 点治理星级。' },
        { id: 'dam-downstream', text: '在下游多修大坝，把泥沙全拦住', stars: 1, metricChanges: { floodSafety: 1, sedimentControl: 1, ecologicalStability: -1, engineeringBenefit: 1 }, feedback: '错误选项不记录治理星级。', explanation: '实际互动中可重新选择。' },
        { id: 'check-dams', text: '在山沟里一道道筑矮坝，把泥沙一层层拦住', stars: 2, metricChanges: { floodSafety: 1, sedimentControl: 3, ecologicalStability: 1, engineeringBenefit: 1 }, feedback: '错误选项不记录治理星级。', explanation: '实际互动中可重新选择。' },
      ],
    },
  ],
};

export { loessPlateauQuestionLevel };
