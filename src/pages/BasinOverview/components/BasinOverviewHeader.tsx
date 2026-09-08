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
      <h1 ref={headingRef} className="sr-only" tabIndex={-1}>黄河、长江与珠江流域总览</h1>
    </header>
  );
}

export default BasinOverviewHeader;
