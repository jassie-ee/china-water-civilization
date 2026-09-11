import type { CSSProperties } from 'react';

import chinaThreeBasinsAtlas from '@/assets/images/china-three-basins-atlas-highlighted.webp';
import { basinAtlasMarkers } from '@/data/basinAtlas';
import { basinOverviewItems } from '@/data/basinOverview';
import type { BasinId } from '@/types/basin';

interface BasinAtlasProps {
  selectedBasinId: BasinId | null;
  highlightedBasinId: BasinId | null;
  onBasinActivate: (basinId: BasinId) => void;
  onBasinHighlight: (basinId: BasinId | null) => void;
}

function BasinAtlas({ selectedBasinId, highlightedBasinId, onBasinActivate, onBasinHighlight }: BasinAtlasProps) {
  const activeBasinId = highlightedBasinId ?? selectedBasinId;
  const activeBasin = basinOverviewItems.find((basin) => basin.id === activeBasinId) ?? null;

  return (
    <main className={`basin-atlas${selectedBasinId === null ? '' : ' basin-atlas--has-selection'}`}>
      <img
        className="basin-atlas__art"
        src={chinaThreeBasinsAtlas}
        alt="中国山河图：北部黄河、居中长江、南部珠江从山地、平原与三角洲通向海岸。"
      />
      <div className="basin-atlas__shade" aria-hidden="true" />
      <aside className="basin-atlas__index" aria-label="三大流域图册" onPointerDown={(event) => event.stopPropagation()}>
        <p className="basin-atlas__index-heading">三大流域</p>
        <ol>
          {basinAtlasMarkers.map((marker, index) => {
            const basin = basinOverviewItems.find((item) => item.id === marker.id);
            const isHighlighted = highlightedBasinId === marker.id;
            const isSelected = selectedBasinId === marker.id;

            return (
              <li key={marker.id}>
                <button
                  className={`${isHighlighted ? ' is-highlighted' : ''}${isSelected ? ' is-selected' : ''}`}
                  type="button"
                  aria-pressed={isSelected}
                  onPointerEnter={() => onBasinHighlight(marker.id)}
                  onPointerLeave={() => onBasinHighlight(null)}
                  onFocus={() => onBasinHighlight(marker.id)}
                  onBlur={() => onBasinHighlight(null)}
                  onClick={() => onBasinActivate(marker.id)}
                >
                  <span className="basin-atlas__index-order" aria-hidden="true">0{index + 1}</span>
                  <span className="basin-atlas__index-copy">
                    <strong>{marker.name}流域</strong>
                    <small>{basin?.englishName}</small>
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
      </aside>
      <nav className="basin-atlas__markers" aria-label="流域入口">
        {basinAtlasMarkers.map((marker) => {
          const markerStyle = {
            '--marker-x': `${marker.position.x}%`,
            '--marker-y': `${marker.position.y}%`,
            '--marker-mobile-x': `${marker.position.mobileX}%`,
            '--marker-mobile-y': `${marker.position.mobileY}%`,
          } as CSSProperties;

          const className = `basin-atlas__marker basin-atlas__marker--${marker.id}${selectedBasinId === marker.id ? ' is-selected' : ''}${highlightedBasinId === marker.id ? ' is-highlighted' : ''}`;

          return (
            <button
              key={marker.id}
              className={className}
              style={markerStyle}
              type="button"
              aria-label={`进入${marker.name}流域`}
              onPointerEnter={() => onBasinHighlight(marker.id)}
              onPointerLeave={() => onBasinHighlight(null)}
              onFocus={() => onBasinHighlight(marker.id)}
              onBlur={() => onBasinHighlight(null)}
              onClick={() => onBasinActivate(marker.id)}
            >
              <span aria-hidden="true">{marker.name}</span>
            </button>
          );
        })}
      </nav>
      {activeBasin !== null && (
        <aside className={`basin-atlas__info basin-atlas__info--${activeBasin.id}`} aria-live="polite">
          <p>{activeBasin.englishName}</p>
          <h2>{activeBasin.name}</h2>
          <span className="basin-atlas__info-rule" aria-hidden="true" />
          <small>{activeBasin.description || '进入流域，探索山地、河网与三角洲之间的治理协同。'}</small>
        </aside>
      )}
    </main>
  );
}

export default BasinAtlas;
