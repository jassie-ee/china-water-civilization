export type ChapterSpiritAction = 'happy' | 'sleeve' | 'point-water' | 'hold-water' | 'purify';

export type LanMascotPosition = { x: number; y: number };

export interface ChapterSpiritDialogue {
  conversationId: string;
  dialogLabel: string;
  messages: string[];
  actionLabel: string;
  unavailableNotice?: string;
  onAction: () => void;
  choices?: Array<{ id: string; label: string; description?: string; imageSrc?: string; feedback?: string; videoSrc?: string; onSelect: () => void }>;
  choicePresentation?: 'list' | 'species' | 'dispatch' | 'maozhou';
  heading?: string;
  media?: { src: string; title: string };
  closeOnBackdrop?: boolean;
  closeOnEscape?: boolean;
  showClose?: boolean;
  closeOnAction?: boolean;
}

export interface ChapterSpiritConfig {
  pageId: string;
  routePath: string;
  dialogue: ChapterSpiritDialogue;
  dialogueId: string;
  action: ChapterSpiritAction;
  initialPosition?: LanMascotPosition;
  spriteAlt: string;
  onDialogueClose?: () => void;
  dialoguePresentation?: 'floating' | 'stage' | 'modal';
  visible?: boolean;
}
