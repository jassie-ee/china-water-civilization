import { useState, type CSSProperties, type ReactNode, type RefObject } from 'react';

import chapterAtlasBackground from '@/assets/images/chapter-overview/chapter-atlas-background.webp';
import shanhaiWaterChronicleFallback from '@/assets/images/shanhai-water-chronicle.webp';
import chapter1Token from '@/assets/images/chapter-overview/chapter-1-source.png';
import chapter2Token from '@/assets/images/chapter-overview/chapter-2-governance.png';
import chapter3Token from '@/assets/images/chapter-overview/chapter-3-voyage.png';
import chapter4Token from '@/assets/images/chapter-overview/chapter-4-cosmos.png';
import type { ChapterId, ChapterOverviewItem } from '@/types/chapter';

import StoryAtlasEffects from './StoryAtlasEffects';

const chapterTokens: Record<ChapterId, string> = {
  'chapter-1': chapter1Token,
  'chapter-2': chapter2Token,
  'chapter-3': chapter3Token,
  'chapter-4': chapter4Token,
};

interface StoryAtlasProps {
  chapters: ChapterOverviewItem[];
  activeChapterId: ChapterId | null;
  highlightedChapterId?: ChapterId | null;
  children?: ReactNode;
  dialogueId?: string;
  markerRefs: RefObject<Record<ChapterId, HTMLButtonElement | null>>;
  onDismiss: () => void;
  onHighlightChapter: (chapterId: ChapterId | null) => void;
  onOpenChapter: (chapterId: ChapterId, trigger: HTMLButtonElement) => void;
}

function StoryAtlas({ chapters, activeChapterId, highlightedChapterId = null, children, dialogueId = 'lan-dialogue', markerRefs, onDismiss, onHighlightChapter, onOpenChapter }: StoryAtlasProps) {
  const [atlasImageSource, setAtlasImageSource] = useState(chapterAtlasBackground);
  // Hover always wins visually: the atlas follows the item currently being explored,
  // while a click remains responsible only for opening its dialogue.
  const focusedChapterId = highlightedChapterId ?? activeChapterId;
  const focusedChapter = chapters.find((chapter) => chapter.id === focusedChapterId) ?? null;
  const atlasStyle = focusedChapter === null
    ? {
      '--atlas-art-x': '0px',
      '--atlas-art-y': '0px',
      '--atlas-effects-x': '0px',
      '--atlas-effects-y': '0px',
    } as CSSProperties
    : {
      '--atlas-focus-x': `${focusedChapter.marker.x}%`,
      '--atlas-focus-y': `${focusedChapter.marker.y}%`,
      '--atlas-art-x': '0px',
      '--atlas-art-y': '0px',
      '--atlas-effects-x': '0px',
      '--atlas-effects-y': '0px',
    } as CSSProperties;

  const handlePointerMove = (event: React.PointerEvent<HTMLElement>): void => {
    if (event.pointerType !== 'mouse') return;

    const bounds = event.currentTarget.getBoundingClientRect();
    const horizontalOffset = ((event.clientX - bounds.left) / bounds.width - .5) * 12;
    const verticalOffset = ((event.clientY - bounds.top) / bounds.height - .5) * 12;
    event.currentTarget.style.setProperty('--atlas-art-x', `${horizontalOffset * .36}px`);
    event.currentTarget.style.setProperty('--atlas-art-y', `${verticalOffset * .36}px`);
    event.currentTarget.style.setProperty('--atlas-effects-x', `${horizontalOffset}px`);
    event.currentTarget.style.setProperty('--atlas-effects-y', `${verticalOffset}px`);
  };

  const handlePointerLeave = (event: React.PointerEvent<HTMLElement>): void => {
    event.currentTarget.style.setProperty('--atlas-art-x', '0px');
    event.currentTarget.style.setProperty('--atlas-art-y', '0px');
    event.currentTarget.style.setProperty('--atlas-effects-x', '0px');
    event.currentTarget.style.setProperty('--atlas-effects-y', '0px');
  };

  return (
    <section
      className={`story-atlas${activeChapterId !== null ? ' story-atlas--has-selection' : ''}${focusedChapterId !== null ? ' story-atlas--has-focus' : ''}`}
      style={atlasStyle}
      aria-label="水脉记忆山海图册"
      onPointerDown={onDismiss}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      <div className="story-atlas__art" aria-hidden="true">
        <img
          src={atlasImageSource}
          alt=""
          onError={() => {
            if (atlasImageSource !== shanhaiWaterChronicleFallback) {
              setAtlasImageSource(shanhaiWaterChronicleFallback);
            }
          }}
        />
      </div>
      <StoryAtlasEffects chapters={chapters} activeChapterId={focusedChapterId} />
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
              className={`story-atlas__marker story-atlas__marker--${chapter.id}${activeChapterId === chapter.id ? ' is-active' : ''}${highlightedChapterId === chapter.id ? ' is-highlighted' : ''}`}
              key={chapter.id}
              style={markerStyle}
            >
              <button
                ref={(element) => { markerRefs.current[chapter.id] = element; }}
                type="button"
                aria-label={`第 ${chapter.order} 章：${chapter.title}`}
                aria-expanded={activeChapterId === chapter.id}
                aria-controls={activeChapterId === chapter.id ? dialogueId : undefined}
                onPointerDown={(event) => event.stopPropagation()}
                onPointerEnter={() => onHighlightChapter(chapter.id)}
                onPointerLeave={() => onHighlightChapter(null)}
                onFocus={() => onHighlightChapter(chapter.id)}
                onBlur={() => onHighlightChapter(null)}
                onClick={(event) => onOpenChapter(chapter.id, event.currentTarget)}
              >
                <span className="story-atlas__token" aria-hidden="true"><img src={chapterTokens[chapter.id]} alt="" /></span>
                <span className="story-atlas__seal" aria-hidden="true">{chapter.markerGlyph}</span>
                <span className="story-atlas__marker-label" aria-hidden="true">
                  <small>CHAPTER 0{chapter.order}</small>
                  <strong>{chapter.title}</strong>
                  <em>{chapter.theme}</em>
                </span>
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
