import type { PearlRiverRegionId } from '@/types/basin';

const mainstreamSegmentPaths: Record<PearlRiverRegionId, string> = {
  upper: 'M210 182 C300 200 410 226 558 270 C610 316 655 385 760 480',
  middle: 'M760 480 C860 508 947 486 1050 470 C1130 510 1192 600 1280 660',
  lower: 'M1180 610 C1220 642 1260 652 1280 660 C1320 690 1360 720 1450 760',
};

const regionLabelPositions: Record<PearlRiverRegionId, { x: number; y: number }> = {
  upper: { x: 520, y: 370 },
  middle: { x: 900, y: 415 },
  lower: { x: 1240, y: 610 },
};

export { mainstreamSegmentPaths, regionLabelPositions };
