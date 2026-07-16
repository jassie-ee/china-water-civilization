import type { BasinId } from '@/types/basin';

// 此处为互动叙事用的抽象中国轮廓与河流示意，不作为测绘或 GIS 数据使用。
const chinaOutlinePath = 'M142 355 C126 304 156 258 224 243 C244 188 305 159 366 170 C416 125 492 131 538 171 C597 141 690 163 726 209 C793 207 849 242 856 294 C910 316 932 359 904 393 C925 443 887 486 824 492 C786 541 713 548 662 525 C614 560 541 548 505 521 C450 552 365 536 323 499 C267 514 205 482 194 434 C150 419 130 389 142 355 Z';

const riverPaths: Record<BasinId, string> = {
  'yellow-river': 'M302 342 C336 309 374 286 412 294 C438 299 447 321 430 339 C411 360 389 373 408 389 C433 408 475 396 505 382 C545 363 578 371 602 393 C627 416 669 414 710 401 C753 387 788 386 830 403',
  'yangtze-river': 'M314 382 C352 395 386 420 422 425 C462 431 487 415 522 425 C557 435 579 457 617 451 C658 445 693 420 731 428 C766 435 800 455 848 449',
};

const riverLabelPositions: Record<BasinId, { x: number; y: number }> = {
  'yellow-river': { x: 592, y: 354 },
  'yangtze-river': { x: 650, y: 481 },
};

export { chinaOutlinePath, riverLabelPositions, riverPaths };
