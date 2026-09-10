import NodeVideoPanel from '@/pages/YellowRiver/components/NodeVideoPanel';
import { getReleaseMediaUrl } from '@/lib/media';
import type { BasinStoryScene } from '@/types/basinStory';

import BasinStoryTabs from './BasinStoryTabs';

interface BasinStoryStageProps {
  scene: BasinStoryScene;
  onStartInteraction: () => void;
  layout?: 'stacked' | 'split';
}

function BasinStoryStage({ scene, onStartInteraction, layout = 'stacked' }: BasinStoryStageProps) {
  const video = scene.videoFilename ? {
    title: scene.videoTitle ?? scene.title,
    description: '影像素材从项目 Release 按需读取；暂未上传时仍可直接进入互动。',
    src: getReleaseMediaUrl(scene.videoFilename),
    poster: scene.poster,
    sourceLabel: scene.videoSourceLabel,
  } : undefined;

  const mediaAfterSectionId = scene.mediaAfterSectionId ?? 'problem';
  const mediaSlot = video !== undefined ? <div className="basin-story-stage__media">
    <NodeVideoPanel video={video} onComplete={scene.interaction ? onStartInteraction : undefined} skipLabel={scene.interaction ? '跳过影像，开始互动' : undefined} />
    {scene.interaction && <button className="basin-story-stage__interaction" type="button" onClick={onStartInteraction}>开始互动</button>}
  </div> : scene.interaction ? <aside className="basin-story-stage__discovery" aria-label="互动探索入口">
    <span>互动观察</span><strong>{scene.label}</strong><p>先认识生活在这段水脉中的生命，再一起思考该怎样守护它们。</p>
    <button className="basin-story-stage__interaction" type="button" onClick={onStartInteraction}>开始识图</button>
  </aside> : undefined;

  if (layout === 'split') {
    return (
      <article className="basin-story-stage basin-story-stage--split">
        <div className="basin-story-stage__interactive-column">
          {mediaSlot}
        </div>
        <BasinStoryTabs sections={scene.sections} storyId={scene.id} />
      </article>
    );
  }

  return <article className="basin-story-stage"><BasinStoryTabs sections={scene.sections} storyId={scene.id} mediaAfterSectionId={mediaAfterSectionId} mediaSlot={mediaSlot} /></article>;
}

export default BasinStoryStage;
