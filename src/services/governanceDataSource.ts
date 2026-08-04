import { governanceQuestionLevelConfigs } from '@/data/governanceLevels/questionLevelConfigs';
import type { GovernanceDataSource } from '@/types/governanceData';
import { clearLevelBestStars, getGovernanceProgress, saveGovernanceProgress, updateLevelBestStars } from '@/utils/governanceProgress';

/**
 * 当前 demo 的数据源：关卡配置来自本地代码，账户进度保存在浏览器本机。
 * 后续接 API 时，仅替换此模块导出的实现。
 */
const localGovernanceDataSource: GovernanceDataSource = {
  getQuestionLevelConfig: (levelId) => (
    governanceQuestionLevelConfigs.find((level) => level.levelId === levelId) ?? null
  ),
  getQuestionLevelConfigs: () => governanceQuestionLevelConfigs,
  loadProgress: async () => getGovernanceProgress(),
  recordLevelResult: async ({ currentProgress, levelId, completedStars }) => {
    const { progress, update } = updateLevelBestStars(currentProgress, levelId, completedStars);

    if (progress !== currentProgress) {
      saveGovernanceProgress(progress);
    }

    return { progress, update };
  },
  clearProgress: async (_accountId, currentProgress, scope) => {
    const levelIds = scope === 'all'
      ? undefined
      : governanceQuestionLevelConfigs
        .filter((level) => level.basinId === scope)
        .map((level) => level.levelId);
    const progress = clearLevelBestStars(currentProgress, levelIds);

    if (progress !== currentProgress) saveGovernanceProgress(progress);
    return progress;
  },
};

const governanceDataSource = localGovernanceDataSource;

export { governanceDataSource };
