import { riverLabelPositions, riverPaths } from '@/data/basinMapPaths';
import type { BasinId, BasinInteractionState, BasinOverviewItem, BasinOverviewPhase } from '@/types/basin';

interface RiverPathProps {
  basin: BasinOverviewItem;
  phase: BasinOverviewPhase;
  isActive: boolean;
  interactionState: BasinInteractionState;
  isSelected: boolean;
  onActivate: (basinId: BasinId) => void;
  onInteractionChange: (basinId: BasinId | null, interactionState: BasinInteractionState) => void;
}

function RiverPath({ basin, phase, isActive, interactionState, isSelected, onActivate, onInteractionChange }: RiverPathProps) {
  const labelPosition = riverLabelPositions[basin.id];
  const stateClassName = isSelected ? 'is-selected' : isActive ? `is-active is-${interactionState}` : '';

  const handleKeyDown = (event: React.KeyboardEvent<SVGGElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onActivate(basin.id);
    }
  };

  return (
    <g
      className={`river-path ${basin.themeClassName} ${stateClassName}`}
      role="button"
      tabIndex={0}
      aria-label={`进入${basin.name}`}
      onBlur={() => onInteractionChange(null, 'idle')}
      onFocus={() => onInteractionChange(basin.id, 'focused')}
      onKeyDown={handleKeyDown}
      onMouseEnter={() => onInteractionChange(basin.id, 'hovered')}
      onMouseLeave={() => onInteractionChange(null, 'idle')}
      onClick={() => onActivate(basin.id)}
    >
      <path className="river-path__hit-area" d={riverPaths[basin.id]} />
      {/* pathLength 将不同长度的河流统一为 0–1，避免固定虚线长度露出尾端。 */}
      <path className={`river-path__glow river-path__glow--${phase}`} d={riverPaths[basin.id]} pathLength={1} />
      <path className={`river-path__line river-path__line--${phase}`} d={riverPaths[basin.id]} pathLength={1} />
      <text className="river-path__label" x={labelPosition.x} y={labelPosition.y}>{basin.name}</text>
    </g>
  );
}

export default RiverPath;
