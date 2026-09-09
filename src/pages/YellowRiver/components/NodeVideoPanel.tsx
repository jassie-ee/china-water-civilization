import { useEffect, useRef, useState } from 'react';

import type { RiverNodeVideo } from '@/types/basin';

interface NodeVideoPanelProps {
  video?: RiverNodeVideo;
  onComplete?: () => void;
  skipLabel?: string;
}

/** 生态节点共用的视频容器；未配置素材时保持安静的导入占位。 */
function NodeVideoPanel({ video, onComplete, skipLabel }: NodeVideoPanelProps) {
  const title = video?.title ?? '生态影像';
  const [hasVideoError, setHasVideoError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    setHasVideoError(false);
  }, [video?.src]);

  const videoSource = video?.src;
  const canPlayVideo = videoSource !== undefined && !hasVideoError;

  const enableAudio = (): void => {
    const media = videoRef.current;
    if (!media) return;
    media.muted = false;
    media.defaultMuted = false;
    if (media.volume === 0) media.volume = 1;
  };

  return (
    <section className="node-video-panel" aria-label={title}>
      {canPlayVideo ? (
        <>
          <video
            ref={videoRef}
            className="node-video-panel__media"
            controls
            muted={false}
            preload="metadata"
            poster={video?.poster}
            onLoadedMetadata={enableAudio}
            onEnded={onComplete}
            onError={() => setHasVideoError(true)}
          >
            <source src={videoSource} />
            您的浏览器暂不支持视频播放。
          </video>
          {onComplete !== undefined && skipLabel !== undefined && <button className="node-video-panel__skip" type="button" onClick={onComplete}>{skipLabel}</button>}
        </>
      ) : (
        <>
          <div className="node-video-panel__placeholder" aria-hidden="true">
            <span>VIDEO</span>
            <strong>{title}</strong>
            <small>{video?.description ?? '视频素材后续导入'}</small>
          </div>
          {onComplete !== undefined && skipLabel !== undefined && <button className="node-video-panel__skip" type="button" onClick={onComplete}>{skipLabel}</button>}
        </>
      )}
    </section>
  );
}

export default NodeVideoPanel;
