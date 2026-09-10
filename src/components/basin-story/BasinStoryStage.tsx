import NodeVideoPanel from '@/pages/YellowRiver/components/NodeVideoPanel';
import { getReleaseMediaUrl } from '@/lib/media';
import type { BasinStoryScene } from '@/types/basinStory';

import BasinStoryTabs from './BasinStoryTabs';

interface BasinStoryStageProps {
  scene: BasinStoryScene;
  onStartInteraction: () => void;
}

function BasinStoryStage({ scene, onStartInteraction }: BasinStoryStageProps) {
  const video = scene.videoFilename ? {
    title: scene.videoTitle ?? scene.title,
    description: '影像素材从项目 Release 按需读取；暂未上传时仍可直接进入互动。',
    src: getReleaseMediaUrl(scene.videoFilename),
    poster: scene.poster,
  } : undefined;

  return (
    <article className="basin-story-stage">
      <div className="basin-story-stage__media">
        <NodeVideoPanel
          video={video}
          onComplete={scene.interaction ? onStartInteraction : undefined}
          skipLabel={scene.interaction ? '跳过影像，开始互动' : undefined}
        />
        {scene.interaction && (
          <button className="basin-story-stage__interaction" type="button" onClick={onStartInteraction}>
            开始互动
          </button>
        )}
      </div>
      <BasinStoryTabs sections={scene.sections} storyId={scene.id} />
    </article>
  );
}

export default BasinStoryStage;
