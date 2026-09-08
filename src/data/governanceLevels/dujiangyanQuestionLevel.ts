import type { GovernanceMetricValues, GovernanceQuestionLevelConfig } from '@/types/governanceLevel';

import { createYangtzeDecisionOptions } from './yangtzeQuestionOptions';

const initialMetrics: GovernanceMetricValues = { floodSafety: 50, sedimentControl: 50, ecologicalStability: 50, engineeringBenefit: 50 };
const explain = '都江堰的长期价值来自顺应岷江河势，以分水、泄洪、排沙和引水共同组织水沙过程。';

const dujiangyanQuestionLevel: GovernanceQuestionLevelConfig = {
  basinId: 'yangtze-river',
  levelId: 'dujiangyan', title: '都江堰：因势利导的水利智慧', description: '在岷江分水、泄洪、排沙与灌溉之间完成八次连续判断。', initialMetrics,
  evaluation: { title: '以顺势而为实现长期平衡', description: '都江堰启示现代治水：工程并非只为控制河流，更要理解并利用河流规律。' },
  questions: [
    { id: 'dujiangyan-system-role', scenario: '团队正在解释都江堰为何不是单一引水设施。', questionText: '最准确的定位是？', options: createYangtzeDecisionOptions('只追求把更多岷江水引入灌区。', '只保留防洪作用，暂停灌溉配置。', '以分水、泄洪、排沙和引水共同服务流域与灌区。', explain) },
    { id: 'dujiangyan-flood-release', scenario: '汛期来水增大，成都平原与河道安全都需保障。', questionText: '应如何安排分洪过程？', options: createYangtzeDecisionOptions('尽量把洪水全部引入内江。', '只在洪峰到达后临时加大外泄。', '顺应水势分流，保留外江泄洪能力并监测河道响应。', explain) },
    { id: 'dujiangyan-sediment', scenario: '监测显示局部泥沙淤积可能影响引水口运行。', questionText: '怎样处理泥沙问题？', options: createYangtzeDecisionOptions('用硬性拦截把泥沙全部留在上游。', '只在明显淤堵后紧急清理。', '维护排沙通道，结合来水过程和巡测开展预防性调控。', explain) },
    { id: 'dujiangyan-irrigation', scenario: '枯水期农业、城乡供水和河道生态都提出用水需求。', questionText: '如何配置有限水量？', options: createYangtzeDecisionOptions('优先满足单一用水方。', '简单平均分配，不设生态底线。', '先守住河道与供水安全底线，再按需水过程协同配置。', explain) },
    { id: 'dujiangyan-maintenance', scenario: '古老工程需要日常维护，同时不能破坏其水沙调节机理。', questionText: '维护原则应是什么？', options: createYangtzeDecisionOptions('以混凝土全面固化河道为主。', '只修复出现故障的局部构件。', '尊重原有水动力逻辑，分区维护并以监测验证效果。', explain) },
    { id: 'dujiangyan-ecology', scenario: '灌区扩展可能压缩河道与湿地空间。', questionText: '应如何回应生态压力？', options: createYangtzeDecisionOptions('把生态空间全部转为高收益用地。', '完全停止所有灌区更新。', '划定河道与湿地底线，在节水改造中减少新增生态压力。', explain) },
    { id: 'dujiangyan-digital', scenario: '灌区计划引入数字监测和预报系统。', questionText: '技术应如何发挥作用？', options: createYangtzeDecisionOptions('只采集数据，不参与运行判断。', '用自动控制替代所有人工巡查。', '结合雨水情、闸控与巡查数据，辅助分级决策和复盘。', explain) },
    { id: 'dujiangyan-review', scenario: '一次汛期运行后，部分分水效果与预测不一致。', questionText: '下一步应怎样改进？', options: createYangtzeDecisionOptions('维持原方案，不记录偏差。', '只修改一个参数以追求表面稳定。', '复盘水沙、闸控和灌区响应，迭代下一轮运行方案。', explain) },
  ],
};

export { dujiangyanQuestionLevel };
