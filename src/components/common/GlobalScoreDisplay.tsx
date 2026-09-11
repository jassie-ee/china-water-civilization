import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';

import type { GovernanceProgressScope } from '@/types/governanceData';
import scoreClearPlate from '@/assets/images/lan/score-clear-plate.webp';
import scoreClosePlate from '@/assets/images/lan/score-close-plate.webp';
import scoreDisplayPlate from '@/assets/images/lan/score-display-plate.webp';
import scorePopoverInkFrame from '@/assets/images/lan/score-popover-ink-frame-v2.webp';

import { useGovernanceProgress } from './governanceProgressContext';

import './GovernanceProgress.css';

interface ScoreCardProps {
  title: string;
  subtitle?: string;
  stars: number;
  scope: GovernanceProgressScope;
  clearLabel: string;
  pendingScope: GovernanceProgressScope | null;
  onRequestClear: (scope: GovernanceProgressScope) => void;
  onCancelClear: () => void;
  onConfirmClear: () => void;
}

function ScoreCard({ title, subtitle, stars, scope, clearLabel, pendingScope, onRequestClear, onCancelClear, onConfirmClear }: ScoreCardProps) {
  const isConfirming = pendingScope === scope;

  return (
    <section className={`score-popover__card${scope === 'all' ? ' score-popover__card--primary' : ''}`}>
      <div>
        <p>
          <span className="score-popover__card-kicker">{title}</span>
          {subtitle !== undefined && <span className="score-popover__card-title">{subtitle}</span>}
        </p>
        <strong>{stars}<span aria-hidden="true">★</span></strong>
      </div>
      {isConfirming ? (
        <div className="score-popover__confirmation" aria-live="polite">
          <span>确认清空？</span>
          <div className="score-popover__confirm-actions">
            <button type="button" aria-label={`确认清空${title}积分`} title="确认清空" onClick={onConfirmClear}>√</button>
            <button type="button" aria-label={`取消清空${title}积分`} title="取消" onClick={onCancelClear}>×</button>
          </div>
        </div>
      ) : (
        <button className="score-popover__clear" type="button" onClick={() => onRequestClear(scope)}>
          <img className="score-popover__clear-art" src={scoreClearPlate} alt="" aria-hidden="true" draggable="false" />
          <span className="score-popover__clear-label">{clearLabel}</span>
        </button>
      )}
    </section>
  );
}

function GlobalScoreDisplay() {
  const location = useLocation();
  const { totalStars, getChapterStars, clearProgress } = useGovernanceProgress();
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

  if (location.pathname === '/') return null;

  return (
    <>
      <button ref={triggerRef} className="global-score-display" type="button" aria-haspopup="dialog" aria-expanded={isOpen} aria-controls="score-popover" onClick={() => (isOpen ? handleClose() : setIsOpen(true))}>
        <img className="global-score-display__plate" src={scoreDisplayPlate} alt="" aria-hidden="true" draggable="false" />
        <span className="global-score-display__content">
          <span className="global-score-display__label">积分</span>
          <span className="global-score-display__star" aria-hidden="true">★</span>
          <span className="global-score-display__value"><span aria-hidden="true">·</span>{String(totalStars).padStart(2, '0')}</span>
        </span>
      </button>
      {isOpen && (
        <div className="score-popover__backdrop" role="presentation" onClick={handleClose}>
          <section id="score-popover" className="score-popover" role="dialog" aria-modal="true" aria-labelledby="score-popover-title" onClick={(event) => event.stopPropagation()}>
            <img className="score-popover__art" src={scorePopoverInkFrame} alt="" aria-hidden="true" draggable="false" />
            <div className="score-popover__fill" aria-hidden="true" />
            <div className="score-popover__surface">
              <header className="score-popover__header">
                <div><p>STAR ARCHIVE</p><h2 id="score-popover-title">我的积分</h2></div>
              </header>
              <div className="score-popover__cards">
                <ScoreCard title="总积分" stars={totalStars} scope="all" clearLabel="清空全部" pendingScope={pendingClearScope} onRequestClear={setPendingClearScope} onCancelClear={() => setPendingClearScope(null)} onConfirmClear={handleConfirmClear} />
                <ScoreCard title="第三章" subtitle="同舟共济" stars={getChapterStars('chapter-3')} scope="chapter-3" clearLabel="清空第三章" pendingScope={pendingClearScope} onRequestClear={setPendingClearScope} onCancelClear={() => setPendingClearScope(null)} onConfirmClear={handleConfirmClear} />
                <ScoreCard title="第四章" subtitle="天地人和" stars={getChapterStars('chapter-4')} scope="chapter-4" clearLabel="清空第四章" pendingScope={pendingClearScope} onRequestClear={setPendingClearScope} onCancelClear={() => setPendingClearScope(null)} onConfirmClear={handleConfirmClear} />
              </div>
            </div>
            <button ref={closeButtonRef} className="score-popover__close" type="button" aria-label="关闭积分面板" onClick={handleClose}>
              <img className="score-popover__close-art" src={scoreClosePlate} alt="" aria-hidden="true" draggable="false" />
              <span className="score-popover__close-icon" aria-hidden="true">×</span>
            </button>
          </section>
        </div>
      )}
    </>
  );
}

export default GlobalScoreDisplay;
