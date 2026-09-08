import { getFirstMediaUrl, getReleaseMediaUrl } from '@/lib/media';

const introPosterFiles = import.meta.glob('/src/assets/videos/chapter-one-intro/intro-poster.{webp,png,jpg,jpeg}', {
  eager: true,
  import: 'default',
  query: '?url',
});

const introStillFiles = import.meta.glob('/src/assets/videos/chapter-one-intro/intro-still.{webp,png,jpg,jpeg}', {
  eager: true,
  import: 'default',
  query: '?url',
});

export const chapterOneIntroVideoSource = getReleaseMediaUrl('chapter-one-intro.mp4');
export const chapterOneIntroPosterSource = getFirstMediaUrl(introPosterFiles);
export const chapterOneIntroStillSource = getFirstMediaUrl(introStillFiles);

export function getChapterOneStoryVideoSource(memoryId: 1 | 2 | 3): string {
  return getReleaseMediaUrl(`memory-${memoryId}.mp4`);
}
