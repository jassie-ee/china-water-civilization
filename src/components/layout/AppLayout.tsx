import type { ReactNode } from 'react';

interface AppLayoutProps {
  children: ReactNode;
}

function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="app-layout">
      <div className="app-layout__navigation-slot" aria-hidden="true" />
      <main className="app-layout__content">{children}</main>
      <div className="app-layout__tools-slot" aria-hidden="true" />
    </div>
  );
}

export default AppLayout;
