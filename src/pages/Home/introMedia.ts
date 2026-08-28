/**
 * Vite 会在构建时自动发现 intro 目录中的媒体文件。
 * 将 intro.mp4 与 intro-poster.webp（或 .png）放入该目录后无需再修改组件导入。
 */
const videoFiles = import.meta.glob('/src/assets/videos/intro/intro.{mp4,webm}', {
  eager: true,
  import: 'default',
  query: '?url',
});

const posterFiles = import.meta.glob('/src/assets/videos/intro/intro-poster.{webp,png,jpg,jpeg}', {
  eager: true,
  import: 'default',
  query: '?url',
});

function getFirstMediaUrl(files: Record<string, unknown>): string | undefined {
  return Object.values(files).find((file): file is string => typeof file === 'string');
}

const introVideoSource = getFirstMediaUrl(videoFiles);
const introPosterSource = getFirstMediaUrl(posterFiles);

export { introPosterSource, introVideoSource };
