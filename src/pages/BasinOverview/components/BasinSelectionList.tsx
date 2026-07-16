import type { BasinId, BasinOverviewItem } from '@/types/basin';

interface BasinSelectionListProps {
  basins: BasinOverviewItem[];
  activeBasinId: BasinId | null;
  onBasinActivate: (basinId: BasinId) => void;
  onActiveBasinChange: (basinId: BasinId | null) => void;
}

function BasinSelectionList({ basins, activeBasinId, onBasinActivate, onActiveBasinChange }: BasinSelectionListProps) {
  return (
    <nav className="basin-selection-list" aria-label="流域选择">
      {basins.map((basin) => (
        <button
          key={basin.id}
          type="button"
          className={`${basin.themeClassName}${activeBasinId === basin.id ? ' is-active' : ''}`}
          onBlur={() => onActiveBasinChange(null)}
          onFocus={() => onActiveBasinChange(basin.id)}
          onMouseEnter={() => onActiveBasinChange(basin.id)}
          onMouseLeave={() => onActiveBasinChange(null)}
          onClick={() => onBasinActivate(basin.id)}
        >
          <span>{basin.name}</span>
          <small>探索流域</small>
        </button>
      ))}
    </nav>
  );
}

export default BasinSelectionList;
