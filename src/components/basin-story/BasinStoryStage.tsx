import NodeVideoPanel from '@/pages/YellowRiver/components/NodeVideoPanel';
import { getLocalVideoAssetUrl } from '@/assets/videos/mediaSources';
import { getReleaseMediaUrl } from '@/lib/media';
import type { BasinStoryScene } from '@/types/basinStory';
import useSyncedMediaHeight from '@/hooks/useSyncedMediaHeight';

import BasinStoryTabs from './BasinStoryTabs';

interface BasinStoryStageProps {
  scene: BasinStoryScene;
  onStartInteraction: () => void;
  interactionLabel?: string;
  layout?: 'stacked' | 'split';
}

function BasinStoryStage({ scene, onStartInteraction, interactionLabel = '跳过影像，直接互动', layout = 'stacked' }: BasinStoryStageProps) {
  const videoSource = scene.videoFilename
    ? getLocalVideoAssetUrl(scene.videoFilename) ?? getReleaseMediaUrl(scene.videoFilename)
    : undefined;
  const video = scene.videoFilename ? {
    title: scene.videoTitle ?? scene.title,
    description: getLocalVideoAssetUrl(scene.videoFilename) ? '影像已随网页打包部署。' : '影像正从发布资源加载。',
    src: videoSource,
    poster: scene.poster,
    sourceLabel: scene.videoSourceLabel,
  } : undefined;
  const hasSplitVideo = layout === 'split' && video !== undefined;
  const { mediaRef, style: splitStyle } = useSyncedMediaHeight(hasSplitVideo);

  const mediaAfterSectionId = scene.mediaAfterSectionId ?? 'problem';
  const mediaSlot = video !== undefined ? <div ref={hasSplitVideo ? mediaRef : undefined} className="basin-story-stage__media">
    <NodeVideoPanel video={video} onComplete={scene.interaction ? onStartInteraction : undefined} skipLabel={scene.interaction ? interactionLabel : undefined} />
  </div> : scene.interaction ? <aside className="basin-story-stage__discovery" aria-label="互动探索入口">
    <span>互动观察</span><strong>{scene.label}</strong><p>先认识生活在这段水脉中的生命，再一起思考该怎样守护它们。</p>
    <button className="basin-story-stage__interaction" type="button" onClick={onStartInteraction}>开始识图</button>
  </aside> : undefined;

  if (layout === 'split') {
    return (
      <article className={`basin-story-stage basin-story-stage--split${hasSplitVideo ? ' basin-story-stage--has-media' : ''}`} style={splitStyle}>
        <div className="basin-story-stage__interactive-column">
          {mediaSlot}
        </div>
        <BasinStoryTabs sections={scene.sections} storyId={scene.id} fillHeight={hasSplitVideo} />
      </article>
    );
  }

  return <article className="basin-story-stage"><BasinStoryTabs sections={scene.sections} storyId={scene.id} mediaAfterSectionId={mediaAfterSectionId} mediaSlot={mediaSlot} /></article>;
}

export default BasinStoryStage;
