import type { YangtzeRiverRegion } from '@/types/basin';

const yangtzeRiverRegions: YangtzeRiverRegion[] = [
  {
    id: 'upper', name: '上游：支流水利文明与生态安全区', shortName: '上游', metaphor: '从岷江分水到赤水河自由流淌的上游样本',
    coreQuestion: '如何让支流开发、民生用水与生态安全彼此支撑？',
    functionDescription: '岷江、赤水河等上游支流既承载水利开发和产业活动，也维系长江上游来水、鱼类生境与生态屏障。',
    overview: '上游以都江堰和赤水河为两种不同样本：前者呈现延续千年的水利工程智慧，后者强调在产业发展中保护自由流淌河流与生态流量。',
    ecologicalProcesses: ['支流水源涵养', '分水与输沙', '生态流量', '鱼类生境', '跨省流域过程'],
    majorProblems: ['开发利用与河流连续性协调', '产业排放与水环境压力', '上下游治理标准差异', '来水与生态过程变化'],
    governanceFocus: '以流域尺度统筹分水、用水、污染治理与生态保护，让上游支流成为绿色发展的基础。',
    summary: '上游展示了长江流域开发必须从支流、水源和生态本底开始。', themeClassName: 'yangtze-river-region--upper',
  },
  {
    id: 'middle', name: '中游：综合枢纽与江湖生命区', shortName: '中游', metaphor: '工程调度与生命过程相互校验的区域',
    coreQuestion: '如何在综合开发中守住洪水安全、调水责任与珍稀物种生境？',
    functionDescription: '三峡、丹江口等枢纽的多目标运行，与中华鲟保护、洞庭湖调蓄和江湖连通共同构成中游的系统关系。',
    overview: '中游不是单纯的工程控制区：大型枢纽的防洪、发电、供水与调水效益，必须通过河道水文、库区生态、珍稀物种和湖泊湿地的响应来检验。',
    ecologicalProcesses: ['水库调度', '洪水演进', '鱼类繁殖与洄游', '江湖连通', '湿地涨落'],
    majorProblems: ['多目标调度取舍', '水源保护与跨区域调水责任', '库区与消落区生态压力', '江湖生境对水文节律敏感'],
    governanceFocus: '以预报、监测、生态约束和联合会商统筹枢纽运行、江湖调蓄与生物多样性保护。',
    summary: '中游检验工程开发是否真正转化为兼顾安全、效率与生命过程的综合能力。', themeClassName: 'yangtze-river-region--middle',
  },
  {
    id: 'lower', name: '下游：湖泊湿地与水网协同区', shortName: '下游', metaphor: '让大江来水在高密度区域中被共同守护和配置',
    coreQuestion: '如何在湿地保护、水网运行与区域发展之间形成长期协同？',
    functionDescription: '鄱阳湖与太湖流域共同呈现下游江湖水文、候鸟栖息、水环境和水网调度之间的复杂关系。',
    overview: '下游人口、产业与水网高度密集。鄱阳湖提示水文变化对湿地的传导，太湖则体现跨区域控源减污、防洪排涝和水资源配置的系统治理。',
    ecologicalProcesses: ['季节水位涨落', '湿地生境演替', '河网水循环', '水环境输移', '防洪排涝'],
    majorProblems: ['湿地与候鸟栖息地压力', '水环境质量风险', '高强度利用下的水网调度冲突', '跨区域协同成本'],
    governanceFocus: '依托生态监测、骨干水网和跨区域机制，统筹湿地保护、水环境改善与流域水安全。',
    summary: '下游让长江流域治理最终落实为湖泊、水网、城市与自然共同运行的长期秩序。', themeClassName: 'yangtze-river-region--lower',
  },
];

export { yangtzeRiverRegions };
