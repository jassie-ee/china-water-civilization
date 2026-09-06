import type { ReactNode } from 'react';

import GlobalScoreDisplay from '@/components/common/GlobalScoreDisplay';
import AccountMenu from '@/components/common/AccountMenu';
import { AccountProvider } from '@/components/common/AccountProvider';
import { GovernanceProgressProvider } from '@/components/common/GovernanceProgressProvider';
import { LanMascotHost, LanMascotProvider } from '@/components/lan-mascot';

import './AppLayout.css';

interface AppLayoutProps {
  children: ReactNode;
}

function AppLayout({ children }: AppLayoutProps) {
  return (
    <AccountProvider>
      <GovernanceProgressProvider>
        <LanMascotProvider>
          <div className="app-layout">
            <div className="app-layout__navigation-slot" aria-hidden="true" />
            <main className="app-layout__content">{children}</main>
            <div className="app-layout__tools-slot" aria-hidden="true" />
            <div className="app-layout__utility-cluster">
              <AccountMenu />
              <GlobalScoreDisplay />
            </div>
            <LanMascotHost />
          </div>
        </LanMascotProvider>
      </GovernanceProgressProvider>
    </AccountProvider>
  );
}

export default AppLayout;
