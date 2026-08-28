export type ChapterId = 'chapter-1' | 'chapter-2' | 'chapter-3' | 'chapter-4';

export type ChapterStatus = 'preview' | 'available';

export type ChapterDialogueSide = 'left' | 'right';
export type ChapterDialogueVertical = 'above' | 'below';

export interface ChapterMarkerPosition {
  x: number;
  y: number;
  mobileX: number;
  mobileY: number;
  dialogueSide: ChapterDialogueSide;
  dialogueVertical: ChapterDialogueVertical;
}

export interface ChapterOverviewItem {
  id: ChapterId;
  order: number;
  markerGlyph: string;
  title: string;
  theme: string;
  marker: ChapterMarkerPosition;
  dialogue: string[];
  ctaLabel: string;
  unavailableNotice?: string;
  status: ChapterStatus;
  route?: string;
}
