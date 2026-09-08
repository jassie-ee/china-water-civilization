import { getFirstMediaUrl, getReleaseMediaUrl } from '@/lib/media';

/**
 * 原始视频由 GitHub Release 按需托管，静帧海报仍随网页代码发布。
 */
const posterFiles = import.meta.glob('/src/assets/videos/intro/intro-poster.{webp,png,jpg,jpeg}', {
  eager: true,
  import: 'default',
  query: '?url',
});

const introVideoSource = getReleaseMediaUrl('site-intro.mp4');
const introPosterSource = getFirstMediaUrl(posterFiles);

export { introPosterSource, introVideoSource };
