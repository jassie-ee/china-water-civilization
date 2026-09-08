import type { BasinOverviewEntry } from '@/types/basin';

const basinOverviewEntryTimings: Record<Exclude<BasinOverviewEntry, 'returning'>, {
  dropLanding: number;
  sourceRippling: number;
  riversAwakening: number;
  interactive: number;
}> = {
  intro: { dropLanding: 420, sourceRippling: 1250, riversAwakening: 2050, interactive: 4550 },
  skipped: { dropLanding: 120, sourceRippling: 380, riversAwakening: 620, interactive: 1300 },
  direct: { dropLanding: 220, sourceRippling: 760, riversAwakening: 1100, interactive: 2900 },
  'chapter-overview': { dropLanding: 180, sourceRippling: 620, riversAwakening: 940, interactive: 2200 },
};

const reducedMotionBasinOverviewTimings = {
  dropLanding: 60,
  sourceRippling: 110,
  riversAwakening: 180,
  interactive: 320,
} as const;

const basinSelectionTransitionDelay = 300;

export { basinOverviewEntryTimings, basinSelectionTransitionDelay, reducedMotionBasinOverviewTimings };
