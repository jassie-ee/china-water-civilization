import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

import { yellowRiverRegions } from '@/data/yellowRiverRegions';
import { yellowRiverNodes } from '@/data/yellowRiverNodes';
import type { YellowRiverNode, YellowRiverNodeId, YellowRiverPanelMode, YellowRiverRegionId } from '@/types/basin';

import YellowRiverMap from './components/YellowRiverMap';
import YellowRiverInfoPanel from './components/YellowRiverInfoPanel';
import YellowRiverNodeDetailPanel from './components/YellowRiverNodeDetailPanel';
import YellowRiverRegionTabs from './components/YellowRiverRegionTabs';

import './YellowRiver.css';

function hasDetailContent(node: YellowRiverNode): boolean {
  return Boolean(
    node.problemDescription
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

function YellowRiver() {
  const [selectedRegionId, setSelectedRegionId] = useState<YellowRiverRegionId>('upper');
  const [previewRegionId, setPreviewRegionId] = useState<YellowRiverRegionId | null>(null);
  const [selectedNodeId, setSelectedNodeId] = useState<YellowRiverNodeId | null>(null);
  const [previewNodeId, setPreviewNodeId] = useState<YellowRiverNodeId | null>(null);
  const visibleNodeId = previewNodeId ?? selectedNodeId;
  const visibleNode = useMemo(
    () => yellowRiverNodes.find((node) => node.id === visibleNodeId) ?? null,
    [visibleNodeId],
  );
  const selectedDetailNode = useMemo(
    () => detailNodes.find((node) => node.id === selectedNodeId) ?? null,
    [selectedNodeId],
  );
  const visibleRegionId = visibleNode?.regionId ?? previewRegionId ?? selectedRegionId;
  const visibleRegion = useMemo(
    () => yellowRiverRegions.find((region) => region.id === visibleRegionId) ?? yellowRiverRegions[0],
    [visibleRegionId],
  );

  const handleRegionPreview = (regionId: YellowRiverRegionId | null): void => {
    setPreviewRegionId(regionId);
  };

  const handleRegionSelect = (regionId: YellowRiverRegionId): void => {
    // 区域选择恢复区域面板，避免节点预览与区域说明同时竞争内容区。
    setSelectedRegionId(regionId);
    setPreviewRegionId(null);
    setSelectedNodeId(null);
    setPreviewNodeId(null);
  };

  const handleNodeSelect = (nodeId: YellowRiverNodeId): void => {
    const node = yellowRiverNodes.find((item) => item.id === nodeId);
    if (!node) return;

    setSelectedNodeId(nodeId);
    setPreviewNodeId(null);
    setPreviewRegionId(null);
    setSelectedRegionId(node.regionId);
  };

  const handleDetailClose = (): void => {
    const triggerNodeId = selectedNodeId;
    setSelectedNodeId(null);
    setPreviewNodeId(null);
    setPreviewRegionId(null);

    // 详情关闭后回到原节点，避免键盘焦点留在已移除的侧栏中。
    window.requestAnimationFrame(() => {
      document.getElementById(`yellow-river-node-${triggerNodeId}`)?.focus();
    });
  };

  const selectedDetailIndex = selectedDetailNode
    ? detailNodes.findIndex((node) => node.id === selectedDetailNode.id)
    : -1;
  const previousDetailNode = selectedDetailIndex >= 0
    ? detailNodes[(selectedDetailIndex - 1 + detailNodes.length) % detailNodes.length]
    : null;
  const nextDetailNode = selectedDetailIndex >= 0
    ? detailNodes[(selectedDetailIndex + 1) % detailNodes.length]
    : null;
  const selectedDetailRegion = selectedDetailNode
    ? yellowRiverRegions.find((region) => region.id === selectedDetailNode.regionId) ?? visibleRegion
    : null;

  const panelMode: YellowRiverPanelMode = visibleNode ? 'node' : 'region';

  return (
    <section className="yellow-river-page">
      <header className="yellow-river-page__header">
        <Link className="yellow-river-page__back" to="/basins" state={{ basinOverviewEntry: 'returning' }}>
          返回中国流域总览
        </Link>
        <p className="yellow-river-page__breadcrumb">中国流域总览 / 黄河流域</p>
        <h1>黄河流域治理系统</h1>
        <p>上中下游是对黄河水循环全过程的空间拆解，分别对应水源形成、水沙迁移与风险承载。</p>
      </header>

      <main className="yellow-river-page__content">
        <section className="yellow-river-page__map-section" aria-labelledby="yellow-river-map-title">
          <div className="yellow-river-page__map-heading">
            <p className="yellow-river-page__eyebrow">YELLOW RIVER SYSTEM</p>
            <h2 id="yellow-river-map-title">识别黄河的三段运行逻辑</h2>
            <p>选择一个河段，查看黄河不同区域的生态功能与治理重点。</p>
          </div>
          <YellowRiverMap
            selectedRegionId={selectedRegionId}
            previewRegionId={previewRegionId}
            selectedNodeId={selectedNodeId}
            previewNodeId={previewNodeId}
            onRegionSelect={handleRegionSelect}
            onRegionPreview={handleRegionPreview}
            onNodeSelect={handleNodeSelect}
            onNodePreview={setPreviewNodeId}
          />
          <YellowRiverRegionTabs
            regions={yellowRiverRegions}
            selectedRegionId={selectedRegionId}
            onRegionSelect={handleRegionSelect}
            onRegionPreview={handleRegionPreview}
          />
        </section>

        {selectedDetailNode && selectedDetailRegion && previousDetailNode && nextDetailNode ? (
          <YellowRiverNodeDetailPanel
            node={selectedDetailNode}
            region={selectedDetailRegion}
            previousNode={previousDetailNode}
            nextNode={nextDetailNode}
            onClose={handleDetailClose}
            onSelectPrevious={() => handleNodeSelect(previousDetailNode.id)}
            onSelectNext={() => handleNodeSelect(nextDetailNode.id)}
          />
        ) : panelMode === 'node' && visibleNode
          ? <YellowRiverInfoPanel mode="node" node={visibleNode} region={visibleRegion} />
          : <YellowRiverInfoPanel mode="region" region={visibleRegion} />}
      </main>
    </section>
  );
}

export default YellowRiver;
