import { createContext, useContext } from 'react';

import type { GovernanceProgressUpdate } from '@/types/governanceProgress';
import type { ChapterScoreGroupId } from '@/data/chapterScoreRegistry';

interface GovernanceProgressContextValue {
  totalStars: number;
  getLevelBestStars: (levelId: string) => number;
  getChapterStars: (groupId: ChapterScoreGroupId) => number;
  recordLevelResult: (levelId: string, completedStars: number) => Promise<GovernanceProgressUpdate>;
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
