import type { CSSProperties } from 'react';

import chinaThreeBasinsAtlas from '@/assets/images/china-three-basins-atlas.png';
import { basinAtlasMarkers } from '@/data/basinAtlas';
import type { BasinId } from '@/types/basin';

interface BasinAtlasProps {
  selectedBasinId: BasinId | null;
  onBasinActivate: (basinId: BasinId) => void;
}

function BasinAtlas({ selectedBasinId, onBasinActivate }: BasinAtlasProps) {
  return (
    <main className={`basin-atlas${selectedBasinId === null ? '' : ' basin-atlas--has-selection'}`}>
      <img
        className="basin-atlas__art"
        src={chinaThreeBasinsAtlas}
        alt="中国山河图：北部黄河、居中长江、南部珠江从山地、平原与三角洲通向海岸。"
      />
      <div className="basin-atlas__shade" aria-hidden="true" />
      <nav className="basin-atlas__markers" aria-label="流域入口">
        {basinAtlasMarkers.map((marker) => {
          const markerStyle = {
            '--marker-x': `${marker.position.x}%`,
            '--marker-y': `${marker.position.y}%`,
            '--marker-mobile-x': `${marker.position.mobileX}%`,
            '--marker-mobile-y': `${marker.position.mobileY}%`,
          } as CSSProperties;

          const className = `basin-atlas__marker basin-atlas__marker--${marker.id}${selectedBasinId === marker.id ? ' is-selected' : ''}`;

          return (
            <button
              key={marker.id}
              className={className}
              style={markerStyle}
              type="button"
              aria-label={`进入${marker.name}流域`}
              onClick={() => onBasinActivate(marker.id)}
            >
              <span aria-hidden="true">{marker.name}</span>
            </button>
          );
        })}
      </nav>
    </main>
  );
}

export default BasinAtlas;
