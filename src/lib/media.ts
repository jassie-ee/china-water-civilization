export function getFirstMediaUrl(files: Record<string, unknown>): string | undefined {
  return Object.values(files).find((file): file is string => typeof file === 'string');
}

const defaultReleaseAssetBase =
  'https://github.com/jassie-ee/china-water-civilization/releases/download/video-assets';

/** 本地打包视频缺失时，从发布资源读取对应素材。 */
export function getReleaseMediaUrl(filename: string): string {
  const base = (import.meta.env.VITE_VIDEO_ASSET_BASE || defaultReleaseAssetBase).replace(/\/$/, '');
  return `${base}/${encodeURIComponent(filename)}`;
}

