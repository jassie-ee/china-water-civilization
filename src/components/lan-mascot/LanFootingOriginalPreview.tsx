import { useEffect, useRef } from 'react';

import type { LanFootingScene } from './lanMascotScenes';

import './LanFootingOriginalPreview.css';

interface LanFootingOriginalPreviewProps {
  scene: LanFootingScene;
  onClose: () => void;
}

function LanFootingOriginalPreview({ scene, onClose }: LanFootingOriginalPreviewProps) {
  const previewRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => previewRef.current?.focus());
    const handleKeyDown = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      window.cancelAnimationFrame(frame);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  return (
    <div className="lan-footing-preview" role="presentation" onClick={onClose}>
      <section
        ref={previewRef}
        className="lan-footing-preview__dialog"
        role="dialog"
        aria-modal="true"
        aria-label={`${scene.alt}原图`}
        tabIndex={-1}
        onClick={(event) => event.stopPropagation()}
      >
        <img className="lan-footing-preview__image" src={scene.src} alt={scene.alt} />
      </section>
    </div>
  );
}

export default LanFootingOriginalPreview;
