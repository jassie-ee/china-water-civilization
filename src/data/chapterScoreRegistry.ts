export const chapterScoreGroups = {
  zhi: {
    label: '治',
    title: '第二章 · 现代江河治理',
    levelIds: [
      'loess-plateau',
      'xiaolangdi',
      'yangtze-cascade-dispatch',
      'yangtze-species-recognition',
      'pearl-salt-tide-response',
      'pearl-maozhou-governance',
      'pearl-dolphin-protection',
    ],
  },
  hang: {
    label: '航',
    title: '第三章 · 同舟共济',
    levelIds: [
      'chapter-3-local-survey',
      'chapter-3-red-sea-desalination',
      'chapter-3-karot-hub',
      'chapter-3-guinea-hydropower',
      'chapter-3-equatorial-cleanup',
      'chapter-3-mekong-sharing',
      'chapter-3-mekong-allocation',
    ],
  },
  wang: {
    label: '望',
    title: '第四章 · 天地人和',
    levelIds: ['chapter-4-final-awakening'],
  },
} as const;

export type ChapterScoreGroupId = keyof typeof chapterScoreGroups;

export const allChapterScoreLevelIds = new Set(
  Object.values(chapterScoreGroups).flatMap((group) => group.levelIds),
);
