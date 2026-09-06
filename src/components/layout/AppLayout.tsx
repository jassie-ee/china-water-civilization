import type { ReactNode } from 'react';

import GlobalScoreDisplay from '@/components/common/GlobalScoreDisplay';
import ChapterInsightDisplay from '@/components/common/ChapterInsightDisplay';
import AccountMenu from '@/components/common/AccountMenu';
import { AccountProvider } from '@/components/common/AccountProvider';
import ChapterInsightProvider from '@/components/common/ChapterInsightProvider';
import { GovernanceProgressProvider } from '@/components/common/GovernanceProgressProvider';

import './AppLayout.css';

interface AppLayoutProps {
  children: ReactNode;
}

function AppLayout({ children }: AppLayoutProps) {
  return (
    <AccountProvider>
      <GovernanceProgressProvider>
        <ChapterInsightProvider>
          <div className="app-layout">
            <div className="app-layout__navigation-slot" aria-hidden="true" />
            <main className="app-layout__content">{children}</main>
            <div className="app-layout__tools-slot" aria-hidden="true" />
            <div className="app-layout__utility-cluster">
              <AccountMenu />
              <ChapterInsightDisplay />
              <GlobalScoreDisplay />
            </div>
          </div>
        </ChapterInsightProvider>
      </GovernanceProgressProvider>
    </AccountProvider>
  );
}

export default AppLayout;
