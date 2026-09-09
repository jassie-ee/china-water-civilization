import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

import RiverSpiritGuide from '@/components/lan/RiverSpiritGuide';
import { pearlRiverNodes } from '@/data/pearlRiverNodes';
import { pearlRiverRegions } from '@/data/pearlRiverRegions';
import type { PearlRiverNode, PearlRiverRegionId } from '@/types/basin';
import YellowRiverNodeDetailPanel from '@/pages/YellowRiver/components/YellowRiverNodeDetailPanel';

import PearlRiverMap from './components/PearlRiverMap';
import './PearlRiver.css';

function hasDetailContent(node: PearlRiverNode): boolean {
  return Boolean(
    node.summary
    || node.problemDescription
    || node.causes?.length
    || node.governanceMeasures?.length
    || node.ecologicalImpacts?.length
    || node.culturalMeaning,
  );
}

const detailNodes = pearlRiverNodes
  .filter(hasDetailContent)
  .slice()
  .sort((firstNode, secondNode) => firstNode.sequence - secondNode.sequence);

function PearlRiver() {
  const location = useLocation();
  const restoredState = location.state as { selectedNodeId?: string; openNodeDetail?: boolean } | null;
  const initialNode = restoredState?.openNodeDetail
    ? detailNodes.find((node) => node.id === restoredState.selectedNodeId) ?? null
    : null;
  const [selectedRegionId, setSelectedRegionId] = useState<PearlRiverRegionId | null>(initialNode?.regionId ?? null);
  const [previewRegionId, setPreviewRegionId] = useState<PearlRiverRegionId | null>(null);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(initialNode?.id ?? null);
  const [previewNodeId, setPreviewNodeId] = useState<string | null>(null);
  const [isDialogueOpen, setIsDialogueOpen] = useState(false);
  const selectedRegion = useMemo(
    () => pearlRiverRegions.find((region) => region.id === selectedRegionId) ?? pearlRiverRegions[0],
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
    ? pearlRiverRegions.find((region) => region.id === selectedDetailNode.regionId) ?? selectedRegion
    : null;

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
    window.requestAnimationFrame(() => document.getElementById(`pearl-river-node-${nodeId}`)?.focus());
  };

  const selectRegion = (regionId: PearlRiverRegionId): void => {
    setSelectedRegionId(regionId);
    setPreviewRegionId(null);
    setSelectedNodeId(null);
    setPreviewNodeId(null);
    setIsDialogueOpen(true);
  };

  const previewNode = (nodeId: string | null): void => {
    const node = pearlRiverNodes.find((item) => item.id === nodeId);
    setPreviewNodeId(nodeId);
    setPreviewRegionId(node?.regionId ?? null);
  };

  const selectNode = (nodeId: string): void => {
    const node = pearlRiverNodes.find((item) => item.id === nodeId);
    if (!node) return;
    setSelectedNodeId(nodeId);
    setPreviewNodeId(null);
    setPreviewRegionId(null);
    setSelectedRegionId(node.regionId);
    setIsDialogueOpen(false);
  };

  return (
    <section className="yellow-river-page yellow-river-page--atlas pearl-river-page pearl-river-page--atlas" onClick={() => setIsDialogueOpen(false)}>
      <header className="yellow-river-page__header">
        <Link className="yellow-river-page__back" to="/basins" state={{ basinOverviewEntry: 'returning' }}>
          返回中国流域总览
        </Link>
        <div className="river-atlas-heading">
          <h1>珠江流域</h1>
          <p>河海相遇的南方水脉</p>
        </div>
      </header>

      <main className="yellow-river-page__content">
        <section className="yellow-river-page__map-section" aria-label="珠江上游、中游、下游互动水脉地图">
          <div className="yellow-river-page__map-stage">
            <PearlRiverMap
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
            <RiverSpiritGuide isOpen={isDialogueOpen} riverName="珠江" region={selectedRegion} node={selectedDetailNode} />
          </div>
        </section>
      </main>

      {selectedDetailNode && selectedDetailRegion && (
        <div className="yellow-river-detail-modal" role="presentation" onClick={closeModal}>
          <div className="yellow-river-detail-modal__dialog" onClick={(event) => event.stopPropagation()}>
            <YellowRiverNodeDetailPanel
              node={selectedDetailNode}
              region={selectedDetailRegion}
              previousNode={previousDetailNode}
              nextNode={nextDetailNode}
              onClose={closeModal}
              onStartGovernance={() => undefined}
              onSelectPrevious={previousDetailNode ? () => selectNode(previousDetailNode.id) : undefined}
              onSelectNext={nextDetailNode ? () => selectNode(nextDetailNode.id) : undefined}
            />
          </div>
        </div>
      )}
    </section>
  );
}

export default PearlRiver;
