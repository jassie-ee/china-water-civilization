import { useLocation } from 'react-router-dom';

import { useGovernanceProgress } from './governanceProgressContext';

import './GovernanceProgress.css';

function GlobalScoreDisplay() {
  const location = useLocation();
  const { totalStars } = useGovernanceProgress();

  if (location.pathname === '/') return null;

  return (
    <div className="global-score-display" aria-label={`积分：${totalStars} 星`}>
      <span>积分</span>
      <span className="global-score-display__star" aria-hidden="true">★</span>
      <span>：{totalStars}</span>
    </div>
  );
}

export default GlobalScoreDisplay;
