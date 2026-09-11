import { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { useChapterSpirit } from '@/components/chapter-spirit';
import { basinOverviewItems } from '@/data/basinOverview';
import usePrefersReducedMotion from '@/hooks/usePrefersReducedMotion';
import type { BasinId, BasinOverviewEntry } from '@/types/basin';

import BasinAtlas from './components/BasinAtlas';
import BasinOverviewHeader from './components/BasinOverviewHeader';
import HydropowerKnowledgeAtlas from './components/HydropowerKnowledgeAtlas';
import Folder from '@/components/Folder/Folder';

import './BasinOverview.css';

function BasinOverview() {
  const navigate = useNavigate();
  const location = useLocation();
  const prefersReducedMotion = usePrefersReducedMotion();
  const entryState = location.state as { basinOverviewEntry?: BasinOverviewEntry } | null;
  const overviewEntry = entryState?.basinOverviewEntry ?? 'direct';
  const [selectedBasinId, setSelectedBasinId] = useState<BasinId | null>(null);
  const [highlightedBasinId, setHighlightedBasinId] = useState<BasinId | null>(null);
  const [isLeaving, setIsLeaving] = useState(false);
  const [isKnowledgeOpen, setIsKnowledgeOpen] = useState(false);
  const navigationTimerRef = useRef<number | null>(null);
  const hasOpenedWelcomeDialogueRef = useRef(false);
  const mascotConfig = useMemo(() => ({
    pageId: 'basin-overview',
    routePath: '/basins',
    dialogueId: 'lan-dialogue-basin-overview',
    action: 'happy' as const,
    initialPosition: { x: 15, y: 80 },
    spriteAlt: '水精灵，点击打开或关闭流域导览，也可以拖动',
    dialogue: {
      conversationId: 'basin-overview-welcome',
      dialogLabel: '小澜的流域导览',
      messages: ['前面就是黄河、长江和珠江啦！每一条河都藏着不同的互动记忆，快选一条，陪我去看看吧。'],
      actionLabel: '开始探索',
      onAction: () => undefined,
      closeOnAction: true,
    },
  }), []);
  const { openDialogue } = useChapterSpirit(mascotConfig);

  useEffect(() => () => {
    if (navigationTimerRef.current !== null) {
      window.clearTimeout(navigationTimerRef.current);
    }
  }, []);

  useEffect(() => {
    if (hasOpenedWelcomeDialogueRef.current) return;
    hasOpenedWelcomeDialogueRef.current = true;
    openDialogue();
  }, [openDialogue]);

  const handleBasinActivate = (basinId: BasinId): void => {
    if (isLeaving) {
      return;
    }

    const selectedBasin = basinOverviewItems.find((basin) => basin.id === basinId);
    if (selectedBasin === undefined || !selectedBasin.isAvailable) {
      return;
    }

    setSelectedBasinId(basinId);
    setIsLeaving(true);
    navigationTimerRef.current = window.setTimeout(
      () => navigate(selectedBasin.route),
      prefersReducedMotion ? 0 : 180,
    );
  };

  return (
    <section className={`basin-overview-page basin-overview-page--${overviewEntry}${isLeaving ? ' basin-overview-page--leaving' : ''}`}>
      <BasinOverviewHeader shouldFocus={overviewEntry === 'returning'} />
      <BasinAtlas
        selectedBasinId={selectedBasinId}
        highlightedBasinId={highlightedBasinId}
        onBasinActivate={handleBasinActivate}
        onBasinHighlight={setHighlightedBasinId}
      />
      <div className="basin-overview__knowledge-trigger">
        <Folder
          color="#2c98a0"
          size={.58}
          onActivate={() => setIsKnowledgeOpen(true)}
          items={[
            <span key="water">水势<br />与电能</span>,
            <span key="station">电站<br />分类</span>,
            <span key="storage">抽水<br />蓄能</span>,
          ]}
        />
        <span aria-hidden="true">水电与储能知识册</span>
      </div>
      <HydropowerKnowledgeAtlas isOpen={isKnowledgeOpen} onClose={() => setIsKnowledgeOpen(false)} />
    </section>
  );
}

export default BasinOverview;
