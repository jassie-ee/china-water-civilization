import {
  mainstreamSegmentPaths,
  regionLabelPositions,
  regionPaths,
  supportWaterwayPaths,
  yangtzeRiverBasinPath,
  yangtzeRiverMainstreamPath,
} from '@/data/yangtzeRiverMapPaths';
import { yangtzeRiverNodes } from '@/data/yangtzeRiverNodes';
import { yangtzeRiverRegions } from '@/data/yangtzeRiverRegions';
import type { YangtzeRiverRegionId } from '@/types/basin';

import YellowRiverMapLegend from '@/pages/YellowRiver/components/YellowRiverMapLegend';
import YellowRiverNodeLayer from '@/pages/YellowRiver/components/YellowRiverNodeLayer';

interface YangtzeRiverMapProps {
  selectedRegionId: YangtzeRiverRegionId;
  previewRegionId: YangtzeRiverRegionId | null;
  selectedNodeId: string | null;
  previewNodeId: string | null;
  onRegionSelect: (regionId: YangtzeRiverRegionId) => void;
  onRegionPreview: (regionId: YangtzeRiverRegionId | null) => void;
  onNodeSelect: (nodeId: string) => void;
  onNodePreview: (nodeId: string | null) => void;
}

function YangtzeRiverMap({
  selectedRegionId, previewRegionId, selectedNodeId, previewNodeId,
  onRegionSelect, onRegionPreview, onNodeSelect, onNodePreview,
}: YangtzeRiverMapProps) {
  const visibleRegionId = previewRegionId ?? selectedRegionId;

  return (
    <div className="yellow-river-map yangtze-river-map" aria-label="长江上中下游互动叙事地图">
      <svg viewBox="0 0 1400 800" role="img" aria-label="可选择长江上游、中游和下游的抽象流域地图">
        <g className="yellow-river-map__terrain-layer" aria-hidden="true">
          <path className="yangtze-river-map__mountains" d="M133 468 C183 276 376 181 550 258 C488 336 505 428 425 506 C313 550 203 533 133 468 Z" />
          <path className="yangtze-river-map__lakes" d="M585 329 C686 242 825 250 900 351 C945 423 892 531 775 562 C669 566 589 501 555 432 C608 408 618 359 585 329 Z" />
          <path className="yangtze-river-map__delta" d="M896 343 C1038 301 1189 369 1239 473 C1274 547 1160 644 1001 615 C929 595 884 544 855 478 C907 420 936 377 896 343 Z" />
        </g>
        <g className="yellow-river-map__basin-layer" aria-hidden="true"><path d={yangtzeRiverBasinPath} /></g>
        <g className="yangtze-river-map__support-waterway-layer" aria-hidden="true">
          {supportWaterwayPaths.map((path) => <path key={path} d={path} />)}
        </g>
        <g className="yellow-river-map__region-layer">
          {yangtzeRiverRegions.map((region) => {
            const isVisible = region.id === visibleRegionId;
            const labelPosition = regionLabelPositions[region.id];
            return (
              <g
                key={region.id}
                className={`yellow-river-map__region ${region.themeClassName}${isVisible ? ' is-visible' : ''}${region.id === selectedRegionId ? ' is-selected' : ''}`}
                role="button"
                tabIndex={0}
                aria-label={`选择长江${region.shortName}`}
                onBlur={() => onRegionPreview(null)}
                onFocus={() => onRegionPreview(region.id)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); onRegionSelect(region.id); }
                }}
                onMouseEnter={() => onRegionPreview(region.id)}
                onMouseLeave={() => onRegionPreview(null)}
                onClick={() => onRegionSelect(region.id)}
              >
                <path className="yellow-river-map__region-hit-area" d={regionPaths[region.id]} />
                <path className="yellow-river-map__region-shape" d={regionPaths[region.id]} />
                <path className="yellow-river-map__region-mainstream" d={mainstreamSegmentPaths[region.id]} />
                <text className="yellow-river-map__region-label" x={labelPosition.x} y={labelPosition.y}>{region.shortName}</text>
              </g>
            );
          })}
        </g>
        <g className="yellow-river-map__mainstream-layer" aria-hidden="true"><path d={yangtzeRiverMainstreamPath} /></g>
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
      <p className="yellow-river-map__caption">流域叙事示意图，非测绘用途</p>
    </div>
  );
}

export default YangtzeRiverMap;
