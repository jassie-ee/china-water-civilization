import type { LanFootingSceneId } from './lanMascotScenes';

export interface LanFootingConfig {
  pageId: string;
  routePath?: string;
  sceneId: LanFootingSceneId;
}

export interface LanFootingRecord {
  config: LanFootingConfig;
}
