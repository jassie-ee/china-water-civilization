import type { GovernanceQuestionAnswerRecord, GovernanceQuestionOption } from '@/types/governanceLevel';
import { governanceMetricIds, governanceMetricLabels } from '@/utils/governanceMetrics';

import StarScore from './StarScore';

interface FeedbackCardProps {
  answer: GovernanceQuestionAnswerRecord;
  option: GovernanceQuestionOption;
  totalStars: number;
  continueLabel: string;
  onContinue: () => void;
  onReconsider: () => void;
}

function FeedbackCard({
  answer,
  option,
  totalStars,
  continueLabel,
  onContinue,
  onReconsider,
}: FeedbackCardProps) {
  return (
    <section className="governance-feedback-card" aria-live="polite" aria-labelledby="governance-feedback-title">
      <p className="governance-feedback-card__eyebrow">本题反馈</p>
      <h2 id="governance-feedback-title">本题获得 {answer.earnedStars} 星 · 本关累计 {totalStars} 星</h2>
      <div className="governance-feedback-card__score-row">
        <StarScore stars={answer.earnedStars} />
        <span>{answer.earnedStars} / 3 星</span>
      </div>
      <p className="governance-feedback-card__feedback">{option.feedback}</p>
      <dl className="governance-feedback-card__metrics">
        {governanceMetricIds.map((metricId) => {
          const change = answer.metricChanges[metricId];

          return (
            <div key={metricId}>
              <dt>{governanceMetricLabels[metricId]}</dt>
              <dd className={change >= 0 ? 'is-positive' : 'is-negative'}>{change >= 0 ? '+' : ''}{change}</dd>
            </div>
          );
        })}
      </dl>
      <section className="governance-feedback-card__explanation">
        <h3>知识解释</h3>
        <p>{option.explanation}</p>
      </section>
      <div className="governance-feedback-card__actions">
        <button className="governance-feedback-card__continue" type="button" onClick={onContinue}>{continueLabel}</button>
        <button className="governance-feedback-card__reconsider" type="button" onClick={onReconsider}>重新考虑本题</button>
      </div>
    </section>
  );
}

export default FeedbackCard;
