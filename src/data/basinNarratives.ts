import yangtzeBackground from '@/assets/images/basins/yangtze-river-background.webp';
import pearlBackground from '@/assets/images/basins/pearl-river-background-v3.webp';
import dolphinPoster from '@/assets/images/interactions/chinese-white-dolphin-home-1920x1080.jpg';
import { yangtzeRiverNodes } from '@/data/yangtzeRiverNodes';
import { yangtzeRiverRegions } from '@/data/yangtzeRiverRegions';
import { pearlRiverNodes } from '@/data/pearlRiverNodes';
import { pearlRiverRegions } from '@/data/pearlRiverRegions';
import type { BasinNarrativeConfig, BasinStorySection } from '@/types/basinStory';

function nodeSections(nodeId: string, reflection: string): BasinStorySection[] {
  const node = [...yangtzeRiverNodes, ...pearlRiverNodes].find((candidate) => candidate.id === nodeId);
  return [
    { id: 'background', label: '背景介绍', paragraphs: [node?.locationDescription ?? '这段流域资料正在整理。', node?.summary ?? '从一处生态变化，观察整条河流的响应。'] },
    { id: 'problem', label: '问题剖析', paragraphs: [node?.problemDescription ?? '河流中的变化会沿水系传递，不能只看单一地点。'], points: node?.causes },
    { id: 'governance', label: '怎样治理', paragraphs: ['治理从识别真实生态需求开始，再把监测结果放进流域协同决策。'], points: node?.governanceMeasures },
    { id: 'change', label: '治理变化', paragraphs: [node?.significance ?? '治理效果需要由水文过程和生命状态共同检验。'], points: node?.ecologicalImpacts },
    { id: 'reflection', label: '水滴感悟', paragraphs: [reflection, node?.culturalMeaning ?? '把水还给河流，也是在为生命留下空间。'] },
  ];
}

const yangtzeNarrative: BasinNarrativeConfig = {
  basinId: 'yangtze-river',
  riverName: '长江',
  pageTitle: '长江流域',
  pageSubtitle: '生命与水流节律',
  theme: 'yangtze',
  background: yangtzeBackground,
  nodes: yangtzeRiverNodes,
  regions: yangtzeRiverRegions,
  scenes: [
    {
      id: 'yangtze-life', label: '认识长江生命', title: '谁在江水中洄游', summary: '从中华鲟出发，认识水温、流量与产卵生境共同维系的生命旅程。',
      nodeId: 'chinese-sturgeon-reserve', videoFilename: 'yangtze-species.mp4', videoTitle: '长江生物与中华鲟影像',
      sections: nodeSections('chinese-sturgeon-reserve', '我曾以为江水只要不断向前就够了，后来才知道，有些生命还需要合适的温度、流速和回家的路。'),
      interaction: {
        id: 'yangtze-species-recognition', mode: 'species-recognition', rewardStars: 3,
        question: '观察形态与生活线索，哪一种是需要往返江海、回到长江繁殖的中华鲟？',
        choices: [
          { id: 'sturgeon', label: 'A. 中华鲟', description: '长吻、骨板明显，具有洄游习性', isCorrect: true, feedback: '认对啦！中华鲟的一生连接江河与海洋，保护它也要保护完整的洄游路径和产卵生境。' },
          { id: 'finless-porpoise', label: 'B. 长江江豚', description: '体形圆润、无背鳍，常在淡水活动', isCorrect: false, feedback: '这是长江江豚，也是重要旗舰物种，但它和中华鲟的形态与生活史并不相同。再观察一次吧。' },
          { id: 'chinese-sucker', label: 'C. 胭脂鱼', description: '幼鱼体色鲜明，体高随成长变化', isCorrect: false, feedback: '胭脂鱼同样值得保护，但这次要找的是往返江海的中华鲟。' },
        ],
      },
    },
    {
      id: 'yangtze-change', label: '江河被工程改变', title: '改变的不只是水位', summary: '梯级工程改变流量、水温和洪峰过程，生命也会感知这些变化。',
      nodeId: 'three-gorges', sections: nodeSections('three-gorges', '一座工程的影响不会停在坝前，它会沿着水温、流量和泥沙继续向下游传递。'),
    },
    {
      id: 'yangtze-dispatch', label: '共同调度', title: '为整条江安排节律', summary: '把预报、库容、下游安全和生态窗口放进同一次联合判断。',
      nodeId: 'dongting-lake', videoFilename: 'yangtze-cascade-dispatch.mp4', videoTitle: '长江梯级水库联合调度影像',
      sections: nodeSections('dongting-lake', '真正的调度不是让每座水库各自最优，而是让整条江在安全与生命之间保持呼吸。'),
      interaction: {
        id: 'yangtze-cascade-dispatch', mode: 'dispatch', rewardStars: 3,
        question: '上游持续来水，下游需要防洪空间，鱼类繁殖期又需要适宜的水文过程。你会怎样组织梯级水库？',
        choices: [
          { id: 'single', label: 'A. 各水库只按自己的发电计划运行', isCorrect: false, feedback: '单库各自运行会把风险和水文波动传给下游，整条江需要共享预报与响应信息。' },
          { id: 'flat', label: 'B. 全部水库维持完全相同的稳定下泄', isCorrect: false, feedback: '稳定并不总等于健康。洪水安全与生态繁殖都需要根据实时来水调整节奏。' },
          { id: 'joint', label: 'C. 共享预报和库情，分工联合调度并保留生态窗口', isCorrect: true, feedback: '判断正确！联合调度把防洪边界、工程能力和生命需求放进同一张流域图里。' },
        ],
      },
    },
  ],
};

const pearlNarrative: BasinNarrativeConfig = {
  basinId: 'pearl-river',
  riverName: '珠江',
  pageTitle: '珠江流域',
  pageSubtitle: '淡水抵达城市与海洋',
  theme: 'pearl',
  background: pearlBackground,
  nodes: pearlRiverNodes,
  regions: pearlRiverRegions,
  scenes: [
    {
      id: 'pearl-salt', label: '枯水期的咸潮', title: '淡水如何抵住海潮', summary: '枯水期，水库、泵站与取水口需要共同守住城市的淡水窗口。',
      nodeId: 'greater-bay-water-network', videoFilename: 'pearl-salt-tide.mp4', videoTitle: '珠江压咸补淡影像',
      sections: nodeSections('greater-bay-water-network', '海水逆流而上时，一滴淡水的抵达，需要上游与城市共同安排。'),
      interaction: {
        id: 'pearl-salt-tide-response', mode: 'dispatch', rewardStars: 3,
        question: '枯水期咸潮逼近取水口，你会怎样保障城市供水，同时避免一次性过量放水？',
        choices: [
          { id: 'wait', label: 'A. 等咸潮到达取水口后再临时停水', isCorrect: false, feedback: '被动停水会放大供水风险。需要提前结合潮汐、来水与库容进行协同。' },
          { id: 'all', label: 'B. 立即把上游水库全部放空', isCorrect: false, feedback: '一次性大量放水忽略了后续枯水期和生态需求，调度需要更有节奏。' },
          { id: 'joint', label: 'C. 预报咸潮窗口，上游补水并同步抢淡蓄库', isCorrect: true, feedback: '选择正确！压咸补淡、泵站抢淡和水库蓄水共同构成了连续的供水防线。' },
        ],
      },
    },
    {
      id: 'pearl-city', label: '城市里的河流', title: '让茅洲河真正变清', summary: '河面变清只是开始，治河更要追到排水系统和污染源头。',
      videoFilename: 'maozhou-river-governance.mp4', videoTitle: '茅洲河流域治理影像',
      sections: [
        { id: 'background', label: '背景介绍', paragraphs: ['茅洲河流经高密度城市与产业区域。人口、厂区、道路和支流密集，让每一处排水变化都可能汇入同一条河。'] },
        { id: 'problem', label: '问题剖析', paragraphs: ['污染并不只在河面。雨污混流、管网缺口、沿岸排放和内源污染相互叠加，单纯清淤或换水难以长期解决。'] },
        { id: 'governance', label: '怎样治理', paragraphs: ['治理沿着污染物的路径反向追踪。'], points: ['排查并控制工业与生活污染源', '完善雨污分流和污水收集管网', '清理内源污染并修复河岸生态', '以跨区域监测持续检验水质'] },
        { id: 'change', label: '治理变化', paragraphs: ['当进入河道的污染持续减少，水质改善才不再依赖临时补水，城市也重新获得可亲近的滨水空间。'] },
        { id: 'reflection', label: '水滴感悟', paragraphs: ['让我变清的不是一场河面美容，而是城市地下管网、岸上生产生活与河流空间一起改变。'] },
      ],
      interaction: {
        id: 'pearl-maozhou-governance', mode: 'choice', rewardStars: 3,
        question: '要让茅洲河长期变清，最先应该把治理力量放在哪里？',
        choices: [
          { id: 'paint', label: 'A. 只美化河岸并增加灯光景观', isCorrect: false, feedback: '景观改善不能阻止污染继续进入河流，河岸好看不等于水质真正恢复。' },
          { id: 'flush', label: 'B. 长期依赖调水把污染冲走', isCorrect: false, feedback: '调水可以缓解局部水质，却不能代替污染源控制和管网建设。' },
          { id: 'source', label: 'C. 控源截污、完善管网，再结合清淤与生态修复', isCorrect: true, feedback: '找到根源了！从源头减少污染，再修复河道，水质改善才会稳定下来。' },
        ],
      },
    },
    {
      id: 'pearl-estuary', label: '淡水抵达河口', title: '给白海豚留下安静的家', summary: '淡水、潮汐、红树林和近海浅滩，共同托住珠江口的生命网络。',
      nodeId: 'pearl-river-estuary', poster: dolphinPoster, videoFilename: 'chinese-white-dolphin.mp4', videoTitle: '珠江口中华白海豚保护影像',
      sections: nodeSections('pearl-river-estuary', '当我抵达海洋，治水并没有结束。这里的每一次航行、施工和水质变化，都会被海豚听见。'),
      interaction: {
        id: 'pearl-dolphin-protection', mode: 'choice', rewardStars: 3,
        question: '施工与航运无法完全停止时，怎样更有效地保护中华白海豚？',
        choices: [
          { id: 'none', label: 'A. 只在岸上设置保护宣传牌', isCorrect: false, feedback: '宣传很重要，但海豚真正面对的是栖息地、水质、航线和水下噪声。' },
          { id: 'monitor', label: 'B. 监测活动范围，避让敏感水域与时段并降低噪声', isCorrect: true, feedback: '做得好！持续监测、主动避让和生境保护，才能把人类活动的干扰真正降下来。' },
          { id: 'feed', label: 'C. 在航道附近集中投喂吸引海豚', isCorrect: false, feedback: '人为投喂会改变野生动物行为，还可能把海豚吸引到高风险航道附近。' },
        ],
      },
    },
  ],
};

export { pearlNarrative, yangtzeNarrative };
