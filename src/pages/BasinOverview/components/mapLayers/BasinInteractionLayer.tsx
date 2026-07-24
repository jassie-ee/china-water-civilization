import type { BasinId, BasinInteractionState } from '@/types/basin';
import type { BasinMapItem } from '@/types/basinMap';

interface BasinInteractionLayerProps {
  basins: BasinMapItem[];
  activeBasinId: BasinId | null;
  interactionState: BasinInteractionState;
  onActivate: (basinId: BasinId) => void;
}

/** 透明热区层预留；待确认的交互几何资产到位后再启用。 */
function BasinInteractionLayer({ basins, activeBasinId, interactionState, onActivate }: BasinInteractionLayerProps) {
  const handleKeyDown = (event: React.KeyboardEvent<SVGImageElement>, basinId: BasinId): void => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onActivate(basinId);
    }
  };

  return (
    <g className="basin-interaction-layer">
      {basins.flatMap((basin) => (
        basin.geometryAssets.interactionArea === null
          ? []
          : [
            <image
              key={basin.id}
              className={activeBasinId === basin.id ? `is-${interactionState}` : undefined}
              href={basin.geometryAssets.interactionArea}
              role="button"
              tabIndex={0}
              aria-label={basin.prompt}
              onClick={() => onActivate(basin.id)}
              onKeyDown={(event) => handleKeyDown(event, basin.id)}
            />,
          ]
      ))}
    </g>
  );
}

export default BasinInteractionLayer;
