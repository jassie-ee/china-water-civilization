import { useCallback, useLayoutEffect, useState, type CSSProperties } from 'react';

interface SyncedMediaHeight {
  mediaRef: (element: HTMLDivElement | null) => void;
  style: CSSProperties | undefined;
}

function useSyncedMediaHeight(enabled: boolean): SyncedMediaHeight {
  const [mediaElement, setMediaElement] = useState<HTMLDivElement | null>(null);
  const [height, setHeight] = useState<number | null>(null);

  const mediaRef = useCallback((element: HTMLDivElement | null): void => {
    setMediaElement(element);
  }, []);

  useLayoutEffect(() => {
    if (!enabled || mediaElement === null) {
      setHeight(null);
      return undefined;
    }

    const updateHeight = (): void => {
      setHeight(Math.round(mediaElement.getBoundingClientRect().height));
    };

    if (typeof ResizeObserver === 'undefined') {
      updateHeight();
      return undefined;
    }

    const observer = new ResizeObserver(updateHeight);

    updateHeight();
    observer.observe(mediaElement);
    return () => observer.disconnect();
  }, [enabled, mediaElement]);

  return {
    mediaRef,
    style: height === null ? undefined : { '--split-media-height': `${height}px` } as CSSProperties,
  };
}

export default useSyncedMediaHeight;
