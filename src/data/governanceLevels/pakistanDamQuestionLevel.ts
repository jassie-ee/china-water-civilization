import type { GovernanceMetricValues, GovernanceQuestionLevelConfig } from '@/types/governanceLevel';

import { createGlobalWaterDecisionOptions } from './globalWaterQuestionOptions';

// PDF 第三章·走出国门 第 2 站·调节水：巴基斯坦印度河水利枢纽
// PDF 原题：三选（ABC 正确，D 网箱养鱼造成水体污染故不可纳入枢纽主责）

const initialMetrics: GovernanceMetricValues = { floodSafety: 50, sedimentControl: 50, ecologicalStability: 50, engineeringBenefit: 50 };
const explain = '巴基斯坦印度河洪水与枯水季节差异极大，水利枢纽应承担防洪、供水与发电三大主责，把洪水转化为旱季可用资源；库区网箱养鱼易污染水质，与枢纽核心功能冲突，不应纳入主责清单。';

const pakistanDamQuestionLevel: GovernanceQuestionLevelConfig = {
  basinId: 'global-water',
  levelId: 'pakistan-dam',
  title: '巴基斯坦印度河：把洪水变成旱季的资源',
  description: '在印度河干支流完成四次连续判断，明确一座枢纽真正应承担的核心职责。',
  initialMetrics,
  evaluation: {
    title: '立足主责、把洪水调成资源',
    description: '巴基斯坦水利枢纽的关键启示：工程主责须围绕防洪、供水、发电展开；与水质相冲突的高密度养殖不应纳入枢纽核心任务。',
  },
  questions: [
    {
      id: 'pakistan-dam-core',
      scenario: '印度河季节性水量极不均匀：夏汛洪水冲毁村庄，冬旱河道见底、农田无水可灌。',
      questionText: '面向这种"两极化"来水，枢纽最核心的三项任务应是？',
      options: createGlobalWaterDecisionOptions(
        '仅承担供水一项任务，其他留给其他工程与生态',
        '防洪 + 供水两项任务，暂不涉及发电',
        '防洪 + 供水 + 发电三项核心任务，让洪水在旱季成为可用资源',
        explain,
      ),
    },
    {
      id: 'pakistan-dam-storage',
      scenario: '枢纽库容有限，必须明确哪些水量值得优先储存。',
      questionText: '为什么"雨季把多余洪水存进水库"是枢纽的第一优先？',
      options: createGlobalWaterDecisionOptions(
        '洪水留不下就下泄，对工程不存在任何长期价值',
        '洪水下泄后会冲刷下游，但库区无须腾出防洪库容',
        '把洪水量存入水库是后续旱季供水、灌溉与发电的物质基础，不蓄洪等于把整条河的水资源浪费在洪水期',
        explain,
      ),
    },
    {
      id: 'pakistan-dam-power',
      scenario: '枢纽同时具备发电潜力，可考虑纳入能源调度。',
      questionText: '为什么把"借水位落差发电"列为枢纽主责之一是合理的？',
      options: createGlobalWaterDecisionOptions(
        '发电与防洪、供水存在天然矛盾，不可兼得',
        '发电只能作为附属，不能为周边村子供电',
        '在同一库容中发电，可让枢纽在承担防洪供水之外为周边社区提供清洁能源，体现工程效益的系统性',
        explain,
      ),
    },
    {
      id: 'pakistan-dam-cage-fish',
      scenario: '有人提议在库区发展网箱养鱼以增加收入。',
      questionText: '为什么"库区大面积发展网箱养鱼"不应作为枢纽主责？',
      options: createGlobalWaterDecisionOptions(
        '库区水温不适合任何鱼类生长',
        '网箱养鱼可大幅提升水质，应作为主责',
        '高密度网箱养鱼易造成水体富营养化与污染，与枢纽承担的供水、灌溉与生态用水功能冲突；可由其他主体在合适区域开展，但不应成为枢纽主责',
        explain,
      ),
    },
  ],
};

export { pakistanDamQuestionLevel };