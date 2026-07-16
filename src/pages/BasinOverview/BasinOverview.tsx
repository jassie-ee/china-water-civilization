import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { basinOverviewItems } from '@/data/basinOverview';
import usePrefersReducedMotion from '@/hooks/usePrefersReducedMotion';
import type { BasinId, BasinOverviewPhase } from '@/types/basin';

import BasinInfoPanel from './components/BasinInfoPanel';
import BasinOverviewHeader from './components/BasinOverviewHeader';
import BasinSelectionList from './components/BasinSelectionList';
import ChinaBasinMap from './components/ChinaBasinMap';
import { basinOverviewTimings, reducedMotionBasinOverviewTimings } from './constants';

import './BasinOverview.css';

function BasinOverview() {
  const navigate = useNavigate();
  const prefersReducedMotion = usePrefersReducedMotion();
  const [overviewPhase, setOverviewPhase] = useState<BasinOverviewPhase>('map-entering');
  const [activeBasinId, setActiveBasinId] = useState<BasinId | null>(null);
  const [selectedBasinId, setSelectedBasinId] = useState<BasinId | null>(null);
  const [isLeaving, setIsLeaving] = useState(false);
  const navigationTimerRef = useRef<number | null>(null);

  useEffect(() => {
    const timings = prefersReducedMotion ? reducedMotionBasinOverviewTimings : basinOverviewTimings;

    setOverviewPhase('map-entering');
    const phaseTimers = [
      window.setTimeout(() => setOverviewPhase('drop-landing'), timings.dropLanding),
      window.setTimeout(() => setOverviewPhase('source-rippling'), timings.sourceRippling),
      window.setTimeout(() => setOverviewPhase('rivers-awakening'), timings.riversAwakening),
      window.setTimeout(() => setOverviewPhase('interactive'), timings.interactive),
    ];

    return () => phaseTimers.forEach((timer) => window.clearTimeout(timer));
  }, [prefersReducedMotion]);

  useEffect(() => () => {
    if (navigationTimerRef.current !== null) {
      window.clearTimeout(navigationTimerRef.current);
    }
  }, []);

  const handleBasinActivate = (basinId: BasinId): void => {
    if (overviewPhase !== 'interactive' || isLeaving) {
      return;
    }

    const selectedBasin = basinOverviewItems.find((basin) => basin.id === basinId);
    if (selectedBasin === undefined || !selectedBasin.isAvailable) {
      return;
    }

    setSelectedBasinId(basinId);
    setActiveBasinId(basinId);
    setIsLeaving(true);
    navigationTimerRef.current = window.setTimeout(
      () => navigate(selectedBasin.route),
      prefersReducedMotion
        ? reducedMotionBasinOverviewTimings.selectionTransition
        : basinOverviewTimings.selectionTransition,
    );
  };

  const activeBasin = basinOverviewItems.find((basin) => basin.id === activeBasinId) ?? null;

  return (
    <section className={`basin-overview-page${isLeaving ? ' basin-overview-page--leaving' : ''}`}>
      <BasinOverviewHeader />
      <div className="basin-overview-page__experience">
        <ChinaBasinMap
          basins={basinOverviewItems}
          phase={overviewPhase}
          activeBasinId={activeBasinId}
          selectedBasinId={selectedBasinId}
          onBasinActivate={handleBasinActivate}
          onActiveBasinChange={setActiveBasinId}
        />
        <div className="basin-overview-page__sidebar">
          <BasinInfoPanel activeBasin={activeBasin} />
          <BasinSelectionList
            basins={basinOverviewItems}
            activeBasinId={activeBasinId}
            onBasinActivate={handleBasinActivate}
            onActiveBasinChange={setActiveBasinId}
          />
        </div>
      </div>
    </section>
  );
}

export default BasinOverview;
