import { useEffect, useRef, useState } from 'react';

import GovernanceStage from '@/pages/GovernanceLevel/components/GovernanceStage';
import { governanceDataSource } from '@/services/governanceDataSource';
import type { GovernanceQuestionLevelConfig } from '@/types/governanceLevel';
import type { RiverNode, RiverRegion } from '@/types/basin';

interface YellowRiverGovernancePanelProps {
  node: RiverNode;
  region: RiverRegion;
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
  const [currentStars, setCurrentStars] = useState(0);
  const typeLabel = node.type === 'ecological' ? '生态问题节点' : '关键工程节点';
  const isOfficialQuestionLevel = governanceDataSource.isRemoteQuestionLevel(level.levelId);

  useEffect(() => {
    closeButtonRef.current?.focus();
  }, []);

  useEffect(() => {
    setCurrentStars(0);
  }, [level.levelId]);

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
          <p className="yellow-river-detail-panel__eyebrow">{typeLabel} · {region.shortName}</p>
          <h2 id="yellow-river-governance-title">{node.name}</h2>
          <p className="yellow-river-governance-panel__level-name">{level.title}</p>
        </div>
        <div className="yellow-river-detail-panel__header-actions">
          <span className="yellow-river-governance-panel__score" aria-live="polite">
            {isOfficialQuestionLevel ? '本关治理星级' : '演示治理星级'} <span aria-hidden="true">★</span>：{currentStars}
          </span>
          <button className="yellow-river-governance-panel__back" type="button" onClick={onBackToDetail}>返回节点介绍</button>
          <button ref={closeButtonRef} className="yellow-river-detail-panel__close" type="button" aria-label="关闭治理关卡" onClick={onClose}>关闭</button>
        </div>
      </header>
      <div className="yellow-river-detail-panel__content yellow-river-governance-panel__content">
        <GovernanceStage level={level} onCurrentStarsChange={setCurrentStars} />
      </div>
    </section>
  );
}

export default YellowRiverGovernancePanel;
