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
      <Link className="basin-overview-header__home-link" to="/chapters">返回章节总览</Link>
      <div className="basin-overview-header__title">
        <p>第二章 · 治</p>
        <h1 ref={headingRef} tabIndex={-1}>现代江河治理</h1>
        <span>因地制宜</span>
      </div>
    </header>
  );
}

export default BasinOverviewHeader;
