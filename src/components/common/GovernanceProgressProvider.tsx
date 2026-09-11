import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';

import type { GovernanceProgressState, GovernanceProgressUpdate } from '@/types/governanceProgress';
import type { GovernanceChapterScope, GovernanceProgressScope } from '@/types/governanceData';
import type { BasinId } from '@/types/basin';
import { governanceDataSource } from '@/services/governanceDataSource';
import { getTotalStars } from '@/utils/governanceProgress';
import { useAccount } from './accountContext';
import { GovernanceProgressContext } from './governanceProgressContext';

interface GovernanceProgressProviderProps {
  children: ReactNode;
}

const demoAccountId = 'local-demo-account';
const emptyProgress: GovernanceProgressState = { levelBestStars: {} };

function GovernanceProgressProvider({ children }: GovernanceProgressProviderProps) {
  const { user } = useAccount();
  const [progress, setProgress] = useState<GovernanceProgressState>(emptyProgress);
  const accountId = user?.id ?? demoAccountId;

  const refreshProgress = useCallback(async (): Promise<void> => {
    const savedProgress = await governanceDataSource.loadProgress(accountId);
    setProgress(savedProgress);
  }, [accountId]);

  useEffect(() => {
    let isMounted = true;

    void governanceDataSource.loadProgress(accountId).then((savedProgress) => {
      if (isMounted) setProgress(savedProgress);
    }).catch(() => {
      if (isMounted) setProgress(emptyProgress);
    });

    return () => {
      isMounted = false;
    };
  }, [accountId]);

  const getLevelBestStars = useCallback(
    (levelId: string): number => progress.levelBestStars[levelId] ?? 0,
    [progress.levelBestStars],
  );

  const recordLevelResult = useCallback(
    async (levelId: string, completedStars: number): Promise<GovernanceProgressUpdate> => {
      const { progress: nextProgress, update } = await governanceDataSource.recordLevelResult({
        accountId,
        currentProgress: progress,
        levelId,
        completedStars,
      });

      setProgress(nextProgress);
      return update;
    },
    [accountId, progress],
  );

  const getBasinStars = useCallback(
    (basinId: BasinId): number => governanceDataSource
      .getQuestionLevelConfigs()
      .filter((level) => level.basinId === basinId)
      .reduce((total, level) => total + (progress.levelBestStars[level.levelId] ?? 0), 0),
    [progress.levelBestStars],
  );

  const getChapterStars = useCallback(
    (chapterId: GovernanceChapterScope): number => Object.entries(progress.levelBestStars)
      .filter(([levelId]) => levelId.startsWith(`${chapterId}-`))
      .reduce((total, [, stars]) => total + stars, 0),
    [progress.levelBestStars],
  );

  const clearProgress = useCallback(
    async (scope: GovernanceProgressScope): Promise<void> => {
      const nextProgress = await governanceDataSource.clearProgress(accountId, progress, scope);
      setProgress(nextProgress);
    },
    [accountId, progress],
  );

  const value = useMemo(
    () => ({
      totalStars: getTotalStars(progress),
      getLevelBestStars,
      getBasinStars,
      getChapterStars,
      recordLevelResult,
      clearProgress,
      refreshProgress,
    }),
    [clearProgress, getBasinStars, getChapterStars, getLevelBestStars, progress, recordLevelResult, refreshProgress],
  );

  return <GovernanceProgressContext.Provider value={value}>{children}</GovernanceProgressContext.Provider>;
}

export { GovernanceProgressProvider };
