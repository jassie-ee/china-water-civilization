import { governanceQuestionLevelConfigs } from '@/data/governanceLevels/questionLevelConfigs';
import type { GovernanceDataSource } from '@/types/governanceData';
import { clearLevelBestStars, getGovernanceProgress, saveGovernanceProgress, updateLevelBestStars } from '@/utils/governanceProgress';

/**
 * 全站治理星级与答题结果只保存到当前浏览器的 localStorage。
 * 不创建账户、不发起认证请求，也不会同步到其他设备。
 */
const localGovernanceDataSource: GovernanceDataSource = {
  getQuestionLevelConfig: (levelId) => (
    governanceQuestionLevelConfigs.find((level) => level.levelId === levelId) ?? null
  ),
  getQuestionLevelConfigs: () => governanceQuestionLevelConfigs,
  loadProgress: async () => getGovernanceProgress(),
  recordLevelResult: async ({ currentProgress, levelId, completedStars }) => {
    const { progress, update } = updateLevelBestStars(currentProgress, levelId, completedStars);
    if (progress !== currentProgress) saveGovernanceProgress(progress);
    return { progress, update };
  },
  clearProgress: async (currentProgress, scope) => {
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

export { localGovernanceDataSource as governanceDataSource };
