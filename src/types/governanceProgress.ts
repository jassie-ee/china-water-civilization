export interface GovernanceProgressRecord {
  levelId: string;
  bestStars: number;
}

export interface GovernanceProgressState {
  levelBestStars: Record<string, number>;
}

export interface GovernanceProgressUpdate {
  previousBestStars: number;
  currentBestStars: number;
  totalStars: number;
  didImprove: boolean;
}
