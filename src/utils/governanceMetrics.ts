import type { GovernanceMetricId, GovernanceMetricValues } from '@/types/governanceLevel';

const governanceMetricLabels: Record<GovernanceMetricId, string> = {
  floodSafety: '防洪安全',
  sedimentControl: '泥沙控制',
  ecologicalStability: '生态稳定',
  engineeringBenefit: '工程收益',
};

const governanceMetricIds: GovernanceMetricId[] = [
  'floodSafety',
  'sedimentControl',
  'ecologicalStability',
  'engineeringBenefit',
];

function clampMetric(value: number): number {
  return Math.min(100, Math.max(0, value));
}

function calculateGovernanceResult(
  initialMetrics: GovernanceMetricValues,
  metricChanges: GovernanceMetricValues,
): GovernanceMetricValues {
  return {
    floodSafety: clampMetric(initialMetrics.floodSafety + metricChanges.floodSafety),
    sedimentControl: clampMetric(initialMetrics.sedimentControl + metricChanges.sedimentControl),
    ecologicalStability: clampMetric(initialMetrics.ecologicalStability + metricChanges.ecologicalStability),
    engineeringBenefit: clampMetric(initialMetrics.engineeringBenefit + metricChanges.engineeringBenefit),
  };
}

export {
  calculateGovernanceResult,
  governanceMetricIds,
  governanceMetricLabels,
};
