import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { chapterOverviewItems } from '@/data/chapters';
import type { ChapterId } from '@/types/chapter';
import LanConversation from '@/components/lan/LanConversation';

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
  const openChapter = chapterOverviewItems.find((chapter) => chapter.id === openChapterId) ?? null;

  const handleOpen = (chapterId: ChapterId): void => {
    lastTriggerIdRef.current = chapterId;
    setOpenChapterId(chapterId);
  };

  const handleClose = (): void => {
    const triggerId = lastTriggerIdRef.current;
    setOpenChapterId(null);

    if (triggerId !== null) {
      window.requestAnimationFrame(() => markerRefs.current[triggerId]?.focus());
    }
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent): void => {
      if (event.key === 'Escape' && openChapterId !== null) {
        event.preventDefault();
        handleClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [openChapterId]);

  const handleAction = (): void => {
    if (openChapter?.route !== undefined) {
      navigate(openChapter.route, { state: { basinOverviewEntry: 'chapter-overview' } });
    }
  };

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
        markerRefs={markerRefs}
        onDismiss={() => {
          if (openChapterId !== null) {
            handleClose();
          }
        }}
        onOpenChapter={handleOpen}
      >
        {openChapter !== null && (
          <LanConversation
            anchor={openChapter.marker}
            actionLabel={openChapter.ctaLabel}
            conversationId={openChapter.id}
            dialogLabel={`小澜：${openChapter.title}`}
            messages={openChapter.dialogue}
            unavailableNotice={openChapter.unavailableNotice}
            onAction={handleAction}
            onClose={handleClose}
          />
        )}
      </StoryAtlas>
    </main>
  );
}

export default ChapterOverview;
