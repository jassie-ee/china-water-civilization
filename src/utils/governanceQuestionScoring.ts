import type {
  GovernanceMetricValues,
  GovernanceQuestionAnswerRecord,
} from '@/types/governanceLevel';

function calculateAccumulatedMetricChanges(
  answers: GovernanceQuestionAnswerRecord[],
): GovernanceMetricValues {
  return answers.reduce<GovernanceMetricValues>((total, answer) => ({
    floodSafety: total.floodSafety + answer.metricChanges.floodSafety,
    sedimentControl: total.sedimentControl + answer.metricChanges.sedimentControl,
    ecologicalStability: total.ecologicalStability + answer.metricChanges.ecologicalStability,
    engineeringBenefit: total.engineeringBenefit + answer.metricChanges.engineeringBenefit,
  }), {
    floodSafety: 0,
    sedimentControl: 0,
    ecologicalStability: 0,
    engineeringBenefit: 0,
  });
}

export {
  calculateAccumulatedMetricChanges,
};
