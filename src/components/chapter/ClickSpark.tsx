import { useEffect, useRef, type MouseEvent, type ReactNode } from 'react';

import usePrefersReducedMotion from '@/hooks/usePrefersReducedMotion';

import './library-motion.css';

/**
 * Adapted from React Bits Free Click Spark.
 * Source: .claude/skills/design-shared/component-library/sources/react-bits-free-sparse/src/ts-tailwind/Animations/ClickSpark/ClickSpark.tsx
 * License: MIT + Commons Clause (see the local React Bits LICENSE.md).
 * The canvas loop is idle until a real click occurs and respects reduced motion.
 */

interface Spark {
  angle: number;
  startTime: number;
  x: number;
  y: number;
}

interface ClickSparkProps {
  children: ReactNode;
  className?: string;
  disabled?: boolean;
  duration?: number;
  extraScale?: number;
  easing?: 'linear' | 'ease-in' | 'ease-out' | 'ease-in-out';
  sparkColor?: string;
  sparkCount?: number;
  sparkRadius?: number;
  sparkSize?: number;
}

function ClickSpark({
  children,
  className = '',
  disabled = false,
  duration = 420,
  extraScale = 1,
  easing = 'ease-out',
  sparkColor = '#fff1b2',
  sparkCount = 7,
  sparkRadius = 18,
  sparkSize = 6,
}: ClickSparkProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sparksRef = useRef<Spark[]>([]);
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

    const resizeCanvas = (): void => {
      const { width, height } = parent.getBoundingClientRect();
      canvas.width = Math.max(1, Math.round(width));
      canvas.height = Math.max(1, Math.round(height));
    };

    const ease = (progress: number): number => {
      if (easing === 'linear') return progress;
      if (easing === 'ease-in') return progress * progress;
      if (easing === 'ease-in-out') {
        return progress < 0.5
          ? 2 * progress * progress
          : -1 + (4 - 2 * progress) * progress;
      }
      return progress * (2 - progress);
    };

    const draw = (timestamp: number): void => {
      context.clearRect(0, 0, canvas.width, canvas.height);
      const nextSparks = sparksRef.current.filter((spark) => {
        const elapsed = timestamp - spark.startTime;
        if (elapsed >= duration) return false;

        const progress = Math.min(1, elapsed / duration);
        const eased = ease(progress);
        const distance = eased * sparkRadius * extraScale;
        const lineLength = sparkSize * (1 - eased);
        const directionX = Math.cos(spark.angle);
        const directionY = Math.sin(spark.angle);

        context.strokeStyle = sparkColor;
        context.lineWidth = 1.25;
        context.lineCap = 'round';
        context.beginPath();
        context.moveTo(spark.x + distance * directionX, spark.y + distance * directionY);
        context.lineTo(
          spark.x + (distance + lineLength) * directionX,
          spark.y + (distance + lineLength) * directionY,
        );
        context.stroke();
        return true;
      });

      sparksRef.current = nextSparks;
      if (nextSparks.length > 0) {
        animationFrame = window.requestAnimationFrame(draw);
      } else {
        animationFrame = null;
      }
    };

    scheduleFrameRef.current = () => {
      if (animationFrame === null) {
        animationFrame = window.requestAnimationFrame(draw);
      }
    };

    const handleResize = (): void => {
      if (resizeTimeout !== null) window.clearTimeout(resizeTimeout);
      resizeTimeout = window.setTimeout(resizeCanvas, 80);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(parent);
    resizeCanvas();

    return () => {
      resizeObserver.disconnect();
      if (resizeTimeout !== null) window.clearTimeout(resizeTimeout);
      if (animationFrame !== null) window.cancelAnimationFrame(animationFrame);
      scheduleFrameRef.current = null;
      sparksRef.current = [];
    };
  }, [duration, easing, extraScale, sparkColor, sparkRadius, sparkSize]);

  const handleClick = (event: MouseEvent<HTMLDivElement>): void => {
    if (disabled || prefersReducedMotion) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const now = performance.now();

    sparksRef.current.push(...Array.from({ length: sparkCount }, (_, index) => ({
      angle: (2 * Math.PI * index) / sparkCount,
      startTime: now,
      x,
      y,
    })));
    scheduleFrameRef.current?.();
  };

  return (
    <div className={`chapter-click-spark${className === '' ? '' : ` ${className}`}`} onClick={handleClick}>
      <canvas className="chapter-click-spark__canvas" ref={canvasRef} aria-hidden="true" />
      <div className="chapter-click-spark__content">{children}</div>
    </div>
  );
}

export default ClickSpark;
