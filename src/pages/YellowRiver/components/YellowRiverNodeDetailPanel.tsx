import { useEffect, useRef } from 'react';

import { governanceDataSource } from '@/services/governanceDataSource';
import type { RiverNode, RiverRegion } from '@/types/basin';
import RiverNarrativeSurface from '@/components/layout/RiverNarrativeSurface';

import NodeVideoPanel from './NodeVideoPanel';
import LoessPlateauNarrative from './LoessPlateauNarrative';

interface YellowRiverNodeDetailPanelProps {
  node: RiverNode;
  region: RiverRegion;
  previousNode: RiverNode | null;
  nextNode: RiverNode | null;
  onClose: () => void;
  onStartGovernance: () => void;
  onSelectPrevious?: () => void;
  onSelectNext?: () => void;
  onStartEcologicalInteraction?: () => void;
  showContinueInteraction?: boolean;
}

interface DetailSectionProps {
  title: string;
  children: React.ReactNode;
}

function DetailSection({ title, children }: DetailSectionProps) {
  return (
    <section className="yellow-river-detail-panel__section">
      <h3>{title}</h3>
      {children}
    </section>
  );
}

function YellowRiverNodeDetailPanel({
  node,
  region,
  previousNode,
  nextNode,
  onClose,
  onStartGovernance,
  onSelectPrevious,
  onSelectNext,
  onStartEcologicalInteraction,
  showContinueInteraction = false,
}: YellowRiverNodeDetailPanelProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const typeLabel = node.type === 'ecological' ? '生态问题节点' : '关键工程节点';
  const governanceLevel = governanceDataSource.getQuestionLevelConfig(node.id);

  useEffect(() => {
    closeButtonRef.current?.focus();
  }, []);

  useEffect(() => {
    contentRef.current?.scrollTo({ top: 0 });
  }, [node.id]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <section
      className={`yellow-river-detail-panel yellow-river-detail-panel--${node.type}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="yellow-river-node-detail-title"
    >
      <RiverNarrativeSurface className="yellow-river-detail-panel__surface">
      <header className="yellow-river-detail-panel__header">
        <div>
          <p className="yellow-river-detail-panel__eyebrow">{typeLabel} · {region.shortName}</p>
          <h2 id="yellow-river-node-detail-title">{node.name}</h2>
          {node.locationDescription && <p className="yellow-river-detail-panel__location">{node.locationDescription}</p>}
        </div>
        <div className="yellow-river-detail-panel__header-actions">
          {governanceLevel && node.id !== 'loess-plateau' && (
            <button className="yellow-river-detail-panel__start" type="button" onClick={onStartGovernance}>
              开始闯关
            </button>
          )}
          <button ref={closeButtonRef} className="yellow-river-detail-panel__close" type="button" aria-label="关闭节点详情" onClick={onClose}>关闭</button>
        </div>
      </header>

      <div ref={contentRef} className="yellow-river-detail-panel__content" aria-live="polite">
        {node.type === 'ecological' && <NodeVideoPanel
          video={node.media?.video}
          onComplete={node.id === 'loess-plateau' ? onStartEcologicalInteraction : undefined}
          skipLabel={node.id === 'loess-plateau' ? '跳过影像，开始互动' : undefined}
        />}
        {node.id === 'loess-plateau' && <LoessPlateauNarrative />}
        {node.id === 'loess-plateau' && showContinueInteraction && onStartEcologicalInteraction && (
          <button className="yellow-river-detail-panel__continue-interaction" type="button" onClick={onStartEcologicalInteraction}>继续互动</button>
        )}
        {node.id !== 'loess-plateau' && node.summary && <p className="yellow-river-detail-panel__introduction">{node.summary}</p>}
        {node.id !== 'loess-plateau' && node.problemDescription && <DetailSection title="这里发生了什么？"><p>{node.problemDescription}</p></DetailSection>}
        {node.id !== 'loess-plateau' && node.causes && node.causes.length > 0 && (
          <DetailSection title="问题如何形成？"><ul>{node.causes.map((cause) => <li key={cause}>{cause}</li>)}</ul></DetailSection>
        )}
        {node.id !== 'loess-plateau' && node.governanceMeasures && node.governanceMeasures.length > 0 && (
          <DetailSection title="治理与工程措施"><ul>{node.governanceMeasures.map((measure) => <li key={measure}>{measure}</li>)}</ul></DetailSection>
        )}
        {node.id !== 'loess-plateau' && node.ecologicalImpacts && node.ecologicalImpacts.length > 0 && (
          <DetailSection title="治理带来了什么变化？"><ul>{node.ecologicalImpacts.map((impact) => <li key={impact}>{impact}</li>)}</ul></DetailSection>
        )}
        {node.id !== 'loess-plateau' && node.culturalMeaning && <DetailSection title="这体现了怎样的治水智慧？"><p className="yellow-river-detail-panel__culture">{node.culturalMeaning}</p></DetailSection>}
        {node.keywords && node.keywords.length > 0 && (
          <DetailSection title="核心关键词">
            <ul className="yellow-river-detail-panel__keywords">{node.keywords.map((keyword) => <li key={keyword}>{keyword}</li>)}</ul>
          </DetailSection>
        )}
        {node.id !== 'loess-plateau' && node.significance && <p className="yellow-river-detail-panel__summary">{node.significance}</p>}
      </div>

      <footer className="yellow-river-detail-panel__navigation">
        {previousNode && onSelectPrevious && <button type="button" onClick={onSelectPrevious}>上一个节点 · {previousNode.shortName}</button>}
        {nextNode && onSelectNext && <button type="button" onClick={onSelectNext}>下一个节点 · {nextNode.shortName}</button>}
        <button type="button" className="yellow-river-detail-panel__return" onClick={onClose}>返回流域地图</button>
      </footer>
      </RiverNarrativeSurface>
    </section>
  );
}

export default YellowRiverNodeDetailPanel;
