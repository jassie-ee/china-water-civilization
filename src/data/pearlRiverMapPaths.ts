import type { PearlRiverRegionId } from '@/types/basin';

/** 坐标与珠江纸本长卷背景保持一致，用于区域点亮的互动引导。 */
const pearlRiverMiddleSegment = 'C860 508 947 486 1050 470 C1130 510 1192 600 1280 660';
const pearlRiverMiddlePath = `M760 480 ${pearlRiverMiddleSegment}`;

const pearlRiverMainstreamPath = `M210 182 C300 200 410 226 558 270 C610 316 655 385 760 480 ${pearlRiverMiddleSegment} C1320 690 1360 720 1450 760`;

const supportWaterwayPaths = [
  // 红水河为西江上游红水河河段，支线从天生桥二级节点连续接出至鱼类生境。
  { regionId: 'upper' as const, path: 'M558 270 C530 350 474 474 402 580' },
  { regionId: 'lower' as const, path: 'M1320 120 C1274 163 1218 205 1185 270 C1166 344 1204 435 1280 660' },
  { regionId: 'lower' as const, path: 'M1450 760 C1490 680 1510 600 1540 530' },
];

const mainstreamSegmentPaths: Record<PearlRiverRegionId, string> = {
  upper: 'M210 182 C300 200 410 226 558 270 C610 316 655 385 760 480',
  // 与常驻蓝色主干线共用完全相同的贝塞尔段，避免悬停高光发生偏移。
  middle: pearlRiverMiddlePath,
  lower: 'M1180 610 C1220 642 1260 652 1280 660 C1320 690 1360 720 1450 760',
};

const regionLabelPositions: Record<PearlRiverRegionId, { x: number; y: number }> = {
  upper: { x: 520, y: 370 },
  middle: { x: 900, y: 415 },
  lower: { x: 1240, y: 610 },
};

export { mainstreamSegmentPaths, pearlRiverMainstreamPath, regionLabelPositions, supportWaterwayPaths };
