import completeMap from '@/assets/images/lan/footings/complete-map.png';
import farmland from '@/assets/images/lan/footings/farmland.png';
import harbor from '@/assets/images/lan/footings/harbor.png';
import riverBank from '@/assets/images/lan/footings/river-bank.png';
import starrySky from '@/assets/images/lan/footings/starry-sky.png';

export const lanFootingScenes = {
  'complete-map': { kind: 'image' as const, src: completeMap, alt: '完整拼图' },
  'river-bank': { kind: 'image' as const, src: riverBank, alt: '河堤清流' },
  farmland: { kind: 'image' as const, src: farmland, alt: '田园水乡' },
  harbor: { kind: 'image' as const, src: harbor, alt: '灯塔海港' },
  'starry-sky': { kind: 'image' as const, src: starrySky, alt: '星空水域' },
  'water-bloom': { kind: 'water-bloom' as const, alt: '水灵脚底的水波与花瓣' },
} as const;

export type LanFootingSceneId = keyof typeof lanFootingScenes;
export type LanFootingScene = (typeof lanFootingScenes)[LanFootingSceneId];
export type LanFootingImageScene = Extract<LanFootingScene, { kind: 'image' }>;
