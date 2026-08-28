import {
  regionLabelPositions,
  regionPaths,
  yellowRiverBasinPath,
  yellowRiverMainstreamPath,
} from '@/data/yellowRiverMapPaths';
import { yellowRiverNodes } from '@/data/yellowRiverNodes';
import { yellowRiverRegions } from '@/data/yellowRiverRegions';
import type { YellowRiverNodeId, YellowRiverRegionId } from '@/types/basin';

import YellowRiverMapLegend from './YellowRiverMapLegend';
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
    <div className="yellow-river-map" aria-label="黄河上游、中游、下游互动叙事地图">
      <svg viewBox="0 0 1400 800" role="img" aria-label="可选择黄河上游、中游和下游的抽象流域地图">
        <defs>
          {yellowRiverRegions.map((region) => (
            <clipPath key={region.id} id={`yellow-river-region-clip-${region.id}`} clipPathUnits="userSpaceOnUse">
              <path d={regionPaths[region.id]} />
            </clipPath>
          ))}
        </defs>
        <g className="yellow-river-map__terrain-layer" aria-hidden="true">
          <path className="yellow-river-map__plateau" d="M146 454 C167 293 350 168 532 234 C475 304 514 384 431 462 C340 529 217 514 146 454 Z" />
          <path className="yellow-river-map__loess" d="M446 295 C553 197 735 199 810 304 C861 389 794 505 688 557 C570 576 455 518 404 446 C473 407 482 346 446 295 Z" />
          <path className="yellow-river-map__plain" d="M797 301 C944 280 1136 368 1203 477 C1248 558 1130 667 951 628 C876 611 823 565 786 493 C841 426 853 353 797 301 Z" />
        </g>
        <g className="yellow-river-map__basin-layer" aria-hidden="true">
          <path d={yellowRiverBasinPath} />
        </g>
        <g className="yellow-river-map__region-layer">
          {yellowRiverRegions.map((region) => {
            const isVisible = region.id === visibleRegionId;
            const labelPosition = regionLabelPositions[region.id];

            return (
              <g
                key={region.id}
                className={`yellow-river-map__region ${region.themeClassName}${isVisible ? ' is-visible' : ''}${region.id === selectedRegionId ? ' is-selected' : ''}`}
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
                <path className="yellow-river-map__region-hit-area" d={regionPaths[region.id]} />
                <path className="yellow-river-map__region-shape" d={regionPaths[region.id]} />
                {/* 由河段边界裁切完整干流，避免手写分段端点与区域边界错位。 */}
                <path
                  className="yellow-river-map__region-mainstream"
                  d={yellowRiverMainstreamPath}
                  clipPath={`url(#yellow-river-region-clip-${region.id})`}
                />
                <text className="yellow-river-map__region-label" x={labelPosition.x} y={labelPosition.y}>{region.shortName}</text>
              </g>
            );
          })}
        </g>
        <g className="yellow-river-map__mainstream-layer" aria-hidden="true">
          <path d={yellowRiverMainstreamPath} />
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
      <YellowRiverMapLegend />
      <p className="yellow-river-map__caption">流域叙事示意图，非测绘用途</p>
    </div>
  );
}

export default YellowRiverMap;
