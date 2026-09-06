import type { BasinDetailConfig, BasinOverviewItem } from '@/types/basin';

const basinOverviewItems: BasinOverviewItem[] = [
  {
    id: 'yellow-river',
    name: '黄河流域',
    englishName: 'YELLOW RIVER BASIN',
    route: '/basins/yellow-river',
    description: '从高原水源、黄土泥沙到下游防洪，探索中国治水理念的系统演进。',
    themeClassName: 'basin--yellow-river',
    isAvailable: true,
  },
  {
    id: 'yangtze-river',
    name: '长江流域',
    englishName: 'YANGTZE RIVER BASIN',
    route: '/basins/yangtze-river',
    description: '从高原峡谷、江湖调蓄到江海交汇，探索开发、保护与协同治理。',
    themeClassName: 'basin--yangtze-river',
    isAvailable: true,
  },
  {
    id: 'pearl-river',
    name: '珠江流域',
    englishName: 'PEARL RIVER BASIN',
    route: '/basins/pearl-river',
    description: '从南岭山地到珠江三角洲，后续将在此展开珠江流域的治理叙事。',
    themeClassName: 'basin--pearl-river',
    isAvailable: true,
  },
];

const basinDetailConfigs: BasinDetailConfig[] = [
  {
    id: 'yellow-river',
    title: '黄河流域治理系统',
    subtitle: 'YELLOW RIVER BASIN',
    description: '从高原水源、黄土高原水沙过程，到下游防洪与人水协调，探索黄河治理理念的系统演进。',
    themeClassName: 'basin-detail--yellow-river',
  },
  {
    id: 'yangtze-river',
    title: '长江流域治理系统',
    subtitle: 'YANGTZE RIVER BASIN',
    description: '从高原源区、峡谷水能、江湖调蓄，到长江口江海交汇，探索开发、保护与协同治理。',
    themeClassName: 'basin-detail--yangtze-river',
  },
  {
    id: 'pearl-river',
    title: '珠江流域治理系统',
    subtitle: 'PEARL RIVER BASIN',
    description: '珠江流域的上中下游分区、治理节点与互动内容将在后续阶段展开。',
    themeClassName: 'basin-detail--pearl-river',
  },
];

export { basinDetailConfigs, basinOverviewItems };
