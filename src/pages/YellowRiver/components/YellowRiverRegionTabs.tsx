import type { YellowRiverRegion, YellowRiverRegionId } from '@/types/basin';

interface YellowRiverRegionTabsProps {
  regions: YellowRiverRegion[];
  selectedRegionId: YellowRiverRegionId;
  onRegionSelect: (regionId: YellowRiverRegionId) => void;
  onRegionPreview: (regionId: YellowRiverRegionId | null) => void;
}

function YellowRiverRegionTabs({ regions, selectedRegionId, onRegionSelect, onRegionPreview }: YellowRiverRegionTabsProps) {
  return (
    <div className="yellow-river-region-tabs" aria-label="黄河区域选择">
      {regions.map((region) => (
        <button
          key={region.id}
          type="button"
          className={`${region.themeClassName}${selectedRegionId === region.id ? ' is-selected' : ''}`}
          aria-pressed={selectedRegionId === region.id}
          onBlur={() => onRegionPreview(null)}
          onFocus={() => onRegionPreview(region.id)}
          onMouseEnter={() => onRegionPreview(region.id)}
          onMouseLeave={() => onRegionPreview(null)}
          onClick={() => onRegionSelect(region.id)}
        >
          <span>{region.shortName}</span>
          <small>{region.coreQuestion}</small>
        </button>
      ))}
    </div>
  );
}

export default YellowRiverRegionTabs;
