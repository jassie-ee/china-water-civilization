import type { ReactNode } from 'react';

import GlobalScoreDisplay from '@/components/common/GlobalScoreDisplay';
import ChapterInsightDisplay from '@/components/common/ChapterInsightDisplay';
import ChapterInsightProvider from '@/components/common/ChapterInsightProvider';
import { GovernanceProgressProvider } from '@/components/common/GovernanceProgressProvider';
import { LanMascotHost, LanMascotProvider } from '@/components/lan-mascot';

import './AppLayout.css';

interface AppLayoutProps {
  children: ReactNode;
}

function AppLayout({ children }: AppLayoutProps) {
  return (
    <GovernanceProgressProvider>
      <ChapterInsightProvider>
        <LanMascotProvider>
          <div className="app-layout">
            <div className="app-layout__navigation-slot" aria-hidden="true" />
            <main className="app-layout__content">{children}</main>
            <div className="app-layout__tools-slot" aria-hidden="true" />
            <div className="app-layout__utility-cluster">
              <ChapterInsightDisplay />
              <GlobalScoreDisplay />
            </div>
            <LanMascotHost />
          </div>
        </LanMascotProvider>
      </ChapterInsightProvider>
    </GovernanceProgressProvider>
  );
}

export default AppLayout;
