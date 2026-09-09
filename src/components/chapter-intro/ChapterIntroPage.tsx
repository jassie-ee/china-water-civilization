import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { HiddenLanMascotRoute } from '@/components/lan-mascot';

import './ChapterIntroPage.css';

interface ChapterIntroPageProps {
  chapterNumber: number;
  theme: string;
  title: string;
  backgroundImage: string;
  videoSource: string;
  posterSource?: string;
  stillSource?: string;
  mediaFilename: string;
  entryLabel: string;
  entryRoute: string;
  hiddenMascotPageId: string;
  routePath: string;
}

function ChapterIntroPage({
  chapterNumber,
  theme,
  title,
  backgroundImage,
  videoSource,
  posterSource,
  stillSource,
  mediaFilename,
  entryLabel,
  entryRoute,
  hiddenMascotPageId,
  routePath,
}: ChapterIntroPageProps) {
  const navigate = useNavigate();
  const mediaFrameRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [showStillFrame, setShowStillFrame] = useState(false);
  const stillFrameSource = stillSource ?? posterSource;
  const pageStyle = { '--chapter-intro-background': `url("${backgroundImage}")` } as CSSProperties;

  useEffect(() => {
    document.body.classList.add('chapter-intro-active');
    return () => document.body.classList.remove('chapter-intro-active');
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (video === null) return undefined;

    let isCancelled = false;
    const beginPlayback = async (): Promise<void> => {
      try {
        video.muted = false;
        await video.play();
        if (!isCancelled) {
          await mediaFrameRef.current?.requestFullscreen?.().catch(() => undefined);
        }
      } catch {
        video.muted = true;
        await video.play().catch(() => undefined);
      }
    };

    void beginPlayback();
    return () => { isCancelled = true; };
  }, []);

  return (
    <main className="chapter-intro" style={pageStyle}>
      <HiddenLanMascotRoute pageId={hiddenMascotPageId} routePath={routePath} />
      <header className="chapter-intro__nav">
        <Link to="/chapters">返回水脉记忆</Link>
        <span aria-hidden="true">/</span>
        <p>第{chapterNumber}章引导影像</p>
      </header>
      <section className="chapter-intro__content" aria-labelledby="chapter-intro-title">
        <p>第{chapterNumber}章 · {theme}</p>
        <h1 id="chapter-intro-title">{title}</h1>
        <div
          ref={mediaFrameRef}
          className={`chapter-intro__media ${showStillFrame ? 'chapter-intro__media--still' : ''}`}
        >
          {!showStillFrame ? (
            <video
              ref={videoRef}
              controls
              playsInline
              poster={stillFrameSource}
              onEnded={() => setShowStillFrame(true)}
              onError={() => setShowStillFrame(true)}
            >
              <source src={videoSource} />
              您的浏览器不支持视频播放。
            </video>
          ) : stillFrameSource ? (
            <img className="chapter-intro__still" src={stillFrameSource} alt="" />
          ) : (
            <div className="chapter-intro__placeholder">
              <span aria-hidden="true">≈</span>
              <h2>第{chapterNumber}章引导影像准备中</h2>
              <p>将视频上传到 Release 并命名为 <code>{mediaFilename}</code> 后，这里会自动接入播放。</p>
            </div>
          )}
          <button className="chapter-intro__enter" type="button" onClick={() => void navigate(entryRoute, { replace: true })}>
            {entryLabel}<span aria-hidden="true">→</span>
          </button>
        </div>
      </section>
    </main>
  );
}

export default ChapterIntroPage;
