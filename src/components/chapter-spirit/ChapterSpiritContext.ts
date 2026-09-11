import { createContext, useContext } from 'react';

import type { LanFootingConfig, LanFootingRecord } from '@/components/lan-mascot/lanFootingTypes';

import type { ChapterSpiritAction, ChapterSpiritConfig } from './chapterSpiritTypes';

export interface ChapterSpiritRecord {
  config: ChapterSpiritConfig;
  action: ChapterSpiritAction;
  isDialogueOpen: boolean;
  position: { x: number; y: number };
}

export interface ChapterSpiritContextValue {
  activeSpirit: ChapterSpiritRecord | null;
  activeFooting: LanFootingRecord | null;
  closeDialogue: (pageId: string) => void;
  openDialogue: (pageId: string) => void;
  registerFooting: (config: LanFootingConfig) => void;
  registerSpirit: (config: ChapterSpiritConfig) => void;
  setPosition: (pageId: string, position: { x: number; y: number }) => void;
}

const ChapterSpiritContext = createContext<ChapterSpiritContextValue | null>(null);

export function useChapterSpiritContext(): ChapterSpiritContextValue {
  const context = useContext(ChapterSpiritContext);
  if (context === null) throw new Error('useChapterSpirit must be used inside ChapterSpiritProvider');
  return context;
}

export default ChapterSpiritContext;
