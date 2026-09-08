import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

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
  const [isLeaving, setIsLeaving] = useState(false);
  const navigationTimerRef = useRef<number | null>(null);

  useEffect(() => () => {
    if (navigationTimerRef.current !== null) {
      window.clearTimeout(navigationTimerRef.current);
    }
  }, []);

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
      <BasinAtlas selectedBasinId={selectedBasinId} onBasinActivate={handleBasinActivate} />
    </section>
  );
}

export default BasinOverview;
