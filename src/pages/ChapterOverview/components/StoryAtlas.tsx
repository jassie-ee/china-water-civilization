import type { CSSProperties, ReactNode, RefObject } from 'react';

import shanhaiWaterChronicle from '@/assets/images/shanhai-water-chronicle.png';
import type { ChapterId, ChapterOverviewItem } from '@/types/chapter';

interface StoryAtlasProps {
  chapters: ChapterOverviewItem[];
  activeChapterId: ChapterId | null;
  children?: ReactNode;
  markerRefs: RefObject<Record<ChapterId, HTMLButtonElement | null>>;
  onDismiss: () => void;
  onOpenChapter: (chapterId: ChapterId) => void;
}

function StoryAtlas({ chapters, activeChapterId, children, markerRefs, onDismiss, onOpenChapter }: StoryAtlasProps) {
  const activeChapter = chapters.find((chapter) => chapter.id === activeChapterId) ?? null;
  const atlasStyle = activeChapter === null
    ? undefined
    : {
      '--atlas-focus-x': `${activeChapter.marker.x}%`,
      '--atlas-focus-y': `${activeChapter.marker.y}%`,
    } as CSSProperties;

  return (
    <section
      className={`story-atlas${activeChapterId !== null ? ' story-atlas--has-selection' : ''}`}
      style={atlasStyle}
      aria-label="水脉记忆山海图册"
      onPointerDown={onDismiss}
    >
      <div className="story-atlas__art" aria-hidden="true">
        <img src={shanhaiWaterChronicle} alt="" />
      </div>
      <p className="story-atlas__caption" aria-hidden="true">山川 · 江河 · 海洋 · 家园</p>
      <ol className="story-atlas__markers" aria-label="四章入口">
        {chapters.map((chapter) => {
          const markerStyle = {
            left: `${chapter.marker.x}%`,
            top: `${chapter.marker.y}%`,
            '--marker-mobile-x': `${chapter.marker.mobileX}%`,
            '--marker-mobile-y': `${chapter.marker.mobileY}%`,
          } as CSSProperties;

          return (
            <li
              className={`story-atlas__marker story-atlas__marker--${chapter.id}${activeChapterId === chapter.id ? ' is-active' : ''}`}
              key={chapter.id}
              style={markerStyle}
            >
              <button
                ref={(element) => { markerRefs.current[chapter.id] = element; }}
                type="button"
                aria-label={`第 ${chapter.order} 章：${chapter.title}`}
                aria-expanded={activeChapterId === chapter.id}
                aria-controls={activeChapterId === chapter.id ? 'lan-dialogue' : undefined}
                onPointerDown={(event) => event.stopPropagation()}
                onClick={() => onOpenChapter(chapter.id)}
              >
                <span className="story-atlas__seal" aria-hidden="true">{chapter.markerGlyph}</span>
              </button>
            </li>
          );
        })}
      </ol>
      {children}
    </section>
  );
}

export default StoryAtlas;
