import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { HiddenLanMascotRoute } from '@/components/lan-mascot';

import {
  chapterOneIntroPosterSource,
  chapterOneIntroStillSource,
  chapterOneIntroVideoSource,
} from './chapterOneMedia';
import './ChapterOneIntro.css';

function ChapterOneIntro() {
  const navigate = useNavigate();
  const mediaFrameRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [showStillFrame, setShowStillFrame] = useState(!chapterOneIntroVideoSource);
  const enterChapter = (): void => { void navigate('/chapters/chapter-1', { replace: true }); };
  const stillSource = chapterOneIntroStillSource ?? chapterOneIntroPosterSource;

  useEffect(() => {
    document.body.classList.add('chapter-one-intro-active');
    return () => document.body.classList.remove('chapter-one-intro-active');
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (video === null || !chapterOneIntroVideoSource) return undefined;

    let isCancelled = false;
    const beginPlayback = async (): Promise<void> => {
      try {
        video.muted = false;
        await video.play();
        if (!isCancelled) {
          await mediaFrameRef.current?.requestFullscreen?.().catch(() => undefined);
        }
      } catch {
        // Cross-route playback and fullscreen are often blocked without a direct gesture.
        // A muted playback attempt keeps the introduction usable without showing an error.
        video.muted = true;
        await video.play().catch(() => undefined);
      }
    };

    void beginPlayback();
    return () => { isCancelled = true; };
  }, []);

  return (
    <main className="chapter-one-intro">
      <HiddenLanMascotRoute pageId="chapter-one-intro-hidden" routePath="/chapters/chapter-1/intro" />
      <header className="chapter-one-intro__nav">
        <Link to="/chapters">返回水脉记忆</Link>
        <span aria-hidden="true">/</span>
        <p>第一章引导影像</p>
      </header>
      <section className="chapter-one-intro__content" aria-labelledby="chapter-one-intro-title">
        <p>第一章 · 顺势而为</p>
        <h1 id="chapter-one-intro-title">水有去处，人有家园</h1>
        <div
          ref={mediaFrameRef}
          className={`chapter-one-intro__media ${showStillFrame ? 'chapter-one-intro__media--still' : ''}`}
        >
          {chapterOneIntroVideoSource && !showStillFrame ? (
            <video
              ref={videoRef}
              controls
              playsInline
              poster={stillSource}
              onEnded={() => setShowStillFrame(true)}
              onError={() => setShowStillFrame(true)}
            >
              <source src={chapterOneIntroVideoSource} />
              您的浏览器不支持视频播放。
            </video>
          ) : stillSource ? (
            <img className="chapter-one-intro__still" src={stillSource} alt="" />
          ) : (
            <div className="chapter-one-intro__placeholder">
              <span aria-hidden="true">≈</span>
              <h2>第一章引导影像准备中</h2>
              <p>将视频命名为 <code>intro.mp4</code> 或 <code>intro.webm</code> 放入指定目录后，这里会自动接入播放。</p>
            </div>
          )}
          <button className="chapter-one-intro__enter" type="button" onClick={enterChapter}>
            找寻水脉记忆<span aria-hidden="true">→</span>
          </button>
        </div>
      </section>
    </main>
  );
}

export default ChapterOneIntro;
