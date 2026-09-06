import type { PearlRiverRegion } from '@/types/basin';

const pearlRiverRegions: PearlRiverRegion[] = [
  {
    id: 'upper', name: '上游：源头涵养与峡谷河流区', shortName: '上游', metaphor: '让高原的每一滴水汇成南国大河',
    coreQuestion: '如何在水电开发中保留河流生命的基本节律？',
    functionDescription: '珠江源、南盘江与红水河把高原湿地、喀斯特山地和峡谷河流连接起来，是来水形成与生态流量保障的起点。',
    overview: '上游从云贵高原出发，水源涵养、石漠化治理与水电梯级开发同时发生。这里的选择会影响下游来水、水质和河流连续性。',
    ecologicalProcesses: ['水源涵养', '湿地调蓄', '峡谷径流形成', '生态流量下泄', '鱼类栖息地连通'],
    majorProblems: ['石漠化与水土流失', '减脱水河段', '梯级开发累积影响', '栖息地破碎'],
    governanceFocus: '保护源区湿地和森林，保障水电站生态下泄，恢复峡谷河段基本水文过程。',
    summary: '上游决定珠江从源头带着怎样的水量与生命力出发。', themeClassName: 'pearl-river-region--upper',
  },
  {
    id: 'middle', name: '中游：西江调控与生命节律区', shortName: '中游', metaphor: '把洪水、航运、供水与鱼类繁殖组织成同一条河流节奏',
    coreQuestion: '控制性工程如何同时服务安全、发展与河流生态？',
    functionDescription: '大藤峡及西江河段承担流域洪水调控、航运、水资源配置和生态过程塑造，是珠江治理的关键枢纽区。',
    overview: '中游的水库调度不只决定库水位，也影响下游洪水过程、咸潮抵御能力和鱼类繁殖所需的涨水节律。',
    ecologicalProcesses: ['洪水演进', '水库调度', '生态流量', '河湾沙洲演变', '鱼类繁殖'],
    majorProblems: ['多目标调度取舍', '枯水期压咸补淡', '河流连续性下降', '繁殖期水文波动'],
    governanceFocus: '通过预报与联合调度协调防洪、航运、补水压咸和生态流量。',
    summary: '中游体现了珠江从单一工程运行走向流域协同调控的能力。', themeClassName: 'pearl-river-region--middle',
  },
  {
    id: 'lower', name: '下游：三角洲供水与河口共生区', shortName: '下游', metaphor: '让多条江河在城市群与海洋之间共同呼吸',
    coreQuestion: '如何在咸潮、供水安全与河口生命之间留出共同空间？',
    functionDescription: '北江、东江与西江进入三角洲后形成密集河网，最终与潮汐、红树林和近海生物共同塑造粤港澳大湾区的水安全。',
    overview: '下游既面对咸潮上溯和高密度城市供水需求，也承担保护红树林、河口湿地和中华白海豚栖息地的责任。',
    ecologicalProcesses: ['三江汇流', '潮汐往复', '淡咸水混合', '红树林护岸', '河口生物栖息'],
    majorProblems: ['枯水期咸潮', '城市供水压力', '河口生境扰动', '多水源协同难度'],
    governanceFocus: '以压咸补淡、江库联动和跨区域供水网络保障用水，同时保护河口湿地与近海生命。',
    summary: '下游让珠江治理最终落实为城市群与河口生态的共同安全。', themeClassName: 'pearl-river-region--lower',
  },
];

export { pearlRiverRegions };
