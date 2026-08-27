import type { CosmicAct, CosmicChoice } from '@/types/cosmicConstraint';

const cosmicActs: CosmicAct[] = [
  {
    id: 'earth-heaven',
    order: 1,
    kind: 'assembly',
    signal: '水脉连天地',
    title: '碎片拼合',
    subtitle: 'EARTH → HEAVEN / MEMORY ASSEMBLY',
    story: '三块散落的水脉记忆，分别来自九州大地、同舟之路和一路同行的你。把它们拼回一起，才看得见完整的水脉。',
    x: 18,
    y: 24,
  },
  {
    id: 'galaxy-voyage',
    order: 2,
    kind: 'voyage',
    signal: '水脉贯星河',
    title: '飞向宇宙',
    subtitle: 'EARTH → GALAXY / LONG SHOT',
    story: '镜头从地球出发，沿着刚刚复原的水线经过月球、火星与更远的星河。地球上的共生经验，开始寻找宇宙的回声。',
    x: 82,
    y: 28,
  },
  {
    id: 'all-things',
    order: 3,
    kind: 'awakening',
    signal: '天地人和',
    title: '万物共生',
    subtitle: 'COSMIC WATERLINE / AWAKENING',
    story: '当地球、星辰与水脉连成一张图，澜澜也成为其中的一部分。最后的答案不属于某一颗星球，而属于彼此相连的万物。',
    x: 51,
    y: 79,
  },
];

const cosmicReflectionChoices: CosmicChoice[] = [
  {
    id: 'earth-answer',
    label: 'A',
    text: '成立。水在地球上的共生经验，可以成为宇宙治理的起点。',
    stars: 3,
    feedback: '这是一次勇敢的确认：先把地球上学会的共生原则带上路，再让新的星球教会我们如何修正它。',
  },
  {
    id: 'new-rules',
    label: 'B',
    text: '不一定。不同星球会有自己的水与生命规则，需要重新学习。',
    stars: 3,
    feedback: '这是一次清醒的保留：液态甲烷湖、地下海洋和冰壳星球都有自己的边界，尊重差异才有真正的共生。',
  },
  {
    id: 'keep-exploring',
    label: 'C',
    text: '不好说。先带着问题出发，在探索中寻找答案。',
    stars: 3,
    feedback: '这是一次面向未知的出发：把地球的智慧带上路，也把谦逊和好奇留给还未相遇的水脉。',
  },
];

export { cosmicActs, cosmicReflectionChoices };
