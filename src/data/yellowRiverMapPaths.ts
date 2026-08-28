import type { YellowRiverRegionId } from '@/types/basin';

// 黄河空间关系的互动叙事示意，不用于测绘或 GIS 定位。
const yellowRiverBasinPath = 'M135 454 C141 318 259 223 403 236 C500 171 641 188 713 264 C826 253 942 292 1029 378 C1139 394 1235 469 1209 557 C1171 641 1042 663 930 635 C823 687 658 664 567 622 C458 654 303 625 219 554 C160 530 128 497 135 454 Z';

const yellowRiverMainstreamPath = 'M232 422 C285 360 360 309 438 322 C492 330 511 367 477 399 C439 435 397 447 424 481 C454 519 529 501 577 470 C638 431 704 443 748 489 C794 537 876 522 940 484 C1006 445 1081 456 1143 495';

const regionPaths: Record<YellowRiverRegionId, string> = {
  upper: 'M145 448 C157 329 259 248 390 250 C447 249 495 282 511 338 C498 393 455 445 423 487 C354 510 245 500 177 474 C158 467 146 457 145 448 Z',
  middle: 'M423 487 C455 441 498 393 511 338 C569 216 712 214 786 290 C838 346 831 424 781 488 C731 545 655 572 577 548 C519 530 467 518 423 487 Z',
  lower: 'M781 488 C831 424 838 346 786 290 C905 288 1038 361 1139 436 C1194 478 1204 539 1164 579 C1110 626 1011 638 929 616 C864 597 815 555 781 488 Z',
};

const regionLabelPositions: Record<YellowRiverRegionId, { x: number; y: number }> = {
  upper: { x: 315, y: 290 },
  middle: { x: 643, y: 250 },
  lower: { x: 1010, y: 352 },
};

const mainstreamSegmentPaths: Record<YellowRiverRegionId, string> = {
  upper: 'M232 422 C285 360 360 309 438 322 C492 330 511 367 477 399',
  middle: 'M477 399 C439 435 397 447 424 481 C454 519 529 501 577 470 C638 431 704 443 748 489',
  lower: 'M748 489 C794 537 876 522 940 484 C1006 445 1081 456 1143 495',
};

export { mainstreamSegmentPaths, regionLabelPositions, regionPaths, yellowRiverBasinPath, yellowRiverMainstreamPath };
