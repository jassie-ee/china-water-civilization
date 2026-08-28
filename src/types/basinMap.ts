import type { BasinId } from './basin';

/** 中国一级地图与其所有叠加层共享的坐标空间。 */
export interface MapViewBox {
  width: number;
  height: number;
}

/** 大型矢量几何保持为独立资产，避免把长路径堆入业务配置。 */
export interface BasinGeometryAssets {
  basinArea: string | null;
  mainRiver: string | null;
  interactionArea: string | null;
}

export interface BasinMapItem {
  id: BasinId;
  name: string;
  route: string;
  geometryAssets: BasinGeometryAssets;
  labelPosition: {
    x: number;
    y: number;
  };
  prompt: string;
}
