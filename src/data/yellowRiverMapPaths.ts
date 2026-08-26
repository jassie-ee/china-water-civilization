import type { YellowRiverRegionId } from '@/types/basin';

/**
 * 坐标直接使用黄河长卷底图的 1672 × 941 画布；水脉只作互动引导，沿图中河道从源区贯通至河口。
 */
const yellowRiverMainstreamPath = 'M185 178 C207 198 233 214 251 226 C270 286 277 402 301 471 C361 452 468 372 548 350 C588 333 623 329 652 339 C686 393 689 540 719 612 C775 613 860 530 953 480 C1008 524 1021 662 1053 735 C1146 742 1316 678 1471 659';

const mainstreamSegmentPaths: Record<YellowRiverRegionId, string> = {
  upper: 'M185 178 C207 198 233 214 251 226 C270 286 277 402 301 471 C354 457 424 404 492 383',
  middle: 'M492 383 C548 350 588 333 652 339 C686 393 689 540 719 612 C775 613 860 530 953 480 C1008 524 1021 662 1053 735',
  lower: 'M1053 735 C1146 742 1316 678 1471 659',
};

const regionLabelPositions: Record<YellowRiverRegionId, { x: number; y: number }> = {
  upper: { x: 332, y: 318 },
  middle: { x: 766, y: 412 },
  lower: { x: 1292, y: 592 },
};

export { mainstreamSegmentPaths, regionLabelPositions, yellowRiverMainstreamPath };
