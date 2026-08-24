import type { GovernanceMetricValues, GovernanceQuestionLevelConfig } from '@/types/governanceLevel';

import { createGlobalWaterDecisionOptions } from './globalWaterQuestionOptions';

// PDF 第三章·走出国门 第 3 站·利用水：几内亚河谷水电站
// PDF 原题：全选（ABCD 都正确）— 发电、留生态水、架输电线、帮鱼繁殖

const initialMetrics: GovernanceMetricValues = { floodSafety: 50, sedimentControl: 50, ecologicalStability: 50, engineeringBenefit: 50 };
const explain = '几内亚河谷水电站与长江三峡思路一致：发电只是工程目标的一部分，必须同时为下游生态、输电通道和鱼类繁殖保留必要的水文与生态条件。';

const guineaHydropowerQuestionLevel: GovernanceQuestionLevelConfig = {
  basinId: 'global-water',
  levelId: 'guinea-hydropower',
  title: '几内亚河谷：水电开发要顾到下游与生态',
  description: '在河谷峡谷完成四次连续判断，把发电与生态、输电、鱼类繁殖同时纳入工程目标。',
  initialMetrics,
  evaluation: {
    title: '发电 + 生态 + 输电 + 鱼类协同',
    description: '几内亚水电开发的核心启示：水电开发是系统协调工程，单一"截水发电"思路无法长期兼顾发电、生态与社区用电。',
  },
  questions: [
    {
      id: 'guinea-hydropower-core',
      scenario: '几内亚河谷上下游村庄长期缺电，但河流仍是下游生计与生态的基础。',
      questionText: '一座合格的水电工程，最少应同时兼顾哪些目标？',
      options: createGlobalWaterDecisionOptions(
        '只追求发电量，最大化单一时段出力',
        '发电 + 输电两项任务，暂不考虑生态',
        '发电 + 下游生态用水 + 输电线路 + 鱼类繁殖期生态调度四项协同，缺一不可',
        explain,
      ),
    },
    {
      id: 'guinea-hydropower-ecological-flow',
      scenario: '若电站把水全截用于发电，下游会出现什么风险？',
      questionText: '为什么大坝必须为下游保留生态用水？',
      options: createGlobalWaterDecisionOptions(
        '下游水量减少对生态影响不大，可以忽略',
        '下游生态用水应通过额外工程补偿，电站本身不预留',
        '下游生态用水保障河岸植被、鱼类洄游与社区取水，是水电工程对河流水文过程的基本尊重；缺少生态基流将导致下游生态系统退化',
        explain,
      ),
    },
    {
      id: 'guinea-hydropower-grid',
      scenario: '电站建成后发出的电如何送达周边村庄？',
      questionText: '为什么"配套架好输电线路"必须与电站同步规划？',
      options: createGlobalWaterDecisionOptions(
        '电发出来自然会点亮周围，无需额外输电投入',
        '输电线路可推迟到电站投运之后再考虑',
        '没有输电线路，发电量无法转化为实际供电；输电通道必须与电站同步规划与建设',
        explain,
      ),
    },
    {
      id: 'guinea-hydropower-fish',
      scenario: '电站改变了河流水文节律，可能影响鱼类繁殖。',
      questionText: '为什么电站需考虑"鱼类繁殖期调整放水时间"？',
      options: createGlobalWaterDecisionOptions(
        '鱼类繁殖完全是自然过程，与电站调度无关',
        '电站只需满足发电曲线，无需考虑鱼类繁殖期',
        '鱼类繁殖期需要稳定的水位与流量节律；通过调度放水时间错开繁殖关键期，可降低水电开发对鱼类种群的冲击',
        explain,
      ),
    },
  ],
};

export { guineaHydropowerQuestionLevel };