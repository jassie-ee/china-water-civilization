import type { GovernanceMetricValues, GovernanceQuestionLevelConfig } from '@/types/governanceLevel';

const initialMetrics: GovernanceMetricValues = {
  floodSafety: 50,
  sedimentControl: 50,
  ecologicalStability: 50,
  engineeringBenefit: 50,
};

// 题目依据龙羊峡综述梳理，用于认识多年调节与上游系统协同，不替代实际调度指令。
const longyangxiaQuestionLevel: GovernanceQuestionLevelConfig = {
  levelId: 'longyangxia',
  title: '龙羊峡：上游多年调节',
  description: '在黄河上游“龙头”工程中，理解削丰补枯、生态基流与水库群协同的治理逻辑。',
  initialMetrics,
  evaluation: {
    title: '以多年调节支撑全流域协同',
    description: '龙羊峡的价值不只在于发电，而在于依托上游稳定来水和大库容，为防洪、供水、生态与下游水沙调控提供系统支撑。',
  },
  questions: [
    {
      id: 'longyangxia-strategic-position',
      scenario: '团队正在说明龙羊峡为何被称为黄河上游的“龙头”工程。',
      questionText: '最能概括其战略位置的判断是？',
      options: [
        { id: 'single-power-station', text: '它主要是一座独立发电站，与下游治理联系有限。', stars: 1, metricChanges: { floodSafety: 0, sedimentControl: -2, ecologicalStability: -1, engineeringBenefit: 3 }, feedback: '只看到发电功能，忽略了其上游调节作用。', explanation: '龙羊峡位于上游梯级开发起点，其调节能力会影响下游梯级和全流域水资源配置。' },
        { id: 'local-water-supply', text: '它只负责周边地区的季节性供水。', stars: 2, metricChanges: { floodSafety: 1, sedimentControl: 0, ecologicalStability: 1, engineeringBenefit: 2 }, feedback: '识别了供水价值，但定位仍偏局部。', explanation: '上游水库的调节会通过河道与梯级系统传导至更大范围。' },
        { id: 'upstream-regulator', text: '它是上游来水节奏的关键调节器，为全流域多目标调度提供基础。', stars: 3, metricChanges: { floodSafety: 4, sedimentControl: 3, ecologicalStability: 3, engineeringBenefit: 3 }, feedback: '你抓住了“龙头”工程的系统定位。', explanation: '龙羊峡以多年调节能力统筹丰枯来水，是黄河上游的重要控制节点。' },
      ],
    },
    {
      id: 'longyangxia-multi-year-regulation',
      scenario: '连续丰水年后，气象预测提示未来可能进入偏枯阶段。',
      questionText: '怎样使用多年调节库容更合理？',
      options: [
        { id: 'release-surplus-immediately', text: '将丰水期来水尽快全部下泄，以追求当期发电。', stars: 1, metricChanges: { floodSafety: 1, sedimentControl: 1, ecologicalStability: -2, engineeringBenefit: 4 }, feedback: '短期收益提高，却削弱了应对枯水年的能力。', explanation: '多年调节的核心在于跨年度配置水量，而非只追求当期出力。' },
        { id: 'store-without-boundary', text: '尽可能长期蓄水，不再考虑汛限与下游需求。', stars: 2, metricChanges: { floodSafety: -3, sedimentControl: 0, ecologicalStability: 1, engineeringBenefit: 1 }, feedback: '保水意识是必要的，但无边界蓄水会带来防洪风险。', explanation: '库容运用需同时遵守防洪约束、下游供水和生态需求。' },
        { id: 'store-abundance-supplement-drought', text: '结合预报分年安排蓄放，在防洪边界内削丰补枯并保障基本下泄。', stars: 3, metricChanges: { floodSafety: 5, sedimentControl: 2, ecologicalStability: 4, engineeringBenefit: 3 }, feedback: '你把丰枯变化转化为可管理的跨年度调配。', explanation: '“丰存枯用”是多年调节的核心价值，需以动态预报和约束条件为前提。' },
      ],
    },
    {
      id: 'longyangxia-flood-space',
      scenario: '汛期临近，库水位较高；预报显示上游可能出现强降雨过程。',
      questionText: '应如何处理防洪库容？',
      options: [
        { id: 'wait-for-flood', text: '维持现状，等洪水到达后再大幅泄水。', stars: 1, metricChanges: { floodSafety: -6, sedimentControl: 0, ecologicalStability: -1, engineeringBenefit: 2 }, feedback: '临时处置会压缩洪水调控空间。', explanation: '上游水库的削峰错峰功能依赖提前预留的有效库容。' },
        { id: 'empty-reservoir', text: '不看预报与下游承受能力，立即大量泄水腾库。', stars: 2, metricChanges: { floodSafety: 1, sedimentControl: 1, ecologicalStability: -3, engineeringBenefit: -2 }, feedback: '方向正确，但急泄可能把风险传递给下游。', explanation: '腾库需要与河道行洪能力、梯级运行和生态条件协调。' },
        { id: 'forecast-based-reserve', text: '依据预报分阶段预泄，保留防洪余量并控制下泄过程。', stars: 3, metricChanges: { floodSafety: 7, sedimentControl: 2, ecologicalStability: 2, engineeringBenefit: 2 }, feedback: '你同时维护了水库安全和下游过程稳定。', explanation: '削峰错峰不是简单放水，而是以预报为依据塑造更安全的洪水过程。' },
      ],
    },
    {
      id: 'longyangxia-ecological-baseflow',
      scenario: '枯水期供水需求增加，下游河道仍需维持基本生态流量。',
      questionText: '生态基流应如何进入调度决策？',
      options: [
        { id: 'remove-ecological-flow', text: '暂停生态下泄，把有限水量全部用于经济用水。', stars: 1, metricChanges: { floodSafety: 0, sedimentControl: 0, ecologicalStability: -7, engineeringBenefit: 3 }, feedback: '短期供水收益增加，但河道生态稳定性受到明显损害。', explanation: '生态基流是维持河流健康和下游系统韧性的基本条件。' },
        { id: 'release-fixed-flow', text: '全年维持完全固定的生态流量，不依据来水和河道状态调整。', stars: 2, metricChanges: { floodSafety: 1, sedimentControl: 0, ecologicalStability: 3, engineeringBenefit: -1 }, feedback: '保留生态意识，但缺乏适应性。', explanation: '生态下泄需要在来水、季节和河道响应变化中进行精细安排。' },
        { id: 'set-ecological-constraint', text: '将生态基流作为硬约束，结合枯丰情势统筹供水、发电和下泄节奏。', stars: 3, metricChanges: { floodSafety: 3, sedimentControl: 1, ecologicalStability: 7, engineeringBenefit: 2 }, feedback: '你让生态目标进入了调度的核心边界。', explanation: '保障生态基流并不等于放弃其他目标，而是以系统约束组织多目标协同。' },
      ],
    },
    {
      id: 'longyangxia-downstream-ladder',
      scenario: '下游梯级电站希望提高保证出力，但近期下游还需配合防洪与供水安排。',
      questionText: '如何安排上游下泄更有利于梯级综合效益？',
      options: [
        { id: 'ignore-ladder-information', text: '只按龙羊峡自身出力安排下泄，不共享下游运行信息。', stars: 1, metricChanges: { floodSafety: 0, sedimentControl: 0, ecologicalStability: -1, engineeringBenefit: 1 }, feedback: '单站运行简单，但系统效益没有被释放。', explanation: '龙羊峡作为上游梯级起点，其出库过程会影响下游电站和河道运行。' },
        { id: 'maximize-peak-generation', text: '只在电价高时集中放水，其他时段尽量蓄水。', stars: 2, metricChanges: { floodSafety: -1, sedimentControl: 1, ecologicalStability: -2, engineeringBenefit: 5 }, feedback: '峰值发电收益提升，但下泄过程可能缺乏稳定性。', explanation: '梯级优化应同时考虑河道过程、生态约束和下游综合需求。' },
        { id: 'coordinate-ladder-release', text: '与下游梯级共享预测和运行信息，协调出库节奏与多目标需求。', stars: 3, metricChanges: { floodSafety: 3, sedimentControl: 2, ecologicalStability: 3, engineeringBenefit: 5 }, feedback: '你通过协同调度提升了全梯级的综合效益。', explanation: '上游“龙头”工程的价值之一，是让多座工程不再各自孤立运行。' },
      ],
    },
    {
      id: 'longyangxia-sediment-power-support',
      scenario: '下游计划实施调水调沙，需要上游提供有利的水动力条件。',
      questionText: '龙羊峡应以什么方式参与？',
      options: [
        { id: 'deny-coordination-request', text: '认为排沙只与下游水库有关，不参与联合过程。', stars: 1, metricChanges: { floodSafety: 0, sedimentControl: -5, ecologicalStability: 0, engineeringBenefit: 1 }, feedback: '忽略了上游来水对下游水沙调控的支撑作用。', explanation: '龙羊峡的控沙作用主要是间接的：通过调节下泄流量为下游过程提供动力条件。' },
        { id: 'release-maximum-flow', text: '不考虑过程时机，持续以最大流量下泄。', stars: 2, metricChanges: { floodSafety: -1, sedimentControl: 4, ecologicalStability: -2, engineeringBenefit: 0 }, feedback: '水动力增强，但无节奏的操作可能造成新的约束。', explanation: '水沙调控强调过程匹配，而非单纯追求更大的下泄流量。' },
        { id: 'support-joint-sediment-process', text: '按联合调度时序提供可控水动力，并同步评估防洪和生态边界。', stars: 3, metricChanges: { floodSafety: 3, sedimentControl: 6, ecologicalStability: 2, engineeringBenefit: 2 }, feedback: '你让上游调节服务于全流域水沙协同。', explanation: '龙羊峡与三门峡、小浪底等工程共同构成黄河水沙调控网络。' },
      ],
    },
    {
      id: 'longyangxia-plateau-ecology',
      scenario: '库区周边希望发展生态旅游与渔业，但湿地和草原生境需要长期维护。',
      questionText: '怎样处理生态保护与区域发展的关系？',
      options: [
        { id: 'develop-without-limits', text: '优先扩大开发规模，生态影响后续再处理。', stars: 1, metricChanges: { floodSafety: 0, sedimentControl: 0, ecologicalStability: -5, engineeringBenefit: 4 }, feedback: '短期发展明显，但生态承载压力被忽略。', explanation: '高原湖区形成了复合生态系统，开发强度需要与生态承载能力相匹配。' },
        { id: 'close-all-development', text: '全面禁止合理利用，不再考虑社区发展需求。', stars: 2, metricChanges: { floodSafety: 0, sedimentControl: 0, ecologicalStability: 4, engineeringBenefit: -3 }, feedback: '保护力度较强，但缺少人与自然协同的路径。', explanation: '生态保护并不必然排斥发展，关键在于设置边界并形成可持续收益。' },
        { id: 'ecological-capacity-development', text: '以生境保护和监测为边界，发展低扰动的生态、工业与文化体验。', stars: 3, metricChanges: { floodSafety: 1, sedimentControl: 0, ecologicalStability: 6, engineeringBenefit: 3 }, feedback: '你为生态资源转化设置了长期边界。', explanation: '龙羊峡从荒漠峡谷到高原绿洲的变化，提示工程效益应与生态承载力共同评价。' },
      ],
    },
    {
      id: 'longyangxia-adaptive-management',
      scenario: '实时监测发现来水过程与季初预测存在偏差，原调度方案的适用性下降。',
      questionText: '下一步最合适的管理动作是？',
      options: [
        { id: 'keep-plan-unchanged', text: '保持原计划不变，避免调整造成管理复杂。', stars: 1, metricChanges: { floodSafety: -2, sedimentControl: -1, ecologicalStability: -1, engineeringBenefit: 1 }, feedback: '方案稳定，却错过了根据新信息修正风险的机会。', explanation: '水库调度面对的是动态水文过程，监测反馈是持续优化的重要依据。' },
        { id: 'change-by-single-indicator', text: '只按发电出力变化调整，其他指标之后再评估。', stars: 2, metricChanges: { floodSafety: 0, sedimentControl: 0, ecologicalStability: -2, engineeringBenefit: 4 }, feedback: '工程收益有所提高，但多目标约束被弱化。', explanation: '单一指标可以提供信号，却不能替代对防洪、生态和供水的系统判断。' },
        { id: 'reassess-and-adapt', text: '依据新监测复核来水、库容与下游需求，动态修正分阶段方案。', stars: 3, metricChanges: { floodSafety: 4, sedimentControl: 2, ecologicalStability: 3, engineeringBenefit: 3 }, feedback: '你建立了“监测—判断—调整”的闭环。', explanation: '尊重自然规律也意味着承认不确定性，并用持续观测支持适应性管理。' },
      ],
    },
  ],
};

export { longyangxiaQuestionLevel };
