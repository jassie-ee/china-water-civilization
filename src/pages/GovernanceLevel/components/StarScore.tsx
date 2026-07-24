import type { GovernanceQuestionStarCount } from '@/types/governanceLevel';

interface StarScoreProps {
  stars: GovernanceQuestionStarCount;
  label?: string;
}

function StarScore({ stars, label = '本题星级' }: StarScoreProps) {
  return (
    <span className="governance-star-score" role="img" aria-label={`${label}：${stars} / 3 星`}>
      {[0, 1, 2].map((starIndex) => (
        <span
          key={starIndex}
          className={`governance-star-score__star${starIndex < stars ? ' is-earned' : ''}`}
          aria-hidden="true"
        >
          ★
        </span>
      ))}
    </span>
  );
}

export default StarScore;
