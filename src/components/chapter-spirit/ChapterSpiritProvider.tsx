import { useCallback, useMemo, useState, type ReactNode } from 'react';
import { useLocation } from 'react-router-dom';

import type { LanFootingConfig, LanFootingRecord } from '@/components/lan-mascot/lanFootingTypes';

import ChapterSpiritContext, { type ChapterSpiritRecord } from './ChapterSpiritContext';
import type { ChapterSpiritConfig } from './chapterSpiritTypes';

interface State { records: Record<string, ChapterSpiritRecord>; footings: Record<string, LanFootingRecord>; }
interface Props { children: ReactNode; }

function sameConfig(first: ChapterSpiritConfig, second: ChapterSpiritConfig): boolean {
  return first.pageId === second.pageId && first.routePath === second.routePath && first.dialogueId === second.dialogueId
    && first.action === second.action && first.spriteAlt === second.spriteAlt && first.visible === second.visible
    && first.dialoguePresentation === second.dialoguePresentation && first.initialPosition?.x === second.initialPosition?.x
    && first.initialPosition?.y === second.initialPosition?.y && first.dialogue.conversationId === second.dialogue.conversationId
    && first.dialogue.onAction === second.dialogue.onAction && first.dialogue.messages.join('\u0000') === second.dialogue.messages.join('\u0000');
}

function ChapterSpiritProvider({ children }: Props) {
  const location = useLocation();
  const [state, setState] = useState<State>({ records: {}, footings: {} });
  const registerSpirit = useCallback((config: ChapterSpiritConfig) => setState((current) => {
    const existing = current.records[config.pageId];
    if (existing !== undefined && sameConfig(existing.config, config)) return current;
    return { ...current, records: { ...current.records, [config.pageId]: {
      config, action: config.action, isDialogueOpen: existing?.isDialogueOpen ?? false,
      position: existing?.position ?? config.initialPosition ?? { x: 16, y: 82 },
    } } };
  }), []);
  const registerFooting = useCallback((config: LanFootingConfig) => setState((current) => ({ ...current, footings: { ...current.footings, [config.pageId]: { config } } })), []);
  const setDialogueOpen = useCallback((pageId: string, isDialogueOpen: boolean) => setState((current) => {
    const record = current.records[pageId];
    return record === undefined || record.isDialogueOpen === isDialogueOpen ? current : { ...current, records: { ...current.records, [pageId]: { ...record, isDialogueOpen } } };
  }), []);
  const setPosition = useCallback((pageId: string, position: { x: number; y: number }) => setState((current) => {
    const record = current.records[pageId];
    return record === undefined ? current : { ...current, records: { ...current.records, [pageId]: { ...record, position } } };
  }), []);
  const activeSpirit = Object.values(state.records).find((record) => record.config.routePath === location.pathname) ?? null;
  const activeFooting = activeSpirit === null ? null : state.footings[activeSpirit.config.pageId] ?? null;
  const value = useMemo(() => ({ activeSpirit, activeFooting, registerSpirit, registerFooting, setPosition,
    openDialogue: (pageId: string) => setDialogueOpen(pageId, true), closeDialogue: (pageId: string) => setDialogueOpen(pageId, false),
  }), [activeFooting, activeSpirit, registerFooting, registerSpirit, setDialogueOpen, setPosition]);
  return <ChapterSpiritContext.Provider value={value}>{children}</ChapterSpiritContext.Provider>;
}

export default ChapterSpiritProvider;
