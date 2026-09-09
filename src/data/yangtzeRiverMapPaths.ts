import type { YangtzeRiverRegionId } from '@/types/basin';

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

export { mainstreamSegmentPaths, regionLabelPositions };
