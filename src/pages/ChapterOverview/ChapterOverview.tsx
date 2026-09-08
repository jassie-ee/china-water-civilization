import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { chapterOverviewItems } from '@/data/chapters';
import type { ChapterId } from '@/types/chapter';
import { useLanMascot } from '@/components/lan-mascot';

import StoryAtlas from './components/StoryAtlas';
import './ChapterOverview.css';

function ChapterOverview() {
  const navigate = useNavigate();
  const [openChapterId, setOpenChapterId] = useState<ChapterId | null>(null);
  const markerRefs = useRef<Record<ChapterId, HTMLButtonElement | null>>({
    'chapter-1': null,
    'chapter-2': null,
    'chapter-3': null,
    'chapter-4': null,
  });
  const lastTriggerIdRef = useRef<ChapterId | null>(null);
  const closeMascotDialogueRef = useRef<() => void>(() => undefined);
  const openChapter = chapterOverviewItems.find((chapter) => chapter.id === openChapterId) ?? null;
  const dialogueId = 'lan-dialogue-chapter-overview';

  const handleOpen = useCallback((chapterId: ChapterId): void => {
    if (chapterId === 'chapter-1') {
      navigate('/chapters/chapter-1/intro');
      return;
    }

    lastTriggerIdRef.current = chapterId;
    setOpenChapterId(chapterId);
  }, [navigate]);

  const handleClose = useCallback((): void => {
    const triggerId = lastTriggerIdRef.current;
    closeMascotDialogueRef.current();
    setOpenChapterId(null);

    if (triggerId !== null) {
      window.requestAnimationFrame(() => markerRefs.current[triggerId]?.focus());
    }
  }, []);

  const handleAction = useCallback((): void => {
    if (openChapter?.route !== undefined) {
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
    <main className="chapter-overview">
      <header className="chapter-overview__nav" aria-label="页面导航">
        <Link className="chapter-overview__home-link" to="/">返回首页</Link>
        <span aria-hidden="true">/</span>
        <p>水脉记忆</p>
      </header>
      <h1 className="sr-only">水脉记忆章节总览</h1>
      <StoryAtlas
        chapters={chapterOverviewItems}
        activeChapterId={openChapterId}
        dialogueId={dialogueId}
        markerRefs={markerRefs}
        onDismiss={() => {
          if (openChapterId !== null) {
            handleClose();
          }
        }}
        onOpenChapter={handleOpen}
      />
    </main>
  );
}

export default ChapterOverview;
