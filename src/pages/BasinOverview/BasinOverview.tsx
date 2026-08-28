import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { basinOverviewItems } from '@/data/basinOverview';
import usePrefersReducedMotion from '@/hooks/usePrefersReducedMotion';
import type { BasinId, BasinInteractionState, BasinOverviewEntry, BasinOverviewPhase } from '@/types/basin';

import BasinInfoPanel from './components/BasinInfoPanel';
import BasinOverviewHeader from './components/BasinOverviewHeader';
import BasinSelectionList from './components/BasinSelectionList';
import ChinaBasinMap from './components/ChinaBasinMap';
import {
  basinOverviewEntryTimings,
  basinSelectionTransitionDelay,
  reducedMotionBasinOverviewTimings,
} from './constants';

import './BasinOverview.css';

function BasinOverview() {
  const navigate = useNavigate();
  const location = useLocation();
  const prefersReducedMotion = usePrefersReducedMotion();
  const entryState = location.state as { basinOverviewEntry?: BasinOverviewEntry } | null;
  const overviewEntry = entryState?.basinOverviewEntry ?? 'direct';
  const [overviewPhase, setOverviewPhase] = useState<BasinOverviewPhase>(
    overviewEntry === 'returning' ? 'interactive' : 'map-entering',
  );
  const [activeBasinId, setActiveBasinId] = useState<BasinId | null>(null);
  const [interactionState, setInteractionState] = useState<BasinInteractionState>('idle');
  const [selectedBasinId, setSelectedBasinId] = useState<BasinId | null>(null);
  const [isLeaving, setIsLeaving] = useState(false);
  const navigationTimerRef = useRef<number | null>(null);

  useEffect(() => {
    if (overviewEntry === 'returning') {
      setOverviewPhase('interactive');
      return undefined;
    }

    const timings = prefersReducedMotion
      ? reducedMotionBasinOverviewTimings
      : basinOverviewEntryTimings[overviewEntry];

    setOverviewPhase('map-entering');
    const phaseTimers = [
      window.setTimeout(() => setOverviewPhase('drop-landing'), timings.dropLanding),
      window.setTimeout(() => setOverviewPhase('source-rippling'), timings.sourceRippling),
      window.setTimeout(() => setOverviewPhase('rivers-awakening'), timings.riversAwakening),
      window.setTimeout(() => setOverviewPhase('interactive'), timings.interactive),
    ];

    return () => phaseTimers.forEach((timer) => window.clearTimeout(timer));
  }, [overviewEntry, prefersReducedMotion]);

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
    setInteractionState('selected');
    setIsLeaving(true);
    navigationTimerRef.current = window.setTimeout(
      () => navigate(selectedBasin.route),
      prefersReducedMotion ? 0 : basinSelectionTransitionDelay,
    );
  };

  const handleBasinInteractionChange = (
    basinId: BasinId | null,
    nextInteractionState: BasinInteractionState,
  ): void => {
    if (isLeaving || selectedBasinId !== null) {
      return;
    }

    setActiveBasinId(basinId);
    setInteractionState(nextInteractionState);
  };

  const activeBasin = basinOverviewItems.find((basin) => basin.id === activeBasinId) ?? null;

  return (
    <section className={`basin-overview-page basin-overview-page--${overviewEntry}${isLeaving ? ' basin-overview-page--leaving' : ''}`}>
      <BasinOverviewHeader shouldFocus={overviewEntry === 'returning'} />
      <div className="basin-overview-page__experience">
        <ChinaBasinMap
          basins={basinOverviewItems}
          phase={overviewPhase}
          activeBasinId={activeBasinId}
          interactionState={interactionState}
          selectedBasinId={selectedBasinId}
          onBasinActivate={handleBasinActivate}
          onBasinInteractionChange={handleBasinInteractionChange}
        />
        <div
          className="basin-overview-page__sidebar"
          onMouseLeave={() => handleBasinInteractionChange(null, 'idle')}
        >
          <BasinInfoPanel activeBasin={activeBasin} />
          <BasinSelectionList
            basins={basinOverviewItems}
            activeBasinId={activeBasinId}
            onBasinActivate={handleBasinActivate}
            onBasinInteractionChange={handleBasinInteractionChange}
          />
        </div>
      </div>
    </section>
  );
}

export default BasinOverview;
