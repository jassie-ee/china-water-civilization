import { createContext, useContext } from 'react';

export interface ChapterInsightContextValue {
  insight: number;
  awakenedMemories: number[];
  completeMemory: (memoryId: number) => void;
  resetChapterInsight: () => void;
}

export const ChapterInsightContext = createContext<ChapterInsightContextValue | null>(null);

export function useChapterInsight(): ChapterInsightContextValue {
  const context = useContext(ChapterInsightContext);

  if (context === null) {
    throw new Error('useChapterInsight 必须在 ChapterInsightProvider 内使用。');
  }

  return context;
}
