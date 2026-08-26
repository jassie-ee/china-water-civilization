import type { GovernanceMetricValues, GovernanceQuestionLevelConfig } from '@/types/governanceLevel';

import { createGlobalWaterDecisionOptions } from './globalWaterQuestionOptions';

// PDF 第三章·走出国门 第 4 站·净化水：赤道几内亚沿岸小镇污水治理
// PDF 原题（题 28）：三选（ABC 正确，D 大规模清淤时机不对——污染源未截时清淤等于白做）
// 沿用现有 3 选 1 星星制：low=先大规模清淤 / middle=先截污管网 / high=截污+模块化净水+湿地生态（system-coordination）

const initialMetrics: GovernanceMetricValues = { floodSafety: 50, sedimentControl: 50, ecologicalStability: 50, engineeringBenefit: 50 };
const explain = '赤道几内亚沿岸小镇资金有限，治水必须把"先截污、再达标、最后生态兜底"的次序摆对；若先大规模清淤但污水仍在排，清完很快又会淤回去，等于白花钱。';

const equatorialGuineaSewageQuestionLevel: GovernanceQuestionLevelConfig = {
  basinId: 'global-water',
  levelId: 'equatorial-guinea-sewage',
  title: '赤道几内亚沿岸小镇：把治水次序摆对',
  description: '在资金有限的小镇完成一次核心判断，把有限的资金优先投到污染源头与达标环节。',
  initialMetrics,
  evaluation: {
    title: '先截污、再达标、最后生态兜底',
    description: '赤道几内亚污水治理的核心启示：治水必须按"源—过程—末端"的次序分配资源，跳过源头而先做末端清淤，只会反复浪费资金。',
  },
  questions: [
    {
      id: 'equatorial-guinea-sewage-priority',
      scenario: '沿岸小镇黑臭河道直流入海，治理资金不足以一次性做完全部环节。',
      questionText: '资金有限时，下面哪些措施应该优先做？',
      options: createGlobalWaterDecisionOptions(
        '先铺截污管网，把散排的污水统一收集起来',
        '配模块化小型净水设备，污水达标后再排放',
        '河口滩涂种红树、建人工湿地，做最后一道生态净化',
        explain,
      ),
    },
  ],
};

export { equatorialGuineaSewageQuestionLevel };