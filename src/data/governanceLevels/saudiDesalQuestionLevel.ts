import type { GovernanceMetricValues, GovernanceQuestionLevelConfig } from '@/types/governanceLevel';

import { createGlobalWaterDecisionOptions } from './globalWaterQuestionOptions';

// PDF 第三章·走出国门 第 1 站·获取水：沙特红海新城海水淡化
// PDF 原题（题 25）：单选（A 正确）—— 选 A 海水淡化 / B 打深井 / C 跨境输水
// 沿用现有 3 选 1 星星制：low=B 跨境输水 / middle=C 深井 / high=A 海水淡化（system-coordination）

const initialMetrics: GovernanceMetricValues = { floodSafety: 50, sedimentControl: 50, ecologicalStability: 50, engineeringBenefit: 50 };
const explain = '沙特红海新城地处热带荒漠，没有地表径流可供利用；海水淡化以稳定、清洁、就近的方式满足城市与生态用水，是当地最可持续的水源方案。';

const saudiDesalQuestionLevel: GovernanceQuestionLevelConfig = {
  basinId: 'global-water',
  levelId: 'saudi-desal',
  title: '沙特红海新城：从海水里要淡水',
  description: '在热带荒漠与红海之间完成一次核心判断，为沙漠新城选择长期水源。',
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
        '建海水淡化厂，把红海的水过滤成淡水',
        '到处打深井，把地下的水抽上来用',
        '从邻国修一条长长的输水管，买水用',
        explain,
      ),
    },
  ],
};

export { saudiDesalQuestionLevel };