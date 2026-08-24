import type { GovernanceMetricValues, GovernanceQuestionLevelConfig } from '@/types/governanceLevel';

import { createCosmicOpenOptions } from './cosmicQuestionOptions';

// PDF 第四章·天地人和：宇宙共生哲思开放题
// PDF 原题：三个选项均可，无标准答案（"成立 / 不一定 / 不好说"都接受）

const initialMetrics: GovernanceMetricValues = { floodSafety: 50, sedimentControl: 50, ecologicalStability: 50, engineeringBenefit: 50 };

const cosmicSymbiosisQuestionLevel: GovernanceQuestionLevelConfig = {
  basinId: 'cosmic',
  levelId: 'cosmic-symbiosis',
  title: '宇宙共生：地球的道理放到星河还成立吗？',
  description: '从地球出发望向宇宙水脉，把地球治水的核心智慧放进开放思辨题。',
  initialMetrics,
  evaluation: {
    title: '敬畏水、尊重规律',
    description: '宇宙共生思辨题的核心启示：地球水治理的智慧不在征服、而在敬畏；无论外星水环境如何变化，"和水好好相处"的态度是共通的答案。',
  },
  questions: [
    {
      id: 'cosmic-wisdom-transferable',
      scenario: '彗星上的冰、木星冰层下的海、火星深处的远古水脉，宇宙遍布水的痕迹。',
      questionText: '地球治水"和水好好相处"的核心智慧，放到浩瀚宇宙中，是否仍然成立？',
      options: createCosmicOpenOptions(),
    },
    {
      id: 'cosmic-attitude',
      scenario: '若你有机会在未来真正站上外星的水环境，你最想先问自己的问题是什么？',
      questionText: '请用一句话写下你最想先问自己的那个问题（不评分，只记录）。',
      options: createCosmicOpenOptions(),
    },
  ],
};

export { cosmicSymbiosisQuestionLevel };