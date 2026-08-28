import type { LanMascotExpressionId } from './lanMascotExpressions';

export type LanMascotPosition = { x: number; y: number };

export interface LanMascotDialogue {
  conversationId: string;
  dialogLabel: string;
  messages: string[];
  actionLabel: string;
  unavailableNotice?: string;
  onAction: () => void;
}

export interface LanMascotConfig {
  pageId: string;
  routePath?: string;
  dialogue: LanMascotDialogue;
  dialogueId: string;
  expressionId: LanMascotExpressionId;
  initialPosition?: LanMascotPosition;
  spriteAlt: string;
  onDialogueClose?: () => void;
}
