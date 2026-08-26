import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import usePrefersReducedMotion from '@/hooks/usePrefersReducedMotion';

import IntroControls from './components/IntroControls';
import IntroVideo from './components/IntroVideo';
import { introPosterSource, introVideoSource } from './introMedia';

import './Home.css';

function Home() {
  const navigate = useNavigate();
  const prefersReducedMotion = usePrefersReducedMotion();
  const videoRef = useRef<HTMLVideoElement>(null);
  const navigationLockRef = useRef(false);
  const [isVideoComplete, setIsVideoComplete] = useState(prefersReducedMotion || !introVideoSource);
  const [hasVideoError, setHasVideoError] = useState(false);

  const isFinalScene = prefersReducedMotion || !introVideoSource || hasVideoError || isVideoComplete;

  useEffect(() => {
    if (prefersReducedMotion || !introVideoSource) {
      setIsVideoComplete(true);
      return;
    }

    setHasVideoError(false);
    setIsVideoComplete(false);
  }, [prefersReducedMotion]);

  const navigateToChapters = (entry: 'intro' | 'skipped') => {
    if (navigationLockRef.current) {
      return;
    }

    navigationLockRef.current = true;
    navigate('/chapters', { state: { chapterOverviewEntry: entry } });
  };

  const handleReplay = () => {
    if (prefersReducedMotion || !introVideoSource) {
      return;
    }

    const video = videoRef.current;

    if (!video) {
      return;
    }

    navigationLockRef.current = false;
    video.muted = true;
    video.currentTime = 0;
    setHasVideoError(false);
    setIsVideoComplete(false);
    void video.play().catch(() => setHasVideoError(true));
  };

  return (
    <section className={`home-page${isFinalScene ? ' home-page--final' : ''}`}>
      <IntroVideo
        ref={videoRef}
        showPoster={isFinalScene}
        videoSrc={prefersReducedMotion ? undefined : introVideoSource}
        posterSrc={introPosterSource}
        onEnded={() => setIsVideoComplete(true)}
        onError={() => setHasVideoError(true)}
      />

      <div className="home-page__topbar">
        <IntroControls
          isReplayEnabled={Boolean(introVideoSource) && !prefersReducedMotion}
          onReplay={handleReplay}
          onSkip={() => navigateToChapters('skipped')}
        />
      </div>

      {isFinalScene && (
        <div className="home-page__content">
          <p className="home-page__chapter">一滴水的文明旅程</p>
          <h1 className="home-page__title">中华水生态文明</h1>
          <p className="home-page__subtitle">从江河源头出发，在自然与工程之间寻找共生之道。</p>
          <button className="home-page__enter-button" type="button" onClick={() => navigateToChapters('intro')}>
            <span>开始探索</span>
          </button>
        </div>
      )}
    </section>
  );
}

export default Home;
