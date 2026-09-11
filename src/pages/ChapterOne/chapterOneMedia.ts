import { getFirstMediaUrl } from '@/lib/media';
import { localVideoAssets } from '@/assets/videos/mediaSources';

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

export const chapterOneIntroVideoSource = localVideoAssets['chapter-one-intro.mp4'];
export const chapterOneIntroPosterSource = getFirstMediaUrl(introPosterFiles);
export const chapterOneIntroStillSource = getFirstMediaUrl(introStillFiles);

export function getChapterOneStoryVideoSource(memoryId: 1 | 2 | 3): string {
  return localVideoAssets[`memory-${memoryId}.mp4`];
}
