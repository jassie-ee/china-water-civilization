import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';

import type { GovernanceProgressState, GovernanceProgressUpdate } from '@/types/governanceProgress';
import type { GovernanceProgressScope } from '@/types/governanceData';
import type { BasinId } from '@/types/basin';
import { governanceDataSource } from '@/services/governanceDataSource';
import { getTotalStars } from '@/utils/governanceProgress';
import { GovernanceProgressContext } from './governanceProgressContext';

interface GovernanceProgressProviderProps {
  children: ReactNode;
}

const emptyProgress: GovernanceProgressState = { levelBestStars: {} };

function GovernanceProgressProvider({ children }: GovernanceProgressProviderProps) {
  const [progress, setProgress] = useState<GovernanceProgressState>(emptyProgress);

  const refreshProgress = useCallback(async (): Promise<void> => {
    const savedProgress = await governanceDataSource.loadProgress();
    setProgress(savedProgress);
  }, []);

  useEffect(() => {
    let isMounted = true;

    void governanceDataSource.loadProgress().then((savedProgress) => {
      if (isMounted) setProgress(savedProgress);
    }).catch(() => {
      if (isMounted) setProgress(emptyProgress);
    });

    return () => {
      isMounted = false;
    };
  }, []);

  const getLevelBestStars = useCallback(
    (levelId: string): number => progress.levelBestStars[levelId] ?? 0,
    [progress.levelBestStars],
  );

  const recordLevelResult = useCallback(
    async (levelId: string, completedStars: number): Promise<GovernanceProgressUpdate> => {
      const { progress: nextProgress, update } = await governanceDataSource.recordLevelResult({
        currentProgress: progress,
        levelId,
        completedStars,
      });

      setProgress(nextProgress);
      return update;
    },
    [progress],
  );

  const getBasinStars = useCallback(
    (basinId: BasinId): number => governanceDataSource
      .getQuestionLevelConfigs()
      .filter((level) => level.basinId === basinId)
      .reduce((total, level) => total + (progress.levelBestStars[level.levelId] ?? 0), 0),
    [progress.levelBestStars],
  );

  const clearProgress = useCallback(
    async (scope: GovernanceProgressScope): Promise<void> => {
      const nextProgress = await governanceDataSource.clearProgress(progress, scope);
      setProgress(nextProgress);
    },
    [progress],
  );

  const value = useMemo(
    () => ({
      totalStars: getTotalStars(progress),
      getLevelBestStars,
      getBasinStars,
      recordLevelResult,
      clearProgress,
      refreshProgress,
    }),
    [clearProgress, getBasinStars, getLevelBestStars, progress, recordLevelResult, refreshProgress],
  );

  return <GovernanceProgressContext.Provider value={value}>{children}</GovernanceProgressContext.Provider>;
}

export { GovernanceProgressProvider };
