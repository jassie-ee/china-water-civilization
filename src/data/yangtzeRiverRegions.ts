import type { YangtzeRiverRegion } from '@/types/basin';

const yangtzeRiverRegions: YangtzeRiverRegion[] = [
  {
    id: 'upper', name: '上游：梯级水能开发与源区约束区', shortName: '上游', metaphor: '从高原来水到峡谷能量的开发起点',
    coreQuestion: '如何让梯级开发建立在稳定来水与生态安全之上？',
    functionDescription: '源区、峡谷河段和上游梯级共同形成长江水量与水能开发的基础；水库群运行需处理丰枯来水、工程安全与下游过程。',
    overview: '上游集中了显著的河流落差和水能条件。溪洛渡等工程展示了清洁能源开发的潜力，也要求把源区生态、库群协同和河道响应视为同一系统。',
    ecologicalProcesses: ['源区水源涵养', '峡谷河流输移', '梯级水库调节', '季节来水变化', '山地生态连通'],
    majorProblems: ['来水年内年际变化', '单站目标与梯级协同之间的矛盾', '库区安全与下游响应约束', '源区与河道生态压力'],
    governanceFocus: '以预报支撑库群联合调度，在工程安全边界内统筹发电、下泄节奏和生态约束。',
    summary: '上游决定长江开发能否拥有稳定、可持续的水量与能量基础。', themeClassName: 'yangtze-river-region--upper',
  },
  {
    id: 'middle', name: '中游：综合枢纽与江湖协同区', shortName: '中游', metaphor: '让上游开发与中下游安全相衔接的控制环节',
    coreQuestion: '如何让综合枢纽同时服务防洪、通航、发电与江湖系统？',
    functionDescription: '三峡作为上中游衔接枢纽，与中游河道、湖泊和洪水过程相互关联；开发效益需要通过防洪安全和江湖生态约束来校验。',
    overview: '中游是开发利用与风险承载相遇的区域。综合枢纽的调度、通航条件和下泄过程，会与江湖连通、湿地生境和人口密集区的安全需求共同作用。',
    ecologicalProcesses: ['综合枢纽调度', '洪水演进', '江湖季节连通', '湿地涨落', '水沙过程'],
    majorProblems: ['多目标调度冲突', '洪水安全与航运需求并存', '江湖生态对水文节律敏感', '上下游信息协同不足'],
    governanceFocus: '以滚动预报和联合会商统筹防洪、发电、航运、水资源利用与生态过程。',
    summary: '中游检验工程开发是否能转化为兼顾安全、效率与生态弹性的综合能力。', themeClassName: 'yangtze-river-region--middle',
  },
  {
    id: 'lower', name: '下游：水网调配与江海协同区', shortName: '下游', metaphor: '把大江来水转化为区域共同水安全的水网末端',
    coreQuestion: '如何在高密度人地空间中协调调水、供水、排涝与江海生态？',
    functionDescription: '下游河网、泵站、水闸和河口共同承接长江来水；区域调水、城乡供水、航运排涝与河口生态在这里形成紧密联系。',
    overview: '江都水利枢纽体现下游水网工程的协同能力。水从长江进入区域水网之后，还需要面对不同地区、不同时段的供需、水质和生态边界。',
    ecologicalProcesses: ['引江与水网输配', '排涝与通航调度', '河网水循环', '径流与潮汐作用', '河口湿地演变'],
    majorProblems: ['多地区用水需求竞争', '调水与排涝时序冲突', '水质与供水安全约束', '高强度开发下的河口生态压力'],
    governanceFocus: '依托监测、分级响应和跨区域会商，统筹引江、输水、排涝、通航与水生态安全。',
    summary: '下游让长江大开发最终落到一张能够协同配置、可靠运行的水网之上。', themeClassName: 'yangtze-river-region--lower',
  },
];

export { yangtzeRiverRegions };
