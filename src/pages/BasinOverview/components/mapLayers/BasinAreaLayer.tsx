import type { BasinMapItem } from '@/types/basinMap';

interface BasinAreaLayerProps {
  basins: BasinMapItem[];
}

/** 仅渲染已核验的流域范围资产，不以河道线推断流域边界。 */
function BasinAreaLayer({ basins }: BasinAreaLayerProps) {
  return (
    <g className="basin-area-layer" aria-hidden="true">
      {basins.flatMap((basin) => (
        basin.geometryAssets.basinArea === null
          ? []
          : [<image key={basin.id} href={basin.geometryAssets.basinArea} />]
      ))}
    </g>
  );
}

export default BasinAreaLayer;
