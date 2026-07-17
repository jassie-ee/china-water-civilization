import { useEffect, useRef } from 'react';

interface BasinOverviewHeaderProps {
  shouldFocus: boolean;
}

function BasinOverviewHeader({ shouldFocus }: BasinOverviewHeaderProps) {
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (shouldFocus) {
      headingRef.current?.focus();
    }
  }, [shouldFocus]);

  return (
    <header className="basin-overview-header">
      <p className="basin-overview-header__eyebrow">中国流域总览</p>
      <h1 ref={headingRef} tabIndex={-1}>一滴水，唤醒万里江河</h1>
      <p>水从世界屋脊出发，穿越高原、峡谷、平原与城市，孕育不同的流域文明。</p>
    </header>
  );
}

export default BasinOverviewHeader;
