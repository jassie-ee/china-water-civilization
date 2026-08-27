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
    title: '同舟共济',
    theme: '一带一路全球治水',
    marker: { x: 79, y: 54, mobileX: 77, mobileY: 65, dialogueSide: 'left', dialogueVertical: 'above' },
    dialogue: [
      '从红海的荒漠到湄澜六国，我看见了许多不同的水土，也看见了共同面对水的愿望。',
      '真正的共享，不是把一套答案搬到远方，而是先听见当地，再一起找到适合这里的路。',
      '你愿意和我一起，把这段水脉带向更远的地方吗？',
    ],
    ctaLabel: '开始探索',
    status: 'available',
    route: '/chapter-3',
  },
  {
    id: 'chapter-4',
    order: 4,
    markerGlyph: '望',
    title: '天地人和',
    theme: '水脉向穹苍',
    marker: { x: 86, y: 18, mobileX: 70, mobileY: 22, dialogueSide: 'left', dialogueVertical: 'below' },
    dialogue: [
      '三块水脉碎片终于要拼在一起了。你看，它会把九州大地和漫天星河连成一张图。',
      '原来“天地人和”不是一句空话——是水，真的把人和天连在了一起。',
      '愿意和我沿着这条水脉，从地球出发，去看看更远的宇宙吗？',
    ],
    ctaLabel: '开始探索',
    status: 'available',
    route: '/chapter-4',
  },
];

export { chapterOverviewItems };
