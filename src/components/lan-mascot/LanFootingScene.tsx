import { useCallback, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

import LanFootingOriginalPreview from './LanFootingOriginalPreview';
import { lanFootingScenes, type LanFootingSceneId } from './lanMascotScenes';
import LanWaterBloomFooting from './LanWaterBloomFooting';
import LanLoessFooting from './LanLoessFooting';

interface LanFootingSceneProps {
  sceneId: LanFootingSceneId;
}

function LanFootingScene({ sceneId }: LanFootingSceneProps) {
  const scene = lanFootingScenes[sceneId];
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closePreview = useCallback(() => {
    setIsPreviewOpen(false);
    window.requestAnimationFrame(() => triggerRef.current?.focus());
  }, []);

  if (scene.kind === 'water-bloom') {
    return <LanWaterBloomFooting />;
  }

  if (scene.kind === 'loess-bloom') {
    return <LanLoessFooting />;
  }

  return (
    <>
      <button
        ref={triggerRef}
        className="lan-footing__trigger"
        type="button"
        aria-label={`查看${scene.alt}原图`}
        aria-haspopup="dialog"
        aria-expanded={isPreviewOpen}
        onClick={() => setIsPreviewOpen(true)}
      >
        <img className="lan-footing__scene" src={scene.src} alt="" aria-hidden="true" />
      </button>
      {isPreviewOpen && createPortal(
        <LanFootingOriginalPreview scene={scene} onClose={closePreview} />,
        document.body,
      )}
    </>
  );
}

export default LanFootingScene;
