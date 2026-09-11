import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { chapterOverviewItems } from '@/data/chapters';
import type { ChapterId } from '@/types/chapter';
import { useChapterSpirit } from '@/components/chapter-spirit';

import StoryAtlas from './components/StoryAtlas';
import './ChapterOverview.css';

interface ChapterAtlasIndexProps {
  activeChapterId: ChapterId | null;
  hoveredChapterId: ChapterId | null;
  onHighlightChapter: (chapterId: ChapterId | null) => void;
  onOpenChapter: (chapterId: ChapterId, trigger: HTMLButtonElement) => void;
}

function ChapterAtlasIndex({ activeChapterId, hoveredChapterId, onHighlightChapter, onOpenChapter }: ChapterAtlasIndexProps) {
  return (
    <aside className="chapter-atlas-index" aria-label="水脉记忆章节索引" onPointerDown={(event) => event.stopPropagation()}>
      <div className="chapter-atlas-index__heading">
        <p>水脉图册</p>
        <span aria-hidden="true" />
      </div>
      <ol className="chapter-atlas-index__list">
        {chapterOverviewItems.map((chapter) => {
          const isActive = activeChapterId === chapter.id;
          const isHighlighted = hoveredChapterId === chapter.id;
          return (
            <li key={chapter.id}>
              <button
                className={`chapter-atlas-index__item${isActive ? ' is-active' : ''}${isHighlighted ? ' is-highlighted' : ''}`}
                type="button"
                aria-pressed={isActive}
                onPointerEnter={() => onHighlightChapter(chapter.id)}
                onPointerLeave={() => onHighlightChapter(null)}
                onFocus={() => onHighlightChapter(chapter.id)}
                onBlur={() => onHighlightChapter(null)}
                onClick={(event) => onOpenChapter(chapter.id, event.currentTarget)}
              >
                <span className="chapter-atlas-index__order" aria-hidden="true">0{chapter.order}</span>
                <span className="chapter-atlas-index__glyph" aria-hidden="true">{chapter.markerGlyph}</span>
                <span className="chapter-atlas-index__copy">
                  <strong>{chapter.title}</strong>
                  <small>{chapter.theme}</small>
                </span>
                {chapter.status === 'preview' && <span className="chapter-atlas-index__status">筹备中</span>}
              </button>
            </li>
          );
        })}
      </ol>
    </aside>
  );
}

interface ChapterSelectionProps {
  chapterId: ChapterId;
}

function ChapterSelection({ chapterId }: ChapterSelectionProps) {
  const chapter = chapterOverviewItems.find((item) => item.id === chapterId);
  if (chapter === undefined) return null;

  return (
    <section className="chapter-atlas-selection" aria-live="polite" onPointerDown={(event) => event.stopPropagation()}>
      <p className="chapter-atlas-selection__eyebrow">第 {chapter.order} 章</p>
      <h2>{chapter.title}</h2>
      <p className="chapter-atlas-selection__theme">{chapter.theme}</p>
      <div className="chapter-atlas-selection__rule" aria-hidden="true" />
      <p className="chapter-atlas-selection__status">
        {chapter.overviewGuide}
      </p>
    </section>
  );
}

function ChapterOverview() {
  const navigate = useNavigate();
  const [openChapterId, setOpenChapterId] = useState<ChapterId | null>(null);
  const [hoveredChapterId, setHoveredChapterId] = useState<ChapterId | null>(null);
  const markerRefs = useRef<Record<ChapterId, HTMLButtonElement | null>>({
    'chapter-1': null,
    'chapter-2': null,
    'chapter-3': null,
    'chapter-4': null,
  });
  const lastTriggerRef = useRef<HTMLButtonElement | null>(null);
  const closeMascotDialogueRef = useRef<() => void>(() => undefined);
  const openChapter = chapterOverviewItems.find((chapter) => chapter.id === openChapterId) ?? null;
  const visibleChapterId = hoveredChapterId ?? openChapterId;
  const dialogueId = 'lan-dialogue-chapter-overview';

  const handleOpen = useCallback((chapterId: ChapterId, trigger: HTMLButtonElement): void => {
    lastTriggerRef.current = trigger;
    setOpenChapterId(chapterId);
  }, []);

  const handleClose = useCallback((): void => {
    const trigger = lastTriggerRef.current;
    lastTriggerRef.current = null;
    closeMascotDialogueRef.current();
    setOpenChapterId(null);

    if (trigger !== null) {
      window.requestAnimationFrame(() => trigger.focus());
    }
  }, []);

  const handleAction = useCallback((): void => {
    if (openChapter === null || openChapter.status !== 'available') return;

    if (openChapter.id === 'chapter-1') {
      navigate('/chapters/chapter-1/intro');
      return;
    }

    if (openChapter.id === 'chapter-2') {
      navigate('/chapters/chapter-2/intro');
      return;
    }

    if (openChapter.id === 'chapter-3' || openChapter.id === 'chapter-4') {
      navigate(openChapter.route ?? '/chapters');
    }
  }, [navigate, openChapter]);

  const mascotDialogue = useMemo(() => {
    if (openChapter !== null) {
      return {
        conversationId: openChapter.id,
        dialogLabel: `小澜：${openChapter.title}`,
        messages: openChapter.dialogue,
        actionLabel: openChapter.ctaLabel,
        unavailableNotice: openChapter.unavailableNotice,
        onAction: handleAction,
      };
    }

    return {
      conversationId: 'chapter-overview-default',
      dialogLabel: '水精灵导览',
      messages: ['你好，我是水精灵。', '点击地图上的章节印记，我会带你继续探索水脉文明。'],
      actionLabel: '选择章节',
      unavailableNotice: '请先选择一个章节印记。',
      onAction: () => closeMascotDialogueRef.current(),
    };
  }, [handleAction, openChapter]);

  const mascotConfig = useMemo(() => ({
    pageId: 'chapter-overview',
    routePath: '/chapters',
    dialogue: mascotDialogue,
    dialogueId,
    action: openChapterId === null ? 'happy' as const : 'point-water' as const,
    spriteAlt: '水精灵，点击打开或关闭导览对话，也可以拖动',
    onDialogueClose: () => {
      if (openChapterId !== null) handleClose();
    },
  }), [dialogueId, handleClose, mascotDialogue, openChapterId]);

  const { closeDialogue, openDialogue } = useChapterSpirit(mascotConfig);
  closeMascotDialogueRef.current = closeDialogue;

  useEffect(() => {
    if (openChapterId !== null) {
      openDialogue();
    }
  }, [openChapterId, openDialogue]);

  return (
    <main className="chapter-overview">
      <header className="chapter-overview__nav" aria-label="页面导航">
        <Link className="chapter-overview__home-link" to="/">返回首页</Link>
        <span aria-hidden="true">/</span>
        <p>水脉记忆</p>
      </header>
      <div className="chapter-overview__atlas-title" aria-hidden="true">
        <p>WATER MEMORY / CHAPTER ATLAS</p>
        <strong>一张山海图，四段水脉</strong>
      </div>
      <h1 className="sr-only">水脉记忆章节总览</h1>
      <StoryAtlas
        chapters={chapterOverviewItems}
        activeChapterId={openChapterId}
        highlightedChapterId={hoveredChapterId}
        dialogueId={dialogueId}
        markerRefs={markerRefs}
        onHighlightChapter={setHoveredChapterId}
        onDismiss={() => {
          if (openChapterId !== null) {
            handleClose();
          }
        }}
        onOpenChapter={handleOpen}
      >
        <ChapterAtlasIndex
          activeChapterId={openChapterId}
          hoveredChapterId={hoveredChapterId}
          onHighlightChapter={setHoveredChapterId}
          onOpenChapter={handleOpen}
        />
        {visibleChapterId !== null && <ChapterSelection chapterId={visibleChapterId} />}
      </StoryAtlas>
    </main>
  );
}

export default ChapterOverview;
