import type { GovernanceMetricValues, GovernanceQuestionLevelConfig } from '@/types/governanceLevel';
import { createYangtzeDecisionOptions } from './yangtzeQuestionOptions';

const initialMetrics: GovernanceMetricValues = { floodSafety: 50, sedimentControl: 50, ecologicalStability: 50, engineeringBenefit: 50 };
const explain = '三峡工程是连接上游梯级开发与中下游安全、通航需求的综合枢纽，调度应以预报、工程边界、下游响应和生态约束共同支撑。';

const threeGorgesQuestionLevel: GovernanceQuestionLevelConfig = {
  levelId: 'three-gorges', title: '三峡：上中游综合枢纽', description: '在防洪、发电、航运、水资源利用与生态约束之间完成八次连续判断。', initialMetrics,
  evaluation: { title: '让综合枢纽服务于流域整体', description: '三峡工程的综合效益依赖于预报、联合调度和对上下游生态过程的持续关注。' },
  questions: [
    { id: 'three-gorges-priority', scenario: '汛期前，来水预报不确定，下游防洪安全与近期发电计划都需要考虑。', questionText: '应如何确定本轮调度优先级？', options: createYangtzeDecisionOptions('只按近期发电收益安排水位。', '先保障防洪，再在其余空间考虑发电。', '以防洪安全边界为前提，联合评估发电、航运和生态约束。', explain) },
    { id: 'three-gorges-forecast', scenario: '气象预报提示上游可能有连续强降雨。', questionText: '怎样准备调洪空间？', options: createYangtzeDecisionOptions('保持高水位，等洪峰到达再集中泄水。', '一次性大幅预泄，不评估下游承受能力。', '依据滚动预报分阶段腾库，并控制下泄过程。', explain) },
    { id: 'three-gorges-cascade', scenario: '上游梯级水库与三峡均将调整出库流量。', questionText: '如何组织水库群协作？', options: createYangtzeDecisionOptions('各水库按自身目标独立运行。', '统一下泄时刻，但不共享实时信息。', '共享预报、库情与河道响应，按角色分工联合调度。', explain) },
    { id: 'three-gorges-ecological-flow', scenario: '枯水期下游河道与重要生境需要基本生态流量。', questionText: '生态流量应处于什么位置？', options: createYangtzeDecisionOptions('只在水量富余时再安排生态下泄。', '设定固定流量，不随水文和生境变化调整。', '作为调度约束，根据来水与生态响应动态保障。', explain) },
    { id: 'three-gorges-navigation', scenario: '航运部门希望获得稳定水位，河道又需保留行洪和生态弹性。', questionText: '怎样协调航运要求？', options: createYangtzeDecisionOptions('航运需求优先，其他目标后续处理。', '完全停止航运相关调度。', '在安全和生态边界内统筹航运水位与河道过程。', explain) },
    { id: 'three-gorges-sediment', scenario: '监测显示局部河段冲淤状态发生变化。', questionText: '面对新的水沙信息应如何行动？', options: createYangtzeDecisionOptions('继续原方案，不根据监测修正。', '只按单一断面数据立即改变全部运行。', '复核多站监测与模型结果，分阶段调整并验证效果。', explain) },
    { id: 'three-gorges-ecosystem', scenario: '调度过程可能影响鱼类繁殖期的水文条件。', questionText: '怎样纳入生境保护？', options: createYangtzeDecisionOptions('不把生境条件列入本次决策。', '暂停所有运行，避免任何水文变化。', '识别关键时期与阈值，将其纳入调度窗口和监测。', explain) },
    { id: 'three-gorges-adaptation', scenario: '一次运行后，实际河道响应与预测存在偏差。', questionText: '最合适的后续动作是？', options: createYangtzeDecisionOptions('不记录偏差，维持原计划。', '凭经验迅速大幅改动，不复盘原因。', '复盘数据与假设，开展验证并迭代下一轮方案。', explain) },
  ],
};

export { threeGorgesQuestionLevel };
