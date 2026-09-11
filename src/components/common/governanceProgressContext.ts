import { createContext, useContext } from 'react';

import type { GovernanceProgressUpdate } from '@/types/governanceProgress';
import type { GovernanceChapterScope, GovernanceProgressScope } from '@/types/governanceData';
import type { BasinId } from '@/types/basin';

interface GovernanceProgressContextValue {
  totalStars: number;
  getLevelBestStars: (levelId: string) => number;
  getBasinStars: (basinId: BasinId) => number;
  getChapterStars: (chapterId: GovernanceChapterScope) => number;
  recordLevelResult: (levelId: string, completedStars: number) => Promise<GovernanceProgressUpdate>;
  clearProgress: (scope: GovernanceProgressScope) => Promise<void>;
  refreshProgress: () => Promise<void>;
}

const GovernanceProgressContext = createContext<GovernanceProgressContextValue | null>(null);

function useGovernanceProgress(): GovernanceProgressContextValue {
  const context = useContext(GovernanceProgressContext);
  if (context === null) {
    throw new Error('useGovernanceProgress 必须在 GovernanceProgressProvider 内使用。');
  }

  return context;
}

export { GovernanceProgressContext, useGovernanceProgress };
