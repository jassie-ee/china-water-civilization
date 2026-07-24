import type { ReactNode } from 'react';

import GlobalScoreDisplay from '@/components/common/GlobalScoreDisplay';
import { GovernanceProgressProvider } from '@/components/common/GovernanceProgressProvider';

interface AppLayoutProps {
  children: ReactNode;
}

function AppLayout({ children }: AppLayoutProps) {
  return (
    <GovernanceProgressProvider>
      <div className="app-layout">
        <div className="app-layout__navigation-slot" aria-hidden="true" />
        <main className="app-layout__content">{children}</main>
        <div className="app-layout__tools-slot" aria-hidden="true" />
        <GlobalScoreDisplay />
      </div>
    </GovernanceProgressProvider>
  );
}

export default AppLayout;
