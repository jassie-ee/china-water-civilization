import {
  mainstreamSegmentPaths,
  pearlRiverMainstreamPath,
  regionLabelPositions,
  supportWaterwayPaths,
} from '@/data/pearlRiverMapPaths';
import { pearlRiverNodes } from '@/data/pearlRiverNodes';
import { pearlRiverRegions } from '@/data/pearlRiverRegions';
import type { PearlRiverRegionId } from '@/types/basin';
import pearlRiverBackground from '@/assets/images/basins/pearl-river-background-v3.webp';

import YellowRiverNodeLayer from '@/pages/YellowRiver/components/YellowRiverNodeLayer';

interface PearlRiverMapProps {
  selectedRegionId: PearlRiverRegionId | null;
  previewRegionId: PearlRiverRegionId | null;
  selectedNodeId: string | null;
  previewNodeId: string | null;
  onRegionSelect: (regionId: PearlRiverRegionId) => void;
  onRegionPreview: (regionId: PearlRiverRegionId | null) => void;
  onNodeSelect: (nodeId: string) => void;
  onNodePreview: (nodeId: string | null) => void;
  onBlankClick: () => void;
}

function PearlRiverMap({
  selectedRegionId,
  previewRegionId,
  selectedNodeId,
  previewNodeId,
  onRegionSelect,
  onRegionPreview,
  onNodeSelect,
  onNodePreview,
  onBlankClick,
}: PearlRiverMapProps) {
  const visibleRegionId = previewRegionId ?? selectedRegionId;

  const handleRegionKeyDown = (event: React.KeyboardEvent<SVGGElement>, regionId: PearlRiverRegionId): void => {
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
    <div className="yellow-river-map yellow-river-map--atlas pearl-river-map pearl-river-map--atlas" aria-label="珠江上游、中游、下游互动水脉地图">
      <svg viewBox="0 0 1672 941" preserveAspectRatio="xMidYMid meet" role="img" aria-label="可选择珠江上游、中游和下游的珠江水脉地图" onClick={handleMapClick}>
        <defs>
          <radialGradient id="pearl-river-atlas-shade" cx="50%" cy="43%" r="78%">
            <stop offset="50%" stopColor="#182d31" stopOpacity="0" />
            <stop offset="100%" stopColor="#091c29" stopOpacity="0.22" />
          </radialGradient>
        </defs>
        <image
          className="yellow-river-map__background"
          href={pearlRiverBackground}
          x="0"
          y="0"
          width="1672"
          height="941"
          preserveAspectRatio="xMidYMid meet"
          aria-hidden="true"
        />
        <rect className="pearl-river-map__background-shade" x="0" y="0" width="1672" height="941" aria-hidden="true" />
        <g className="yellow-river-map__waterway pearl-river-map__waterway" aria-hidden="true">
          <path className="yellow-river-map__waterway-bed" d={pearlRiverMainstreamPath} />
          <path className="yellow-river-map__waterway-body" d={pearlRiverMainstreamPath} />
          <path className="yellow-river-map__waterway-glint" d={pearlRiverMainstreamPath} />
        </g>
        <g className="pearl-river-map__support-waterway" aria-hidden="true">
          {supportWaterwayPaths.map(({ regionId, path }) => (
            <g
              key={path}
              className={`pearl-river-map__support-waterway-branch${regionId === visibleRegionId ? ' is-visible' : ''}${regionId === selectedRegionId ? ' is-selected' : ''}`}
            >
              <path className="pearl-river-map__support-waterway-bed" d={path} />
              <path className="pearl-river-map__support-waterway-body" d={path} />
              <path className="pearl-river-map__support-waterway-glint" d={path} />
            </g>
          ))}
        </g>
        <g className="yellow-river-map__atlas-region-layer">
          {pearlRiverRegions.map((region) => {
            const isVisible = region.id === visibleRegionId;
            const labelPosition = regionLabelPositions[region.id];

            return (
              <g
                key={region.id}
                className={`yellow-river-map__atlas-region ${region.themeClassName}${isVisible ? ' is-visible' : ''}${region.id === selectedRegionId ? ' is-selected' : ''}`}
                role="button"
                tabIndex={0}
                aria-label={`选择珠江${region.shortName}`}
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
            nodes={pearlRiverNodes}
            mapId="pearl-river"
            selectedNodeId={selectedNodeId}
            previewNodeId={previewNodeId}
            onNodePreview={onNodePreview}
            onNodeSelect={onNodeSelect}
          />
        </g>
      </svg>
    </div>
  );
}

export default PearlRiverMap;
