import type { RiverNode } from '@/types/basin';

import YellowRiverNodeMarker from './YellowRiverNodeMarker';

interface YellowRiverNodeLayerProps {
  nodes: RiverNode[];
  selectedNodeId: string | null;
  previewNodeId: string | null;
  onNodePreview: (nodeId: string | null) => void;
  onNodeSelect: (nodeId: string) => void;
  mapId?: string;
}

function YellowRiverNodeLayer({ nodes, selectedNodeId, previewNodeId, onNodePreview, onNodeSelect, mapId }: YellowRiverNodeLayerProps) {
  const activeNodeId = previewNodeId ?? selectedNodeId;
  const ecologicalNodes = nodes.filter((node) => node.type === 'ecological');
  const engineeringNodes = nodes.filter((node) => node.type === 'engineering');

  return (
    <>
      <g className="yellow-river-map__ecological-node-layer">
        {ecologicalNodes.map((node) => (
          <YellowRiverNodeMarker
            key={node.id}
            node={node}
            isSelected={node.id === selectedNodeId}
            isPreviewed={node.id === activeNodeId}
            onPreview={onNodePreview}
            onSelect={onNodeSelect}
            mapId={mapId}
          />
        ))}
      </g>
      <g className="yellow-river-map__engineering-node-layer">
        {engineeringNodes.map((node) => (
          <YellowRiverNodeMarker
            key={node.id}
            node={node}
            isSelected={node.id === selectedNodeId}
            isPreviewed={node.id === activeNodeId}
            onPreview={onNodePreview}
            onSelect={onNodeSelect}
            mapId={mapId}
          />
        ))}
      </g>
      <g className="yellow-river-map__node-label-layer" aria-hidden="true">
        {nodes.map((node) => (
          <text
            key={node.id}
            className={`yellow-river-map__node-label yellow-river-map__node-label--${node.type}${node.id === activeNodeId ? ' is-active' : ''}`}
            x={node.position.x + (node.position.labelOffsetX ?? 0)}
            y={node.position.y + (node.position.labelOffsetY ?? 0)}
          >
            {node.shortName}
          </text>
        ))}
      </g>
    </>
  );
}

export default YellowRiverNodeLayer;
