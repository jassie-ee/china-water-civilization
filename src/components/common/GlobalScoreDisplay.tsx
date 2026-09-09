import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';

import type { GovernanceProgressScope } from '@/types/governanceData';

import { useGovernanceProgress } from './governanceProgressContext';

import './GovernanceProgress.css';

interface ScoreCardProps {
  title: string;
  stars: number;
  scope: GovernanceProgressScope;
  clearLabel: string;
  pendingScope: GovernanceProgressScope | null;
  onRequestClear: (scope: GovernanceProgressScope) => void;
  onCancelClear: () => void;
  onConfirmClear: () => void;
}

function ScoreCard({ title, stars, scope, clearLabel, pendingScope, onRequestClear, onCancelClear, onConfirmClear }: ScoreCardProps) {
  const isConfirming = pendingScope === scope;

  return (
    <section className={`score-popover__card score-popover__card--${scope}`}>
      <div>
        <p>{title}</p>
        <strong>{stars}<span aria-hidden="true">★</span></strong>
      </div>
      {isConfirming ? (
        <div className="score-popover__confirmation" aria-live="polite">
          <span>确认清空？</span>
          <div className="score-popover__confirm-actions">
            <button type="button" aria-label={`确认清空${title}治理星级`} title="确认清空" onClick={onConfirmClear}>√</button>
            <button type="button" aria-label={`取消清空${title}治理星级`} title="取消" onClick={onCancelClear}>×</button>
          </div>
        </div>
      ) : (
        <button className="score-popover__clear" type="button" onClick={() => onRequestClear(scope)}>{clearLabel}</button>
      )}
    </section>
  );
}

function GlobalScoreDisplay() {
  const location = useLocation();
  const { totalStars, getBasinStars, clearProgress } = useGovernanceProgress();
  const [isOpen, setIsOpen] = useState(false);
  const [pendingClearScope, setPendingClearScope] = useState<GovernanceProgressScope | null>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const handleClose = (): void => {
    setIsOpen(false);
    setPendingClearScope(null);
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

  const handleConfirmClear = async (): Promise<void> => {
    if (pendingClearScope === null) return;
    await clearProgress(pendingClearScope);
    setPendingClearScope(null);
  };

  if (!location.pathname.startsWith('/basins')) return null;

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
              <div><p>水脉治理档案</p><h2 id="score-popover-title">我的治理星级</h2></div>
              <button ref={closeButtonRef} className="score-popover__close" type="button" aria-label="关闭治理星级面板" onClick={handleClose}>×</button>
            </header>
            <div className="score-popover__cards">
              <ScoreCard title="总治理星级" stars={totalStars} scope="all" clearLabel="清空全部治理星级" pendingScope={pendingClearScope} onRequestClear={setPendingClearScope} onCancelClear={() => setPendingClearScope(null)} onConfirmClear={handleConfirmClear} />
              <p className="score-popover__basin-heading">三大流域治理星级</p>
              <ScoreCard title="黄河治理星级" stars={getBasinStars('yellow-river')} scope="yellow-river" clearLabel="清空黄河治理星级" pendingScope={pendingClearScope} onRequestClear={setPendingClearScope} onCancelClear={() => setPendingClearScope(null)} onConfirmClear={handleConfirmClear} />
              <ScoreCard title="长江治理星级" stars={getBasinStars('yangtze-river')} scope="yangtze-river" clearLabel="清空长江治理星级" pendingScope={pendingClearScope} onRequestClear={setPendingClearScope} onCancelClear={() => setPendingClearScope(null)} onConfirmClear={handleConfirmClear} />
              <ScoreCard title="珠江治理星级" stars={getBasinStars('pearl-river')} scope="pearl-river" clearLabel="清空珠江治理星级" pendingScope={pendingClearScope} onRequestClear={setPendingClearScope} onCancelClear={() => setPendingClearScope(null)} onConfirmClear={handleConfirmClear} />
            </div>
          </section>
        </div>
      )}
    </>
  );
}

export default GlobalScoreDisplay;
