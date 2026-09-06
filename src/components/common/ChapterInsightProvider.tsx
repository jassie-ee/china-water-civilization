import { useCallback, useMemo, useState, type ReactNode } from 'react';

import { ChapterInsightContext } from './chapterInsightContext';

const STORAGE_KEY = 'water-chronicle-chapter-one-progress';

interface ChapterInsightProviderProps {
  children: ReactNode;
}

interface StoredChapterInsight {
  awakenedMemories: number[];
}

function readProgress(): number[] {
  try {
    const storedValue = window.localStorage.getItem(STORAGE_KEY);
    const storedProgress = storedValue === null ? null : JSON.parse(storedValue) as StoredChapterInsight;
    const memories = storedProgress?.awakenedMemories ?? [];

    return memories.filter((memory, index) => Number.isInteger(memory) && memory >= 1 && memory <= 3 && memories.indexOf(memory) === index);
  } catch {
    return [];
  }
}

function persistProgress(awakenedMemories: number[]): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ awakenedMemories }));
  } catch {
    // 隐私模式或存储受限时，仍保留当前会话内进度。
  }
}

function ChapterInsightProvider({ children }: ChapterInsightProviderProps) {
  const [awakenedMemories, setAwakenedMemories] = useState<number[]>(readProgress);

  const completeMemory = useCallback((memoryId: number) => {
    setAwakenedMemories((currentMemories) => {
      if (currentMemories.includes(memoryId)) return currentMemories;

      const nextMemories = [...currentMemories, memoryId].sort((left, right) => left - right);
      persistProgress(nextMemories);
      return nextMemories;
    });
  }, []);

  const resetChapterInsight = useCallback(() => {
    persistProgress([]);
    setAwakenedMemories([]);
  }, []);

  const value = useMemo(() => ({
    insight: awakenedMemories.length * 10,
    awakenedMemories,
    completeMemory,
    resetChapterInsight,
  }), [awakenedMemories, completeMemory, resetChapterInsight]);

  return <ChapterInsightContext.Provider value={value}>{children}</ChapterInsightContext.Provider>;
}

export default ChapterInsightProvider;
