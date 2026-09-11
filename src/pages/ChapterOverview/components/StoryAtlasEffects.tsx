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
    return {
      path: `C ${firstControl.x} ${firstControl.y}, ${secondControl.x} ${secondControl.y}, ${thirdControl.x} ${thirdControl.y} S ${point.x} ${point.y}, ${point.x} ${point.y}`,
    };
}

function StoryAtlasEffects({ chapters, activeChapterId }: StoryAtlasEffectsProps) {
  const desktopPoints = chapters.map(getDesktopPoint);
  const mobilePoints = chapters.map(getMobilePoint);
  const desktopSegments = desktopPoints.slice(1).map((point, index) => getRouteSegment(desktopPoints[index], point, index + 1));
  const mobileSegments = mobilePoints.slice(1).map((point, index) => getRouteSegment(mobilePoints[index], point, index + 1));
  const desktopPath = desktopPoints.length === 0 ? '' : [`M ${desktopPoints[0].x} ${desktopPoints[0].y}`, ...desktopSegments.map((segment) => segment.path)].join(' ');
  const mobilePath = mobilePoints.length === 0 ? '' : [`M ${mobilePoints[0].x} ${mobilePoints[0].y}`, ...mobileSegments.map((segment) => segment.path)].join(' ');
  const activeChapter = chapters.find((chapter) => chapter.id === activeChapterId) ?? null;
  const activeIndex = activeChapter === null ? -1 : chapters.findIndex((chapter) => chapter.id === activeChapter.id);
  // A chapter's immediate waterway is the segment leading into it; for the
  // first source marker, illuminate the segment flowing away from the source.
  const highlightedSegmentIndex = activeIndex <= 0 ? 0 : activeIndex - 1;

  return (
    <div className="story-atlas-effects" aria-hidden="true">
      <svg className="story-atlas-effects__route" viewBox="0 0 100 100" preserveAspectRatio="none">
        <path className="story-atlas-effects__route-base" d={desktopPath} />
        <path className="story-atlas-effects__route-flow story-atlas-effects__route-flow--ambient" d={desktopPath} />
        <path className="story-atlas-effects__route-base story-atlas-effects__route-base--mobile" d={mobilePath} />
        <path className="story-atlas-effects__route-flow story-atlas-effects__route-flow--ambient story-atlas-effects__route-flow--mobile" d={mobilePath} />
        {activeIndex >= 0 && desktopSegments[highlightedSegmentIndex] !== undefined && <path className="story-atlas-effects__route-flow story-atlas-effects__route-flow--active" d={`M ${desktopPoints[highlightedSegmentIndex].x} ${desktopPoints[highlightedSegmentIndex].y} ${desktopSegments[highlightedSegmentIndex].path}`} />}
        {activeIndex >= 0 && mobileSegments[highlightedSegmentIndex] !== undefined && <path className="story-atlas-effects__route-flow story-atlas-effects__route-flow--active story-atlas-effects__route-flow--mobile" d={`M ${mobilePoints[highlightedSegmentIndex].x} ${mobilePoints[highlightedSegmentIndex].y} ${mobileSegments[highlightedSegmentIndex].path}`} />}
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
