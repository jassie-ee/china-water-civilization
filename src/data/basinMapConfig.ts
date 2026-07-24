import type { BasinMapItem, MapViewBox } from '@/types/basinMap';

// 候选 EPS 的预留坐标系，暂未接入当前 /basins 页面；现有页面仍使用自身稳定的 1040 × 650 示意坐标系。
const chinaMapViewBox: MapViewBox = {
  width: 1602.6667,
  height: 1077.3333,
};

// 流域边界和干流尚无经过确认的完整数据，因此资产字段保持为空。
const basinMapItems: BasinMapItem[] = [
  {
    id: 'yellow-river',
    name: '黄河',
    route: '/basins/yellow-river',
    geometryAssets: { basinArea: null, mainRiver: null, interactionArea: null },
    labelPosition: { x: 0, y: 0 },
    prompt: '进入黄河流域',
  },
  {
    id: 'yangtze-river',
    name: '长江',
    route: '/basins/yangtze-river',
    geometryAssets: { basinArea: null, mainRiver: null, interactionArea: null },
    labelPosition: { x: 0, y: 0 },
    prompt: '进入长江流域',
  },
];

export { basinMapItems, chinaMapViewBox };
