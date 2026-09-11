import { useCallback, useMemo, useState, type ReactNode } from 'react';
import { useLocation } from 'react-router-dom';

import LanMascotContext, { type LanMascotContextValue, type LanMascotRecord } from './LanMascotContext';
import type { LanFootingConfig, LanFootingRecord } from './lanFootingTypes';
import { defaultLanMascotConfig, defaultLanMascotPosition } from './lanMascotDefaults';
import type { LanMascotExpressionId } from './lanMascotExpressions';
import type { LanMascotConfig, LanMascotPosition } from './lanMascotTypes';

interface LanMascotProviderProps {
  children: ReactNode;
  /**
   * The upstream plugin ships with a friendly global fallback mascot. Keep it
   * opt-in at the app shell so existing pages can adopt the plugin gradually
   * without gaining an extra sprite overlay before they register a config.
   */
  showDefaultMascot?: boolean;
}

interface LanMascotState {
  activePageId: string | null;
  footings: Record<string, LanFootingRecord>;
  records: Record<string, LanMascotRecord>;
}

function sameDialogue(first: LanMascotConfig['dialogue'], second: LanMascotConfig['dialogue']): boolean {
  return first.conversationId === second.conversationId
    && first.dialogLabel === second.dialogLabel
    && first.actionLabel === second.actionLabel
    && first.unavailableNotice === second.unavailableNotice
    && first.onAction === second.onAction
    && first.messages.length === second.messages.length
    && first.messages.every((message, index) => message === second.messages[index]);
}

function sameConfig(first: LanMascotConfig, second: LanMascotConfig): boolean {
  const firstPosition = first.initialPosition ?? defaultLanMascotPosition;
  const secondPosition = second.initialPosition ?? defaultLanMascotPosition;

  return first.pageId === second.pageId
    && first.routePath === second.routePath
    && first.dialogueId === second.dialogueId
    && first.expressionId === second.expressionId
    && firstPosition.x === secondPosition.x
    && firstPosition.y === secondPosition.y
    && first.spriteAlt === second.spriteAlt
    && first.spriteSrc === second.spriteSrc
    && first.dialoguePresentation === second.dialoguePresentation
    && first.onDialogueClose === second.onDialogueClose
    && sameDialogue(first.dialogue, second.dialogue);
}

function sameFootingConfig(first: LanFootingConfig, second: LanFootingConfig): boolean {
  return first.pageId === second.pageId
    && first.routePath === second.routePath
    && first.sceneId === second.sceneId;
}

function LanMascotProvider({ children, showDefaultMascot = true }: LanMascotProviderProps) {
  const location = useLocation();
  const [state, setState] = useState<LanMascotState>(() => {
    if (!showDefaultMascot) {
      return { activePageId: null, footings: {}, records: {} };
    }

    return {
      activePageId: defaultLanMascotConfig.pageId,
      footings: {},
      records: {
        [defaultLanMascotConfig.pageId]: {
          config: defaultLanMascotConfig,
          expressionId: defaultLanMascotConfig.expressionId,
          isDialogueOpen: false,
          position: defaultLanMascotConfig.initialPosition ?? defaultLanMascotPosition,
        },
      },
    };
  });

  const registerMascot = useCallback((config: LanMascotConfig): void => {
    setState((currentState) => {
      const existing = currentState.records[config.pageId];
      const isSameRecord = existing !== undefined && sameConfig(existing.config, config);
      const initialPosition = config.initialPosition ?? defaultLanMascotPosition;

      if (isSameRecord && currentState.activePageId === config.pageId) {
        return currentState;
      }

      return {
        activePageId: config.pageId,
        footings: currentState.footings,
        records: {
          ...currentState.records,
          [config.pageId]: existing === undefined
            ? { config, expressionId: config.expressionId, isDialogueOpen: false, position: initialPosition }
            : {
              ...existing,
              config,
              expressionId: existing.config.expressionId === config.expressionId
                ? existing.expressionId
                : config.expressionId,
            },
        },
      };
    });
  }, []);

  const registerFooting = useCallback((config: LanFootingConfig): void => {
    setState((currentState) => {
      const existing = currentState.footings[config.pageId];
      if (existing !== undefined && sameFootingConfig(existing.config, config)) return currentState;

      return {
        ...currentState,
        footings: {
          ...currentState.footings,
          [config.pageId]: { config },
        },
      };
    });
  }, []);

  const setExpression = useCallback((pageId: string, expressionId: LanMascotExpressionId): void => {
    setState((currentState) => {
      const record = currentState.records[pageId];
      if (record === undefined || record.expressionId === expressionId) return currentState;

      return {
        ...currentState,
        records: { ...currentState.records, [pageId]: { ...record, expressionId } },
      };
    });
  }, []);

  const setPosition = useCallback((pageId: string, position: LanMascotPosition): void => {
    setState((currentState) => {
      const record = currentState.records[pageId];
      if (record === undefined) return currentState;

      return {
        ...currentState,
        records: { ...currentState.records, [pageId]: { ...record, position } },
      };
    });
  }, []);

  const setDialogueOpen = useCallback((pageId: string, isDialogueOpen: boolean): void => {
    setState((currentState) => {
      const record = currentState.records[pageId];
      if (record === undefined || record.isDialogueOpen === isDialogueOpen) return currentState;

      return {
        ...currentState,
        records: { ...currentState.records, [pageId]: { ...record, isDialogueOpen } },
      };
    });
  }, []);

  const activeMascot = Object.values(state.records).find((record) => record.config.routePath === location.pathname)
    ?? (showDefaultMascot ? state.records[defaultLanMascotConfig.pageId] : undefined)
    ?? null;
  const activeFooting = Object.values(state.footings).find((record) => record.config.routePath === location.pathname)
    ?? null;
  const contextValue = useMemo<LanMascotContextValue>(() => ({
    activeMascot,
    activeFooting,
    closeDialogue: (pageId) => setDialogueOpen(pageId, false),
    openDialogue: (pageId) => setDialogueOpen(pageId, true),
    registerFooting,
    registerMascot,
    setExpression,
    setPosition,
  }), [activeFooting, activeMascot, registerFooting, registerMascot, setDialogueOpen, setExpression, setPosition]);

  return <LanMascotContext.Provider value={contextValue}>{children}</LanMascotContext.Provider>;
}

export default LanMascotProvider;
