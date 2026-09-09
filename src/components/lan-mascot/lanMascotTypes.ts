import type { LanMascotExpressionId } from './lanMascotExpressions';

export type LanMascotPosition = { x: number; y: number };

export interface LanMascotDialogue {
  conversationId: string;
  dialogLabel: string;
  messages: string[];
  actionLabel: string;
  unavailableNotice?: string;
  onAction: () => void;
  choices?: Array<{
    id: string;
    label: string;
    onSelect: () => void;
  }>;
  media?: {
    src: string;
    title: string;
  };
  closeOnBackdrop?: boolean;
  closeOnEscape?: boolean;
  showClose?: boolean;
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
  dialoguePresentation?: 'floating' | 'stage' | 'modal';
  visible?: boolean;
}
