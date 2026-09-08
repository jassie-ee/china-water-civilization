import type { BasinMapItem } from '@/types/basinMap';

interface BasinLabelLayerProps {
  basins: BasinMapItem[];
}

/** 标签坐标仅保存在配置中，不与几何路径或页面说明混写。 */
function BasinLabelLayer({ basins }: BasinLabelLayerProps) {
  return (
    <g className="basin-label-layer" aria-hidden="true">
      {basins.map((basin) => (
        <text key={basin.id} x={basin.labelPosition.x} y={basin.labelPosition.y}>
          {basin.name}
        </text>
      ))}
    </g>
  );
}

export default BasinLabelLayer;
