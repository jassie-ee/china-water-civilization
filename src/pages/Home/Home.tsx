import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import usePrefersReducedMotion from '@/hooks/usePrefersReducedMotion';

import IntroControls from './components/IntroControls';
import IntroScene from './components/IntroScene';
import {
  basinTransitionDelay,
  introPhaseSequence,
  phaseDelays,
  reducedMotionBasinTransitionDelay,
  reducedMotionPhaseDelays,
} from './constants';
import type { IntroPhase } from './types';

import './Home.css';

function Home() {
  const navigate = useNavigate();
  const prefersReducedMotion = usePrefersReducedMotion();
  const [phase, setPhase] = useState<IntroPhase>('atoms-floating');
  const [animationVersion, setAnimationVersion] = useState(0);
  const [isNavigating, setIsNavigating] = useState(false);
  const navigationLockRef = useRef(false);

  useEffect(() => {
    const activeDelays = prefersReducedMotion ? reducedMotionPhaseDelays : phaseDelays;
    const transitionDelay = prefersReducedMotion ? reducedMotionBasinTransitionDelay : basinTransitionDelay;
    let elapsedTime = 0;

    setPhase('atoms-floating');

    // 动画时序集中在页面层管理，视觉组件只根据当前阶段呈现对应状态。
    const phaseTimers = introPhaseSequence.slice(1).flatMap((nextPhase, phaseIndex) => {
      const previousPhase = introPhaseSequence[phaseIndex];

      if (previousPhase === 'transitioning-to-basins') {
        return [];
      }

      elapsedTime += activeDelays[previousPhase];

      const phaseTimer = window.setTimeout(() => setPhase(nextPhase), elapsedTime);

      return [phaseTimer];
    });
    const navigationTimer = window.setTimeout(() => {
      if (navigationLockRef.current) {
        return;
      }

      navigationLockRef.current = true;
      setIsNavigating(true);
      navigate('/chapters', { state: { chapterOverviewEntry: 'intro' } });
    }, elapsedTime + transitionDelay);

    return () => {
      phaseTimers.forEach((timer) => window.clearTimeout(timer));
      window.clearTimeout(navigationTimer);
    };
  }, [animationVersion, navigate, prefersReducedMotion]);

  const handleReplayAnimation = () => {
    navigationLockRef.current = false;
    setIsNavigating(false);
    setPhase('atoms-floating');
    setAnimationVersion((currentVersion) => currentVersion + 1);
  };

  const handleSkipIntro = () => {
    if (isNavigating || navigationLockRef.current) {
      return;
    }

    navigationLockRef.current = true;
    setIsNavigating(true);
    navigate('/chapters', { state: { chapterOverviewEntry: 'skipped' } });
  };

  return (
    <section className={`home-page${phase === 'transitioning-to-basins' ? ' home-page--transitioning' : ''}`}>
      <IntroScene phase={phase} />

      <div className="home-page__topbar">
        <span className="home-page__eyebrow">WATER ECOLOGICAL CIVILIZATION</span>
        <IntroControls onReplay={handleReplayAnimation} onSkip={handleSkipIntro} />
      </div>

      <div className="home-page__content">
        <p className="home-page__chapter">一滴水的文明旅程</p>
        <h1 className="home-page__title">中华水生态文明</h1>
        <p className="home-page__subtitle">
          从江河源头出发，理解山水相依，
          <br />
          在自然与工程之间寻找共生之道。
        </p>
      </div>

      <p className="home-page__role">水生态工程师 · 沉浸式治理体验</p>
    </section>
  );
}

export default Home;
