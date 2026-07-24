import { useCallback, useMemo, useState, type ReactNode } from 'react';

import type { GovernanceProgressState, GovernanceProgressUpdate } from '@/types/governanceProgress';
import {
  getGovernanceProgress,
  getTotalStars,
  saveGovernanceProgress,
  updateLevelBestStars,
} from '@/utils/governanceProgress';
import { GovernanceProgressContext } from './governanceProgressContext';

interface GovernanceProgressProviderProps {
  children: ReactNode;
}

function GovernanceProgressProvider({ children }: GovernanceProgressProviderProps) {
  const [progress, setProgress] = useState<GovernanceProgressState>(getGovernanceProgress);

  const getLevelBestStars = useCallback(
    (levelId: string): number => progress.levelBestStars[levelId] ?? 0,
    [progress.levelBestStars],
  );

  const recordLevelResult = useCallback(
    (levelId: string, completedStars: number): GovernanceProgressUpdate => {
      const { progress: nextProgress, update } = updateLevelBestStars(progress, levelId, completedStars);

      if (nextProgress !== progress) {
        saveGovernanceProgress(nextProgress);
        setProgress(nextProgress);
      }

      return update;
    },
    [progress],
  );

  const value = useMemo(
    () => ({
      totalStars: getTotalStars(progress),
      getLevelBestStars,
      recordLevelResult,
    }),
    [getLevelBestStars, progress, recordLevelResult],
  );

  return <GovernanceProgressContext.Provider value={value}>{children}</GovernanceProgressContext.Provider>;
}

export { GovernanceProgressProvider };
