import type { YangtzeRiverNode } from '@/types/basin';

// 坐标服务于 1400 × 800 的长江流域叙事示意图；支流与湖泊节点按相对方位定位，不表示测绘坐标。
const yangtzeRiverNodes: YangtzeRiverNode[] = [
  {
    id: 'dujiangyan', name: '都江堰水利工程', shortName: '都江堰', type: 'engineering', regionId: 'upper',
    position: { x: 285, y: 284, labelOffsetX: -31, labelOffsetY: -30 }, isAvailable: true,
    locationDescription: '岷江上游出山口的古代无坝引水工程，岷江为长江上游重要支流。',
    summary: '都江堰以分水、泄洪、排沙和引水相结合，体现顺应河势、因地制宜的水利开发智慧。',
    keywords: ['岷江', '无坝引水', '分水排沙', '灌溉', '水利文明'],
    problemDescription: '如何在防洪、灌溉、输沙与河流生态之间保持长期平衡，是古今都江堰持续面对的系统问题。',
    governanceMeasures: ['顺应河势组织分水与泄洪', '保持排沙通道与工程维护', '以现代监测支撑灌区协同调度'],
    ecologicalImpacts: ['减少单纯筑坝对河流连续性的干扰', '需要持续关注来水、泥沙与灌区用水变化'],
    culturalMeaning: '以“因势利导”服务民生，是中华传统治水智慧的重要表达。',
  },
  {
    id: 'chishui-river', name: '赤水河流域生态保护', shortName: '赤水河', type: 'ecological', regionId: 'upper',
    position: { x: 414, y: 405, labelOffsetX: -31, labelOffsetY: 58 }, isAvailable: true,
    locationDescription: '长江上游一级支流，跨云南、贵州、四川，拥有重要鱼类生境与产业发展空间。',
    summary: '赤水河将自由流淌支流、珍稀鱼类生境、白酒产业与跨省协同治理放在同一流域单元中。',
    keywords: ['自由流淌', '生态流量', '鱼类生境', '产业污染治理', '跨省协同'],
    problemDescription: '产业排放、用水需求、生态流量和上下游治理标准需要同时协调。',
    governanceMeasures: ['开展流域污染源协同治理', '保障重要生境与生态流量', '建立跨省流域联防联控机制'],
    significance: '它展示了上游支流如何在保护生态本底的同时探索绿色发展。',
  },
  {
    id: 'three-gorges', name: '三峡工程', shortName: '三峡工程', type: 'engineering', regionId: 'middle',
    position: { x: 620, y: 409, labelOffsetX: -42, labelOffsetY: -30 }, isAvailable: true,
    locationDescription: '长江三峡河段的控制性枢纽，在本页作为上中游衔接工程展示。',
    summary: '三峡工程统筹防洪、发电、航运和水资源利用，是长江干流综合开发的关键环节。',
    keywords: ['综合枢纽', '防洪', '发电', '航运', '联合调度'],
    problemDescription: '防洪库容、发电计划、航运条件、补水和生态过程并不总能同时达到最优。',
    governanceMeasures: ['实施滚动预报调度', '统筹上下游库群与河道响应', '将生态过程纳入调度约束'],
    ecologicalImpacts: ['发挥防洪、发电与航运综合效益', '需持续评估库区生态和下游水文响应'],
    culturalMeaning: '大型工程的价值在于协调多种公共需求，而不是放大单一功能。',
  },
  {
    id: 'chinese-sturgeon-reserve', name: '长江湖北宜昌中华鲟自然保护区', shortName: '中华鲟保护区', type: 'ecological', regionId: 'middle',
    position: { x: 735, y: 399, labelOffsetX: -51, labelOffsetY: 58 }, isAvailable: true,
    locationDescription: '宜昌江段的中华鲟重要栖息与保护区域。',
    summary: '中华鲟保护区以旗舰物种为窗口，提示工程调度、航道活动与河流生境保护之间存在长期关联。',
    keywords: ['中华鲟', '鱼类洄游', '产卵生境', '生态调度', '生物多样性'],
    problemDescription: '水文节律变化、航道活动和栖息地压力会影响珍稀鱼类的繁殖与生存环境。',
    governanceMeasures: ['避让关键繁殖期与敏感水域', '加强鱼类和水文过程监测', '以生态调度与栖息地修复协同保护'],
    significance: '它让“生态底线”从抽象原则转化为可被观察、监测和保护的生命过程。',
  },
  {
    id: 'dongting-lake', name: '洞庭湖江湖调蓄与湿地', shortName: '洞庭湖', type: 'ecological', regionId: 'middle',
    position: { x: 828, y: 542, labelOffsetX: -31, labelOffsetY: 58 }, isAvailable: true,
    locationDescription: '长江中游重要通江湖泊与湿地系统。',
    summary: '洞庭湖承担江湖连通、洪水调蓄和湿地生境等多重功能，是长江中游开发利用的重要生态约束。',
    keywords: ['江湖连通', '洪水调蓄', '湿地', '洲滩', '生态约束'],
    problemDescription: '江湖关系变化、岸线利用和极端水文过程会共同影响湖区调蓄与湿地功能。',
    governanceMeasures: ['维护必要江湖连通过程', '保护蓄滞洪与湿地空间', '以水文生态监测支持适应性管理'],
    significance: '洞庭湖提醒工程调度必须为洪水与湿地过程保留空间。',
  },
  {
    id: 'danjiangkou', name: '丹江口水利枢纽', shortName: '丹江口', type: 'engineering', regionId: 'middle',
    position: { x: 784, y: 310, labelOffsetX: -31, labelOffsetY: -30 }, isAvailable: true,
    locationDescription: '汉江与丹江汇合处的控制性水利枢纽，汉江为长江重要支流。',
    summary: '丹江口水利枢纽承担防洪、供水、发电、灌溉和调水等任务，是南水北调中线工程的重要水源地。',
    keywords: ['汉江', '跨流域调水', '水源保护', '消落区', '综合利用'],
    problemDescription: '水源安全、库区水质、消落区生态、洪水风险与下游河道需求需要统筹考虑。',
    governanceMeasures: ['强化水源地保护和污染防治', '统筹防洪、供水与生态下泄', '开展消落区生态保护和风险监测'],
    ecologicalImpacts: ['支撑跨区域水资源配置', '调水与水库运行需持续回应上下游生态约束'],
    culturalMeaning: '跨流域调水把一座水库的运行责任延伸到更广阔的区域共同体。',
  },
  {
    id: 'poyang-lake', name: '鄱阳湖湿地与候鸟栖息地', shortName: '鄱阳湖', type: 'ecological', regionId: 'lower',
    position: { x: 980, y: 588, labelOffsetX: -31, labelOffsetY: 58 }, isAvailable: true,
    locationDescription: '长江中下游重要通江湖泊湿地。',
    summary: '鄱阳湖的季节性水位涨落连接湖泊生态、候鸟栖息地与长江干流水文过程。',
    keywords: ['候鸟栖息地', '湿地', '季节水位', '江湖交换', '生态监测'],
    problemDescription: '水位变化、湖区利用与生境保护之间需要建立长期、可监测的协调关系。',
    governanceMeasures: ['保护关键湿地与候鸟栖息地', '监测江湖水文交换和生态响应', '控制高扰动利用并推进修复'],
    significance: '它是观察长江流域水文变化如何传导至湿地生物多样性的关键窗口。',
  },
  {
    id: 'taihu-governance', name: '太湖流域综合治理', shortName: '太湖治理', type: 'engineering', regionId: 'lower',
    position: { x: 1102, y: 560, labelOffsetX: -31, labelOffsetY: 58 }, isAvailable: true,
    locationDescription: '长三角重要湖泊与水网区域，以流域综合治理系统而非单体工程呈现。',
    summary: '太湖流域综合治理连接骨干水网、防洪排涝、水环境改善、水资源配置与跨省协同，是下游高密度地区人水关系的集中样本。',
    keywords: ['骨干水网', '水环境治理', '防洪排涝', '水资源配置', '跨省协同'],
    problemDescription: '水环境质量、洪涝风险、城乡发展与区域协同治理相互交织，不能依靠单一工程解决。',
    governanceMeasures: ['推进控源减污与生态修复', '完善骨干水网和防洪排涝体系', '依托河湖长制与跨区域机制协同治理'],
    ecologicalImpacts: ['提升饮用水安全和流域韧性', '为高密度地区探索发展与保护并行的治理路径'],
    culturalMeaning: '太湖的经验说明，大江下游的现代治水更需要一张跨区域协同运行的水网。',
  },
];

// 仅已开放治理关卡的工程节点参与弹窗内的前后切换，顺序遵循开发叙事主线。
const yangtzeRiverGovernanceNodeIds = ['dujiangyan', 'three-gorges', 'danjiangkou', 'taihu-governance'] as const;

export { yangtzeRiverGovernanceNodeIds, yangtzeRiverNodes };
