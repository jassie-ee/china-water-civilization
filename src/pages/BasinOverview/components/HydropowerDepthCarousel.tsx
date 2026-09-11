import { useCallback, useEffect, useLayoutEffect, useRef, type ReactNode } from 'react';
import gsap from 'gsap';

import usePrefersReducedMotion from '@/hooks/usePrefersReducedMotion';

export interface HydropowerDepthItem { id: string; label: string; visual: ReactNode; }
interface HydropowerDepthCarouselProps { activeIndex: number; items: HydropowerDepthItem[]; onChange: (index: number) => void; }

function getSignedDistance(index: number, activeIndex: number, count: number): number {
  let distance = index - activeIndex;
  if (distance > count / 2) distance -= count;
  if (distance < -count / 2) distance += count;
  return distance;
}

function HydropowerDepthCarousel({ activeIndex, items, onChange }: HydropowerDepthCarouselProps) {
  const cardRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const reducedMotion = usePrefersReducedMotion();
  const count = items.length;
  const select = useCallback((index: number) => { if (count > 0) onChange((index + count) % count); }, [count, onChange]);

  useLayoutEffect(() => {
    cardRefs.current.forEach((card, index) => {
      if (card === null) return;
      const distance = getSignedDistance(index, activeIndex, count);
      const absoluteDistance = Math.abs(distance);
      const visible = absoluteDistance <= 1;
      gsap.killTweensOf(card);
      gsap.to(card, { x: distance * 94, z: -absoluteDistance * 150, rotationY: distance * -18, scale: absoluteDistance === 0 ? 1 : .86, opacity: visible ? (absoluteDistance === 0 ? 1 : .68) : 0, filter: absoluteDistance === 0 ? 'brightness(1)' : 'brightness(.66) blur(1.5px)', duration: reducedMotion ? 0 : .62, ease: 'power3.out', overwrite: true });
      card.style.pointerEvents = visible ? 'auto' : 'none';
      card.setAttribute('aria-hidden', String(index !== activeIndex));
    });
  }, [activeIndex, count, reducedMotion]);

  useEffect(() => () => { cardRefs.current.forEach((card) => { if (card !== null) gsap.killTweensOf(card); }); }, []);

  return <div className="hydropower-depth-carousel" role="group" aria-roledescription="carousel" aria-label="水电与储能知识章节" tabIndex={0} onKeyDown={(event) => {
    if (event.key === 'ArrowLeft') { event.preventDefault(); select(activeIndex - 1); }
    if (event.key === 'ArrowRight') { event.preventDefault(); select(activeIndex + 1); }
  }}>
    <div className="hydropower-depth-carousel__stage">
      {items.map((item, index) => <button key={item.id} ref={(element) => { cardRefs.current[index] = element; }} type="button" className={`hydropower-depth-carousel__card hydropower-depth-carousel__card--${item.id}${index === activeIndex ? ' is-active' : ''}`} aria-label={`阅读：${item.label}`} aria-pressed={index === activeIndex} onClick={() => select(index)}>
        <span className="hydropower-depth-carousel__card-number">0{index + 1}</span><span className="hydropower-depth-carousel__card-title">{item.label}</span>{item.visual}
      </button>)}
    </div>
    <button type="button" className="hydropower-depth-carousel__control hydropower-depth-carousel__control--previous" onClick={() => select(activeIndex - 1)} aria-label="上一章">‹</button>
    <button type="button" className="hydropower-depth-carousel__control hydropower-depth-carousel__control--next" onClick={() => select(activeIndex + 1)} aria-label="下一章">›</button>
    <div className="hydropower-depth-carousel__indicators" role="tablist" aria-label="知识章节">
      {items.map((item, index) => <button key={item.id} type="button" role="tab" aria-selected={index === activeIndex} aria-label={`切换到${item.label}`} className={index === activeIndex ? 'is-active' : ''} onClick={() => select(index)} />)}
    </div>
  </div>;
}

export default HydropowerDepthCarousel;
