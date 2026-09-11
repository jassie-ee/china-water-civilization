import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';

import type { GovernanceProgressState, GovernanceProgressUpdate } from '@/types/governanceProgress';
import { governanceDataSource } from '@/services/governanceDataSource';
import { getChapterStars, getTotalStars } from '@/utils/governanceProgress';
import type { ChapterScoreGroupId } from '@/data/chapterScoreRegistry';
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

  const getChapterScore = useCallback(
    (groupId: ChapterScoreGroupId): number => getChapterStars(progress, groupId),
    [progress],
  );

  const value = useMemo(
    () => ({
      totalStars: getTotalStars(progress),
      getLevelBestStars,
      getChapterStars: getChapterScore,
      recordLevelResult,
      refreshProgress,
    }),
    [getChapterScore, getLevelBestStars, progress, recordLevelResult, refreshProgress],
  );

  return <GovernanceProgressContext.Provider value={value}>{children}</GovernanceProgressContext.Provider>;
}

export { GovernanceProgressProvider };
