import type { WorldWaterNode } from '@/types/worldWater';

const worldWaterNodes: WorldWaterNode[] = [
  {
    id: 'nile-delta',
    order: 1,
    region: '非洲 · 河口湿地',
    title: '一条河，许多生活',
    subtitle: 'NILE DELTA / 河口共生',
    story: '潮汐、农田、湿地与城市共享同一片低地。水从来不是一条线，而是许多生活交叠的边界。',
    question: '面对不同地区的用水与生态需求，第一步应该是什么？',
    x: 16,
    y: 64,
    choices: [
      {
        id: 'single-answer',
        label: 'A',
        text: '先由一个中心制定统一方案，再要求各地执行。',
        stars: 1,
        feedback: '统一的方向可以很快，但如果没有听见地方经验，方案很难在河口真正落地。',
      },
      {
        id: 'shared-map',
        label: 'B',
        text: '先把各方的用水、生态与风险画在同一张图上，共同设定底线。',
        stars: 3,
        feedback: '先看见彼此，再一起设定边界。共享水脉的第一步，是把不同声音放进同一张图。',
      },
      {
        id: 'largest-share',
        label: 'C',
        text: '优先满足需求量最大的地区，其他需求之后再协调。',
        stars: 1,
        feedback: '只按水量排序会让脆弱的湿地与小社区失去表达，河口需要的是平衡而非单一优先级。',
      },
    ],
  },
  {
    id: 'rhine-corridor',
    order: 2,
    region: '欧洲 · 跨境河廊',
    title: '让河流穿过边界',
    subtitle: 'RHINE CORRIDOR / 跨境协作',
    story: '河流不认识国界。上游的选择，会在下游留下回声；一段水质、一片湿地，都是共同的责任。',
    question: '当一条河穿过多个治理边界，什么最值得被优先建立？',
    x: 47,
    y: 45,
    choices: [
      {
        id: 'separate-reports',
        label: 'A',
        text: '各地只做好自己的河段，最后再汇总成一份报告。',
        stars: 1,
        feedback: '分段负责可以清晰，却容易错过污染、洪水与生态迁徙在边界上的连续性。',
      },
      {
        id: 'shared-observation',
        label: 'B',
        text: '共享观测、预警与修复目标，让上下游一起校准行动。',
        stars: 3,
        feedback: '信息先流动起来，治理才有机会跨过边界。共同观测是共同承担的起点。',
      },
      {
        id: 'delay-action',
        label: 'C',
        text: '等所有参与方完全同意后，再开始任何修复行动。',
        stars: 2,
        feedback: '协商需要耐心，但河流也在继续变化；可以先建立可逆的小步行动，再边做边校准。',
      },
    ],
  },
  {
    id: 'maritime-route',
    order: 3,
    region: '海上水路 · 港湾与岛屿',
    title: '共享不是复制答案',
    subtitle: 'MARITIME ROUTE / 在地共创',
    story: '从河口到海湾，水把城市、港口与岛屿连接起来。真正的同行，不是把一套答案搬到另一片土地。',
    question: '当经验要走向更远的地方，怎样才算一次有生命力的共享？',
    x: 79,
    y: 34,
    choices: [
      {
        id: 'copy-model',
        label: 'A',
        text: '把已经验证过的工程与制度原样复制到当地。',
        stars: 1,
        feedback: '复制可以带来速度，却可能忽略当地的季风、潮汐、社区与生活方式。',
      },
      {
        id: 'co-create-local',
        label: 'B',
        text: '带去方法与经验，和当地社区一起改写成适合这里的方案。',
        stars: 3,
        feedback: '把经验变成共同语言，再让当地知识完成最后一笔，水脉才会真正连起来。',
      },
      {
        id: 'only-share-result',
        label: 'C',
        text: '只分享最后的成果，不必讨论过程中遇到的困难。',
        stars: 2,
        feedback: '成果值得分享，曲折同样值得留下；透明的过程能让下一次同行少走弯路。',
      },
    ],
  },
];

export { worldWaterNodes };
