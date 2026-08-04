import { useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

import { governanceDataSource } from '@/services/governanceDataSource';
import { yangtzeRiverGovernanceNodeIds, yangtzeRiverNodes } from '@/data/yangtzeRiverNodes';
import { yangtzeRiverRegions } from '@/data/yangtzeRiverRegions';
import type { YangtzeRiverNode, YangtzeRiverRegionId } from '@/types/basin';
import YellowRiverGovernancePanel from '@/pages/YellowRiver/components/YellowRiverGovernancePanel';
import YellowRiverInfoPanel from '@/pages/YellowRiver/components/YellowRiverInfoPanel';
import YellowRiverNodeDetailPanel from '@/pages/YellowRiver/components/YellowRiverNodeDetailPanel';

import './YangtzeRiver.css';
import YangtzeRiverMap from './components/YangtzeRiverMap';

type YangtzeModalMode = 'detail' | 'governance';

function hasDetailContent(node: YangtzeRiverNode): boolean {
  return Boolean(node.problemDescription || node.causes?.length || node.governanceMeasures?.length || node.ecologicalImpacts?.length || node.culturalMeaning);
}

const detailNodes = yangtzeRiverNodes.filter(hasDetailContent).slice().sort((firstNode, secondNode) => firstNode.position.x - secondNode.position.x);
const governanceNodes = yangtzeRiverGovernanceNodeIds
  .map((nodeId) => detailNodes.find((node) => node.id === nodeId))
  .filter((node): node is YangtzeRiverNode => node !== undefined);

function YangtzeRiver() {
  const location = useLocation();
  const restoredState = location.state as { selectedNodeId?: string; openNodeDetail?: boolean; openGovernance?: boolean } | null;
  const initialNode = restoredState?.openNodeDetail ? detailNodes.find((node) => node.id === restoredState.selectedNodeId) ?? null : null;
  const [selectedRegionId, setSelectedRegionId] = useState<YangtzeRiverRegionId>(initialNode?.regionId ?? 'upper');
  const [previewRegionId, setPreviewRegionId] = useState<YangtzeRiverRegionId | null>(null);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(initialNode?.id ?? null);
  const [previewNodeId, setPreviewNodeId] = useState<string | null>(null);
  const [modalMode, setModalMode] = useState<YangtzeModalMode>(restoredState?.openGovernance ? 'governance' : 'detail');
  const selectedRegion = useMemo(() => yangtzeRiverRegions.find((region) => region.id === selectedRegionId) ?? yangtzeRiverRegions[0], [selectedRegionId]);
  const selectedDetailNode = useMemo(() => detailNodes.find((node) => node.id === selectedNodeId) ?? null, [selectedNodeId]);
  const selectedDetailIndex = selectedDetailNode ? governanceNodes.findIndex((node) => node.id === selectedDetailNode.id) : -1;
  const previousDetailNode = selectedDetailIndex >= 0 ? governanceNodes[(selectedDetailIndex - 1 + governanceNodes.length) % governanceNodes.length] : null;
  const nextDetailNode = selectedDetailIndex >= 0 ? governanceNodes[(selectedDetailIndex + 1) % governanceNodes.length] : null;
  const selectedDetailRegion = selectedDetailNode ? yangtzeRiverRegions.find((region) => region.id === selectedDetailNode.regionId) ?? selectedRegion : null;
  const governanceLevel = selectedDetailNode ? governanceDataSource.getQuestionLevelConfig(selectedDetailNode.id) : null;

  const closeModal = (): void => {
    const nodeId = selectedNodeId;
    setSelectedNodeId(null); setPreviewNodeId(null); setPreviewRegionId(null); setModalMode('detail');
    window.requestAnimationFrame(() => document.getElementById(`yangtze-river-node-${nodeId}`)?.focus());
  };
  const selectRegion = (regionId: YangtzeRiverRegionId): void => {
    setSelectedRegionId(regionId); setPreviewRegionId(null); setSelectedNodeId(null); setPreviewNodeId(null); setModalMode('detail');
  };
  const selectNode = (nodeId: string): void => {
    const node = yangtzeRiverNodes.find((item) => item.id === nodeId);
    if (!node) return;
    setSelectedNodeId(nodeId); setPreviewNodeId(null); setPreviewRegionId(null); setSelectedRegionId(node.regionId); setModalMode('detail');
  };

  return (
    <section className="yellow-river-page yangtze-river-page">
      <header className="yellow-river-page__header">
        <Link className="yellow-river-page__back" to="/basins" state={{ basinOverviewEntry: 'returning' }}>返回中国流域总览</Link>
        <p className="yellow-river-page__breadcrumb">中国流域总览 / 长江流域</p>
        <h1>长江流域治理系统</h1>
        <p>水能梯级、综合枢纽与水网—江海协同串联长江开发利用；防洪安全、生态底线与流域协同始终是工程决策的共同约束。</p>
      </header>
      <main className="yellow-river-page__content">
        <section className="yellow-river-page__map-section" aria-labelledby="yangtze-river-map-title">
          <div className="yellow-river-page__map-heading"><p className="yellow-river-page__eyebrow">YANGTZE RIVER DEVELOPMENT SYSTEM</p><h2 id="yangtze-river-map-title">长江流域示意图</h2><p>选择河段或节点，查看开发利用、生态约束与流域协同的关系。</p></div>
          <YangtzeRiverMap selectedRegionId={selectedRegionId} previewRegionId={previewRegionId} selectedNodeId={selectedNodeId} previewNodeId={previewNodeId} onRegionSelect={selectRegion} onRegionPreview={setPreviewRegionId} onNodeSelect={selectNode} onNodePreview={setPreviewNodeId} />
        </section>
        <aside className="yellow-river-page__reference-panel" aria-label="长江流域查阅栏"><YellowRiverInfoPanel region={selectedRegion} /></aside>
      </main>
      {selectedDetailNode && selectedDetailRegion && (
        <div className="yellow-river-detail-modal" role="presentation" onClick={closeModal}>
          <div className={`yellow-river-detail-modal__dialog${modalMode === 'governance' ? ' yellow-river-detail-modal__dialog--governance' : ''}`} onClick={(event) => event.stopPropagation()}>
            {modalMode === 'governance' && governanceLevel ? <YellowRiverGovernancePanel node={selectedDetailNode} region={selectedDetailRegion} level={governanceLevel} onBackToDetail={() => setModalMode('detail')} onClose={closeModal} /> : <YellowRiverNodeDetailPanel node={selectedDetailNode} region={selectedDetailRegion} previousNode={previousDetailNode} nextNode={nextDetailNode} onClose={closeModal} onStartGovernance={() => setModalMode('governance')} onSelectPrevious={previousDetailNode ? () => selectNode(previousDetailNode.id) : undefined} onSelectNext={nextDetailNode ? () => selectNode(nextDetailNode.id) : undefined} />}
          </div>
        </div>
      )}
    </section>
  );
}

export default YangtzeRiver;
