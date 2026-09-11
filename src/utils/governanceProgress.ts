import type { GovernanceProgressState, GovernanceProgressUpdate } from '@/types/governanceProgress';
import { allChapterScoreLevelIds, chapterScoreGroups, type ChapterScoreGroupId } from '@/data/chapterScoreRegistry';

const governanceProgressStorageKey = 'chinese-water-ecological-civilization:governance-progress';
const chapterThreeMigrationStorageKey = 'chinese-water-ecological-civilization:chapter-three-score-reset-v1';

const emptyGovernanceProgress: GovernanceProgressState = {
  levelBestStars: {},
};

function getGovernanceProgress(): GovernanceProgressState {
  if (typeof window === 'undefined') return emptyGovernanceProgress;

  try {
    const storedValue = window.localStorage.getItem(governanceProgressStorageKey);
    if (storedValue === null) return emptyGovernanceProgress;

    const parsedValue: unknown = JSON.parse(storedValue);
    if (typeof parsedValue !== 'object' || parsedValue === null) return emptyGovernanceProgress;

    const levelBestStars = (parsedValue as { levelBestStars?: unknown }).levelBestStars;
    if (typeof levelBestStars !== 'object' || levelBestStars === null) return emptyGovernanceProgress;

    const validEntries = Object.entries(levelBestStars).filter(
      ([, stars]) => typeof stars === 'number' && Number.isInteger(stars) && stars >= 0 && stars <= 3,
    );

    const storedProgress = { levelBestStars: Object.fromEntries(validEntries) };
    if (window.localStorage.getItem(chapterThreeMigrationStorageKey) !== 'done') {
      const retainedEntries = Object.entries(storedProgress.levelBestStars)
        .filter(([levelId]) => !levelId.startsWith('chapter-3-'));
      const migratedProgress = { levelBestStars: Object.fromEntries(retainedEntries) };
      window.localStorage.setItem(chapterThreeMigrationStorageKey, 'done');
      saveGovernanceProgress(migratedProgress);
      return migratedProgress;
    }

    return storedProgress;
  } catch {
    return emptyGovernanceProgress;
  }
}

function saveGovernanceProgress(progress: GovernanceProgressState): void {
  if (typeof window === 'undefined') return;

  window.localStorage.setItem(governanceProgressStorageKey, JSON.stringify(progress));
}

function getTotalStars(progress: GovernanceProgressState): number {
  return [...allChapterScoreLevelIds].reduce(
    (total, levelId) => total + (progress.levelBestStars[levelId] ?? 0),
    0,
  );
}

function getChapterStars(progress: GovernanceProgressState, groupId: ChapterScoreGroupId): number {
  return chapterScoreGroups[groupId].levelIds.reduce(
    (total, levelId) => total + (progress.levelBestStars[levelId] ?? 0),
    0,
  );
}

function clearLevelBestStars(progress: GovernanceProgressState, levelIds?: readonly string[]): GovernanceProgressState {
  if (levelIds === undefined) return emptyGovernanceProgress;

  const levelIdSet = new Set(levelIds);
  const retainedEntries = Object.entries(progress.levelBestStars).filter(([levelId]) => !levelIdSet.has(levelId));

  return retainedEntries.length === Object.keys(progress.levelBestStars).length
    ? progress
    : { levelBestStars: Object.fromEntries(retainedEntries) };
}

function updateLevelBestStars(
  progress: GovernanceProgressState,
  levelId: string,
  completedStars: number,
): { progress: GovernanceProgressState; update: GovernanceProgressUpdate } {
  const previousBestStars = progress.levelBestStars[levelId] ?? 0;
  const currentBestStars = Math.min(3, Math.max(previousBestStars, completedStars));
  const didImprove = currentBestStars > previousBestStars;
  const nextProgress: GovernanceProgressState = didImprove
    ? { levelBestStars: { ...progress.levelBestStars, [levelId]: currentBestStars } }
    : progress;

  return {
    progress: nextProgress,
    update: {
      previousBestStars,
      currentBestStars,
      totalStars: getTotalStars(nextProgress),
      didImprove,
    },
  };
}

export {
  getGovernanceProgress,
  getChapterStars,
  getTotalStars,
  clearLevelBestStars,
  saveGovernanceProgress,
  updateLevelBestStars,
};
