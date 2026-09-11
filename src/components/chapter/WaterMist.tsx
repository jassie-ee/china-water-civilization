import { useEffect, useRef, type MouseEvent, type ReactNode } from 'react';

import usePrefersReducedMotion from '@/hooks/usePrefersReducedMotion';

import './library-motion.css';

interface MistPulse {
  startTime: number;
  x: number;
  y: number;
}

interface WaterMistProps {
  children: ReactNode;
  className?: string;
  disabled?: boolean;
  duration?: number;
  mistColor?: string;
  puffCount?: number;
  rippleColor?: string;
  rippleCount?: number;
  rippleRadius?: number;
}

/**
 * Local, dependency-free adaptation of the library's fluid interaction idea.
 * References: React Bits Free SplashCursor and RippleDistortion.
 * The full-screen/WebGL implementations are intentionally reduced to a local
 * 2D canvas pulse for chapter surfaces, so the effect stays quiet and scoped.
 * License reference: MIT + Commons Clause (see the local React Bits LICENSE.md).
 */

function colorToRgba(color: string, alpha: number): string {
  const clean = color.trim().replace('#', '');
  const expanded = clean.length === 3
    ? clean.split('').map((part) => `${part}${part}`).join('')
    : clean;

  if (!/^[0-9a-f]{6}$/i.test(expanded)) return `rgba(255, 255, 255, ${alpha})`;

  const value = Number.parseInt(expanded, 16);
  return `rgba(${(value >> 16) & 255}, ${(value >> 8) & 255}, ${value & 255}, ${alpha})`;
}

function easeOut(progress: number): number {
  return progress * (2 - progress);
}

function WaterMist({
  children,
  className = '',
  disabled = false,
  duration = 760,
  mistColor = '#b8d8c9',
  puffCount = 6,
  rippleColor = '#b8d8c9',
  rippleCount = 3,
  rippleRadius = 28,
}: WaterMistProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pulsesRef = useRef<MistPulse[]>([]);
  const scheduleFrameRef = useRef<(() => void) | null>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    const parent = canvas?.parentElement;
    if (!canvas || !parent) return undefined;

    const context = canvas.getContext('2d');
    if (!context) return undefined;

    let animationFrame: number | null = null;
    let resizeTimeout: number | null = null;
    let width = 1;
    let height = 1;
    const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);

    const resizeCanvas = (): void => {
      const bounds = parent.getBoundingClientRect();
      width = Math.max(1, bounds.width);
      height = Math.max(1, bounds.height);
      canvas.width = Math.round(width * pixelRatio);
      canvas.height = Math.round(height * pixelRatio);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    };

    const draw = (timestamp: number): void => {
      context.clearRect(0, 0, width, height);
      const nextPulses = pulsesRef.current.filter((pulse) => {
        const progress = Math.min(1, (timestamp - pulse.startTime) / duration);
        if (progress >= 1) return false;

        const fade = 1 - progress;
        const mistProgress = easeOut(Math.min(1, progress / 0.72));

        const washRadius = 7 + mistProgress * 16;
        const wash = context.createRadialGradient(pulse.x, pulse.y, 0, pulse.x, pulse.y, washRadius);
        wash.addColorStop(0, colorToRgba(mistColor, 0.22 * fade));
        wash.addColorStop(0.52, colorToRgba(mistColor, 0.11 * fade));
        wash.addColorStop(1, colorToRgba(mistColor, 0));
        context.fillStyle = wash;
        context.beginPath();
        context.arc(pulse.x, pulse.y, washRadius, 0, Math.PI * 2);
        context.fill();

        for (let puffIndex = 0; puffIndex < puffCount; puffIndex += 1) {
          const angle = (Math.PI * 2 * puffIndex) / puffCount - 0.35;
          const drift = 3 + mistProgress * (8 + (puffIndex % 2) * 3);
          const puffX = pulse.x + Math.cos(angle) * drift;
          const puffY = pulse.y + Math.sin(angle) * drift * 0.58;
          const puffWidth = 5 + mistProgress * (7 + (puffIndex % 3));
          const puffHeight = puffWidth * (0.42 + (puffIndex % 2) * 0.08);
          const puff = context.createRadialGradient(puffX, puffY, 0, puffX, puffY, puffWidth);

          context.save();
          context.globalAlpha = fade * (0.76 - puffIndex * 0.055);
          context.filter = `blur(${Math.round(3 + mistProgress * 3)}px)`;
          puff.addColorStop(0, colorToRgba(mistColor, 0.38));
          puff.addColorStop(0.62, colorToRgba(mistColor, 0.14));
          puff.addColorStop(1, colorToRgba(mistColor, 0));
          context.fillStyle = puff;
          context.beginPath();
          context.ellipse(puffX, puffY, puffWidth, puffHeight, angle, 0, Math.PI * 2);
          context.fill();
          context.restore();
        }

        for (let rippleIndex = 0; rippleIndex < rippleCount; rippleIndex += 1) {
          const delay = rippleIndex * 0.12;
          const rippleProgress = Math.max(0, Math.min(1, (progress - delay) / (1 - delay)));
          if (rippleProgress === 0) continue;

          const radius = 4 + rippleProgress * rippleRadius;
          context.save();
          context.globalAlpha = (1 - rippleProgress) * (0.32 - rippleIndex * 0.07);
          context.strokeStyle = rippleColor;
          context.lineWidth = 1;
          context.filter = 'blur(.25px)';
          context.beginPath();
          context.ellipse(
            pulse.x,
            pulse.y,
            radius,
            radius * (0.42 + rippleIndex * 0.045),
            -0.1 + rippleIndex * 0.08,
            0,
            Math.PI * 2,
          );
          context.stroke();
          context.restore();
        }

        return true;
      });

      pulsesRef.current = nextPulses;
      if (nextPulses.length > 0) {
        animationFrame = window.requestAnimationFrame(draw);
      } else {
        animationFrame = null;
      }
    };

    scheduleFrameRef.current = () => {
      if (animationFrame === null) animationFrame = window.requestAnimationFrame(draw);
    };

    const handleResize = (): void => {
      if (resizeTimeout !== null) window.clearTimeout(resizeTimeout);
      resizeTimeout = window.setTimeout(resizeCanvas, 80);
    };

    const resizeObserver = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(handleResize);
    resizeObserver?.observe(parent);
    resizeCanvas();

    return () => {
      resizeObserver?.disconnect();
      if (resizeTimeout !== null) window.clearTimeout(resizeTimeout);
      if (animationFrame !== null) window.cancelAnimationFrame(animationFrame);
      scheduleFrameRef.current = null;
      pulsesRef.current = [];
    };
  }, [duration, mistColor, puffCount, rippleColor, rippleCount, rippleRadius]);

  const handleClick = (event: MouseEvent<HTMLDivElement>): void => {
    if (disabled || prefersReducedMotion) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const bounds = canvas.getBoundingClientRect();
    pulsesRef.current = [
      ...pulsesRef.current.slice(-2),
      {
        startTime: performance.now(),
        x: event.clientX - bounds.left,
        y: event.clientY - bounds.top,
      },
    ];
    scheduleFrameRef.current?.();
  };

  return (
    <div className={`chapter-water-mist${className === '' ? '' : ` ${className}`}`} onClick={handleClick}>
      <canvas className="chapter-water-mist__canvas" ref={canvasRef} aria-hidden="true" />
      <div className="chapter-water-mist__content">{children}</div>
    </div>
  );
}

export default WaterMist;
