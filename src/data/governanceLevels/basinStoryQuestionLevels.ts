import type { GovernanceQuestionLevelConfig } from '@/types/governanceLevel';

const emptyMetrics = { floodSafety: 50, sedimentControl: 50, ecologicalStability: 50, engineeringBenefit: 50 } as const;

function createStoryLevel(levelId: string, basinId: GovernanceQuestionLevelConfig['basinId'], title: string): GovernanceQuestionLevelConfig {
  return {
    levelId,
    basinId,
    title,
    description: '本关使用视频后小澜互动完成，不进入旧版多题治理关卡。',
    initialMetrics: emptyMetrics,
    evaluation: { title, description: '首次完成后记入当前浏览器的治理星级。' },
    questions: [{
      id: `${levelId}-story`,
      scenario: '互动入口由流域叙事页面承接。',
      questionText: '请在叙事页面完成互动。',
      options: [{ id: 'story-complete', text: '完成互动', stars: 3, metricChanges: emptyMetrics, feedback: '互动由页面内小澜对话呈现。', explanation: '此配置用于治理星级归集。' }],
    }],
  };
}

const basinStoryQuestionLevels = [
  createStoryLevel('yangtze-species-recognition', 'yangtze-river', '长江：认识江中生命'),
  createStoryLevel('yangtze-cascade-dispatch', 'yangtze-river', '长江：梯级联合调度'),
  createStoryLevel('pearl-salt-tide-response', 'pearl-river', '珠江：压咸补淡'),
  createStoryLevel('pearl-maozhou-governance', 'pearl-river', '珠江：茅洲河治理'),
  createStoryLevel('pearl-dolphin-protection', 'pearl-river', '珠江：守护白海豚'),
];

export { basinStoryQuestionLevels };
