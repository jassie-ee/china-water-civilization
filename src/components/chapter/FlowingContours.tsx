import { useEffect, useRef, type CSSProperties } from 'react';

import usePrefersReducedMotion from '@/hooks/usePrefersReducedMotion';

interface ContourPoint {
  x: number;
  baseY: number;
  phase: number;
  offsetY: number;
}

interface ContourLine {
  points: ContourPoint[];
  index: number;
}

interface PointerState {
  x: number;
  y: number;
  smoothX: number;
  smoothY: number;
  velocity: number;
  hasPosition: boolean;
}

interface FlowingContoursProps {
  amplitude?: number;
  className?: string;
  lineColor?: string;
  lineCount?: number;
  lineGap?: number;
  speed?: number;
  style?: CSSProperties;
}

/**
 * Local, dependency-free adaptation of React Bits Free Waves.
 * Source: .claude/skills/design-shared/component-library/sources/
 * react-bits-free-sparse/src/ts-tailwind/Backgrounds/Waves/Waves.tsx
 *
 * The original full-surface wave field is reduced to a few cartographic
 * contour lines so the chapter keeps its paper-map composition and remains
 * smooth without bringing in a WebGL runtime.
 */
function FlowingContours({
  amplitude = 9,
  className = '',
  lineColor = 'rgba(174, 211, 197, .15)',
  lineCount = 5,
  lineGap = 66,
  speed = 0.00042,
  style,
}: FlowingContoursProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
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
    const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5);
    const pointer: PointerState = {
      x: 0,
      y: 0,
      smoothX: 0,
      smoothY: 0,
      velocity: 0,
      hasPosition: false,
    };
    let lines: ContourLine[] = [];

    const resizeCanvas = (): void => {
      const bounds = parent.getBoundingClientRect();
      width = Math.max(1, bounds.width);
      height = Math.max(1, bounds.height);
      canvas.width = Math.round(width * pixelRatio);
      canvas.height = Math.round(height * pixelRatio);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

      const count = Math.max(3, lineCount);
      const spacing = Math.max(18, lineGap);
      const pointCount = Math.ceil((width + 80) / spacing) + 1;
      const top = height * 0.23;
      const usableHeight = Math.max(height * 0.52, spacing * (count - 1));

      lines = Array.from({ length: count }, (_, lineIndex) => {
        const baseY = top + (usableHeight / Math.max(1, count - 1)) * lineIndex;
        return {
          index: lineIndex,
          points: Array.from({ length: pointCount }, (_, pointIndex) => ({
            x: -40 + pointIndex * spacing,
            baseY,
            phase: lineIndex * 0.82 + pointIndex * 0.12,
            offsetY: 0,
          })),
        };
      });
    };

    const getField = (point: ContourPoint, lineIndex: number, timestamp: number): number => {
      const time = timestamp * speed;
      const broad = Math.sin(point.x * 0.009 + time + point.phase) * 0.68;
      const cross = Math.sin((point.x + point.baseY) * 0.004 - time * 0.62 + lineIndex) * 0.22;
      const returnFlow = Math.cos(point.x * 0.017 - time * 0.38 + lineIndex * 1.7) * 0.1;
      return broad + cross + returnFlow;
    };

    const draw = (timestamp: number): void => {
      context.clearRect(0, 0, width, height);
      pointer.smoothX += (pointer.x - pointer.smoothX) * 0.085;
      pointer.smoothY += (pointer.y - pointer.smoothY) * 0.085;
      pointer.velocity *= 0.92;

      lines.forEach((line) => {
        const points = line.points.map((point) => {
          const field = getField(point, line.index, prefersReducedMotion ? 0 : timestamp);
          const distance = Math.hypot(point.x - pointer.smoothX, point.baseY - pointer.smoothY);
          const influence = pointer.hasPosition ? Math.max(0, 1 - distance / 170) : 0;
          const pointerLift = Math.sin(distance * 0.035) * influence * Math.min(10, pointer.velocity * 0.8);
          const targetOffset = field * amplitude + pointerLift;
          point.offsetY += (targetOffset - point.offsetY) * 0.065;
          return { x: point.x, y: point.baseY + point.offsetY };
        });

        if (points.length < 2) return;

        context.save();
        context.globalAlpha = Math.max(0.2, 0.72 - line.index * 0.1);
        context.strokeStyle = lineColor;
        context.lineWidth = line.index === 2 ? 1.2 : 0.82;
        context.lineCap = 'round';
        context.lineJoin = 'round';
        context.beginPath();
        context.moveTo(points[0].x, points[0].y);

        for (let pointIndex = 1; pointIndex < points.length - 1; pointIndex += 1) {
          const point = points[pointIndex];
          const nextPoint = points[pointIndex + 1];
          const midX = (point.x + nextPoint.x) / 2;
          const midY = (point.y + nextPoint.y) / 2;
          context.quadraticCurveTo(point.x, point.y, midX, midY);
        }

        const lastPoint = points[points.length - 1];
        context.lineTo(lastPoint.x, lastPoint.y);
        context.stroke();
        context.restore();
      });

      if (!prefersReducedMotion) animationFrame = window.requestAnimationFrame(draw);
    };

    const handlePointerMove = (event: PointerEvent): void => {
      const bounds = canvas.getBoundingClientRect();
      const nextX = event.clientX - bounds.left;
      const nextY = event.clientY - bounds.top;
      const distance = Math.hypot(nextX - pointer.x, nextY - pointer.y);
      pointer.velocity += (Math.min(18, distance) - pointer.velocity) * 0.2;
      pointer.x = nextX;
      pointer.y = nextY;
      pointer.hasPosition = true;
    };

    const handleResize = (): void => {
      if (resizeTimeout !== null) window.clearTimeout(resizeTimeout);
      resizeTimeout = window.setTimeout(resizeCanvas, 80);
    };

    const resizeObserver = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(handleResize);
    resizeObserver?.observe(parent);
    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    resizeCanvas();
    draw(0);

    return () => {
      resizeObserver?.disconnect();
      window.removeEventListener('pointermove', handlePointerMove);
      if (resizeTimeout !== null) window.clearTimeout(resizeTimeout);
      if (animationFrame !== null) window.cancelAnimationFrame(animationFrame);
    };
  }, [amplitude, lineColor, lineCount, lineGap, prefersReducedMotion, speed]);

  return (
    <div className={`chapter-flowing-contours${className === '' ? '' : ` ${className}`}`} style={style} aria-hidden="true">
      <canvas className="chapter-flowing-contours__canvas" ref={canvasRef} />
    </div>
  );
}

export default FlowingContours;
