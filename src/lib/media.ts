export function getFirstMediaUrl(files: Record<string, unknown>): string | undefined {
  return Object.values(files).find((file): file is string => typeof file === 'string');
}

const defaultReleaseAssetBase =
  'https://github.com/jassie-ee/china-water-civilization/releases/download/video-assets';

/**
 * 原始视频不进入 Git 仓库；生产环境从 GitHub Release 按需读取。
 * 可在 .env.local 通过 VITE_VIDEO_ASSET_BASE 覆盖为另一个 Release 标签或 CDN。
 */
export function getReleaseMediaUrl(filename: string): string {
  const base = (import.meta.env.VITE_VIDEO_ASSET_BASE || defaultReleaseAssetBase).replace(/\/$/, '');
  return `${base}/${encodeURIComponent(filename)}`;
}
