import type { GovernanceMetricValues, GovernanceQuestionLevelConfig } from '@/types/governanceLevel';

import { createGlobalWaterDecisionOptions } from './globalWaterQuestionOptions';

// PDF 第三章·走出国门 第 5 站·共管水（澜湄六国上下两题）：
//   上半题（题 29）：跨境水情信息共享 / 提前预警 / 联合值班（三选 ABC 正确）
//   下半题（题 30）：枯水期水量分配高潮综合题（全选 ABCD 正确）

const initialMetrics: GovernanceMetricValues = { floodSafety: 50, sedimentControl: 50, ecologicalStability: 50, engineeringBenefit: 50 };
const explainSharedMonitoring = '澜湄流域跨越中国、缅甸、老挝、泰国、柬埔寨、越南六国，洪水与枯水都不分国界；只有共享水文数据、提前预警、汛期联合值班，才能让上下游都赢得应对时间。';
const explainJointAllocation = '跨境流域枯水期的水量分配远不止"按比例分水"，还需配套生态保护、生态补偿与联合调水设施；只有分水、共护、补偿、调水四件事一起做，跨境河流才能让六国都受益。';

const lancangMekongSharedMonitoring: GovernanceQuestionLevelConfig = {
  basinId: 'global-water',
  levelId: 'mekong-shared-monitoring',
  title: '澜湄六国（上）：让洪水能提前被看见',
  description: '围绕跨境水情信息共享、提前预警与汛期联合值班，完成一次核心判断。',
  initialMetrics,
  evaluation: {
    title: '信息共享、提前预警、联合值班',
    description: '澜湄跨境水情的核心启示：水情信息跨越国界，必须依靠共享平台、提前预警与汛期联合值班，让上下游都赢得应对时间。',
  },
  questions: [
    {
      id: 'mekong-shared-platform',
      scenario: '上游下了大暴雨，可下游还蒙在鼓里，等洪水冲到家门口已经来不及了。',
      questionText: '你觉得该怎么解决这个信息不通的问题？',
      options: createGlobalWaterDecisionOptions(
        '建共享的水文监测平台，上下游水情数据互通',
        '上游要泄洪了，提前发通知给下游，留足应对时间',
        '汛期各国联合值班，一起盯着整条河的水情',
        explainSharedMonitoring,
      ),
    },
  ],
};

const lancangMekongJointAllocation: GovernanceQuestionLevelConfig = {
  basinId: 'global-water',
  levelId: 'mekong-joint-allocation',
  title: '澜湄六国（下）：枯水期让六国都受益',
  description: '在跨境枯水期水量分配的高潮综合题上，完成一次核心判断。',
  initialMetrics,
  evaluation: {
    title: '协商分水 + 共护生态 + 生态补偿 + 联合调水',
    description: '澜湄枯水期的核心启示：跨境水量分配是系统工程，必须把分水、共护、补偿、调水四件事一起做，单一动作无法让六国都受益。',
  },
  questions: [
    {
      id: 'mekong-allocation-negotiation',
      scenario: '到了枯水期，水不够用了。上游要灌溉农田、下游要喝水、城市要用水、河里的鱼也要水活下去。六个国家都等着用水。',
      questionText: '你觉得下面哪些做法能让大家都受益？',
      options: createGlobalWaterDecisionOptions(
        '枯水期六国坐下来协商，合理分配整条河的水量',
        '联合保护流域生态，不让污染从上游流到下游',
        '建立生态补偿机制，保护水源好的国家能得到补偿',
        explainJointAllocation,
      ),
    },
  ],
};

export { lancangMekongJointAllocation, lancangMekongSharedMonitoring };