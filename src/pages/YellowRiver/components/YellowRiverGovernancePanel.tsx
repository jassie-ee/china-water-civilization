import { useEffect, useRef } from 'react';

import GovernanceStage from '@/pages/GovernanceLevel/components/GovernanceStage';
import type { GovernanceQuestionLevelConfig } from '@/types/governanceLevel';
import type { YellowRiverNode, YellowRiverRegion } from '@/types/basin';

interface YellowRiverGovernancePanelProps {
  node: YellowRiverNode;
  region: YellowRiverRegion;
  level: GovernanceQuestionLevelConfig;
  onBackToDetail: () => void;
  onClose: () => void;
}

function YellowRiverGovernancePanel({
  node,
  region,
  level,
  onBackToDetail,
  onClose,
}: YellowRiverGovernancePanelProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const typeLabel = node.type === 'ecological' ? '生态问题节点' : '关键工程节点';

  useEffect(() => {
    closeButtonRef.current?.focus();
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <section
      className={`yellow-river-detail-panel yellow-river-governance-panel yellow-river-detail-panel--${node.type}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="yellow-river-governance-title"
    >
      <header className="yellow-river-detail-panel__header">
        <div>
          <p className="yellow-river-detail-panel__eyebrow">{typeLabel} · 黄河{region.shortName}</p>
          <h2 id="yellow-river-governance-title">{node.name}</h2>
          <p className="yellow-river-governance-panel__level-name">{level.title}</p>
        </div>
        <div className="yellow-river-detail-panel__header-actions">
          <button className="yellow-river-governance-panel__back" type="button" onClick={onBackToDetail}>返回节点介绍</button>
          <button ref={closeButtonRef} className="yellow-river-detail-panel__close" type="button" aria-label="关闭治理关卡" onClick={onClose}>关闭</button>
        </div>
      </header>
      <div className="yellow-river-detail-panel__content yellow-river-governance-panel__content">
        <GovernanceStage level={level} />
      </div>
    </section>
  );
}

export default YellowRiverGovernancePanel;
