import { chinaOutlinePath } from '@/data/basinMapPaths';
import type { BasinId, BasinInteractionState, BasinOverviewItem, BasinOverviewPhase } from '@/types/basin';

import RiverPath from './RiverPath';
import SourceMarker from './SourceMarker';

interface ChinaBasinMapProps {
  basins: BasinOverviewItem[];
  phase: BasinOverviewPhase;
  activeBasinId: BasinId | null;
  interactionState: BasinInteractionState;
  selectedBasinId: BasinId | null;
  onBasinActivate: (basinId: BasinId) => void;
  onBasinInteractionChange: (basinId: BasinId | null, interactionState: BasinInteractionState) => void;
}

function ChinaBasinMap({ basins, phase, activeBasinId, interactionState, selectedBasinId, onBasinActivate, onBasinInteractionChange }: ChinaBasinMapProps) {
  return (
    <div
      className={`china-basin-map china-basin-map--${phase} china-basin-map--${interactionState}${selectedBasinId === null ? '' : ' china-basin-map--has-selection'}`}
      aria-label="中国流域互动叙事示意图"
    >
      <svg viewBox="0 0 1040 650" role="img" aria-label="从青藏高原源头点亮黄河和长江的抽象流域地图">
        <g className="china-basin-map__atmosphere" aria-hidden="true">
          <ellipse cx="510" cy="345" rx="410" ry="245" />
        </g>
        <g className="china-basin-map__outline" aria-hidden="true">
          <path d={chinaOutlinePath} />
          <path className="china-basin-map__terrain" d="M241 307 C325 241 412 226 475 245 C551 266 586 228 661 241" />
        </g>
        <SourceMarker phase={phase} />
        <g className="china-basin-map__rivers">
          {basins.map((basin) => (
            <RiverPath
              key={basin.id}
              basin={basin}
              phase={phase}
              isActive={activeBasinId === basin.id}
              interactionState={activeBasinId === basin.id ? interactionState : 'idle'}
              isSelected={selectedBasinId === basin.id}
              onActivate={onBasinActivate}
              onInteractionChange={onBasinInteractionChange}
            />
          ))}
        </g>
      </svg>
      <p className="china-basin-map__caption">互动叙事地理示意，非测绘地图</p>
    </div>
  );
}

export default ChinaBasinMap;
