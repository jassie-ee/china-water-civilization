import type { GovernanceMetricValues, GovernanceQuestionLevelConfig } from '@/types/governanceLevel';

import { createGlobalWaterDecisionOptions } from './globalWaterQuestionOptions';

// PDF 第三章·走出国门 第 5 站·共管水（澜湄六国上下两题）：
//   上半题（题 29）：跨境水情信息共享 / 提前预警 / 联合值班（三选 ABC 正确，D 不符合跨境共治）
//   下半题（题 30）：枯水期水量分配高潮综合题（全选 ABCD 正确）

const initialMetrics: GovernanceMetricValues = { floodSafety: 50, sedimentControl: 50, ecologicalStability: 50, engineeringBenefit: 50 };
const explainSharedMonitoring = '澜湄流域跨越中国、缅甸、老挝、泰国、柬埔寨、越南六国，洪水与枯水都不分国界；只有共享水文数据、提前预警、汛期联合值班，才能让上下游都赢得应对时间。';
const explainJointAllocation = '跨境流域枯水期的水量分配远不止"按比例分水"，还需配套生态保护、生态补偿与联合调水设施；只有分水、共护、补偿、调水四件事一起做，跨境河流才能让六国都受益。';

const lancangMekongSharedMonitoring: GovernanceQuestionLevelConfig = {
  basinId: 'global-water',
  levelId: 'mekong-shared-monitoring',
  title: '澜湄六国（上）：让洪水能提前被看见',
  description: '围绕跨境水情信息共享、提前预警与汛期联合值班，完成两次连续判断。',
  initialMetrics,
  evaluation: {
    title: '信息共享、提前预警、联合值班',
    description: '澜湄跨境水情的核心启示：水情信息跨越国界，必须依靠共享平台、提前预警与汛期联合值班，让上下游都赢得应对时间。',
  },
  questions: [
    {
      id: 'mekong-shared-platform',
      scenario: '上游暴雨形成的洪峰，下游常常来不及反应就被冲到。',
      questionText: '面向跨境水情，六个国家之间最需要建立的机制是？',
      options: createGlobalWaterDecisionOptions(
        '让上游单方面监测，下游自行估算',
        '让六个国家各自保留水情数据，互不分享',
        '建立共享的水文监测平台，让上下游水情数据互通，作为跨境共治的基础设施',
        explainSharedMonitoring,
      ),
    },
    {
      id: 'mekong-joint-duty',
      scenario: '若信息通道已建立，下一步应把跨境水情怎么用起来？',
      questionText: '为什么"汛期各国联合值班"是信息共享之后的关键动作？',
      options: createGlobalWaterDecisionOptions(
        '汛期水量集中由上游国家单独处置即可',
        '下游国家无需了解上游情况，自行判断即可',
        '汛期由六国联合值班、共同盯防整条河的水情变化，把共享数据转化为统一的应对行动',
        explainSharedMonitoring,
      ),
    },
  ],
};

const lancangMekongJointAllocation: GovernanceQuestionLevelConfig = {
  basinId: 'global-water',
  levelId: 'mekong-joint-allocation',
  title: '澜湄六国（下）：枯水期让六国都受益',
  description: '在跨境枯水期水量分配的高潮综合题上，把分水、共护、补偿、调水四件事一起纳入决策。',
  initialMetrics,
  evaluation: {
    title: '协商分水 + 共护生态 + 生态补偿 + 联合调水',
    description: '澜湄枯水期的核心启示：跨境水量分配是系统工程，必须把分水、共护、补偿、调水四件事一起做，单一动作无法让六国都受益。',
  },
  questions: [
    {
      id: 'mekong-allocation-negotiation',
      scenario: '枯水期六国同时面临灌溉、饮水、城市与生态用水压力。',
      questionText: '面向跨境枯水期，最稳妥的分配机制是什么？',
      options: createGlobalWaterDecisionOptions(
        '由水量最多的国家单方面决定分配比例',
        '按照历史用量比例沿用即可，无需重新协商',
        '由六国在枯水期共同协商，结合生态基流与各方用水需求，重新形成均衡的水量分配方案',
        explainJointAllocation,
      ),
    },
    {
      id: 'mekong-allocation-ecosystem',
      scenario: '即使分水方案达成共识，水质污染仍可能跨境传递。',
      questionText: '为什么"联合保护流域生态"应与分水方案同步推进？',
      options: createGlobalWaterDecisionOptions(
        '分水与生态无关，可分开推进',
        '生态保护只需在上游单方面执行即可',
        '跨境污染一旦发生，下游无法独善其身；只有六国共同保护流域生态，才能让分水的总量与质量都可持续',
        explainJointAllocation,
      ),
    },
    {
      id: 'mekong-allocation-compensation',
      scenario: '上游国家保护水源用地会牺牲部分开发机会。',
      questionText: '为什么要建立"生态补偿机制"？',
      options: createGlobalWaterDecisionOptions(
        '生态补偿会激化上下游矛盾，应避免',
        '上游保护水源是天然义务，无需补偿',
        '对保护水源地上游国家进行生态补偿，体现"谁保护、谁受益"的公平原则，可让保护行动长期可持续',
        explainJointAllocation,
      ),
    },
    {
      id: 'mekong-allocation-joint-infrastructure',
      scenario: '单纯分水难以应对跨年度丰枯差异。',
      questionText: '为什么"联合建设水利设施"是分水方案的重要补充？',
      options: createGlobalWaterDecisionOptions(
        '联合设施会让上游失去水资源控制权',
        '跨境水量已经充足，无需更多设施',
        '联合建设水利设施可在丰枯年间调节整条河的水量，让分水方案具备跨时间尺度的弹性',
        explainJointAllocation,
      ),
    },
  ],
};

export { lancangMekongJointAllocation, lancangMekongSharedMonitoring };