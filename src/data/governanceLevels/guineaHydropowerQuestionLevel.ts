import type { GovernanceMetricValues, GovernanceQuestionLevelConfig } from '@/types/governanceLevel';

import { createGlobalWaterDecisionOptions } from './globalWaterQuestionOptions';

// PDF 第三章·走出国门 第 3 站·利用水：几内亚河谷水电站
// PDF 原题（题 27）：全选（ABCD 都正确）—— 发电 + 留生态水 + 架输电线 + 帮鱼繁殖
// 沿用现有 3 选 1 星星制：low=只发电 / middle=发电+生态 / high=发电+生态+输电+鱼繁殖（system-coordination）

const initialMetrics: GovernanceMetricValues = { floodSafety: 50, sedimentControl: 50, ecologicalStability: 50, engineeringBenefit: 50 };
const explain = '几内亚河谷水电站与长江三峡思路一致：发电只是工程目标的一部分，必须同时为下游生态、输电通道和鱼类繁殖保留必要的水文与生态条件。';

const guineaHydropowerQuestionLevel: GovernanceQuestionLevelConfig = {
  basinId: 'global-water',
  levelId: 'guinea-hydropower',
  title: '几内亚河谷：水电开发要顾到下游与生态',
  description: '在河谷峡谷完成一次核心判断，把发电与生态、输电、鱼类繁殖同时纳入工程目标。',
  initialMetrics,
  evaluation: {
    title: '发电 + 生态 + 输电 + 鱼类协同',
    description: '几内亚水电开发的核心启示：水电开发是系统协调工程，单一"截水发电"思路无法长期兼顾发电、生态与社区用电。',
  },
  questions: [
    {
      id: 'guinea-hydropower-core',
      scenario: '河谷里河水从高处往低处流，可旁边的村子一到晚上就黑灯瞎火——他们没有电。你是中国来的水利专家，打算帮他们修一座水电站。',
      questionText: '修这座电站，下面哪些事得同时考虑到？',
      options: createGlobalWaterDecisionOptions(
        '借着河道落差发电，把电送到村子里',
        '大坝不能把水全截干，得给下游留够生态用水',
        '配套架好输电线路，电发出来得送得出去',
        explain,
      ),
    },
  ],
};

export { guineaHydropowerQuestionLevel };