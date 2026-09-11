import chapterOneIntro from './chapter-one-intro/chapter-one-intro.mp4';
import chapterTwoIntro from './chapter-two-intro/chapter-two-intro.mp4';
import memory1 from './chapter-one-stories/memory-1.mp4';
import memory2 from './chapter-one-stories/memory-2.mp4';
import memory3 from './chapter-one-stories/memory-3.mp4';
import siteIntro from './intro/site-intro.mp4';
import changjiang1 from './yangtze/changjiang-1.mp4';
import sanxia from './yangtze/sanxia.mp4';
import loessPlateauIntro from './yellow-river/loess-plateau-intro.mp4';
import xiaolangdi from './yellow-river/xiaolangdi.mp4';

export const localVideoAssets: Record<string, string> = {
  'site-intro.mp4': siteIntro,
  'chapter-one-intro.mp4': chapterOneIntro,
  'chapter-two-intro.mp4': chapterTwoIntro,
  'memory-1.mp4': memory1,
  'memory-2.mp4': memory2,
  'memory-3.mp4': memory3,
  'loess-plateau-intro.mp4': loessPlateauIntro,
  'xiaolangdi.mp4': xiaolangdi,
  'changjiang-1.mp4': changjiang1,
  'sanxia.mp4': sanxia,
};

export function getLocalVideoAssetUrl(filename: string): string | undefined {
  return localVideoAssets[filename];
}
