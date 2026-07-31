export type BasinId = 'yellow-river' | 'yangtze-river';

export type BasinOverviewPhase =
  | 'map-entering'
  | 'drop-landing'
  | 'source-rippling'
  | 'rivers-awakening'
  | 'interactive';

export type BasinOverviewEntry = 'intro' | 'skipped' | 'direct' | 'returning';

export type BasinInteractionState = 'idle' | 'hovered' | 'focused' | 'selected';

export type RiverRegionId = 'upper' | 'middle' | 'lower';

export type YellowRiverRegionId = RiverRegionId;

export type YangtzeRiverRegionId = RiverRegionId;

export type YellowRiverNodeType = 'ecological' | 'engineering';

export type YellowRiverNodeId =
  | 'source-ecology'
  | 'loess-plateau'
  | 'sediment-corridor'
  | 'longyangxia'
  | 'sanmenxia'
  | 'xiaolangdi'
  | 'zhengzhou-levee';

export interface YellowRiverMapPosition {
  x: number;
  y: number;
  labelOffsetX?: number;
  labelOffsetY?: number;
}

export type RiverNodeType = 'ecological' | 'engineering';

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
  position: YellowRiverMapPosition;
  isAvailable: boolean;
}

export type YellowRiverNode = RiverNode & { id: YellowRiverNodeId };

export type YangtzeRiverNode = RiverNode;

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
