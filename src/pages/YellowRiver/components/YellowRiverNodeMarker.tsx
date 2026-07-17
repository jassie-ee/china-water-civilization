import type { KeyboardEvent } from 'react';

import type { YellowRiverNode } from '@/types/basin';

interface YellowRiverNodeMarkerProps {
  node: YellowRiverNode;
  isSelected: boolean;
  isPreviewed: boolean;
  onPreview: (nodeId: YellowRiverNode['id'] | null) => void;
  onSelect: (nodeId: YellowRiverNode['id']) => void;
}

function YellowRiverNodeMarker({ node, isSelected, isPreviewed, onPreview, onSelect }: YellowRiverNodeMarkerProps) {
  const handleKeyDown = (event: KeyboardEvent<SVGGElement>): void => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onSelect(node.id);
    }
  };
  const typeLabel = node.type === 'ecological' ? '生态问题节点' : '关键工程节点';
  const stateClassName = `${isSelected ? ' is-selected' : ''}${isPreviewed ? ' is-previewed' : ''}`;

  return (
    <g
      className={`yellow-river-node-marker yellow-river-node-marker--${node.type}${stateClassName}`}
      id={`yellow-river-node-${node.id}`}
      transform={`translate(${node.position.x} ${node.position.y})`}
      role="button"
      tabIndex={0}
      aria-label={`${typeLabel}：${node.name}`}
      aria-pressed={isSelected}
      onBlur={() => onPreview(null)}
      onFocus={() => onPreview(node.id)}
      onKeyDown={handleKeyDown}
      onMouseEnter={() => onPreview(node.id)}
      onMouseLeave={() => onPreview(null)}
      onClick={() => onSelect(node.id)}
    >
      <circle className="yellow-river-node-marker__hit-area" r="29" />
      <circle className="yellow-river-node-marker__glow" r="21" aria-hidden="true" />
      {node.type === 'ecological' ? (
        <>
          <circle className="yellow-river-node-marker__shape" r="11" />
          <path className="yellow-river-node-marker__symbol" d="M-3 4 C-7 -2 -3 -8 4 -9 C7 -3 4 3 -3 4 Z" aria-hidden="true" />
        </>
      ) : (
        <>
          <polygon className="yellow-river-node-marker__shape" points="0,-14 12,-7 12,7 0,14 -12,7 -12,-7" />
          <path className="yellow-river-node-marker__symbol" d="M-6 4 H6 M-3 0 V-5 M3 0 V-5" aria-hidden="true" />
        </>
      )}
    </g>
  );
}

export default YellowRiverNodeMarker;
