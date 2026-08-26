import { forwardRef } from 'react';

import './IntroVideo.css';

interface IntroVideoProps {
  showPoster: boolean;
  videoSrc?: string;
  posterSrc?: string;
  onEnded: () => void;
  onError: () => void;
}

const IntroVideo = forwardRef<HTMLVideoElement, IntroVideoProps>(function IntroVideo(
  { showPoster, videoSrc, posterSrc, onEnded, onError },
  ref,
) {
  return (
    <div
      aria-hidden="true"
      className={`intro-video${showPoster ? ' intro-video--show-poster' : ''}`}
      style={posterSrc ? { backgroundImage: `url(${posterSrc})` } : undefined}
    >
      {videoSrc && (
        <video
          ref={ref}
          autoPlay
          muted
          playsInline
          poster={posterSrc}
          preload="auto"
          src={videoSrc}
          onEnded={onEnded}
          onError={onError}
        />
      )}
    </div>
  );
});

export default IntroVideo;
