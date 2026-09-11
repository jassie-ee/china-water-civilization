import type { BasinId, RiverNode, RiverRegion } from './basin';

export type BasinStoryInteractionMode = 'choice' | 'species-recognition' | 'dispatch';

export interface BasinStorySection {
  id: 'background' | 'problem' | 'governance' | 'change' | 'reflection';
  label: string;
  paragraphs: string[];
  points?: string[];
}

export interface BasinStoryChoice {
  id: string;
  label: string;
  description?: string;
  imageSrc?: string;
  isCorrect: boolean;
  feedback: string;
}

export interface BasinStoryInteraction {
  id: string;
  mode: BasinStoryInteractionMode;
  question: string;
  choices: BasinStoryChoice[];
  rewardStars: 3;
}

export interface BasinStoryScene {
  id: string;
  label: string;
  title: string;
  summary: string;
  nodeId?: string;
  videoFilename?: string;
  videoTitle?: string;
  videoSourceLabel?: string;
  poster?: string;
  /** 媒体不是独立章节，而是嵌入叙事阅读中的理解入口。 */
  mediaAfterSectionId?: BasinStorySection['id'];
  sections: BasinStorySection[];
  interaction?: BasinStoryInteraction;
}

export interface BasinNarrativeConfig {
  basinId: BasinId;
  riverName: string;
  pageTitle: string;
  pageSubtitle: string;
  theme: 'yellow' | 'yangtze' | 'pearl';
  background: string;
  /** 可选的场景级底图；未声明的流域继续使用统一底图。 */
  sceneBackgrounds?: Record<string, string>;
  scenes: BasinStoryScene[];
  nodes: RiverNode[];
  regions: RiverRegion[];
}
