import { useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import type { CSSProperties } from 'react';

import { yellowRiverRegions } from '@/data/yellowRiverRegions';
import { yellowRiverGovernanceNodeIds, yellowRiverNodes } from '@/data/yellowRiverNodes';
import { governanceDataSource } from '@/services/governanceDataSource';
import type { YellowRiverNode, YellowRiverNodeId, YellowRiverRegionId } from '@/types/basin';

import YellowRiverMap from './components/YellowRiverMap';
import YellowRiverNodeDetailPanel from './components/YellowRiverNodeDetailPanel';
import YellowRiverGovernancePanel from './components/YellowRiverGovernancePanel';
import YellowRiverSpiritDialogue from './components/YellowRiverSpiritDialogue';
import yellowRiverBackground from '@/assets/images/basins/yellow-river-background.png';

import './YellowRiver.css';

function hasDetailContent(node: YellowRiverNode): boolean {
  return Boolean(
    node.summary
    || node.problemDescription
    || node.causes?.length
    || node.governanceMeasures?.length
    || node.ecologicalImpacts?.length
    || node.culturalMeaning,
  );
}

const detailNodes = yellowRiverNodes
  .filter(hasDetailContent)
  .slice()
  .sort((firstNode, secondNode) => firstNode.position.x - secondNode.position.x);

const governanceNodes = yellowRiverGovernanceNodeIds
  .map((nodeId) => detailNodes.find((node) => node.id === nodeId))
  .filter((node): node is YellowRiverNode => node !== undefined);

type YellowRiverModalMode = 'detail' | 'governance';

interface RestoredModalState {
  nodeId: YellowRiverNodeId | null;
  modalMode: YellowRiverModalMode;
}

function getRestoredModalState(locationState: unknown): RestoredModalState {
  if (typeof locationState !== 'object' || locationState === null) {
    return { nodeId: null, modalMode: 'detail' };
  }

  const state = locationState as { selectedNodeId?: unknown; openNodeDetail?: unknown; openGovernance?: unknown };
  if (state.openNodeDetail !== true || typeof state.selectedNodeId !== 'string') {
    return { nodeId: null, modalMode: 'detail' };
  }

  return {
    nodeId: detailNodes.find((node) => node.id === state.selectedNodeId)?.id ?? null,
    modalMode: state.openGovernance === true ? 'governance' : 'detail',
  };
}

function YellowRiver() {
  const location = useLocation();
  const restoredModalState = getRestoredModalState(location.state);
  const restoredNodeId = restoredModalState.nodeId;
  const restoredNode = yellowRiverNodes.find((node) => node.id === restoredNodeId) ?? null;
  const [selectedRegionId, setSelectedRegionId] = useState<YellowRiverRegionId>(restoredNode?.regionId ?? 'upper');
  const [previewRegionId, setPreviewRegionId] = useState<YellowRiverRegionId | null>(null);
  const [selectedNodeId, setSelectedNodeId] = useState<YellowRiverNodeId | null>(restoredNodeId);
  const [previewNodeId, setPreviewNodeId] = useState<YellowRiverNodeId | null>(null);
  const [modalMode, setModalMode] = useState<YellowRiverModalMode>(restoredModalState.modalMode);
  const selectedDetailNode = useMemo(
    () => detailNodes.find((node) => node.id === selectedNodeId) ?? null,
    [selectedNodeId],
  );
  const selectedRegion = useMemo(
    () => yellowRiverRegions.find((region) => region.id === selectedRegionId) ?? yellowRiverRegions[0],
    [selectedRegionId],
  );

  const handleRegionPreview = (regionId: YellowRiverRegionId | null): void => {
    setPreviewRegionId(regionId);
  };

  /** 节点预览只改变地图高亮，不改变右侧已选河段的说明内容。 */
  const handleNodePreview = (nodeId: YellowRiverNodeId | null): void => {
    const node = yellowRiverNodes.find((item) => item.id === nodeId);
    setPreviewNodeId(nodeId);
    setPreviewRegionId(node?.regionId ?? null);
  };

  const handleRegionSelect = (regionId: YellowRiverRegionId): void => {
    // 区域选择恢复区域面板，避免节点预览与区域说明同时竞争内容区。
    setSelectedRegionId(regionId);
    setPreviewRegionId(null);
    setSelectedNodeId(null);
    setPreviewNodeId(null);
    setModalMode('detail');
  };

  const handleNodeSelect = (nodeId: YellowRiverNodeId): void => {
    const node = yellowRiverNodes.find((item) => item.id === nodeId);
    if (!node) return;

    setSelectedNodeId(nodeId);
    setPreviewNodeId(null);
    setPreviewRegionId(null);
    setSelectedRegionId(node.regionId);
    setModalMode('detail');
  };

  const handleDetailClose = (): void => {
    const triggerNodeId = selectedNodeId;
    setSelectedNodeId(null);
    setPreviewNodeId(null);
    setPreviewRegionId(null);
    setModalMode('detail');

    // 详情关闭后回到原节点，避免键盘焦点留在已移除的侧栏中。
    window.requestAnimationFrame(() => {
      document.getElementById(`yellow-river-node-${triggerNodeId}`)?.focus();
    });
  };

  const selectedDetailIndex = selectedDetailNode
    ? governanceNodes.findIndex((node) => node.id === selectedDetailNode.id)
    : -1;
  const previousDetailNode = selectedDetailIndex >= 0
    ? governanceNodes[(selectedDetailIndex - 1 + governanceNodes.length) % governanceNodes.length]
    : null;
  const nextDetailNode = selectedDetailIndex >= 0
    ? governanceNodes[(selectedDetailIndex + 1) % governanceNodes.length]
    : null;
  const selectedDetailRegion = selectedDetailNode
    ? yellowRiverRegions.find((region) => region.id === selectedDetailNode.regionId) ?? selectedRegion
    : null;
  const governanceLevel = selectedDetailNode
    ? governanceDataSource.getQuestionLevelConfig(selectedDetailNode.id)
    : null;
  const pageStyle = {
    '--yellow-river-page-background': `url(${yellowRiverBackground})`,
  } as CSSProperties;

  return (
    <section className="yellow-river-page yellow-river-page--atlas" style={pageStyle}>
      <header className="yellow-river-page__header">
        <Link className="yellow-river-page__back" to="/basins" state={{ basinOverviewEntry: 'returning' }}>
          返回中国流域总览
        </Link>
      </header>

      <main className="yellow-river-page__content">
        <section className="yellow-river-page__map-section" aria-label="黄河上中下游互动水脉地图">
          <div className="yellow-river-page__map-stage">
            <YellowRiverMap
              selectedRegionId={selectedRegionId}
              previewRegionId={previewRegionId}
              selectedNodeId={selectedNodeId}
              previewNodeId={previewNodeId}
              onRegionSelect={handleRegionSelect}
              onRegionPreview={handleRegionPreview}
              onNodeSelect={handleNodeSelect}
              onNodePreview={handleNodePreview}
            />
            <YellowRiverSpiritDialogue
              region={selectedRegion}
              node={selectedDetailNode}
            />
          </div>
        </section>
      </main>
      {selectedDetailNode && selectedDetailRegion && (
        <div className="yellow-river-detail-modal" role="presentation" onClick={handleDetailClose}>
          <div className={`yellow-river-detail-modal__dialog${modalMode === 'governance' ? ' yellow-river-detail-modal__dialog--governance' : ''}`} onClick={(event) => event.stopPropagation()}>
            {modalMode === 'governance' && governanceLevel !== null ? (
              <YellowRiverGovernancePanel
                node={selectedDetailNode}
                region={selectedDetailRegion}
                level={governanceLevel}
                onBackToDetail={() => setModalMode('detail')}
                onClose={handleDetailClose}
              />
            ) : (
              <YellowRiverNodeDetailPanel
                node={selectedDetailNode}
                region={selectedDetailRegion}
                previousNode={previousDetailNode}
                nextNode={nextDetailNode}
                onClose={handleDetailClose}
                onStartGovernance={() => setModalMode('governance')}
                onSelectPrevious={previousDetailNode ? () => handleNodeSelect(previousDetailNode.id) : undefined}
                onSelectNext={nextDetailNode ? () => handleNodeSelect(nextDetailNode.id) : undefined}
              />
            )}
          </div>
        </div>
      )}
    </section>
  );
}

export default YellowRiver;
