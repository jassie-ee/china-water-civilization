import type { BasinId } from '@/types/basin';

interface BasinAtlasPosition {
  x: number;
  y: number;
  mobileX: number;
  mobileY: number;
}

type AvailableBasinAtlasMarker = {
  id: BasinId;
  name: string;
  position: BasinAtlasPosition;
  isAvailable: true;
};

type UnavailableBasinAtlasMarker = {
  id: 'pearl-river';
  name: string;
  position: BasinAtlasPosition;
  isAvailable: false;
};

type BasinAtlasMarker = AvailableBasinAtlasMarker | UnavailableBasinAtlasMarker;

const basinAtlasMarkers: BasinAtlasMarker[] = [
  {
    id: 'yellow-river',
    name: '黄河',
    position: { x: 47, y: 36, mobileX: 38, mobileY: 36 },
    isAvailable: true,
  },
  {
    id: 'yangtze-river',
    name: '长江',
    position: { x: 51, y: 56, mobileX: 54, mobileY: 56 },
    isAvailable: true,
  },
  {
    id: 'pearl-river',
    name: '珠江',
    position: { x: 56, y: 75, mobileX: 73, mobileY: 75 },
    isAvailable: false,
  },
];

export { basinAtlasMarkers };
export type { BasinAtlasMarker };
