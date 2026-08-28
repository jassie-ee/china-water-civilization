import { useLayoutEffect } from 'react';

import { useLanMascotContext } from './LanMascotContext';
import type { LanFootingConfig } from './lanFootingTypes';

export function useLanFooting(config: LanFootingConfig): void {
  const { registerFooting } = useLanMascotContext();

  useLayoutEffect(() => {
    registerFooting(config);
  }, [config, registerFooting]);
}
