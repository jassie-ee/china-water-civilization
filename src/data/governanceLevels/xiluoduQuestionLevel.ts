import type { GovernanceMetricValues, GovernanceQuestionLevelConfig } from '@/types/governanceLevel';

import { createYangtzeDecisionOptions } from './yangtzeQuestionOptions';

const initialMetrics: GovernanceMetricValues = { floodSafety: 50, sedimentControl: 50, ecologicalStability: 50, engineeringBenefit: 50 };
const explain = '溪洛渡代表梯级水能开发：工程运行应以安全边界、来水预报、相邻梯级协同和河道响应共同支撑。';

const xiluoduQuestionLevel: GovernanceQuestionLevelConfig = {
  levelId: 'xiluodu',
  title: '溪洛渡：梯级水能开发',
  description: '在峡谷河段的清洁能源开发中，完成八次关于库群协同与系统约束的判断。',
  initialMetrics,
  evaluation: { title: '让水能开发成为流域协同的一环', description: '梯级工程的综合价值来自联合运行，而不是放大单站的短期目标。' },
  questions: [
    { id: 'xiluodu-position', scenario: '团队需要说明溪洛渡在上游开发链条中的作用。', questionText: '怎样理解它的工程定位？', options: createYangtzeDecisionOptions('把它当作只追求发电量的独立电站。', '主要考虑本地供电，不关注梯级联系。', '作为梯级开发节点，在清洁能源、河道过程与上下游协同中运行。', explain) },
    { id: 'xiluodu-forecast', scenario: '汛前预报显示来水可能快速增加。', questionText: '如何准备有效调节空间？', options: createYangtzeDecisionOptions('维持高水位，等洪峰到达后再集中处理。', '立即大幅泄水，不评估下游承受能力。', '根据滚动预报分阶段安排蓄放，并控制下泄过程。', explain) },
    { id: 'xiluodu-cascade', scenario: '相邻梯级计划同步调整出库。', questionText: '最合适的协作方式是？', options: createYangtzeDecisionOptions('各电站按各自目标独立运行。', '只约定一个统一时刻，不共享运行数据。', '共享预报、库情和河道响应，按角色开展联合调度。', explain) },
    { id: 'xiluodu-energy', scenario: '电网高峰期需要更多清洁电力。', questionText: '怎样安排出力更稳妥？', options: createYangtzeDecisionOptions('只按峰值收益集中放水。', '完全放弃调峰能力以避免任何变化。', '在安全、下游过程和生态约束内优化出力与下泄节奏。', explain) },
    { id: 'xiluodu-ecology', scenario: '监测提示下游关键生境对水文节律敏感。', questionText: '生态信息应如何进入决策？', options: createYangtzeDecisionOptions('不列入运行条件，事后再处理。', '采用全年固定下泄值，不观察响应。', '识别关键时期和阈值，将生态要求纳入调度窗口与监测。', explain) },
    { id: 'xiluodu-safety', scenario: '库区出现需要复核的安全监测信号。', questionText: '应如何处理？', options: createYangtzeDecisionOptions('为保持发电计划而忽略异常。', '立刻停止全部运行，但不分析原因。', '复核监测与工况，按安全规程评估并调整运行方案。', explain) },
    { id: 'xiluodu-information', scenario: '电网、水文和河道管理部门掌握的信息并不一致。', questionText: '应建立怎样的机制？', options: createYangtzeDecisionOptions('各部门保留数据，分别做决定。', '只在突发事件后临时沟通。', '建立预测共享、联合会商、执行反馈和复盘机制。', explain) },
    { id: 'xiluodu-review', scenario: '一次调度后，实际来水过程与预测存在差异。', questionText: '下一步最合适的做法是？', options: createYangtzeDecisionOptions('不记录偏差，继续原计划。', '凭经验大幅修改参数，不验证结果。', '复盘预测和响应，校正假设并迭代下一轮调度。', explain) },
  ],
};

export { xiluoduQuestionLevel };
