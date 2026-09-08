import LanFootingScene from './LanFootingScene';
import { useLanMascotContext } from './LanMascotContext';

import './LanMascot.css';

function LanFootingHost() {
  const { activeFooting, activeMascot } = useLanMascotContext();

  if (activeFooting === null || activeMascot === null || activeFooting.config.visible === false || activeMascot.config.visible === false || activeFooting.config.pageId !== activeMascot.config.pageId) {
    return null;
  }

  const { position } = activeMascot;

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
