import type { YellowRiverRegionId } from '@/types/basin';

/** 坐标与黄河底图的山地—峡谷—平原—河口叙事对齐，仅用于互动引导。 */
const yellowRiverMainstreamPath = 'M284 208 C354 222 366 250 331 282 C304 308 341 331 390 341 C440 351 461 384 434 424 C407 463 424 495 466 524 C513 557 539 582 588 587 C655 596 706 628 776 620 C854 611 879 566 935 548 C1030 518 1121 526 1209 472';

const mainstreamSegmentPaths: Record<YellowRiverRegionId, string> = {
  upper: 'M284 208 C354 222 366 250 331 282 C304 308 341 331 390 341 C440 351 461 384 434 424',
  middle: 'M434 424 C407 463 424 495 466 524 C513 557 539 582 588 587 C655 596 706 628 776 620',
  lower: 'M776 620 C854 611 879 566 935 548 C1030 518 1121 526 1209 472',
};

const regionLabelPositions: Record<YellowRiverRegionId, { x: number; y: number }> = {
  upper: { x: 358, y: 260 },
  middle: { x: 633, y: 500 },
  lower: { x: 1010, y: 450 },
};

export { mainstreamSegmentPaths, regionLabelPositions, yellowRiverMainstreamPath };
