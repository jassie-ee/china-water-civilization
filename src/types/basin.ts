export type BasinId = 'yellow-river' | 'yangtze-river';

export type BasinOverviewPhase =
  | 'map-entering'
  | 'drop-landing'
  | 'source-rippling'
  | 'rivers-awakening'
  | 'interactive';

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
