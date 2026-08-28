import type { RiverNodeVideo } from '@/types/basin';

interface NodeVideoPanelProps {
  video?: RiverNodeVideo;
}

/** 生态节点共用的视频容器；未配置素材时保持安静的导入占位。 */
function NodeVideoPanel({ video }: NodeVideoPanelProps) {
  const title = video?.title ?? '生态影像';

  return (
    <section className="node-video-panel" aria-label={title}>
      {video?.src ? (
        <video className="node-video-panel__media" controls preload="metadata" poster={video.poster}>
          <source src={video.src} />
          您的浏览器暂不支持视频播放。
        </video>
      ) : (
        <div className="node-video-panel__placeholder" aria-hidden="true">
          <span>VIDEO</span>
          <strong>{title}</strong>
          <small>{video?.description ?? '视频素材后续导入'}</small>
        </div>
      )}
    </section>
  );
}

export default NodeVideoPanel;
