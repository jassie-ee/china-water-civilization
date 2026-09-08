import type { GovernanceMetricValues, GovernanceQuestionLevelConfig } from '@/types/governanceLevel';

import { createYangtzeDecisionOptions } from './yangtzeQuestionOptions';

const initialMetrics: GovernanceMetricValues = { floodSafety: 50, sedimentControl: 50, ecologicalStability: 50, engineeringBenefit: 50 };
const explain = '丹江口水利枢纽承担多目标任务，水源安全、防洪、调水与汉江下游生态必须在同一套约束中统筹。';

const danjiangkouQuestionLevel: GovernanceQuestionLevelConfig = {
  basinId: 'yangtze-river',
  levelId: 'danjiangkou', title: '丹江口：水源安全与跨域调配', description: '在防洪、供水、调水、水质与生态约束之间完成八次连续判断。', initialMetrics,
  evaluation: { title: '让调水责任覆盖上下游', description: '跨流域调水不是单向输水，而是对水源地、库区和下游河道共同负责。' },
  questions: [
    { id: 'danjiangkou-priority', scenario: '来水偏少，供水、调水和汉江下游需水同时增加。', questionText: '本轮调度应如何确定优先级？', options: createYangtzeDecisionOptions('只按调水规模安排出库。', '平均削减所有用途，不识别风险。', '先保障工程与水源安全、生态底线，再按风险协同配置。', explain) },
    { id: 'danjiangkou-water-quality', scenario: '库区监测发现局部水体浑浊和面源污染风险上升。', questionText: '怎样维护水源安全？', options: createYangtzeDecisionOptions('只在取水口末端处理。', '只增加一次临时采样。', '联动入库支流、库区和取水口监测，开展源头减污与分级响应。', explain) },
    { id: 'danjiangkou-flood', scenario: '预报显示可能出现强降雨与高库水位叠加。', questionText: '如何预留防洪空间？', options: createYangtzeDecisionOptions('等洪峰抵达后再集中泄洪。', '不考虑下游承受能力立即大量泄水。', '依据滚动预报分阶段腾库，并控制下泄过程与风险告知。', explain) },
    { id: 'danjiangkou-drawdown', scenario: '消落区因水位涨落出现生态与岸坡稳定压力。', questionText: '治理策略应是什么？', options: createYangtzeDecisionOptions('将消落区全部硬化并开发利用。', '只在出现灾害后临时修复。', '识别敏感区，结合水位管理、植被修复和风险监测开展分区治理。', explain) },
    { id: 'danjiangkou-hanjiang', scenario: '调水后汉江中下游需要维持基本水动力和生态过程。', questionText: '应如何安排下泄？', options: createYangtzeDecisionOptions('将下泄完全让位于调水任务。', '全年使用固定下泄值，不看河道状态。', '把生态下泄作为约束，结合来水和河道响应动态调整。', explain) },
    { id: 'danjiangkou-emergency', scenario: '极端泄洪情景可能影响下游社区安全。', questionText: '风险管理应如何组织？', options: createYangtzeDecisionOptions('只在事件发生后发布通知。', '只由枢纽单方决定并执行。', '建立预报预警、联合会商、分级泄洪和社区风险沟通机制。', explain) },
    { id: 'danjiangkou-coordination', scenario: '水源地保护涉及多省、市和多个管理部门。', questionText: '协同机制应怎样建立？', options: createYangtzeDecisionOptions('各地各自执行，不共享信息。', '只在水质超标后临时联络。', '建立上下游联动、左右岸共治、监测共享与责任追踪机制。', explain) },
    { id: 'danjiangkou-review', scenario: '一次调度结束后，部分水质和下游响应与预测不同。', questionText: '最合适的改进动作是？', options: createYangtzeDecisionOptions('不记录偏差，继续既定计划。', '仅提高一个阈值避免再次预警。', '复盘来水、水质、下泄和生态反馈，校正模型并更新预案。', explain) },
  ],
};

export { danjiangkouQuestionLevel };
