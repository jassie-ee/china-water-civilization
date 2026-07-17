import { yellowRiverNodes } from '@/data/yellowRiverNodes';
import type { YellowRiverNodeId } from '@/types/basin';

import YellowRiverNodeMarker from './YellowRiverNodeMarker';

interface YellowRiverNodeLayerProps {
  selectedNodeId: YellowRiverNodeId | null;
  previewNodeId: YellowRiverNodeId | null;
  onNodePreview: (nodeId: YellowRiverNodeId | null) => void;
  onNodeSelect: (nodeId: YellowRiverNodeId) => void;
}

function YellowRiverNodeLayer({ selectedNodeId, previewNodeId, onNodePreview, onNodeSelect }: YellowRiverNodeLayerProps) {
  const activeNodeId = previewNodeId ?? selectedNodeId;
  const ecologicalNodes = yellowRiverNodes.filter((node) => node.type === 'ecological');
  const engineeringNodes = yellowRiverNodes.filter((node) => node.type === 'engineering');

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
          />
        ))}
      </g>
      <g className="yellow-river-map__node-label-layer" aria-hidden="true">
        {yellowRiverNodes.map((node) => (
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
