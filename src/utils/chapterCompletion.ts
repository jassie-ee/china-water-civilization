const chapterCompletionStorageKey = 'chinese-water-ecological-civilization:chapter-completion';

interface ChapterCompletionState {
  chapter3: boolean;
  chapter4: boolean;
}

const emptyChapterCompletion: ChapterCompletionState = {
  chapter3: false,
  chapter4: false,
};

function loadChapterCompletion(): ChapterCompletionState {
  if (typeof window === 'undefined') return emptyChapterCompletion;

  try {
    const storedValue = window.localStorage.getItem(chapterCompletionStorageKey);
    if (storedValue === null) return emptyChapterCompletion;

    const parsedValue: unknown = JSON.parse(storedValue);
    if (typeof parsedValue !== 'object' || parsedValue === null) return emptyChapterCompletion;

    const value = parsedValue as Partial<ChapterCompletionState>;
    return {
      chapter3: value.chapter3 === true,
      chapter4: value.chapter4 === true,
    };
  } catch {
    return emptyChapterCompletion;
  }
}

function markChapterComplete(chapter: keyof ChapterCompletionState): ChapterCompletionState {
  const nextState = { ...loadChapterCompletion(), [chapter]: true };
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(chapterCompletionStorageKey, JSON.stringify(nextState));
  }
  return nextState;
}

export type { ChapterCompletionState };
export { loadChapterCompletion, markChapterComplete };
