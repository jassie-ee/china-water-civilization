import type { CSSProperties } from 'react';

import './chapter-scene-annotations.css';

export interface ChapterSceneAnnotation {
  align?: 'left' | 'right';
  detail: string;
  id: string;
  kicker: string;
  title: string;
  x: number;
  y: number;
}

interface ChapterSceneAnnotationsProps {
  activeId?: string;
  annotations: readonly ChapterSceneAnnotation[];
  onSelect?: (id: string) => void;
}

function ChapterSceneAnnotations({ activeId, annotations, onSelect }: ChapterSceneAnnotationsProps) {
  return (
    <ol className="chapter-scene-annotations" aria-label="场景内容说明">
      {annotations.map((annotation) => {
        const isActive = activeId === annotation.id;
        const annotationStyle = {
          '--annotation-x': `${annotation.x}%`,
          '--annotation-y': `${annotation.y}%`,
        } as CSSProperties;

        return (
          <li
            className={`chapter-scene-annotations__item${isActive ? ' is-active' : ''}`}
            data-align={annotation.align ?? 'left'}
            data-annotation-id={annotation.id}
            key={annotation.id}
            style={annotationStyle}
          >
            <button
              type="button"
              aria-pressed={isActive}
              aria-label={`${annotation.title}：${annotation.detail}`}
              onClick={() => onSelect?.(annotation.id)}
            >
              <span className="chapter-scene-annotations__pin" aria-hidden="true" />
              <span className="chapter-scene-annotations__copy">
                <small>{annotation.kicker}</small>
                <strong>{annotation.title}</strong>
                <em>{annotation.detail}</em>
              </span>
            </button>
          </li>
        );
      })}
    </ol>
  );
}

export default ChapterSceneAnnotations;
