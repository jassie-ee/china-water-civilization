import type { YangtzeRiverRegionId } from '@/types/basin';

// 长江空间关系的交互叙事示意，不用于测绘或 GIS 定位。
const yangtzeRiverBasinPath = 'M128 426 C172 264 349 189 501 249 C618 179 779 211 854 305 C971 283 1165 343 1237 447 C1278 514 1191 625 1060 629 C942 666 814 624 733 589 C607 645 445 614 354 549 C243 557 145 511 128 426 Z';
const yangtzeRiverMainstreamPath = 'M204 390 C292 332 365 299 445 326 C512 349 526 392 590 407 C667 426 727 385 798 421 C862 453 897 518 973 501 C1048 483 1090 420 1180 454';
// 仅表达支流、湖泊与干流的相对关系，不作为真实河网或测绘路径使用。
const supportWaterwayPaths = [
  'M285 284 C298 306 311 325 329 342',
  'M414 405 C420 376 431 347 445 326',
  'M784 310 C808 341 827 381 851 445',
  'M828 542 C830 503 834 468 846 443',
  'M980 588 C979 553 977 523 973 501',
  'M1102 560 C1105 516 1113 477 1131 440',
];
const regionPaths: Record<YangtzeRiverRegionId, string> = {
  upper: 'M137 420 C179 282 336 218 489 258 C544 277 578 334 566 396 C546 450 502 474 452 498 C351 523 234 502 164 467 C145 456 135 439 137 420 Z',
  middle: 'M452 498 C502 474 546 450 566 396 C630 263 764 242 850 316 C907 364 907 450 859 510 C809 565 731 584 657 557 C580 531 512 528 452 498 Z',
  lower: 'M859 510 C907 450 907 364 850 316 C967 300 1127 351 1217 432 C1268 480 1245 549 1182 586 C1101 629 989 625 908 592 C883 577 868 549 859 510 Z',
};
const regionLabelPositions: Record<YangtzeRiverRegionId, { x: number; y: number }> = { upper: { x: 323, y: 281 }, middle: { x: 690, y: 270 }, lower: { x: 1060, y: 355 } };
const mainstreamSegmentPaths: Record<YangtzeRiverRegionId, string> = {
  upper: 'M204 390 C292 332 365 299 445 326 C512 349 526 392 590 407',
  middle: 'M590 407 C667 426 727 385 798 421 C862 453 897 518 973 501',
  lower: 'M973 501 C1048 483 1090 420 1180 454',
};

export { mainstreamSegmentPaths, regionLabelPositions, regionPaths, supportWaterwayPaths, yangtzeRiverBasinPath, yangtzeRiverMainstreamPath };
