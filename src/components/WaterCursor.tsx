import { useEffect, useRef } from 'react';

import './WaterCursor.css';

const CLICK_BUFFER_DURATION_MS = 120;

function isEditableTarget(target: Element): boolean {
  return target.closest('input, textarea, select, [contenteditable="true"]') !== null;
}

function isNativeMediaPage(): boolean {
  return document.body.classList.contains('chapter-one-intro-active');
}

/** 全局微交互：点击立刻出现涟漪，再短暂延后原本的鼠标或触摸点击。 */
function WaterCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const rippleLayerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cursorElement = cursorRef.current;
    const rippleLayer = rippleLayerRef.current;
    let pendingPointer: { pointerId: number; target: Element } | null = null;
    let isReplayingClick = false;

    const createRipple = (x: number, y: number): void => {
      if (rippleLayer === null) return;

      const ripple = document.createElement('span');
      ripple.className = 'water-cursor__ripple';
      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;
      for (let index = 0; index < 3; index += 1) {
        ripple.append(document.createElement('i'));
      }
      rippleLayer.append(ripple);
      ripple.addEventListener('animationend', (animationEvent) => {
        if (animationEvent.target === ripple) ripple.remove();
      });
    };

    const handlePointerMove = (event: PointerEvent): void => {
      if (event.pointerType !== 'mouse' || cursorElement === null || isNativeMediaPage()) return;

      cursorElement.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0) translate(-50%, -50%)`;
      cursorElement.style.opacity = '1';
    };

    const handlePointerLeave = (): void => {
      if (cursorElement !== null) cursorElement.style.opacity = '0';
    };

    const handlePointerDown = (event: PointerEvent): void => {
      if (isNativeMediaPage()) return;
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      if (!event.isPrimary || (event.pointerType !== 'touch' && event.button !== 0)) return;
      if (!(event.target instanceof Element) || isEditableTarget(event.target)) return;

      createRipple(event.clientX, event.clientY);
      pendingPointer = { pointerId: event.pointerId, target: event.target };
    };

    const handleClickCapture = (event: MouseEvent): void => {
      if (isNativeMediaPage()) return;
      if (isReplayingClick || pendingPointer === null || !(event.target instanceof Element)) return;
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

      const pendingTarget = pendingPointer.target;
      const clickedTarget = event.target;
      const isMatchingPointer = pendingTarget === clickedTarget
        || pendingTarget.contains(clickedTarget)
        || clickedTarget.contains(pendingTarget);
      if (!isMatchingPointer) return;

      pendingPointer = null;
      event.preventDefault();
      event.stopImmediatePropagation();

      const replayTarget = clickedTarget;
      const replayEventOptions: MouseEventInit = {
        bubbles: true,
        cancelable: true,
        composed: true,
        button: event.button,
        buttons: event.buttons,
        clientX: event.clientX,
        clientY: event.clientY,
        ctrlKey: event.ctrlKey,
        metaKey: event.metaKey,
        shiftKey: event.shiftKey,
      };
      window.setTimeout(() => {
        isReplayingClick = true;
        replayTarget.dispatchEvent(new MouseEvent('click', replayEventOptions));
        isReplayingClick = false;
      }, CLICK_BUFFER_DURATION_MS);
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerdown', handlePointerDown, { passive: true });
    window.addEventListener('click', handleClickCapture, true);
    document.documentElement.addEventListener('mouseleave', handlePointerLeave);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('click', handleClickCapture, true);
      document.documentElement.removeEventListener('mouseleave', handlePointerLeave);
    };
  }, []);

  return (
    <div className="water-cursor" aria-hidden="true">
      <div ref={rippleLayerRef} className="water-cursor__ripple-layer" />
      <div ref={cursorRef} className="water-cursor__drop">
        <svg viewBox="0 0 36 46" focusable="false">
          <defs>
            <linearGradient id="water-cursor-fill" x1="7" y1="4" x2="29" y2="42" gradientUnits="userSpaceOnUse">
              <stop stopColor="#d9ffff" stopOpacity=".94" />
              <stop offset=".42" stopColor="#6bd4e5" stopOpacity=".82" />
              <stop offset="1" stopColor="#177caa" stopOpacity=".72" />
            </linearGradient>
          </defs>
          <path d="M18 2C14.4 9.3 5 18 5 28.2C5 36.3 10.8 42 18 42C25.2 42 31 36.3 31 28.2C31 18 21.6 9.3 18 2Z" fill="url(#water-cursor-fill)" />
          <path d="M13.1 11.3C10.4 15.3 8.5 20 8.5 24.3" fill="none" stroke="#efffff" strokeLinecap="round" strokeWidth="2.2" opacity=".76" />
        </svg>
      </div>
    </div>
  );
}

export default WaterCursor;
