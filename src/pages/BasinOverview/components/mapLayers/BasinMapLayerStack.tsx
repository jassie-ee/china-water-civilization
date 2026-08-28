import { basinMapItems, chinaMapViewBox } from '@/data/basinMapConfig';
import type { BasinId, BasinInteractionState } from '@/types/basin';

import BasinAreaLayer from './BasinAreaLayer';
import BasinInteractionLayer from './BasinInteractionLayer';
import BasinLabelLayer from './BasinLabelLayer';
import ChinaOutlineLayer from './ChinaOutlineLayer';
import RiverMainlineLayer from './RiverMainlineLayer';
import TerrainDecorationLayer from './TerrainDecorationLayer';

interface BasinMapLayerStackProps {
  chinaOutlineAsset: string | null;
  activeBasinId: BasinId | null;
  interactionState: BasinInteractionState;
  onBasinActivate: (basinId: BasinId) => void;
}

/**
 * 一级地图的固定图层顺序。当前不接入概览页，待 EPS 与流域数据核验后替换示意地图。
 */
function BasinMapLayerStack({
  chinaOutlineAsset,
  activeBasinId,
  interactionState,
  onBasinActivate,
}: BasinMapLayerStackProps) {
  return (
    <svg viewBox={`0 0 ${chinaMapViewBox.width} ${chinaMapViewBox.height}`} role="img" aria-label="中国流域总览地图">
      <ChinaOutlineLayer assetHref={chinaOutlineAsset} />
      <TerrainDecorationLayer />
      <BasinAreaLayer basins={basinMapItems} />
      <RiverMainlineLayer basins={basinMapItems} />
      <BasinLabelLayer basins={basinMapItems} />
      <BasinInteractionLayer
        basins={basinMapItems}
        activeBasinId={activeBasinId}
        interactionState={interactionState}
        onActivate={onBasinActivate}
      />
    </svg>
  );
}

export default BasinMapLayerStack;
