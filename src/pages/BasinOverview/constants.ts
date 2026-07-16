const basinOverviewTimings = {
  dropLanding: 500,
  sourceRippling: 1350,
  riversAwakening: 2200,
  interactive: 4700,
  selectionTransition: 360,
} as const;

const reducedMotionBasinOverviewTimings = {
  dropLanding: 80,
  sourceRippling: 140,
  riversAwakening: 220,
  interactive: 360,
  selectionTransition: 0,
} as const;

export { basinOverviewTimings, reducedMotionBasinOverviewTimings };
