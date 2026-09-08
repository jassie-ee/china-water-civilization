import type { ChapterId, ChapterOverviewItem } from '@/types/chapter';

import './StoryAtlasEffects.css';

interface StoryAtlasEffectsProps {
  chapters: ChapterOverviewItem[];
  activeChapterId: ChapterId | null;
}

interface AtlasPoint {
  x: number;
  y: number;
}

interface RouteSegment {
  path: string;
  boat: AtlasPoint & { rotation: number };
}

interface RouteGeometry {
  boats: Array<AtlasPoint & { rotation: number }>;
  path: string;
}

function getDesktopPoint(chapter: ChapterOverviewItem): AtlasPoint {
  return { x: chapter.marker.x, y: chapter.marker.y };
}

function getMobilePoint(chapter: ChapterOverviewItem): AtlasPoint {
  return { x: chapter.marker.mobileX, y: chapter.marker.mobileY };
}

function getRouteSegment(previousPoint: AtlasPoint, point: AtlasPoint, index: number): RouteSegment {
    const deltaX = point.x - previousPoint.x;
    const deltaY = point.y - previousPoint.y;
    const distance = Math.hypot(deltaX, deltaY) || 1;
    const normalX = -deltaY / distance;
    const normalY = deltaX / distance;
    const bendDirection = index % 2 === 0 ? 1 : -1;
    const firstBend = 4.8 * bendDirection;
    const secondBend = -3.6 * bendDirection;
    const firstControl = {
      x: previousPoint.x + deltaX * .25 + normalX * firstBend,
      y: previousPoint.y + deltaY * .25 + normalY * firstBend,
    };
    const secondControl = {
      x: previousPoint.x + deltaX * .62 + normalX * secondBend,
      y: previousPoint.y + deltaY * .62 + normalY * secondBend,
    };
    const thirdControl = {
      x: previousPoint.x + deltaX * .82 + normalX * firstBend * .72,
      y: previousPoint.y + deltaY * .82 + normalY * firstBend * .72,
    };
    const boatT = .55;
    const boatPosition = cubicPoint(previousPoint, firstControl, secondControl, thirdControl, boatT);
    const boatTangent = cubicTangent(previousPoint, firstControl, secondControl, thirdControl, boatT);

    return {
      path: `C ${firstControl.x} ${firstControl.y}, ${secondControl.x} ${secondControl.y}, ${thirdControl.x} ${thirdControl.y} S ${point.x} ${point.y}, ${point.x} ${point.y}`,
      boat: {
        ...boatPosition,
        rotation: Math.atan2(boatTangent.y, boatTangent.x) * (180 / Math.PI),
      },
    };
}

function cubicPoint(start: AtlasPoint, firstControl: AtlasPoint, secondControl: AtlasPoint, end: AtlasPoint, t: number): AtlasPoint {
  const inverseT = 1 - t;
  return {
    x: inverseT ** 3 * start.x
      + 3 * inverseT ** 2 * t * firstControl.x
      + 3 * inverseT * t ** 2 * secondControl.x
      + t ** 3 * end.x,
    y: inverseT ** 3 * start.y
      + 3 * inverseT ** 2 * t * firstControl.y
      + 3 * inverseT * t ** 2 * secondControl.y
      + t ** 3 * end.y,
  };
}

function cubicTangent(start: AtlasPoint, firstControl: AtlasPoint, secondControl: AtlasPoint, end: AtlasPoint, t: number): AtlasPoint {
  const inverseT = 1 - t;
  return {
    x: 3 * inverseT ** 2 * (firstControl.x - start.x)
      + 6 * inverseT * t * (secondControl.x - firstControl.x)
      + 3 * t ** 2 * (end.x - secondControl.x),
    y: 3 * inverseT ** 2 * (firstControl.y - start.y)
      + 6 * inverseT * t * (secondControl.y - firstControl.y)
      + 3 * t ** 2 * (end.y - secondControl.y),
  };
}

function createRouteGeometry(points: AtlasPoint[]): RouteGeometry {
  const segments = points.slice(1).map((point, index) => getRouteSegment(points[index], point, index + 1));

  return {
    boats: segments.map((segment) => segment.boat),
    path: points.length === 0
      ? ''
      : [`M ${points[0].x} ${points[0].y}`, ...segments.map((segment) => segment.path)].join(' '),
  };
}

interface StoryAtlasBoatProps {
  boat: AtlasPoint & { rotation: number };
  index: number;
  mobile?: boolean;
}

function StoryAtlasBoat({ boat, index, mobile = false }: StoryAtlasBoatProps) {
  return (
    <g
      className={`story-atlas-effects__boat story-atlas-effects__boat--${mobile ? 'mobile' : 'desktop'} story-atlas-effects__boat--${index + 1}`}
      transform={`translate(${boat.x} ${boat.y}) rotate(${boat.rotation})`}
    >
      <g className="story-atlas-effects__boat-motion">
        <path className="story-atlas-effects__boat-hull" d="M -2.5 .35 Q 0 1.7 2.5 .35 L 1.8 1.2 Q 0 2.15 -1.8 1.2 Z" />
        <path className="story-atlas-effects__boat-mast" d="M -.15 -2.4 L -.15 .75" />
        <path className="story-atlas-effects__boat-sail" d="M .05 -2.15 L 1.8 .38 L .05 .38 Z" />
        <path className="story-atlas-effects__boat-sail story-atlas-effects__boat-sail--small" d="M -.25 -1.55 L -1.45 .28 L -.25 .28 Z" />
      </g>
    </g>
  );
}

function StoryAtlasEffects({ chapters, activeChapterId }: StoryAtlasEffectsProps) {
  const desktopRoute = createRouteGeometry(chapters.map(getDesktopPoint));
  const mobileRoute = createRouteGeometry(chapters.map(getMobilePoint));
  const activeChapter = chapters.find((chapter) => chapter.id === activeChapterId) ?? null;

  return (
    <div className="story-atlas-effects" aria-hidden="true">
      <svg className="story-atlas-effects__route" viewBox="0 0 100 100" preserveAspectRatio="none">
        <path className="story-atlas-effects__route-base" d={desktopRoute.path} />
        <path className="story-atlas-effects__route-flow" d={desktopRoute.path} />
        <path className="story-atlas-effects__route-base story-atlas-effects__route-base--mobile" d={mobileRoute.path} />
        <path className="story-atlas-effects__route-flow story-atlas-effects__route-flow--mobile" d={mobileRoute.path} />
        {desktopRoute.boats.map((boat, index) => <StoryAtlasBoat key={`desktop-boat-${index}`} boat={boat} index={index} />)}
        {mobileRoute.boats.map((boat, index) => <StoryAtlasBoat key={`mobile-boat-${index}`} boat={boat} index={index} mobile />)}
        {activeChapter !== null && (
          <>
            <circle className="story-atlas-effects__active-glow" cx={activeChapter.marker.x} cy={activeChapter.marker.y} r="3.4" />
            <circle className="story-atlas-effects__active-glow story-atlas-effects__active-glow--mobile" cx={activeChapter.marker.mobileX} cy={activeChapter.marker.mobileY} r="3.4" />
          </>
        )}
      </svg>
    </div>
  );
}

export default StoryAtlasEffects;
