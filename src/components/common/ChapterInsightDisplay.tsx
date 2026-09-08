import { useLocation } from 'react-router-dom';

import { useChapterInsight } from './chapterInsightContext';
import './GovernanceProgress.css';

function ChapterInsightDisplay() {
  const location = useLocation();
  const { insight } = useChapterInsight();

  if (location.pathname !== '/chapters/chapter-1') return null;

  return (
    <p className="chapter-insight-display" aria-label={`第一章水脉感悟值：${insight}/30`}>
      <span>水脉感悟值</span>
      <strong>{insight}/30</strong>
    </p>
  );
}

export default ChapterInsightDisplay;
