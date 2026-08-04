import type { BasinId, BasinInteractionState, BasinOverviewItem } from '@/types/basin';

interface BasinSelectionListProps {
  basins: BasinOverviewItem[];
  activeBasinId: BasinId | null;
  onBasinActivate: (basinId: BasinId) => void;
  onBasinInteractionChange: (basinId: BasinId | null, interactionState: BasinInteractionState) => void;
}

function BasinSelectionList({ basins, activeBasinId, onBasinActivate, onBasinInteractionChange }: BasinSelectionListProps) {
  return (
    <nav className="basin-selection-list" aria-label="流域选择">
      {basins.map((basin) => (
        <button
          key={basin.id}
          type="button"
          className={`${basin.themeClassName}${activeBasinId === basin.id ? ' is-active' : ''}`}
          onBlur={() => onBasinInteractionChange(null, 'idle')}
          onFocus={() => onBasinInteractionChange(basin.id, 'focused')}
          onMouseEnter={() => onBasinInteractionChange(basin.id, 'hovered')}
          onMouseLeave={() => onBasinInteractionChange(null, 'idle')}
          onClick={() => onBasinActivate(basin.id)}
        >
          <span>{basin.name}</span>
          <small>探索流域</small>
        </button>
      ))}
      <p className="basin-selection-list__coming-soon">其他流域正在整理中。</p>
    </nav>
  );
}

export default BasinSelectionList;
