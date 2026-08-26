import {
  mainstreamSegmentPaths,
  regionLabelPositions,
  yellowRiverMainstreamPath,
} from '@/data/yellowRiverMapPaths';
import { yellowRiverNodes } from '@/data/yellowRiverNodes';
import { yellowRiverRegions } from '@/data/yellowRiverRegions';
import type { YellowRiverNodeId, YellowRiverRegionId } from '@/types/basin';
import yellowRiverBackground from '@/assets/images/basins/yellow-river-background.png';

import YellowRiverNodeLayer from './YellowRiverNodeLayer';

interface YellowRiverMapProps {
  selectedRegionId: YellowRiverRegionId;
  previewRegionId: YellowRiverRegionId | null;
  selectedNodeId: YellowRiverNodeId | null;
  previewNodeId: YellowRiverNodeId | null;
  onRegionSelect: (regionId: YellowRiverRegionId) => void;
  onRegionPreview: (regionId: YellowRiverRegionId | null) => void;
  onNodeSelect: (nodeId: YellowRiverNodeId) => void;
  onNodePreview: (nodeId: YellowRiverNodeId | null) => void;
}

function YellowRiverMap({
  selectedRegionId,
  previewRegionId,
  selectedNodeId,
  previewNodeId,
  onRegionSelect,
  onRegionPreview,
  onNodeSelect,
  onNodePreview,
}: YellowRiverMapProps) {
  const visibleRegionId = previewRegionId ?? selectedRegionId;

  const handleRegionKeyDown = (event: React.KeyboardEvent<SVGGElement>, regionId: YellowRiverRegionId): void => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onRegionSelect(regionId);
    }
  };

  return (
    <div className="yellow-river-map yellow-river-map--atlas" aria-label="黄河上游、中游、下游互动水脉地图">
      <svg viewBox="0 0 1672 941" preserveAspectRatio="xMidYMid meet" role="img" aria-label="可选择黄河上游、中游和下游的黄河水脉地图">
        <defs>
          <radialGradient id="yellow-river-atlas-shade" cx="50%" cy="44%" r="76%">
            <stop offset="56%" stopColor="#071b22" stopOpacity="0" />
            <stop offset="100%" stopColor="#071b22" stopOpacity="0.3" />
          </radialGradient>
        </defs>
        <image
          className="yellow-river-map__background"
          href={yellowRiverBackground}
          x="0"
          y="0"
          width="1672"
          height="941"
          preserveAspectRatio="xMidYMid meet"
          aria-hidden="true"
        />
        <rect className="yellow-river-map__background-shade" x="0" y="0" width="1672" height="941" aria-hidden="true" />
        <g className="yellow-river-map__waterway" aria-hidden="true">
          <path className="yellow-river-map__waterway-bed" d={yellowRiverMainstreamPath} />
          <path className="yellow-river-map__waterway-body" d={yellowRiverMainstreamPath} />
          <path className="yellow-river-map__waterway-glint" d={yellowRiverMainstreamPath} />
        </g>
        <g className="yellow-river-map__atlas-region-layer">
          {yellowRiverRegions.map((region) => {
            const isVisible = region.id === visibleRegionId;
            const labelPosition = regionLabelPositions[region.id];

            return (
              <g
                key={region.id}
                className={`yellow-river-map__atlas-region ${region.themeClassName}${isVisible ? ' is-visible' : ''}${region.id === selectedRegionId ? ' is-selected' : ''}`}
                role="button"
                tabIndex={0}
                aria-label={`选择黄河${region.shortName}`}
                onBlur={() => onRegionPreview(null)}
                onFocus={() => onRegionPreview(region.id)}
                onKeyDown={(event) => handleRegionKeyDown(event, region.id)}
                onMouseEnter={() => onRegionPreview(region.id)}
                onMouseLeave={() => onRegionPreview(null)}
                onClick={() => onRegionSelect(region.id)}
              >
                <path className="yellow-river-map__atlas-region-hit-area" d={mainstreamSegmentPaths[region.id]} />
                <path className="yellow-river-map__atlas-region-water" d={mainstreamSegmentPaths[region.id]} />
                <text className="yellow-river-map__region-label" x={labelPosition.x} y={labelPosition.y}>{region.shortName}</text>
              </g>
            );
          })}
        </g>
        <g className="yellow-river-map__node-layer">
          <YellowRiverNodeLayer
            nodes={yellowRiverNodes}
            selectedNodeId={selectedNodeId}
            previewNodeId={previewNodeId}
            onNodePreview={(nodeId) => onNodePreview(nodeId as YellowRiverNodeId | null)}
            onNodeSelect={(nodeId) => onNodeSelect(nodeId as YellowRiverNodeId)}
          />
        </g>
      </svg>
    </div>
  );
}

export default YellowRiverMap;
