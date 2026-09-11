import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';

import { useGovernanceProgress } from './governanceProgressContext';

import './GovernanceProgress.css';

interface ScoreCardProps {
  title: string;
  stars: number;
}

function ScoreCard({ title, stars }: ScoreCardProps) {
  return (
    <section className="score-popover__card">
      <div>
        <p>{title}</p>
        <strong>{stars}<span aria-hidden="true">★</span></strong>
      </div>
    </section>
  );
}

function GlobalScoreDisplay() {
  const location = useLocation();
  const { totalStars, getChapterStars } = useGovernanceProgress();
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const handleClose = (): void => {
    setIsOpen(false);
    window.requestAnimationFrame(() => triggerRef.current?.focus());
  };

  useEffect(() => {
    if (!isOpen) return undefined;

    closeButtonRef.current?.focus();
    const handleKeyDown = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') handleClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  if (!['/basins', '/chapter-3', '/chapter-4'].some((path) => location.pathname.startsWith(path))) return null;

  return (
    <>
      <button ref={triggerRef} className="global-score-display" type="button" aria-haspopup="dialog" aria-expanded={isOpen} aria-controls="score-popover" onClick={() => (isOpen ? handleClose() : setIsOpen(true))}>
        <span className="global-score-display__label">治理星级</span>
        <span className="global-score-display__star" aria-hidden="true">★</span>
        <strong className="global-score-display__value">{totalStars}</strong>
      </button>
      {isOpen && (
        <div className="score-popover__backdrop" role="presentation" onClick={handleClose}>
          <section id="score-popover" className="score-popover" role="dialog" aria-modal="true" aria-labelledby="score-popover-title" onClick={(event) => event.stopPropagation()}>
            <header className="score-popover__header">
              <div><p>水脉学习档案</p><h2 id="score-popover-title">我的治理星级</h2></div>
              <button ref={closeButtonRef} className="score-popover__close" type="button" aria-label="关闭治理星级面板" onClick={handleClose}>×</button>
            </header>
            <div className="score-popover__cards">
              <ScoreCard title="总治理积分" stars={totalStars} />
              <p className="score-popover__basin-heading">治 · 航 · 望</p>
              <ScoreCard title="治 · 第二章" stars={getChapterStars('zhi')} />
              <ScoreCard title="航 · 第三章" stars={getChapterStars('hang')} />
              <ScoreCard title="望 · 第四章" stars={getChapterStars('wang')} />
            </div>
          </section>
        </div>
      )}
    </>
  );
}

export default GlobalScoreDisplay;
