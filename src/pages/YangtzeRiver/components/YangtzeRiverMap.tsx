import {
  mainstreamSegmentPaths,
  regionLabelPositions,
} from '@/data/yangtzeRiverMapPaths';
import { yangtzeRiverNodes } from '@/data/yangtzeRiverNodes';
import { yangtzeRiverRegions } from '@/data/yangtzeRiverRegions';
import type { YangtzeRiverRegionId } from '@/types/basin';
import yangtzeRiverBackground from '@/assets/images/basins/yangtze-river-background.webp';

import YellowRiverNodeLayer from '@/pages/YellowRiver/components/YellowRiverNodeLayer';
import YellowRiverMapLegend from '@/pages/YellowRiver/components/YellowRiverMapLegend';

interface YangtzeRiverMapProps {
  selectedRegionId: YangtzeRiverRegionId | null;
  previewRegionId: YangtzeRiverRegionId | null;
  selectedNodeId: string | null;
  previewNodeId: string | null;
  onRegionSelect: (regionId: YangtzeRiverRegionId) => void;
  onRegionPreview: (regionId: YangtzeRiverRegionId | null) => void;
  onNodeSelect: (nodeId: string) => void;
  onNodePreview: (nodeId: string | null) => void;
  onBlankClick: () => void;
}

function YangtzeRiverMap({
  selectedRegionId,
  previewRegionId,
  selectedNodeId,
  previewNodeId,
  onRegionSelect,
  onRegionPreview,
  onNodeSelect,
  onNodePreview,
  onBlankClick,
}: YangtzeRiverMapProps) {
  const visibleRegionId = previewRegionId ?? selectedRegionId;

  const handleRegionKeyDown = (event: React.KeyboardEvent<SVGGElement>, regionId: YangtzeRiverRegionId): void => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onRegionSelect(regionId);
    }
  };

  const handleMapClick = (event: React.MouseEvent<SVGSVGElement>): void => {
    event.stopPropagation();
    const target = event.target as Element;
    if (target.closest('.yellow-river-map__atlas-region, .yellow-river-node-marker') === null) {
      onBlankClick();
    }
  };

  return (
    <div className="yellow-river-map yellow-river-map--atlas yangtze-river-map yangtze-river-map--atlas" aria-label="长江上游、中游、下游互动水脉地图">
      <svg viewBox="0 0 1672 941" preserveAspectRatio="xMidYMid meet" role="img" aria-label="可选择长江上游、中游和下游的长江水脉地图" onClick={handleMapClick}>
        <defs>
          <radialGradient id="yangtze-river-atlas-shade" cx="50%" cy="45%" r="76%">
            <stop offset="56%" stopColor="#061d29" stopOpacity="0" />
            <stop offset="100%" stopColor="#061d29" stopOpacity="0.28" />
          </radialGradient>
        </defs>
        <image
          className="yellow-river-map__background"
          href={yangtzeRiverBackground}
          x="0"
          y="0"
          width="1672"
          height="941"
          preserveAspectRatio="xMidYMid meet"
          aria-hidden="true"
        />
        <rect className="yangtze-river-map__background-shade" x="0" y="0" width="1672" height="941" aria-hidden="true" />
        <g className="yellow-river-map__atlas-region-layer">
          {yangtzeRiverRegions.map((region) => {
            const isVisible = region.id === visibleRegionId;
            const labelPosition = regionLabelPositions[region.id];

            return (
              <g
                key={region.id}
                className={`yellow-river-map__atlas-region ${region.themeClassName}${isVisible ? ' is-visible' : ''}${region.id === selectedRegionId ? ' is-selected' : ''}`}
                role="button"
                tabIndex={0}
                aria-label={`选择长江${region.shortName}`}
                onBlur={() => onRegionPreview(null)}
                onFocus={() => onRegionPreview(region.id)}
                onKeyDown={(event) => handleRegionKeyDown(event, region.id)}
                onMouseEnter={() => onRegionPreview(region.id)}
                onMouseLeave={() => onRegionPreview(null)}
                onClick={() => onRegionSelect(region.id)}
              >
                <path className="yellow-river-map__atlas-region-hit-area" d={mainstreamSegmentPaths[region.id]} />
                <text className="yellow-river-map__region-label" x={labelPosition.x} y={labelPosition.y}>{region.shortName}</text>
              </g>
            );
          })}
        </g>
        <g className="yellow-river-map__node-layer">
          <YellowRiverNodeLayer
            nodes={yangtzeRiverNodes}
            mapId="yangtze-river"
            selectedNodeId={selectedNodeId}
            previewNodeId={previewNodeId}
            onNodePreview={onNodePreview}
            onNodeSelect={onNodeSelect}
          />
        </g>
      </svg>
      <YellowRiverMapLegend />
    </div>
  );
}

export default YangtzeRiverMap;
