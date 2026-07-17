import type { YellowRiverRegion } from '@/types/basin';

const yellowRiverRegions: YellowRiverRegion[] = [
  {
    id: 'upper',
    name: '上游：水源涵养与生态形成区',
    shortName: '上游',
    metaphor: '黄河的起点呼吸系统',
    coreQuestion: '水从哪里来？',
    functionDescription: '作为流域生态安全的源头控制区，决定黄河水资源如何形成、调节与保持稳定，是整个系统的水量基础。',
    overview: '黄河上游位于青藏高原及西北高寒区域，是流域水资源形成的重要源区。冰川、积雪与降水共同补给，高寒草地和湿地参与水源涵养，使初始径流得以形成并在季节之间调节。源区生态环境脆弱，气候变化和人类活动会直接影响水源供给能力，因此上游的生态安全决定着黄河系统起点的稳定性。',
    ecologicalProcesses: ['冰川和积雪融水补给', '高寒草地与湿地水源涵养', '河流初始径流形成', '水量季节性调节', '源区生态系统稳定'],
    majorProblems: ['冰川退缩', '冻土变化', '草地退化', '湿地功能下降', '径流年际波动', '水源涵养能力下降'],
    governanceFocus: '生态保护、源区修复、水源涵养和水量稳定。',
    summary: '上游决定黄河有没有稳定的水。',
    themeClassName: 'yellow-river-region--upper',
  },
  {
    id: 'middle',
    name: '中游：物质迁移与泥沙生成区',
    shortName: '中游',
    metaphor: '黄河的血肉生成系统',
    coreQuestion: '水携带什么？',
    functionDescription: '决定泥沙、水土与河流能量如何迁移和转换，塑造黄河高含沙、高风险水沙系统的核心特征。',
    overview: '黄河中游穿越黄土高原，是水土流失和泥沙输入最集中的区域。集中降雨作用于松散黄土，并叠加坡地利用与植被变化，形成强烈侵蚀；大量泥沙随水流入河并向下游输移。强侵蚀、泥沙输入和水沙输移连续叠加，使黄河形成高含沙、高淤积与风险累积并存的独特系统。',
    ecologicalProcesses: ['降雨冲刷', '坡面侵蚀', '沟壑侵蚀', '泥沙入河', '水沙输移', '河道冲淤变化'],
    majorProblems: ['水土流失', '植被退化', '泥沙大量进入黄河', '河道淤积', '下游洪水风险累积', '土地生产力下降'],
    governanceFocus: '退耕还林还草、水土保持、小流域治理和水沙调控。',
    summary: '中游决定黄河携带多少泥沙。',
    themeClassName: 'yellow-river-region--middle',
  },
  {
    id: 'lower',
    name: '下游：风险积累与人地冲突区',
    shortName: '下游',
    metaphor: '人水冲突最集中的区域',
    coreQuestion: '水如何与人类社会共存？',
    functionDescription: '作为上中游自然过程累积后的风险承载区，集中面对洪水、泥沙与人类空间需求，是流域治理成果的最终体现区域。',
    overview: '黄河进入下游平原后，地势趋于平缓，水流携沙能力下降，泥沙持续沉积并抬高河床，形成典型的地上河。上游水量与中游泥沙在此共同转化为洪水和空间风险；同时人口、农业与城市高度聚集，使河流空间、行洪安全和社会发展之间形成持续张力。',
    ecologicalProcesses: ['水流速度下降', '泥沙沉积', '河床抬高', '河道摆动受到人工约束', '洪水风险集中释放', '河流与城市空间竞争'],
    majorProblems: ['地上河', '河床淤积', '洪水风险', '堤防压力', '滩区人居矛盾', '河流生态空间减少'],
    governanceFocus: '防洪安全、水沙调控、河道治理、生态调度和人河空间协调。',
    summary: '下游决定黄河如何安全地穿越人类社会。',
    themeClassName: 'yellow-river-region--lower',
  },
];

export { yellowRiverRegions };
