import type { CSSProperties, ReactNode } from 'react';

import defaultBackground from '@/assets/images/shared/river-story-surface.png';

import './RiverNarrativeSurface.css';

interface RiverNarrativeSurfaceProps {
  children: ReactNode;
  className?: string;
  /** 可传入其他导入后的图片；未传时统一使用流域叙事底图。 */
  backgroundImage?: string;
}

/**
 * 可复用的流域内容底板。
 *
 * 统一承载节点介绍、治理闯关及未来珠江等流域页面的背景；如需替换默认底图，
 * 仅替换 shared/river-story-surface.png，或在单个页面传入 backgroundImage 即可。
 */
function RiverNarrativeSurface({ children, className = '', backgroundImage = defaultBackground }: RiverNarrativeSurfaceProps) {
  const style = {
    '--river-narrative-surface-image': `url("${backgroundImage}")`,
  } as CSSProperties;

  return (
    <div className={`river-narrative-surface ${className}`.trim()} style={style}>
      <div className="river-narrative-surface__content">{children}</div>
    </div>
  );
}

export default RiverNarrativeSurface;
