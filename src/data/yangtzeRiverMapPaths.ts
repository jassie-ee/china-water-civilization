import type { YangtzeRiverRegionId } from '@/types/basin';

/** 坐标直接使用长江长卷底图的 1672 × 941 画布；水脉只作互动引导，沿图中河网从西向东贯通。 */
const yangtzeRiverMainstreamPath = 'M150 210 C215 220 290 263 350 300 C365 320 374 340 370 360 C364 380 356 403 350 420 C405 439 455 454 510 465 C584 475 653 461 724 492 C798 524 856 558 927 574 C990 588 1044 591 1092 617 C1170 658 1254 709 1430 735';

/** 赤水河与汉江支流补足空间叙事，并随其所属上游／中游河段同步提亮。 */
const supportWaterwayPaths = [
  {
    regionId: 'upper' as const,
    path: 'M370 360 C335 397 305 438 296 482 C286 528 255 574 270 620',
  },
  {
    regionId: 'middle' as const,
    path: 'M700 280 C752 312 731 353 762 389 C791 423 765 465 724 492',
  },
];

const mainstreamSegmentPaths: Record<YangtzeRiverRegionId, string> = {
  upper: 'M150 210 C215 220 290 263 350 300 C365 320 374 340 370 360',
  middle: 'M370 360 C364 380 356 403 350 420 C405 439 455 454 510 465 C584 475 653 461 724 492 C798 524 856 558 927 574',
  lower: 'M927 574 C990 588 1044 591 1092 617 C1170 658 1254 709 1430 735',
};

const regionLabelPositions: Record<YangtzeRiverRegionId, { x: number; y: number }> = {
  upper: { x: 430, y: 350 },
  middle: { x: 790, y: 440 },
  lower: { x: 1190, y: 570 },
};

export { mainstreamSegmentPaths, regionLabelPositions, supportWaterwayPaths, yangtzeRiverMainstreamPath };
