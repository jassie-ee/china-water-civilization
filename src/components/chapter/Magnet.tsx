import { useEffect, useRef, useState, type HTMLAttributes, type ReactNode } from 'react';

import usePrefersReducedMotion from '@/hooks/usePrefersReducedMotion';

import './library-motion.css';

/**
 * Adapted from React Bits Free Magnet.
 * Source: .claude/skills/design-shared/component-library/sources/react-bits-free-sparse/src/ts-tailwind/Animations/Magnet/Magnet.tsx
 * License: MIT + Commons Clause (see the local React Bits LICENSE.md).
 * The attraction is limited to primary actions and is disabled for coarse pointers/reduced motion.
 */

interface MagnetProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  activeTransition?: string;
  disabled?: boolean;
  inactiveTransition?: string;
  innerClassName?: string;
  magnetStrength?: number;
  padding?: number;
  wrapperClassName?: string;
}

function Magnet({
  children,
  activeTransition = 'transform 280ms cubic-bezier(.2, .75, .25, 1)',
  className = '',
  disabled = false,
  inactiveTransition = 'transform 420ms cubic-bezier(.45, 0, .55, 1)',
  innerClassName = '',
  magnetStrength = 4,
  padding = 48,
  style,
  wrapperClassName = '',
  ...props
}: MagnetProps) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const magnetRef = useRef<HTMLDivElement>(null);
  const [isActive, setIsActive] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (disabled || prefersReducedMotion || typeof window === 'undefined') {
      setIsActive(false);
      setPosition({ x: 0, y: 0 });
      return undefined;
    }

    if (!window.matchMedia('(pointer: fine)').matches) return undefined;

    const handleMouseMove = (event: MouseEvent): void => {
      const element = magnetRef.current;
      if (!element) return;

      const { left, top, width, height } = element.getBoundingClientRect();
      const centerX = left + width / 2;
      const centerY = top + height / 2;
      const distanceX = Math.abs(centerX - event.clientX);
      const distanceY = Math.abs(centerY - event.clientY);

      if (distanceX < width / 2 + padding && distanceY < height / 2 + padding) {
        setIsActive(true);
        setPosition({
          x: (event.clientX - centerX) / magnetStrength,
          y: (event.clientY - centerY) / magnetStrength,
        });
        return;
      }

      setIsActive(false);
      setPosition({ x: 0, y: 0 });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [disabled, magnetStrength, padding, prefersReducedMotion]);

  return (
    <div
      {...props}
      ref={magnetRef}
      className={`chapter-magnet${wrapperClassName === '' ? '' : ` ${wrapperClassName}`}${className === '' ? '' : ` ${className}`}`}
      style={{ display: 'inline-flex', position: 'relative', ...style }}
    >
      <div
        className={`chapter-magnet__inner${innerClassName === '' ? '' : ` ${innerClassName}`}`}
        style={{
          transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
          transition: isActive ? activeTransition : inactiveTransition,
          willChange: 'transform',
        }}
      >
        {children}
      </div>
    </div>
  );
}

export default Magnet;
