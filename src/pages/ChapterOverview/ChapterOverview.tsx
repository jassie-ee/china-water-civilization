import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';

import { chapterOverviewItems } from '@/data/chapters';
import chapterSpiritAnimation from '@/assets/images/lan/animated/sleeve-pingpong.webp';
import type { ChapterId } from '@/types/chapter';
import { useLanMascot } from '@/components/lan-mascot';

import StoryAtlas from './components/StoryAtlas';
import './ChapterOverview.css';

gsap.registerPlugin(useGSAP);

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
      <p className="chapter-atlas-index__hint">选择一枚印记，打开章节导览</p>
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
  onOpenDialogue: () => void;
}

function ChapterSelection({ chapterId, onOpenDialogue }: ChapterSelectionProps) {
  const chapter = chapterOverviewItems.find((item) => item.id === chapterId);
  if (chapter === undefined) return null;

  return (
    <section className="chapter-atlas-selection" aria-live="polite" onPointerDown={(event) => event.stopPropagation()}>
      <p className="chapter-atlas-selection__eyebrow">第 {chapter.order} 章</p>
      <h2>{chapter.title}</h2>
      <p className="chapter-atlas-selection__theme">{chapter.theme}</p>
      <div className="chapter-atlas-selection__rule" aria-hidden="true" />
      <p className="chapter-atlas-selection__status">
        {chapter.status === 'available' ? '小澜正在这里等你' : '这段水脉仍在修复中'}
      </p>
      <button className="chapter-atlas-selection__action" type="button" onClick={onOpenDialogue}>
        {chapter.status === 'available' ? '打开导览' : '查看筹备提示'}
        <span aria-hidden="true">→</span>
      </button>
    </section>
  );
}

function ChapterOverview() {
  const navigate = useNavigate();
  const pageRef = useRef<HTMLElement | null>(null);
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
  const dialogueId = 'lan-dialogue-chapter-overview';

  useGSAP(() => {
    const media = gsap.matchMedia();
    media.add('(min-width: 721px) and (prefers-reduced-motion: no-preference)', () => {
      const page = pageRef.current;
      if (page === null) return;

      const intro = gsap.timeline({ defaults: { ease: 'power3.out' } });
      const markers = Array.from(page.querySelectorAll<HTMLElement>('.story-atlas__marker'));
      const markerLabels = Array.from(page.querySelectorAll<HTMLElement>('.story-atlas__marker-label'));
      const seals = Array.from(page.querySelectorAll<HTMLElement>('.story-atlas__seal'));

      intro
        .from('.chapter-overview__nav', { autoAlpha: 0, x: -14, duration: .55 }, 0)
        .from('.chapter-atlas-index', { autoAlpha: 0, x: -18, duration: .7 }, .1)
        .from('.story-atlas__masthead', { autoAlpha: 0, y: -12, duration: .72 }, .16)
        // Keep map pins visible throughout the intro so the atlas remains discoverable
        // while the surrounding copy fades in.
        .from(markers, { scale: .86, y: 8, duration: .62, stagger: { each: .1, from: 'edges' } }, .28)
        .from(markerLabels, { x: 8, duration: .42, stagger: .08 }, .44)
        .from('.story-atlas__caption', { autoAlpha: 0, y: 10, duration: .42 }, .7);

      gsap.to(seals, {
        y: -2,
        duration: 2.8,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
        stagger: { each: .18, from: 'random' },
      });
    });

    return () => media.revert();
  }, { scope: pageRef });

  useGSAP(() => {
    const media = gsap.matchMedia();
    media.add('(min-width: 721px) and (prefers-reduced-motion: no-preference)', () => {
      const page = pageRef.current;
      const selection = page?.querySelector<HTMLElement>('.chapter-atlas-selection');
      const activeSeal = page?.querySelector<HTMLElement>('.story-atlas__marker.is-active .story-atlas__seal');
      const activeToken = page?.querySelector<HTMLElement>('.story-atlas__marker.is-active .story-atlas__token');
      if (selection === null || selection === undefined) return;

      const selectionTimeline = gsap.timeline({ defaults: { ease: 'power3.out' } });
      selectionTimeline.from(selection, { autoAlpha: 0, x: 16, y: 8, duration: .56 });

      if (activeToken !== null && activeToken !== undefined) {
        selectionTimeline.fromTo(
          activeToken,
          { autoAlpha: 0, scale: .76, rotate: -5, y: 6 },
          { autoAlpha: .94, scale: 1, rotate: 0, y: 0, duration: .48, ease: 'back.out(1.35)' },
          '-=.34',
        );
      }

      if (activeSeal !== null && activeSeal !== undefined) {
        selectionTimeline
          .fromTo(activeSeal, { scale: .82 }, { scale: 1.1, duration: .36, ease: 'back.out(1.7)' }, '-=.36')
          .to(activeSeal, { scale: 1, duration: .26, ease: 'power2.out' });
      }
    });

    return () => media.revert();
  }, { scope: pageRef, dependencies: [openChapterId], revertOnUpdate: true });

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

    if (openChapter.route !== undefined) {
      navigate(openChapter.route, { state: { basinOverviewEntry: 'chapter-overview' } });
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
      onAction: () => undefined,
    };
  }, [handleAction, openChapter]);

  const mascotConfig = useMemo(() => ({
    pageId: 'chapter-overview',
    routePath: '/chapters',
    dialogue: mascotDialogue,
    dialogueId,
    expressionId: 'happy' as const,
    spriteAlt: '水精灵，点击打开或关闭导览对话，也可以拖动',
    spriteSrc: chapterSpiritAnimation,
    dialoguePresentation: 'subtitle' as const,
    onDialogueClose: () => {
      if (openChapterId !== null) handleClose();
    },
  }), [dialogueId, handleClose, mascotDialogue, openChapterId]);

  const { closeDialogue, openDialogue } = useLanMascot(mascotConfig);
  closeMascotDialogueRef.current = closeDialogue;

  useEffect(() => {
    if (openChapterId !== null) {
      openDialogue();
    }
  }, [openChapterId, openDialogue]);

  return (
    <main ref={pageRef} className="chapter-overview">
      <header className="chapter-overview__nav" aria-label="页面导航">
        <Link className="chapter-overview__home-link" to="/">返回首页</Link>
        <span aria-hidden="true">/</span>
        <p>水脉记忆</p>
      </header>
      <h1 className="sr-only">水脉记忆章节总览</h1>
      <StoryAtlas
        chapters={chapterOverviewItems}
        activeChapterId={openChapterId}
        highlightedChapterId={hoveredChapterId}
        dialogueId={dialogueId}
        markerRefs={markerRefs}
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
        {openChapterId !== null && <ChapterSelection chapterId={openChapterId} onOpenDialogue={openDialogue} />}
      </StoryAtlas>
    </main>
  );
}

export default ChapterOverview;
