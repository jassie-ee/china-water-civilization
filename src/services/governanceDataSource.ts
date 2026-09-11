import type { GovernanceDataSource } from '@/types/governanceData';
import { getGovernanceProgress, saveGovernanceProgress, updateLevelBestStars } from '@/utils/governanceProgress';

/**
 * 全站治理星级与答题结果只保存到当前浏览器的 localStorage。
 * 不创建账户、不发起认证请求，也不会同步到其他设备。
 */
const localGovernanceDataSource: GovernanceDataSource = {
  loadProgress: async () => getGovernanceProgress(),
  recordLevelResult: async ({ currentProgress, levelId, completedStars }) => {
    const { progress, update } = updateLevelBestStars(currentProgress, levelId, completedStars);
    if (progress !== currentProgress) saveGovernanceProgress(progress);
    return { progress, update };
  },
};

export { localGovernanceDataSource as governanceDataSource };
