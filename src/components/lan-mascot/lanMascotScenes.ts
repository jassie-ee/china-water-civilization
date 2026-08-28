import completeMap from '@/assets/images/lan/footings/complete-map.png';
import farmland from '@/assets/images/lan/footings/farmland.png';
import harbor from '@/assets/images/lan/footings/harbor.png';
import riverBank from '@/assets/images/lan/footings/river-bank.png';
import starrySky from '@/assets/images/lan/footings/starry-sky.png';

export const lanFootingScenes = {
  'complete-map': { src: completeMap, alt: '完整拼图' },
  'river-bank': { src: riverBank, alt: '河堤清流' },
  farmland: { src: farmland, alt: '田园水乡' },
  harbor: { src: harbor, alt: '灯塔海港' },
  'starry-sky': { src: starrySky, alt: '星空水域' },
} as const;

export type LanFootingSceneId = keyof typeof lanFootingScenes;
export type LanFootingScene = (typeof lanFootingScenes)[LanFootingSceneId];
