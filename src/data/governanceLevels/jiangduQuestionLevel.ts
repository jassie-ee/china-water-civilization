import type { GovernanceMetricValues, GovernanceQuestionLevelConfig } from '@/types/governanceLevel';

import { createYangtzeDecisionOptions } from './yangtzeQuestionOptions';

const initialMetrics: GovernanceMetricValues = { floodSafety: 50, sedimentControl: 50, ecologicalStability: 50, engineeringBenefit: 50 };
const explain = '江都水利枢纽连接长江与江淮水网；调水、排涝、供水、通航和水质安全需要在跨区域系统中协同判断。';

const jiangduQuestionLevel: GovernanceQuestionLevelConfig = {
  levelId: 'jiangdu',
  title: '江都：水网调配与区域协同',
  description: '在南水北调东线源头与区域水网中，完成八次关于多目标调度的判断。',
  initialMetrics,
  evaluation: { title: '让一张水网服务共同水安全', description: '下游工程的价值在于把长江来水转化为跨区域、可持续的供水与防灾能力。' },
  questions: [
    { id: 'jiangdu-position', scenario: '团队需要说明江都枢纽为何是下游开发的重要节点。', questionText: '最准确的理解是？', options: createYangtzeDecisionOptions('它只是一座本地排涝泵站。', '它只为单一城市提供调水服务。', '它连接长江与区域水网，统筹调水、排涝、通航和水安全。', explain) },
    { id: 'jiangdu-allocation', scenario: '来水偏少，城乡供水、农业和生态均提出需求。', questionText: '怎样配置有限水量？', options: createYangtzeDecisionOptions('优先满足单一行业，其他需求全部延后。', '简单平均分配，不区分安全底线。', '识别供水安全和生态底线，结合过程与风险实施分级配置。', explain) },
    { id: 'jiangdu-water-quality', scenario: '引江过程中监测到局部水质风险上升。', questionText: '应如何响应？', options: createYangtzeDecisionOptions('继续原有输水计划，不关注水质变化。', '只在末端加大处理，不追溯风险。', '联动水源、通道和受水区监测，分级调整取输水安排。', explain) },
    { id: 'jiangdu-drainage', scenario: '强降雨可能与调水高峰重叠。', questionText: '如何协调排涝与调水？', options: createYangtzeDecisionOptions('各泵站和闸门自行运行。', '只保留一种功能，其他全部暂停。', '依据雨水情预报统筹泵闸运行，预留必要排涝与输水能力。', explain) },
    { id: 'jiangdu-navigation', scenario: '航运部门希望保持水位，区域又需要调水和防汛空间。', questionText: '怎样处理航运需求？', options: createYangtzeDecisionOptions('航运优先，其他约束后续处理。', '永久停止航运调度。', '在安全和生态边界内协调通航水位、调水节奏与闸运行。', explain) },
    { id: 'jiangdu-cross-region', scenario: '上游来水变化将影响多个受水地区。', questionText: '跨区域协同应如何建立？', options: createYangtzeDecisionOptions('各地独立决策，不共享信息。', '只在供水中断后临时联络。', '建立预报共享、联合会商、应急预案与事后评估机制。', explain) },
    { id: 'jiangdu-ecology', scenario: '河网生态对水位和流速变化表现出敏感性。', questionText: '生态约束应怎样处理？', options: createYangtzeDecisionOptions('将其视作非必要信息。', '设定固定指标，不监测实际响应。', '结合季节、河网状态和监测结果设置可调整的生态约束。', explain) },
    { id: 'jiangdu-review', scenario: '一轮调度完成后，部分地区的实际需求与预测不同。', questionText: '如何改进下一轮方案？', options: createYangtzeDecisionOptions('沿用原方案，不记录差异。', '只修改一个数字以获得更好表面结果。', '复盘供需、水质、闸泵运行与生态反馈，迭代综合调度方案。', explain) },
  ],
};

export { jiangduQuestionLevel };
