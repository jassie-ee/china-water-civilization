import { useRef, useState, type ReactNode } from 'react';

import './chapter-scene-stage.css';

interface ChapterSceneStageProps {
  children?: ReactNode;
  className?: string;
  label: string;
  poster?: string;
  src?: string;
}

function ChapterSceneStage({ children, className = '', label, poster, src }: ChapterSceneStageProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasError, setHasError] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlayback = (): void => {
    const video = videoRef.current;
    if (video === null) return;

    if (video.paused || video.ended) {
      if (video.ended) video.currentTime = 0;
      void video.play().catch(() => setHasError(true));
      return;
    }

    video.pause();
  };

  return (
    <figure className={`chapter-scene-stage${className ? ` ${className}` : ''}`} aria-label={label}>
      <div className="chapter-scene-stage__canvas">
        {src !== undefined && !hasError ? (
          <video
            ref={videoRef}
            className="chapter-scene-stage__media"
            loop
            muted
            playsInline
            preload="metadata"
            poster={poster}
            onError={() => setHasError(true)}
            onEnded={() => setIsPlaying(false)}
            onPause={() => setIsPlaying(false)}
            onPlay={() => setIsPlaying(true)}
          >
            <source src={src} type="video/mp4" />
          </video>
        ) : poster !== undefined ? (
          <img className="chapter-scene-stage__media" src={poster} alt="" aria-hidden="true" />
        ) : null}
        <div className="chapter-scene-stage__wash" aria-hidden="true" />
        <div className="chapter-scene-stage__meta" aria-hidden="true">
          <span>{label}</span>
          <small>{isPlaying ? '影像流动中' : '现场记录'}</small>
        </div>
        {src !== undefined && !hasError && (
          <button
            className="chapter-scene-stage__play"
            type="button"
            aria-label={isPlaying ? `暂停${label}` : `播放${label}`}
            onClick={togglePlayback}
          >
            <span aria-hidden="true">{isPlaying ? 'Ⅱ' : '▶'}</span>
            {isPlaying ? '暂停影像' : '观看影像'}
          </button>
        )}
        {hasError && (
          <p className="chapter-scene-stage__fallback" role="status">
            影像暂不可用，保留静态现场。
          </p>
        )}
        {children}
      </div>
    </figure>
  );
}

export default ChapterSceneStage;
