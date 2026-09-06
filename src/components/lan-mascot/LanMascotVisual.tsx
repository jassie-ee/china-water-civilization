import type { CSSProperties } from 'react';

import happyFaceBase from '@/assets/images/lan/mascots/happy-face-base.png';

import type { LanMascotExpressionId } from './lanMascotExpressions';

interface LanMascotVisualProps {
  alt: string;
  expressionId: LanMascotExpressionId;
  spriteSrc: string;
  style: CSSProperties;
}

/**
 * 精灵的视觉渲染边界。
 *
 * 当前保留 PNG 渲染作为稳定降级；Live2D 模型交付后，只需要在这里接入
 * Cubism canvas，不必改动拖拽、对话框或页面注册逻辑。
 */
function LanMascotVisual({ alt, expressionId, spriteSrc, style }: LanMascotVisualProps) {
  if (expressionId === 'happy') {
    return (
      <span
        className="lan-mascot__visual lan-mascot__visual--layered"
        data-expression={expressionId}
        data-renderer="layered-preview"
        style={style}
      >
        <span className="lan-mascot__layered-model">
          <img className="lan-mascot__face-base" src={happyFaceBase} alt={alt} aria-hidden="true" draggable={false} />
          <img className="lan-mascot__face-layer lan-mascot__face-layer--eye-left" src={spriteSrc} alt="" aria-hidden="true" draggable={false} />
          <img className="lan-mascot__face-layer lan-mascot__face-layer--eye-right" src={spriteSrc} alt="" aria-hidden="true" draggable={false} />
          <img className="lan-mascot__face-layer lan-mascot__face-layer--mouth" src={spriteSrc} alt="" aria-hidden="true" draggable={false} />
        </span>
      </span>
    );
  }

  return (
    <span
      className="lan-mascot__visual"
      data-expression={expressionId}
      data-renderer="sprite"
      style={style}
    >
      <img
        className="lan-mascot__sprite"
        src={spriteSrc}
        alt={alt}
        aria-hidden="true"
        draggable={false}
      />
    </span>
  );
}

export default LanMascotVisual;
