import type { BasinMapItem } from '@/types/basinMap';

interface RiverMainlineLayerProps {
  basins: BasinMapItem[];
}

/** 干流视觉层与流域范围、透明热区分离。 */
function RiverMainlineLayer({ basins }: RiverMainlineLayerProps) {
  return (
    <g className="river-mainline-layer" aria-hidden="true">
      {basins.flatMap((basin) => (
        basin.geometryAssets.mainRiver === null
          ? []
          : [<image key={basin.id} href={basin.geometryAssets.mainRiver} />]
      ))}
    </g>
  );
}

export default RiverMainlineLayer;
