import type { GovernanceMetricValues, GovernanceQuestionLevelConfig } from '@/types/governanceLevel';

const initialMetrics: GovernanceMetricValues = {
  floodSafety: 50,
  sedimentControl: 50,
  ecologicalStability: 50,
  engineeringBenefit: 50,
};

// 题目依据三门峡综述梳理，强调从工程实践中认识水沙规律，不替代实际调度指令。
const sanmenxiaQuestionLevel: GovernanceQuestionLevelConfig = {
  levelId: 'sanmenxia',
  title: '三门峡：从拦沙到协同调控',
  description: '通过八个决策情境，理解多泥沙河流治理如何从单一工程思维走向尊重规律的联合调度。',
  initialMetrics,
  evaluation: {
    title: '在实践中修正认知，形成系统治理',
    description: '三门峡的价值不仅在于工程本体，也在于它促成了对黄河水沙规律的持续认识、改建与协同治理。',
  },
  questions: [
    {
      id: 'sanmenxia-strategic-control',
      scenario: '团队要说明三门峡为何在黄河治理史中具有关键意义。',
      questionText: '以下哪种定位最符合三门峡的战略特征？',
      options: [
        { id: 'ordinary-local-project', text: '它是只服务局部地区的一般性小型工程。', stars: 1, metricChanges: { floodSafety: 0, sedimentControl: -2, ecologicalStability: 0, engineeringBenefit: 1 }, feedback: '这一判断低估了工程对黄河水沙过程的控制范围。', explanation: '三门峡控制黄河大部分流域来水来沙，是中游下段的重要控制节点。' },
        { id: 'permanent-single-solution', text: '它建成后即可用一种固定方式永久解决所有黄河问题。', stars: 2, metricChanges: { floodSafety: 1, sedimentControl: 1, ecologicalStability: -1, engineeringBenefit: 2 }, feedback: '认识到工程的重要性，但把复杂系统简化成了单一答案。', explanation: '黄河水沙关系具有复杂性，工程功能与运行方式需要持续适应。' },
        { id: 'exploration-and-control-node', text: '它既是中游水沙控制节点，也是推动治黄认知演进的探路工程。', stars: 3, metricChanges: { floodSafety: 3, sedimentControl: 3, ecologicalStability: 2, engineeringBenefit: 3 }, feedback: '你同时认识到工程的控制价值与探索价值。', explanation: '三门峡的实践与改建为后续水沙调控和系统治理积累了重要经验。' },
      ],
    },
    {
      id: 'sanmenxia-sediment-accumulation',
      scenario: '水库运行后发现库区泥沙淤积加剧，并对上游河道产生影响。',
      questionText: '面对这种情况，最合理的首要态度是？',
      options: [
        { id: 'deny-observation', text: '坚持原有判断，认为监测到的淤积只是短期偶然现象。', stars: 1, metricChanges: { floodSafety: -2, sedimentControl: -5, ecologicalStability: -1, engineeringBenefit: 1 }, feedback: '拒绝证据会延误对风险的识别。', explanation: '多泥沙河流的冲淤过程必须以持续监测和事实判断为基础。' },
        { id: 'treat-only-local-symptom', text: '只在局部河段临时清淤，不分析水库运行方式与水沙过程。', stars: 2, metricChanges: { floodSafety: 1, sedimentControl: 1, ecologicalStability: -1, engineeringBenefit: -1 }, feedback: '缓解了局部问题，但没有触及形成淤积的过程原因。', explanation: '库区及上游河道变化与来水来沙、库水位和泄流方式共同相关。' },
        { id: 'reassess-water-sediment-process', text: '复核水沙规律、库区演变与上游影响，并据此调整运行和改建方案。', stars: 3, metricChanges: { floodSafety: 4, sedimentControl: 6, ecologicalStability: 2, engineeringBenefit: 2 }, feedback: '你把问题转化为重新认识规律的起点。', explanation: '三门峡的运行演变表明，面对复杂系统需要在实践中修正工程方案。' },
      ],
    },
    {
      id: 'sanmenxia-clear-water-turbid-discharge',
      scenario: '汛期水沙集中，非汛期则水清沙少，工程需要确定年度运行节奏。',
      questionText: '哪种运行思路更符合“蓄清排浑”？',
      options: [
        { id: 'store-all-year', text: '全年维持高水位，尽可能把来沙长期拦在库内。', stars: 1, metricChanges: { floodSafety: -3, sedimentControl: -6, ecologicalStability: -1, engineeringBenefit: 2 }, feedback: '持续拦沙会加重库区冲淤矛盾。', explanation: '三门峡早期“蓄水拦沙”的实践暴露了长期单向拦沙的局限。' },
        { id: 'drain-all-year', text: '全年低水位敞泄，不再利用清水期蓄水兴利。', stars: 2, metricChanges: { floodSafety: 1, sedimentControl: 4, ecologicalStability: -1, engineeringBenefit: -3 }, feedback: '排沙能力有所提升，但综合兴利空间被过度压缩。', explanation: '治理并非只追求排沙，还需要在不同季节统筹防洪、供水和工程效益。' },
        { id: 'store-clear-release-turbid', text: '非汛期蓄清水兴利，汛期降低水位泄洪排沙，并随监测调整。', stars: 3, metricChanges: { floodSafety: 5, sedimentControl: 7, ecologicalStability: 2, engineeringBenefit: 3 }, feedback: '你选择了顺应季节水沙差异的运行方式。', explanation: '“蓄清排浑”是在认识黄河水沙季节规律基础上形成的适应性调度方法。' },
      ],
    },
    {
      id: 'sanmenxia-discharge-capacity-upgrade',
      scenario: '评估显示现有泄流排沙能力不足，库区冲淤关系难以改善。',
      questionText: '工程改建应优先遵循什么原则？',
      options: [
        { id: 'add-structures-without-analysis', text: '只要增加设施数量即可，不必核对其对水沙过程的作用。', stars: 1, metricChanges: { floodSafety: 0, sedimentControl: -3, ecologicalStability: -1, engineeringBenefit: -2 }, feedback: '新增工程量不等于解决关键机制。', explanation: '改建应针对泄流、排沙和库区演变之间的具体关系提出措施。' },
        { id: 'preserve-original-design', text: '为避免成本，坚持原有布置，不再调整泄流排沙设施。', stars: 2, metricChanges: { floodSafety: -1, sedimentControl: -2, ecologicalStability: 0, engineeringBenefit: 1 }, feedback: '维持既有方案降低了短期成本，却保留了长期风险。', explanation: '复杂工程需要随着认识深化进行必要改建，而不是将初始设计绝对化。' },
        { id: 'targeted-outlet-upgrade', text: '依据监测与试验，针对性提升泄流排沙能力，并验证改建后的过程效果。', stars: 3, metricChanges: { floodSafety: 4, sedimentControl: 6, ecologicalStability: 2, engineeringBenefit: 2 }, feedback: '你让工程改建服务于可验证的水沙调控目标。', explanation: '三门峡通过增建排沙设施、调整底孔等方式逐步提升了泄流排沙能力。' },
      ],
    },
    {
      id: 'sanmenxia-upstream-river-risk',
      scenario: '上游支流河口附近水位抬升，库区回水与泥沙淤积可能影响周边安全。',
      questionText: '处理这一风险时应采取哪种视角？',
      options: [
        { id: 'focus-on-dam-only', text: '只检查大坝本体安全，不评估上游河道和区域响应。', stars: 1, metricChanges: { floodSafety: -5, sedimentControl: -2, ecologicalStability: -1, engineeringBenefit: 1 }, feedback: '工程安全被片面理解，风险范围被低估。', explanation: '水库运行会影响库区与上游河道，需要把工程和河流空间作为整体观察。' },
        { id: 'temporary-local-protection', text: '只在受影响河段临时加固，暂不调整运行过程。', stars: 2, metricChanges: { floodSafety: 2, sedimentControl: 0, ecologicalStability: -1, engineeringBenefit: -1 }, feedback: '局部防护有用，但难以替代源头过程管理。', explanation: '防护措施需要与水位、泄流和泥沙调控协同，避免风险在系统中转移。' },
        { id: 'basin-scale-risk-response', text: '联合评估库区、上游河道和受影响区域，调整运行并配合必要的防护措施。', stars: 3, metricChanges: { floodSafety: 6, sedimentControl: 3, ecologicalStability: 2, engineeringBenefit: 2 }, feedback: '你将局部风险放回了流域过程之中。', explanation: '三门峡的经验说明，工程决策需要同时关注库区冲淤、上游河道和区域安全。' },
      ],
    },
    {
      id: 'sanmenxia-joint-scheduling',
      scenario: '小浪底准备开展调水调沙，三门峡可通过泄流形成有利的上游来水过程。',
      questionText: '三门峡应如何参与联合调度？',
      options: [
        { id: 'operate-in-isolation', text: '只根据本库发电和蓄水需要运行，不参与下游过程安排。', stars: 1, metricChanges: { floodSafety: 0, sedimentControl: -5, ecologicalStability: -1, engineeringBenefit: 1 }, feedback: '单库目标得到维持，但协同水动力没有形成。', explanation: '三门峡是小浪底调水调沙链条的重要上游节点，需承担承上启下的功能。' },
        { id: 'release-at-maximum', text: '持续按最大能力泄流，不与下游过程和河道承受能力匹配。', stars: 2, metricChanges: { floodSafety: -1, sedimentControl: 4, ecologicalStability: -2, engineeringBenefit: 0 }, feedback: '水动力增强，但过程失去节奏可能造成新的风险。', explanation: '联合调度的关键在于时序、流量与各节点约束的匹配。' },
        { id: 'coordinate-with-xiaolangdi', text: '与小浪底及相关水库共享监测和预报，按统一时序组织来水与泄流。', stars: 3, metricChanges: { floodSafety: 4, sedimentControl: 7, ecologicalStability: 2, engineeringBenefit: 3 }, feedback: '你让工程从单点运行进入了协同网络。', explanation: '三门峡适时泄流可为小浪底形成水沙过程提供关键动力，是联合调度的重要环节。' },
      ],
    },
    {
      id: 'sanmenxia-ecological-constraint',
      scenario: '排沙过程可能改变河道流量与水体条件，相关生态响应需要被纳入决策。',
      questionText: '生态条件应如何处理？',
      options: [
        { id: 'ignore-ecological-response', text: '只考核排沙量和发电量，生态影响之后再讨论。', stars: 1, metricChanges: { floodSafety: 1, sedimentControl: 2, ecologicalStability: -6, engineeringBenefit: 3 }, feedback: '工程指标集中，但生态稳定性承受了代价。', explanation: '水沙调控会影响河道和库区生态，需要在运行中设置必要的生态边界。' },
        { id: 'stop-all-operations', text: '为避免生态扰动，停止所有排沙和调度操作。', stars: 2, metricChanges: { floodSafety: -1, sedimentControl: -3, ecologicalStability: 4, engineeringBenefit: -2 }, feedback: '减少了短期扰动，但也失去了主动治理的能力。', explanation: '生态保护需要融入方案设计，而不是简单否定所有工程调控。' },
        { id: 'monitor-and-set-boundaries', text: '跟踪生态响应，设置流量与过程约束，在排沙、防洪和生态之间动态优化。', stars: 3, metricChanges: { floodSafety: 3, sedimentControl: 4, ecologicalStability: 6, engineeringBenefit: 2 }, feedback: '你把生态响应转化为运行边界，而非事后补救。', explanation: '人水和谐依赖持续监测和多目标权衡，使工程运行与河流生态共同保持韧性。' },
      ],
    },
    {
      id: 'sanmenxia-learning-from-practice',
      scenario: '一次调度结果与模型预测不完全一致，团队需要决定下一轮方案是否修正。',
      questionText: '哪种做法最能体现三门峡的“探路”价值？',
      options: [
        { id: 'hide-unexpected-result', text: '不记录偏差，继续沿用原方案以保持表面稳定。', stars: 1, metricChanges: { floodSafety: -2, sedimentControl: -2, ecologicalStability: -1, engineeringBenefit: 0 }, feedback: '回避偏差会阻断认识提升。', explanation: '复杂河流治理需要正视不确定性，将运行结果转化为下一轮决策的信息。' },
        { id: 'change-without-review', text: '立即凭经验大幅改变方案，不复盘原因也不验证效果。', stars: 2, metricChanges: { floodSafety: 0, sedimentControl: 1, ecologicalStability: -1, engineeringBenefit: 0 }, feedback: '行动很快，但缺乏可积累的科学依据。', explanation: '适应性调整应建立在监测、分析、验证和再优化的闭环之上。' },
        { id: 'review-test-and-improve', text: '复盘监测数据与模型假设，形成小范围验证后再迭代下一轮调度。', stars: 3, metricChanges: { floodSafety: 4, sedimentControl: 4, ecologicalStability: 3, engineeringBenefit: 2 }, feedback: '你把一次偏差转化成了系统学习的机会。', explanation: '三门峡由“拦”到“排”的演进，正体现了在实践中求真知、持续改进的治理精神。' },
      ],
    },
  ],
};

export { sanmenxiaQuestionLevel };
