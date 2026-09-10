import { Mesh, Program, Renderer, Triangle } from 'ogl';
import { useEffect, useRef, useState, type CSSProperties } from 'react';

import './GlowCursor.css';

const MAX_POINTS = 40;

const vertexShader = `
attribute vec2 position;
attribute vec2 uv;
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 0.0, 1.0);
}`;

const fragmentShader = `
precision highp float;
#define MAX_POINTS 40
uniform vec2 uResolution;
uniform vec2 uPoints[MAX_POINTS];
uniform float uPointCount;
uniform vec3 uColor;
uniform vec3 uSecondaryColor;
uniform float uTrailWidth;
uniform float uGlowIntensity;
uniform float uTaper;
uniform float uTime;
uniform float uFade;
varying vec2 vUv;

void main() {
  vec2 pixel = vUv * uResolution;
  float strongest = 0.0;
  float colorWeight = 0.0;
  vec3 colorSum = vec3(0.0);
  float denominator = max(uPointCount - 1.0, 1.0);

  for (int i = 0; i < MAX_POINTS - 1; i++) {
    float index = float(i);
    float active = 1.0 - step(uPointCount - 1.0, index);
    vec2 start = uPoints[i];
    vec2 end = uPoints[i + 1];
    vec2 segment = end - start;
    vec2 toPixel = pixel - start;
    float along = clamp(dot(toPixel, segment) / max(dot(segment, segment), 0.0001), 0.0, 1.0);
    float progress = clamp((index + along) / denominator, 0.0, 1.0);
    float life = pow(1.0 - progress, mix(0.7, 1.6, uTaper));
    float width = uTrailWidth * mix(1.0, 0.2, progress);
    float distanceToTrail = length(toPixel - segment * along);
    float core = exp(-pow(distanceToTrail / max(width, 0.5), 2.0) * 2.35);
    float halo = (width * width * 4.0) / (distanceToTrail * distanceToTrail + width * width * 4.0);
    float pulse = 0.94 + sin(uTime * 2.7 - progress * 10.0) * 0.06;
    float intensity = (core + halo * uGlowIntensity * 0.42) * life * pulse * active;
    vec3 segmentColor = mix(uColor, uSecondaryColor, progress);
    strongest = max(strongest, intensity);
    colorSum += segmentColor * intensity;
    colorWeight += intensity;
  }

  float alpha = clamp(strongest * uFade, 0.0, 0.88);
  if (alpha < 0.002) discard;
  vec3 color = colorSum / max(colorWeight, 0.0001);
  color = mix(color, vec3(1.0), smoothstep(0.45, 1.0, strongest) * 0.38);
  gl_FragColor = vec4(color, alpha);
}`;

interface GlowCursorProps {
  color?: string;
  secondaryColor?: string;
  trailLength?: number;
  trailWidth?: number;
  trailTaper?: number;
  followSpeed?: number;
  glowIntensity?: number;
  idleTimeout?: number;
  fadeDuration?: number;
  maxDevicePixelRatio?: number;
  className?: string;
  style?: CSSProperties;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function hexToRgb(hex: string): number[] {
  const value = hex.replace('#', '').trim();
  const normalized = value.length === 3 ? value.split('').map((character) => `${character}${character}`).join('') : value;
  const parsed = Number.parseInt(normalized || '000000', 16);
  return [((parsed >> 16) & 255) / 255, ((parsed >> 8) & 255) / 255, (parsed & 255) / 255];
}

/** 全局 WebGL 水光鼠标轨迹。仅在精确指针且未启用减少动态效果时渲染。 */
function GlowCursor({
  color = '#75dce7',
  secondaryColor = '#d6b86d',
  trailLength = 28,
  trailWidth = 7,
  trailTaper = .82,
  followSpeed = .17,
  glowIntensity = 1.25,
  idleTimeout = 520,
  fadeDuration = 620,
  maxDevicePixelRatio = 1.25,
  className = '',
  style,
}: GlowCursorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [isCanvasReady, setIsCanvasReady] = useState(false);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updatePreference = (): void => setPrefersReducedMotion(media.matches);
    updatePreference();
    media.addEventListener('change', updatePreference);
    return () => media.removeEventListener('change', updatePreference);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('glow-cursor-active', isCanvasReady);
    return () => document.documentElement.classList.remove('glow-cursor-active');
  }, [isCanvasReady]);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    setIsCanvasReady(false);
    if (prefersReducedMotion || container === null || canvas === null) return undefined;

    let renderer: Renderer;
    try {
      renderer = new Renderer({ canvas, alpha: true, dpr: Math.min(window.devicePixelRatio || 1, maxDevicePixelRatio) });
    } catch {
      return undefined;
    }
    renderer.gl.clearColor(0, 0, 0, 0);

    const pointData = new Float32Array(MAX_POINTS * 2);
    const points = Array.from({ length: MAX_POINTS }, () => ({ x: 0, y: 0 }));
    const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const head = { ...target };
    let initialized = false;
    let pointerInside = false;
    let lastInput = performance.now();
    let lastFrame = performance.now();
    let fade = 0;
    let animationFrame = 0;
    let disposed = false;

    const program = new Program(renderer.gl, {
      vertex: vertexShader,
      fragment: fragmentShader,
      uniforms: {
        uResolution: { value: [1, 1] },
        uPoints: { value: pointData },
        uPointCount: { value: clamp(Math.round(trailLength), 2, MAX_POINTS) },
        uColor: { value: hexToRgb(color) },
        uSecondaryColor: { value: hexToRgb(secondaryColor) },
        uTrailWidth: { value: trailWidth },
        uGlowIntensity: { value: glowIntensity },
        uTaper: { value: trailTaper },
        uTime: { value: 0 },
        uFade: { value: 0 },
      },
      transparent: true,
      depthTest: false,
      depthWrite: false,
    });
    const mesh = new Mesh(renderer.gl, { geometry: new Triangle(renderer.gl), program });
    setIsCanvasReady(true);

    const resize = (): void => {
      const width = Math.max(container.clientWidth, 1);
      const height = Math.max(container.clientHeight, 1);
      renderer.setSize(width, height);
      program.uniforms.uResolution.value = [width, height];
    };
    const initialize = (x: number, y: number): void => {
      target.x = x;
      target.y = y;
      head.x = x;
      head.y = y;
      points.forEach((point) => { point.x = x; point.y = y; });
      initialized = true;
    };
    const handlePointerMove = (event: PointerEvent): void => {
      if (event.pointerType !== 'mouse' || document.body.classList.contains('chapter-intro-active')) return;
      if (!initialized) initialize(event.clientX, window.innerHeight - event.clientY);
      target.x = event.clientX;
      target.y = window.innerHeight - event.clientY;
      pointerInside = true;
      lastInput = performance.now();
    };
    const handlePointerLeave = (): void => {
      pointerInside = false;
      lastInput = performance.now();
    };
    const render = (now: number): void => {
      if (disposed) return;
      const delta = Math.min((now - lastFrame) / 16.667, 3);
      lastFrame = now;
      if (initialized) {
        const headEase = 1 - Math.pow(1 - clamp(followSpeed, .01, .99), delta);
        const tailEase = 1 - Math.pow(1 - clamp(.29 + followSpeed * .32, .1, .88), delta);
        head.x += (target.x - head.x) * headEase;
        head.y += (target.y - head.y) * headEase;
        points[0] = { ...head };
        for (let index = 1; index < MAX_POINTS; index += 1) {
          points[index].x += (points[index - 1].x - points[index].x) * tailEase;
          points[index].y += (points[index - 1].y - points[index].y) * tailEase;
        }
        points.forEach((point, index) => { pointData[index * 2] = point.x; pointData[index * 2 + 1] = point.y; });
      }
      const idle = now - lastInput > idleTimeout || !pointerInside;
      fade += ((initialized && !idle ? 1 : 0) - fade) * Math.min(1, (16.667 * delta / Math.max(fadeDuration, 16)) * 7);
      program.uniforms.uTime.value = now * .001;
      program.uniforms.uFade.value = fade;
      renderer.render({ scene: mesh });
      animationFrame = requestAnimationFrame(render);
    };

    const observer = new ResizeObserver(resize);
    observer.observe(container);
    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    document.documentElement.addEventListener('mouseleave', handlePointerLeave);
    resize();
    animationFrame = requestAnimationFrame(render);

    return () => {
      disposed = true;
      cancelAnimationFrame(animationFrame);
      observer.disconnect();
      window.removeEventListener('pointermove', handlePointerMove);
      document.documentElement.removeEventListener('mouseleave', handlePointerLeave);
      mesh.geometry.remove();
      program.remove();
    };
  }, [color, fadeDuration, followSpeed, glowIntensity, idleTimeout, maxDevicePixelRatio, prefersReducedMotion, secondaryColor, trailLength, trailTaper, trailWidth]);

  if (prefersReducedMotion) return null;
  return <div ref={containerRef} className={`glow-cursor${isCanvasReady ? ' glow-cursor--ready' : ''}${className ? ` ${className}` : ''}`} style={style} aria-hidden="true"><canvas ref={canvasRef} className="glow-cursor__canvas" /></div>;
}

export default GlowCursor;
