export type BasinId = 'yellow-river' | 'yangtze-river';

export type BasinOverviewPhase =
  | 'map-entering'
  | 'drop-landing'
  | 'source-rippling'
  | 'rivers-awakening'
  | 'interactive';

export type BasinOverviewEntry = 'intro' | 'skipped' | 'direct' | 'returning' | 'chapter-overview';

export type BasinInteractionState = 'idle' | 'hovered' | 'focused' | 'selected';

export type RiverRegionId = 'upper' | 'middle' | 'lower';

export type YellowRiverRegionId = RiverRegionId;

export type YangtzeRiverRegionId = RiverRegionId;

export type YellowRiverNodeType = 'ecological' | 'engineering';

export type YellowRiverNodeId =
  | 'sanjiangyuan'
  | 'loess-plateau'
  | 'sediment-corridor'
  | 'longyangxia'
  | 'sanmenxia'
  | 'xiaolangdi'
  | 'yellow-river-delta-wetland';

export interface YellowRiverMapPosition {
  x: number;
  y: number;
  labelOffsetX?: number;
  labelOffsetY?: number;
}

export type RiverNodeType = 'ecological' | 'engineering';

/** 节点媒体保持为可选配置，素材可在后续按节点逐步接入。 */
export interface RiverNodeVideo {
  title: string;
  description?: string;
  src?: string;
  poster?: string;
}

export interface RiverNodeMedia {
  video?: RiverNodeVideo;
}

export interface RiverNode {
  id: string;
  name: string;
  shortName: string;
  type: RiverNodeType;
  regionId: RiverRegionId;
  locationDescription?: string;
  summary?: string;
  keywords?: string[];
  significance?: string;
  problemDescription?: string;
  causes?: string[];
  governanceMeasures?: string[];
  ecologicalImpacts?: string[];
  culturalMeaning?: string;
  media?: RiverNodeMedia;
  position: YellowRiverMapPosition;
  isAvailable: boolean;
}

export type YellowRiverNode = RiverNode & {
  id: YellowRiverNodeId;
  /** 沿河叙事顺序；详情切换与无障碍阅读不依赖画布横向坐标。 */
  sequence: number;
};

export type YangtzeRiverNode = RiverNode & {
  /** 沿江叙事顺序；详情切换与阅读顺序不依赖画布横向坐标。 */
  sequence: number;
};

export interface BasinOverviewItem {
  id: BasinId;
  name: string;
  englishName: string;
  route: string;
  description: string;
  themeClassName: string;
  isAvailable: boolean;
}

export interface BasinDetailConfig {
  id: BasinId;
  title: string;
  subtitle: string;
  description: string;
  themeClassName: string;
}

export interface RiverRegion {
  id: RiverRegionId;
  name: string;
  shortName: string;
  metaphor: string;
  coreQuestion: string;
  functionDescription: string;
  overview: string;
  ecologicalProcesses: string[];
  majorProblems: string[];
  governanceFocus: string;
  summary: string;
  themeClassName: string;
}

export type YellowRiverRegion = RiverRegion;

export type YangtzeRiverRegion = RiverRegion;
