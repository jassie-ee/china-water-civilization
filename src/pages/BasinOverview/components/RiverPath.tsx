import { riverLabelPositions, riverPaths } from '@/data/basinMapPaths';
import type { BasinId, BasinOverviewItem, BasinOverviewPhase } from '@/types/basin';

interface RiverPathProps {
  basin: BasinOverviewItem;
  phase: BasinOverviewPhase;
  isActive: boolean;
  isSelected: boolean;
  onActivate: (basinId: BasinId) => void;
  onActiveChange: (basinId: BasinId | null) => void;
}

function RiverPath({ basin, phase, isActive, isSelected, onActivate, onActiveChange }: RiverPathProps) {
  const labelPosition = riverLabelPositions[basin.id];
  const stateClassName = isSelected ? 'is-selected' : isActive ? 'is-active' : '';

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
      onBlur={() => onActiveChange(null)}
      onFocus={() => onActiveChange(basin.id)}
      onKeyDown={handleKeyDown}
      onMouseEnter={() => onActiveChange(basin.id)}
      onMouseLeave={() => onActiveChange(null)}
      onClick={() => onActivate(basin.id)}
    >
      <path className="river-path__hit-area" d={riverPaths[basin.id]} />
      <path className={`river-path__glow river-path__glow--${phase}`} d={riverPaths[basin.id]} />
      <path className={`river-path__line river-path__line--${phase}`} d={riverPaths[basin.id]} />
      <text className="river-path__label" x={labelPosition.x} y={labelPosition.y}>{basin.name}</text>
    </g>
  );
}

export default RiverPath;
