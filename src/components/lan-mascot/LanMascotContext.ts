import { createContext, useContext } from 'react';

import type { LanFootingConfig, LanFootingRecord } from './lanFootingTypes';
import type { LanMascotExpressionId } from './lanMascotExpressions';
import type { LanMascotConfig, LanMascotPosition } from './lanMascotTypes';

export interface LanMascotRecord {
  config: LanMascotConfig;
  expressionId: LanMascotExpressionId;
  isDialogueOpen: boolean;
  position: LanMascotPosition;
}

export interface LanMascotContextValue {
  activeMascot: LanMascotRecord | null;
  activeFooting: LanFootingRecord | null;
  closeDialogue: (pageId: string) => void;
  openDialogue: (pageId: string) => void;
  registerFooting: (config: LanFootingConfig) => void;
  registerMascot: (config: LanMascotConfig) => void;
  setExpression: (pageId: string, expressionId: LanMascotExpressionId) => void;
  setPosition: (pageId: string, position: LanMascotPosition) => void;
}

const LanMascotContext = createContext<LanMascotContextValue | null>(null);

export function useLanMascotContext(): LanMascotContextValue {
  const context = useContext(LanMascotContext);

  if (context === null) {
    throw new Error('useLanMascot must be used inside LanMascotProvider');
  }

  return context;
}

export default LanMascotContext;
