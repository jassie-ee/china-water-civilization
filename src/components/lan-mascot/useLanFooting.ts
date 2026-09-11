import { useLayoutEffect } from 'react';

import { useChapterSpiritContext } from '@/components/chapter-spirit/ChapterSpiritContext';
import type { LanFootingConfig } from './lanFootingTypes';

export function useLanFooting(config: LanFootingConfig): void {
  const { registerFooting } = useChapterSpiritContext();

  useLayoutEffect(() => {
    registerFooting(config);
  }, [config, registerFooting]);
}
