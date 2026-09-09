import { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { useLanMascot } from '@/components/lan-mascot';
import { basinOverviewItems } from '@/data/basinOverview';
import usePrefersReducedMotion from '@/hooks/usePrefersReducedMotion';
import type { BasinId, BasinOverviewEntry } from '@/types/basin';

import BasinAtlas from './components/BasinAtlas';
import BasinOverviewHeader from './components/BasinOverviewHeader';

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
  const navigationTimerRef = useRef<number | null>(null);
  const mascotConfig = useMemo(() => ({
    pageId: 'basin-overview',
    routePath: '/basins',
    dialogueId: 'lan-dialogue-basin-overview',
    expressionId: 'happy' as const,
    initialPosition: { x: 15, y: 80 },
    spriteAlt: '水精灵，点击打开或关闭流域导览，也可以拖动',
    dialogue: {
      conversationId: 'basin-overview-welcome',
      dialogLabel: '小澜的流域导览',
      messages: ['前面就是黄河、长江和珠江啦！每一条河都藏着不同的互动记忆，快选一条，陪我去看看吧。'],
      actionLabel: '开始探索',
      onAction: () => undefined,
    },
  }), []);
  const { openDialogue } = useLanMascot(mascotConfig);

  useEffect(() => () => {
    if (navigationTimerRef.current !== null) {
      window.clearTimeout(navigationTimerRef.current);
    }
  }, []);

  useEffect(() => {
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
    </section>
  );
}

export default BasinOverview;
