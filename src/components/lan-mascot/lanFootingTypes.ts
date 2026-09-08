import type { LanFootingSceneId } from './lanMascotScenes';

export interface LanFootingConfig {
  pageId: string;
  routePath?: string;
  sceneId: LanFootingSceneId;
  visible?: boolean;
}

export interface LanFootingRecord {
  config: LanFootingConfig;
}
