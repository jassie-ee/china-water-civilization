import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

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
      <Link className="basin-overview-header__home-link" to="/">返回主页</Link>
      <p className="basin-overview-header__eyebrow">中华水生态文明 · 首批开放流域</p>
      <h1 ref={headingRef} tabIndex={-1}>黄河与长江流域总览</h1>
      <p>水从世界屋脊出发，穿越高原、峡谷、平原与城市，孕育不同的流域文明。</p>
    </header>
  );
}

export default BasinOverviewHeader;
