import type { GovernanceMetricValues } from '@/types/governanceLevel';
import { governanceMetricIds, governanceMetricLabels } from '@/utils/governanceMetrics';

interface GovernanceMetricPanelProps {
  initialMetrics: GovernanceMetricValues;
  finalMetrics?: GovernanceMetricValues;
  metricChanges?: GovernanceMetricValues;
  compact?: boolean;
}

function GovernanceMetricPanel({ initialMetrics, finalMetrics, metricChanges, compact = false }: GovernanceMetricPanelProps) {
  const metrics = finalMetrics ?? initialMetrics;

  return (
    <div className={`governance-metrics${compact ? ' governance-metrics--compact' : ''}`} aria-label="治理指标">
      {governanceMetricIds.map((metricId) => {
        const initialValue = initialMetrics[metricId];
        const finalValue = metrics[metricId];
        const change = metricChanges?.[metricId];

        return (
          <article key={metricId} className="governance-metrics__item">
            <div className="governance-metrics__heading">
              <span>{governanceMetricLabels[metricId]}</span>
              <strong>{finalMetrics ? `${initialValue} → ${finalValue}` : initialValue}</strong>
            </div>
            <div className="governance-metrics__track" aria-hidden="true"><i style={{ width: `${finalValue}%` }} /></div>
            {change !== undefined && <small className={change >= 0 ? 'is-positive' : 'is-negative'}>{change >= 0 ? '↑ ' : '↓ '}{`${change >= 0 ? '+' : ''}${change}`}</small>}
          </article>
        );
      })}
    </div>
  );
}

export default GovernanceMetricPanel;
