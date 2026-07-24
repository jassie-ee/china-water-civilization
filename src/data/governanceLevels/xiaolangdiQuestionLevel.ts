import type { GovernanceQuestionLevelConfig, GovernanceMetricValues } from '@/types/governanceLevel';

const initialMetrics: GovernanceMetricValues = {
  floodSafety: 50,
  sedimentControl: 50,
  ecologicalStability: 50,
  engineeringBenefit: 50,
};

// 本配置仅用于验证通用四题引擎的数据结构，不代表真实工程调度方案或监测结论。
const xiaolangdiQuestionLevel: GovernanceQuestionLevelConfig = {
  levelId: 'xiaolangdi',
  title: '小浪底：水沙平衡调度',
  description: '通过连续治理取舍，理解防洪、泥沙、生态与工程收益之间的系统关系。',
  initialMetrics,
  evaluation: {
    title: '系统治理需要持续权衡',
    description: '本次结果用于结构验证与互动学习，强调多目标协同，不代表真实工程绩效。',
  },
  questions: [
    {
      id: 'identify-governance-priority',
      scenario: '结构验证情境：调度开始前，需要先明确本轮治理最应关注的目标组合。',
      questionText: '面对多项任务，你会如何确定本轮调度的优先原则？',
      options: [
        {
          id: 'prioritize-sediment-only',
          text: '优先追求泥沙输移效率，暂不同时评估其他目标。',
          stars: 1,
          metricChanges: { floodSafety: 3, sedimentControl: 7, ecologicalStability: -4, engineeringBenefit: -2 },
          feedback: '泥沙目标得到加强，但单一目标会压缩其他治理空间。',
          explanation: '流域治理通常需要同时识别安全、生态与工程运行之间的关联。',
        },
        {
          id: 'coordinate-multiple-goals',
          text: '先比较防洪、泥沙、生态与工程条件，再确定协同目标。',
          stars: 3,
          metricChanges: { floodSafety: 5, sedimentControl: 5, ecologicalStability: 4, engineeringBenefit: 3 },
          feedback: '你选择了先识别系统关系的路径，为后续调度保留了协调空间。',
          explanation: '多目标对比不是放弃重点，而是让重点建立在整体约束之上。',
        },
        {
          id: 'prioritize-engineering-return',
          text: '优先保持工程收益，后续再处理其他治理要求。',
          stars: 2,
          metricChanges: { floodSafety: 0, sedimentControl: -3, ecologicalStability: -3, engineeringBenefit: 7 },
          feedback: '工程收益有所提升，但泥沙与生态目标被推迟处理。',
          explanation: '工程收益是治理因素之一，不能替代对流域整体状态的判断。',
        },
      ],
    },
    {
      id: 'select-sediment-operation-rhythm',
      scenario: '结构验证情境：进入水沙调控环节，需要选择调度节奏。',
      questionText: '你会采用怎样的泥沙调控节奏？',
      options: [
        {
          id: 'single-intensity-operation',
          text: '采用一次性高强度调度，尽快追求单项效果。',
          stars: 2,
          metricChanges: { floodSafety: 2, sedimentControl: 8, ecologicalStability: -5, engineeringBenefit: -2 },
          feedback: '短期泥沙控制增强，但系统承受的波动也随之增加。',
          explanation: '高强度措施可能有效，却需要同时考虑河道与生态系统的承受能力。',
        },
        {
          id: 'stage-based-operation',
          text: '结合监测信息分阶段调整，在不同目标之间保持弹性。',
          stars: 3,
          metricChanges: { floodSafety: 4, sedimentControl: 6, ecologicalStability: 4, engineeringBenefit: 3 },
          feedback: '你保留了根据状态变化调整的空间，治理节奏更具协同性。',
          explanation: '分阶段调控有助于把一次决策转化为持续观察和适应的过程。',
        },
        {
          id: 'delay-all-actions',
          text: '暂缓所有调整，等待更多信息后再行动。',
          stars: 1,
          metricChanges: { floodSafety: -2, sedimentControl: -4, ecologicalStability: 1, engineeringBenefit: 0 },
          feedback: '风险变化尚未被及时回应，部分治理目标可能失去主动性。',
          explanation: '审慎不等于停滞；治理需要在信息不足与行动时机之间寻找平衡。',
        },
      ],
    },
    {
      id: 'protect-ecological-conditions',
      scenario: '结构验证情境：调度方案即将执行，需要处理生态条件与运行目标的关系。',
      questionText: '你会如何把生态条件纳入调度约束？',
      options: [
        {
          id: 'exclude-ecological-conditions',
          text: '只关注工程调度目标，不把生态条件纳入本轮判断。',
          stars: 1,
          metricChanges: { floodSafety: 1, sedimentControl: 1, ecologicalStability: -7, engineeringBenefit: 4 },
          feedback: '工程目标更集中，但生态稳定面临明显压力。',
          explanation: '生态条件是河流系统运行的一部分，而非调度完成后的附加项。',
        },
        {
          id: 'set-ecological-constraints',
          text: '设置生态约束，并在满足约束的前提下协调其他目标。',
          stars: 3,
          metricChanges: { floodSafety: 4, sedimentControl: 4, ecologicalStability: 7, engineeringBenefit: 2 },
          feedback: '你将生态条件纳入方案边界，形成更完整的系统治理取舍。',
          explanation: '把生态约束前置，能够避免仅以单一运行结果评价治理成效。',
        },
        {
          id: 'pause-operations-for-ecology',
          text: '为避免生态扰动，暂停本轮所有工程调整。',
          stars: 2,
          metricChanges: { floodSafety: -1, sedimentControl: -3, ecologicalStability: 4, engineeringBenefit: -2 },
          feedback: '生态压力有所缓解，但其他治理任务缺少必要响应。',
          explanation: '生态保护需要进入协同设计，而不必然意味着停止全部治理行动。',
        },
      ],
    },
    {
      id: 'adapt-with-monitoring',
      scenario: '结构验证情境：方案执行后出现新的状态信息，需要决定是否调整后续策略。',
      questionText: '你会如何利用监测信息完成下一步治理？',
      options: [
        {
          id: 'keep-original-plan',
          text: '保持原方案不变，不根据新信息调整。',
          stars: 1,
          metricChanges: { floodSafety: 0, sedimentControl: -2, ecologicalStability: -2, engineeringBenefit: 2 },
          feedback: '执行保持稳定，但错过了根据状态变化优化方案的机会。',
          explanation: '复杂系统中，持续监测与反馈能够支持更有针对性的后续调整。',
        },
        {
          id: 'adapt-with-observation',
          text: '依据监测结果复核指标，并动态修正后续调度。',
          stars: 3,
          metricChanges: { floodSafety: 5, sedimentControl: 5, ecologicalStability: 5, engineeringBenefit: 3 },
          feedback: '你建立了“观察—判断—调整”的闭环，治理更具适应性。',
          explanation: '系统治理不是一次性选择，而是以监测和反馈支持持续优化。',
        },
        {
          id: 'maximize-short-term-output',
          text: '优先维持短期工程产出，不调整当前运行安排。',
          stars: 2,
          metricChanges: { floodSafety: 1, sedimentControl: -3, ecologicalStability: -3, engineeringBenefit: 6 },
          feedback: '短期工程收益增加，但长期协同能力受到限制。',
          explanation: '短期产出可以是目标之一，但应放在长期治理韧性的框架内评估。',
        },
      ],
    },
  ],
};

export { xiaolangdiQuestionLevel };
