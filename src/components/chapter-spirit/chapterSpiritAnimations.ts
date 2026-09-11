import happy from '@/assets/images/lan/animated/happy-pingpong.webp';
import holdWater from '@/assets/images/lan/animated/hold-water-pingpong.webp';
import pointWater from '@/assets/images/lan/animated/point-water-pingpong.webp';
import sleeve from '@/assets/images/lan/animated/sleeve-pingpong.webp';
import purify from '@/assets/images/lan/animated/turbid-to-clear-pingpong.webp';
import happyStill from '@/assets/images/lan/animated/happy-still.webp';
import holdWaterStill from '@/assets/images/lan/animated/hold-water-still.webp';
import pointWaterStill from '@/assets/images/lan/animated/point-water-still.webp';
import purifyStill from '@/assets/images/lan/animated/purify-still.webp';
import sleeveStill from '@/assets/images/lan/animated/sleeve-still.webp';

import type { ChapterSpiritAction } from './chapterSpiritTypes';

export const chapterSpiritAnimations: Record<ChapterSpiritAction, string> = {
  happy,
  sleeve,
  'point-water': pointWater,
  'hold-water': holdWater,
  purify,
};

export const chapterSpiritStillImages: Record<ChapterSpiritAction, string> = {
  happy: happyStill,
  sleeve: sleeveStill,
  'point-water': pointWaterStill,
  'hold-water': holdWaterStill,
  purify: purifyStill,
};
