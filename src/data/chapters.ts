import type { ChapterOverviewItem } from '@/types/chapter';

const chapterOverviewItems: ChapterOverviewItem[] = [
  {
    id: 'chapter-1',
    order: 1,
    markerGlyph: '源',
    title: '水有去处，人有家园',
    theme: '顺势而为',
    marker: { x: 20, y: 58, mobileX: 22, mobileY: 64, dialogueSide: 'right', dialogueVertical: 'above' },
    dialogue: [
      '我是一滴从九州江河中醒来的水。',
      '我记得流过高山、田野和村庄，却忘记了，人们最初怎样与我相处。',
      '你愿意陪我找回失落的水脉记忆吗？',
    ],
    ctaLabel: '开始探索',
    unavailableNotice: '这段水脉仍在修复中，第一章很快会与您相见。',
    status: 'preview',
  },
  {
    id: 'chapter-2',
    order: 2,
    markerGlyph: '治',
    title: '现代江河治理',
    theme: '因地制宜',
    marker: { x: 48, y: 58, mobileX: 48, mobileY: 52, dialogueSide: 'right', dialogueVertical: 'above' },
    dialogue: [
      '我已经想起，人们曾学会顺着我的方向，为我寻找去处。',
      '可当我流过更长的河流、更广的土地和更多的城市时，我发现：每一条江河，都有不同的性格。',
      '人们又该怎样与我同行？',
    ],
    ctaLabel: '开始探索',
    status: 'available',
    route: '/basins',
  },
  {
    id: 'chapter-3',
    order: 3,
    markerGlyph: '航',
    title: '中国方案与海上丝路',
    theme: '共建共享',
    marker: { x: 79, y: 54, mobileX: 77, mobileY: 65, dialogueSide: 'left', dialogueVertical: 'above' },
    dialogue: [
      '我从中国近海出发，沿着海上水路，看见了许多不同的河流和海岸。',
      '每一片土地都有不同的水；真正的共享，不是带去一套标准答案，而是一起找到当地的答案。',
      '你愿意和我一起，把这段水脉带向更远的地方吗？',
    ],
    ctaLabel: '开始探索',
    unavailableNotice: '这段水脉仍在修复中，海上丝路的旅程正在筹备。',
    status: 'preview',
  },
  {
    id: 'chapter-4',
    order: 4,
    markerGlyph: '望',
    title: '水脉向未来',
    theme: '共同家园',
    marker: { x: 86, y: 18, mobileX: 70, mobileY: 22, dialogueSide: 'left', dialogueVertical: 'below' },
    dialogue: [
      '当我回望地球，江河、田野、城市和海洋像一张彼此相连的水网。',
      '面对气候变化和新的挑战，人类还能怎样守护水与共同的家园？',
      '让我们从珍惜脚下的每一滴水开始。',
    ],
    ctaLabel: '开始探索',
    unavailableNotice: '这段水脉仍在修复中，终章将在前三段记忆汇合后点亮。',
    status: 'preview',
  },
];

export { chapterOverviewItems };
