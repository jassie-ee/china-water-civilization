import LanFootingScene from './LanFootingScene';
import { useChapterSpiritContext } from '@/components/chapter-spirit/ChapterSpiritContext';

import '@/components/chapter-spirit/ChapterSpirit.css';

function LanFootingHost() {
  const { activeFooting, activeSpirit } = useChapterSpiritContext();

  if (activeFooting === null || activeSpirit === null || activeFooting.config.visible === false || activeSpirit.config.visible === false || activeFooting.config.pageId !== activeSpirit.config.pageId) {
    return null;
  }

  const { position } = activeSpirit;

  return (
    <div className="lan-footing-host">
      <div
        className="lan-footing"
        style={{ left: `${position.x}%`, top: `${position.y}%` }}
      >
        <LanFootingScene sceneId={activeFooting.config.sceneId} />
      </div>
    </div>
  );
}

export default LanFootingHost;
