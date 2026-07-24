import type { GovernanceQuestionAnswerRecord, GovernanceQuestionLevelConfig } from '@/types/governanceLevel';
import type { GovernanceProgressUpdate } from '@/types/governanceProgress';
import { calculateGovernanceResult } from '@/utils/governanceMetrics';
import { calculateAccumulatedMetricChanges } from '@/utils/governanceQuestionScoring';

import GovernanceMetricPanel from './GovernanceMetricPanel';
import StarScore from './StarScore';

interface ResultPanelProps {
  level: GovernanceQuestionLevelConfig;
  answers: GovernanceQuestionAnswerRecord[];
  progressUpdate: GovernanceProgressUpdate | null;
}

function ResultPanel({ level, answers, progressUpdate }: ResultPanelProps) {
  const totalStars = answers.reduce((total, answer) => total + answer.earnedStars, 0);
  const metricChanges = calculateAccumulatedMetricChanges(answers);
  const finalMetrics = calculateGovernanceResult(level.initialMetrics, metricChanges);

  return (
    <section className="governance-question-result" aria-live="polite" aria-labelledby="governance-question-result-title">
      <p className="governance-question-result__eyebrow">治理结果</p>
      <h2 id="governance-question-result-title">完成 {answers.length} 题 · 本次获得 {totalStars} 星</h2>
      {progressUpdate !== null && (
        <p className="governance-question-result__history">
          历史最佳 {progressUpdate.currentBestStars} 星 · 全站积分 ★：{progressUpdate.totalStars}
          {progressUpdate.didImprove ? '（已更新）' : '（历史纪录保持不变）'}
        </p>
      )}
      <div className="governance-question-result__stars" aria-label="星级轨迹">
        {answers.map((answer) => (
          <div key={answer.questionId}>
            <span>第 {answer.questionNumber} 题</span>
            <StarScore stars={answer.earnedStars} label={`第 ${answer.questionNumber} 题星级`} />
          </div>
        ))}
      </div>
      <section className="governance-question-result__metrics" aria-labelledby="governance-question-result-metrics-title">
        <h3 id="governance-question-result-metrics-title">四项治理指标</h3>
        <GovernanceMetricPanel
          initialMetrics={level.initialMetrics}
          finalMetrics={finalMetrics}
          metricChanges={metricChanges}
        />
      </section>
      <section className="governance-question-result__evaluation" aria-labelledby="governance-question-evaluation-title">
        <h3 id="governance-question-evaluation-title">治理评价</h3>
        <strong>{level.evaluation.title}</strong>
        <p>{level.evaluation.description}</p>
      </section>
    </section>
  );
}

export default ResultPanel;
