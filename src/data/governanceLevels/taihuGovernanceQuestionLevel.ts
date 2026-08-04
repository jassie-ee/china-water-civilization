import type { GovernanceMetricValues, GovernanceQuestionLevelConfig } from '@/types/governanceLevel';

import { createYangtzeDecisionOptions } from './yangtzeQuestionOptions';

const initialMetrics: GovernanceMetricValues = { floodSafety: 50, sedimentControl: 50, ecologicalStability: 50, engineeringBenefit: 50 };
const explain = '太湖流域综合治理依赖控源减污、生态修复、骨干水网、防洪排涝和跨区域协同，而非单一工程。';

const taihuGovernanceQuestionLevel: GovernanceQuestionLevelConfig = {
  basinId: 'yangtze-river',
  levelId: 'taihu-governance', title: '太湖：水网协同与综合治理', description: '在水环境改善、防洪排涝、水资源配置与跨省协同之间完成八次连续判断。', initialMetrics,
  evaluation: { title: '让湖泊治理成为一张水网的共同责任', description: '太湖治理说明高密度区域的水安全，需要环境治理、工程网络与制度协同共同支撑。' },
  questions: [
    { id: 'taihu-source-control', scenario: '湖区水环境改善需要面对城镇、农业和产业等多类污染来源。', questionText: '最有效的治理路径是？', options: createYangtzeDecisionOptions('只在湖心加大末端清淤。', '只治理一类污染源。', '开展控源减污、入河湖管理和生态修复的系统组合。', explain) },
    { id: 'taihu-water-network', scenario: '骨干水网需要同时承担输水、排涝、引排和水环境改善任务。', questionText: '怎样组织水网运行？', options: createYangtzeDecisionOptions('各闸泵按单站目标独立运行。', '只强调输水效率，不顾区域过程。', '依据雨水情与水质信息联合调度，统筹多功能水网。', explain) },
    { id: 'taihu-flood', scenario: '强降雨可能造成流域洪水与城市内涝风险。', questionText: '防洪排涝应如何安排？', options: createYangtzeDecisionOptions('等内涝发生后再临时抽排。', '只建设单一排水通道。', '预留调蓄空间，联动河网、泵站和预警系统分级响应。', explain) },
    { id: 'taihu-drinking-water', scenario: '饮用水安全与湖泊生态改善需要同步保障。', questionText: '应优先建立什么机制？', options: createYangtzeDecisionOptions('只在水厂末端加大处理。', '只对个别取水口短期管控。', '建立水源地保护、流域监测、污染溯源与应急联动机制。', explain) },
    { id: 'taihu-rural-river', scenario: '乡村水系整治计划改善人居环境，同时可能改变自然水系。', questionText: '怎样避免新的生态压力？', options: createYangtzeDecisionOptions('将河道全部硬化成排水沟。', '完全不开展必要整治。', '保留水系连通和生态岸线，在改善生活环境中采用低扰动措施。', explain) },
    { id: 'taihu-cross-province', scenario: '太湖流域治理涉及江苏、浙江、上海等多地。', questionText: '跨区域协同应怎样推进？', options: createYangtzeDecisionOptions('按行政边界分别设定目标。', '只在突发事件时进行联络。', '共享监测、统一关键目标、联合会商并追踪治理责任。', explain) },
    { id: 'taihu-ecological-restoration', scenario: '局部湖滨带需要兼顾防洪安全和生境恢复。', questionText: '修复方案应如何选择？', options: createYangtzeDecisionOptions('以连续硬质岸线为唯一方案。', '只种植景观植物，不监测成效。', '按岸段功能实施生态修复，并监测水质、生境与防洪响应。', explain) },
    { id: 'taihu-review', scenario: '一轮治理后，部分区域水质改善但生态指标仍不稳定。', questionText: '下一步应如何优化？', options: createYangtzeDecisionOptions('只宣传已有成果，不再调整措施。', '更换单一指标以改善表面结果。', '复盘污染、水网调度和生态监测结果，迭代分区综合治理。', explain) },
  ],
};

export { taihuGovernanceQuestionLevel };
