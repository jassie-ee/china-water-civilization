import type { GovernanceMetricValues, GovernanceQuestionLevelConfig } from '@/types/governanceLevel';

import { createGlobalWaterDecisionOptions } from './globalWaterQuestionOptions';

// PDF 第三章·走出国门 第 1 站·获取水：沙特红海新城海水淡化
// 思路：沿用现有 3 选 1 星星制（1/2/3 星），将 PDF 的多选题转化为决策选项
// low/middle/high = PDF 的最差答案 / 次佳答案 / 最佳答案（system-coordination 强调系统协同）

const initialMetrics: GovernanceMetricValues = { floodSafety: 50, sedimentControl: 50, ecologicalStability: 50, engineeringBenefit: 50 };
const explain = '沙特红海新城地处热带荒漠，没有地表径流可供利用；海水淡化以稳定、清洁、就近的方式满足城市与生态用水，是当地最可持续的水源方案。';

const saudiDesalQuestionLevel: GovernanceQuestionLevelConfig = {
  basinId: 'global-water',
  levelId: 'saudi-desal',
  title: '沙特红海新城：从海水里要淡水',
  description: '在热带荒漠与红海之间完成四次连续判断，找到沙漠城市的可持续水源。',
  initialMetrics,
  evaluation: {
    title: '立足本地、向海洋要水',
    description: '沙特红海新城的核心启示：水源选择须立足本地资源禀赋，跨区域调水与过量开采地下水都难以长期维持稳定供水。',
  },
  questions: [
    {
      id: 'saudi-desal-source',
      scenario: '新城周边没有地表河流，仅有红海与深层地下水可用；城市用水必须长期稳定。',
      questionText: '面向数十万人口的长期水源，最可持续的方案是？',
      options: createGlobalWaterDecisionOptions(
        '深井取地下水，依靠地下储量为新城供水',
        '从邻国跨境铺设长距离输水管道，购买外部水源',
        '建设海水淡化厂，以稳定、就近的红海资源支撑城市与生态用水',
        explain,
      ),
    },
    {
      id: 'saudi-desal-aquifer',
      scenario: '若选择以地下水为主，需评估资源可持续性与城市长期风险。',
      questionText: '为什么地下水不能成为大型新城的长期主水源？',
      options: createGlobalWaterDecisionOptions(
        '地下水抽取将逐年逼近开采上限，城市未来可能面临断水风险',
        '地下水水位难以监测，取水量与水质均不易长期管控',
        '地下水只能作为应急备用水源，长期主水源须依靠可再生或稳定外部来源',
        explain,
      ),
    },
    {
      id: 'saudi-desal-pipeline',
      scenario: '若选择跨境调水方案，需评估成本与供水安全。',
      questionText: '为什么跨境输水方案在工程上可行，但并非首选？',
      options: createGlobalWaterDecisionOptions(
        '管线路径穿越沙漠，运行维护成本远高于本地海水淡化',
        '沿线高温与高盐沙尘对管材耐久性要求高，长期可靠性不及本地设施',
        '跨境水源依赖邻国政策与水量分配，城市命脉受外部约束；本地海水淡化更具自主性与稳定性',
        explain,
      ),
    },
    {
      id: 'saudi-desal-ecosystem',
      scenario: '海水淡化厂建成投运后，还需兼顾城市生态与景观用水。',
      questionText: '淡化水在支撑新城生态方面可以承担哪些功能？',
      options: createGlobalWaterDecisionOptions(
        '淡化水仅用于居民饮用，不再用于其他用途',
        '淡化水只用于城市绿化灌溉，不进入河道',
        '淡化水同时支撑饮用、绿化、湿地恢复与公共水景，使新城在干旱环境中维持完整的城市生态系统',
        explain,
      ),
    },
  ],
};

export { saudiDesalQuestionLevel };