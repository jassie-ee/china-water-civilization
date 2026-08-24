import type { GovernanceMetricValues, GovernanceQuestionLevelConfig } from '@/types/governanceLevel';

import { createGlobalWaterDecisionOptions } from './globalWaterQuestionOptions';

// PDF 第三章·走出国门 第 4 站·净化水：赤道几内亚沿岸小镇污水治理
// PDF 原题：三选（ABC 正确，D 大规模清淤在污染源未截时等于白做）

const initialMetrics: GovernanceMetricValues = { floodSafety: 50, sedimentControl: 50, ecologicalStability: 50, engineeringBenefit: 50 };
const explain = '赤道几内亚沿岸小镇资金有限，治水必须把"先截污、再达标、最后生态兜底"的次序摆对；若先大规模清淤但污水仍在排，清完很快又会淤回去，等于白花钱。';

const equatorialGuineaSewageQuestionLevel: GovernanceQuestionLevelConfig = {
  basinId: 'global-water',
  levelId: 'equatorial-guinea-sewage',
  title: '赤道几内亚沿岸小镇：把治水次序摆对',
  description: '在资金有限的小镇完成四次连续判断，把有限的资金优先投到污染源头与达标环节。',
  initialMetrics,
  evaluation: {
    title: '先截污、再达标、最后生态兜底',
    description: '赤道几内亚污水治理的核心启示：治水必须按"源—过程—末端"的次序分配资源，跳过源头而先做末端清淤，只会反复浪费资金。',
  },
  questions: [
    {
      id: 'equatorial-guinea-sewage-priority',
      scenario: '沿岸小镇黑臭河道直流入海，治理资金不足以一次性做完全部环节。',
      questionText: '资金有限时，最优先应投入哪一环节？',
      options: createGlobalWaterDecisionOptions(
        '先做大规模河道清淤，把底泥挖干净',
        '先铺截污管网，把散排污水统一收集起来',
        '先在河口大规模清淤，把入海口的脏东西一次清掉',
        explain,
      ),
    },
    {
      id: 'equatorial-guinea-sewage-modular',
      scenario: '截污完成后，仍需把收集起来的污水进行处理再排放。',
      questionText: '为什么"模块化小型净水设备"比大规模集中处理更适合小镇？',
      options: createGlobalWaterDecisionOptions(
        '模块化设备无法处理任何污水',
        '模块化设备处理规模有限，效果不可靠',
        '模块化小型设备投资低、运维简单，可分阶段扩展；适合人口与污水量不集中、预算有限的小镇，比一次性大规模集中处理更稳健',
        explain,
      ),
    },
    {
      id: 'equatorial-guinea-sewage-wetland',
      scenario: '污水达标排放后，河口生态仍需做最后一道生态修复。',
      questionText: '为什么"河口种红树 + 人工湿地"应作为治水的最后一道兜底？',
      options: createGlobalWaterDecisionOptions(
        '红树林与人工湿地只起到景观作用，无法净化水质',
        '红树林与人工湿地应作为治水的第一步，与截污同时开工',
        '红树林与人工湿地能在末端进一步吸收氮磷等营养物质、稳定岸线并提供生境；作为最后一道兜底，可让治水效果持续巩固',
        explain,
      ),
    },
    {
      id: 'equatorial-guinea-sewage-dredging',
      scenario: '有人建议先投入资金做大规模河道清淤以快速见效。',
      questionText: '为什么"先大规模清淤"在污染源未截时往往白做？',
      options: createGlobalWaterDecisionOptions(
        '清淤对河道健康毫无意义，任何时候都不该做',
        '清淤应在截污之前完成，效果最佳',
        '在污水仍在直排的前提下清淤，河道很快会被新一轮泥沙与污染物重新淤积；先截污再清淤，才能让清淤效果长期维持',
        explain,
      ),
    },
  ],
};

export { equatorialGuineaSewageQuestionLevel };