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
  const backgroundSection = scene.sections.find((section) => section.id === 'background');
  const governanceSection = scene.sections.find((section) => section.id === 'governance');
  const reflectionSection = scene.sections.find((section) => section.id === 'reflection');
  const mediaSlot = video !== undefined ? <div ref={hasSplitVideo ? mediaRef : undefined} className="basin-story-stage__media">
    <NodeVideoPanel video={video} onComplete={scene.interaction ? onStartInteraction : undefined} skipLabel={scene.interaction ? interactionLabel : undefined} />
  </div> : scene.interaction ? <aside className="basin-story-stage__discovery" aria-label="互动探索入口">
    <span>互动观察</span><strong>{scene.label}</strong><p>先认识生活在这段水脉中的生命，再一起思考该怎样守护它们。</p>
    <button className="basin-story-stage__interaction" type="button" onClick={onStartInteraction}>开始识图</button>
  </aside> : undefined;

  if (layout === 'split') {
    if (scene.id === 'pearl-city') {
      return (
        <article className="basin-story-stage basin-story-stage--maozhou">
          <section className="maozhou-decision" aria-label="茅洲河治理互动入口">
            <p>互动 3.2</p><h3>先堵住污染的来路</h3><span>从一条发黑的城市河流，判断治理应从哪里开始。</span>
            <button className="maozhou-decision__start" type="button" onClick={onStartInteraction}>开始决策<span aria-hidden="true">→</span></button>
          </section>
          <BasinStoryTabs sections={scene.sections} storyId={scene.id} fillHeight />
        </article>
      );
    }
    if (scene.id === 'yangtze-life') {
      const conclusion = reflectionSection?.paragraphs[reflectionSection.paragraphs.length - 1];

      return (
        <article className="basin-story-stage basin-story-stage--split basin-story-stage--yangtze-life">
          <div className="basin-story-stage__interactive-column">
            {mediaSlot}
          </div>
          <section className="basin-story-stage__life-copy" aria-live="polite">
            <p className="basin-story-stage__life-eyebrow">生命共同体</p>
            <h3>让每一种生命都有回家的路</h3>
            <div className="basin-story-stage__life-body">
              {backgroundSection?.paragraphs[0] && <p>{backgroundSection.paragraphs[0]}</p>}
              {governanceSection?.paragraphs[0] && <p>{governanceSection.paragraphs[0]}</p>}
            </div>
            <div className="basin-story-stage__life-process" aria-label="守护长江生命的行动路径">
              <strong>十年禁渔</strong><b>→</b><strong>栖息地修复</strong><b>→</b><strong>科学监测</strong>
            </div>
            {conclusion && <p className="basin-story-stage__life-conclusion">{conclusion}</p>}
          </section>
        </article>
      );
    }

    return (
      <article className={`basin-story-stage basin-story-stage--split basin-story-stage--${scene.id}${hasSplitVideo ? ' basin-story-stage--has-media' : ''}`} style={splitStyle}>
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
