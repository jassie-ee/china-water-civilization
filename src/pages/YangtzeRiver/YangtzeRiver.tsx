import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

import RiverSpiritGuide from '@/components/lan/RiverSpiritGuide';
import { governanceDataSource } from '@/services/governanceDataSource';
import { yangtzeRiverNodes } from '@/data/yangtzeRiverNodes';
import { yangtzeRiverRegions } from '@/data/yangtzeRiverRegions';
import type { YangtzeRiverNode, YangtzeRiverRegionId } from '@/types/basin';
import YellowRiverGovernancePanel from '@/pages/YellowRiver/components/YellowRiverGovernancePanel';
import YellowRiverNodeDetailPanel from '@/pages/YellowRiver/components/YellowRiverNodeDetailPanel';

import './YangtzeRiver.css';
import YangtzeRiverMap from './components/YangtzeRiverMap';

type YangtzeModalMode = 'detail' | 'governance';

function hasDetailContent(node: YangtzeRiverNode): boolean {
  return Boolean(
    node.summary
    || node.problemDescription
    || node.causes?.length
    || node.governanceMeasures?.length
    || node.ecologicalImpacts?.length
    || node.culturalMeaning,
  );
}

const detailNodes = yangtzeRiverNodes
  .filter(hasDetailContent)
  .slice()
  .sort((firstNode, secondNode) => firstNode.sequence - secondNode.sequence);

function YangtzeRiver() {
  const location = useLocation();
  const restoredState = location.state as { selectedNodeId?: string; openNodeDetail?: boolean; openGovernance?: boolean } | null;
  const initialNode = restoredState?.openNodeDetail ? detailNodes.find((node) => node.id === restoredState.selectedNodeId) ?? null : null;
  const [selectedRegionId, setSelectedRegionId] = useState<YangtzeRiverRegionId | null>(initialNode?.regionId ?? null);
  const [previewRegionId, setPreviewRegionId] = useState<YangtzeRiverRegionId | null>(null);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(initialNode?.id ?? null);
  const [previewNodeId, setPreviewNodeId] = useState<string | null>(null);
  const [modalMode, setModalMode] = useState<YangtzeModalMode>(restoredState?.openGovernance ? 'governance' : 'detail');
  const [isDialogueOpen, setIsDialogueOpen] = useState(false);
  const selectedRegion = useMemo(
    () => yangtzeRiverRegions.find((region) => region.id === selectedRegionId) ?? yangtzeRiverRegions[0],
    [selectedRegionId],
  );
  const selectedDetailNode = useMemo(
    () => detailNodes.find((node) => node.id === selectedNodeId) ?? null,
    [selectedNodeId],
  );
  const selectedDetailIndex = selectedDetailNode ? detailNodes.findIndex((node) => node.id === selectedDetailNode.id) : -1;
  const previousDetailNode = selectedDetailIndex >= 0 ? detailNodes[(selectedDetailIndex - 1 + detailNodes.length) % detailNodes.length] : null;
  const nextDetailNode = selectedDetailIndex >= 0 ? detailNodes[(selectedDetailIndex + 1) % detailNodes.length] : null;
  const selectedDetailRegion = selectedDetailNode
    ? yangtzeRiverRegions.find((region) => region.id === selectedDetailNode.regionId) ?? selectedRegion
    : null;
  const governanceLevel = selectedDetailNode ? governanceDataSource.getQuestionLevelConfig(selectedDetailNode.id) : null;

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') setIsDialogueOpen(false);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const closeModal = (): void => {
    const nodeId = selectedNodeId;
    setSelectedNodeId(null);
    setPreviewNodeId(null);
    setPreviewRegionId(null);
    setModalMode('detail');
    window.requestAnimationFrame(() => document.getElementById(`yangtze-river-node-${nodeId}`)?.focus());
  };

  const selectRegion = (regionId: YangtzeRiverRegionId): void => {
    setSelectedRegionId(regionId);
    setPreviewRegionId(null);
    setSelectedNodeId(null);
    setPreviewNodeId(null);
    setModalMode('detail');
    setIsDialogueOpen(true);
  };

  const previewNode = (nodeId: string | null): void => {
    const node = yangtzeRiverNodes.find((item) => item.id === nodeId);
    setPreviewNodeId(nodeId);
    setPreviewRegionId(node?.regionId ?? null);
  };

  const selectNode = (nodeId: string): void => {
    const node = yangtzeRiverNodes.find((item) => item.id === nodeId);
    if (!node) return;
    setSelectedNodeId(nodeId);
    setPreviewNodeId(null);
    setPreviewRegionId(null);
    setSelectedRegionId(node.regionId);
    setModalMode('detail');
    setIsDialogueOpen(false);
  };

  return (
    <section className="yellow-river-page yellow-river-page--atlas yangtze-river-page yangtze-river-page--atlas" onClick={() => setIsDialogueOpen(false)}>
      <header className="yellow-river-page__header">
        <Link className="yellow-river-page__back" to="/basins" state={{ basinOverviewEntry: 'returning' }}>
          返回中国流域总览
        </Link>
        <div className="river-atlas-heading">
          <h1>长江流域</h1>
          <p>江湖相依的水网长卷</p>
        </div>
      </header>

      <main className="yellow-river-page__content">
        <section className="yellow-river-page__map-section" aria-label="长江上游、中游、下游互动水脉地图">
          <div className="yellow-river-page__map-stage">
            <YangtzeRiverMap
              selectedRegionId={selectedRegionId}
              previewRegionId={previewRegionId}
              selectedNodeId={selectedNodeId}
              previewNodeId={previewNodeId}
              onRegionSelect={selectRegion}
              onRegionPreview={setPreviewRegionId}
              onNodeSelect={selectNode}
              onNodePreview={previewNode}
              onBlankClick={() => setIsDialogueOpen(false)}
            />
            <RiverSpiritGuide
              isOpen={isDialogueOpen}
              riverName="长江"
              region={selectedRegion}
              node={selectedDetailNode}
              onDialogueClose={() => setIsDialogueOpen(false)}
            />
          </div>
        </section>
      </main>

      {selectedDetailNode && selectedDetailRegion && (
        <div className="yellow-river-detail-modal" role="presentation" onClick={closeModal}>
          <div className={`yellow-river-detail-modal__dialog${modalMode === 'governance' ? ' yellow-river-detail-modal__dialog--governance' : ''}`} onClick={(event) => event.stopPropagation()}>
            {modalMode === 'governance' && governanceLevel ? (
              <YellowRiverGovernancePanel
                node={selectedDetailNode}
                region={selectedDetailRegion}
                level={governanceLevel}
                onBackToDetail={() => setModalMode('detail')}
                onClose={closeModal}
              />
            ) : (
              <YellowRiverNodeDetailPanel
                node={selectedDetailNode}
                region={selectedDetailRegion}
                previousNode={previousDetailNode}
                nextNode={nextDetailNode}
                onClose={closeModal}
                onStartGovernance={() => setModalMode('governance')}
                onSelectPrevious={previousDetailNode ? () => selectNode(previousDetailNode.id) : undefined}
                onSelectNext={nextDetailNode ? () => selectNode(nextDetailNode.id) : undefined}
              />
            )}
          </div>
        </div>
      )}
    </section>
  );
}

export default YangtzeRiver;
