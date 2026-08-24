import type { GovernanceMetricValues, GovernanceQuestionLevelConfig } from '@/types/governanceLevel';

import { createGlobalWaterDecisionOptions } from './globalWaterQuestionOptions';

// PDF 第三章·走出国门 第 2 站·调节水：巴基斯坦印度河水利枢纽
// PDF 原题（题 26）：三选（ABC 正确，D 网箱养鱼看似合理但造成水体污染）
// 沿用现有 3 选 1 星星制：low=只供水 / middle=防洪+供水 / high=防洪+供水+发电（system-coordination）

const initialMetrics: GovernanceMetricValues = { floodSafety: 50, sedimentControl: 50, ecologicalStability: 50, engineeringBenefit: 50 };
const explain = '巴基斯坦印度河洪水与枯水季节差异极大，水利枢纽应承担防洪、供水与发电三大主责，把洪水转化为旱季可用资源；库区网箱养鱼易污染水质，与枢纽核心功能冲突，不应纳入主责清单。';

const pakistanDamQuestionLevel: GovernanceQuestionLevelConfig = {
  basinId: 'global-water',
  levelId: 'pakistan-dam',
  title: '巴基斯坦印度河：把洪水变成旱季的资源',
  description: '在印度河干支流完成一次核心判断，明确一座枢纽真正应承担的核心职责。',
  initialMetrics,
  evaluation: {
    title: '立足主责、把洪水调成资源',
    description: '巴基斯坦水利枢纽的关键启示：工程主责须围绕防洪、供水、发电展开；与水质相冲突的高密度养殖不应纳入枢纽核心任务。',
  },
  questions: [
    {
      id: 'pakistan-dam-core',
      scenario: '印度河季节性水量极不均匀：夏汛洪水冲毁村庄，冬旱河道见底、农田无水可灌。',
      questionText: '面向这种"两极化"来水，枢纽最核心的三项任务应是？',
      options: createGlobalWaterDecisionOptions(
        '雨季把多余的洪水存进水库，别让它乱冲',
        '旱季把存的水放出来，浇地、供水',
        '借着水位落差发电，给周边村子供电',
        explain,
      ),
    },
  ],
};

export { pakistanDamQuestionLevel };