import type { ReactNode } from 'react';

import GlobalScoreDisplay from '@/components/common/GlobalScoreDisplay';
import ChapterInsightDisplay from '@/components/common/ChapterInsightDisplay';
import ChapterInsightProvider from '@/components/common/ChapterInsightProvider';
import { GovernanceProgressProvider } from '@/components/common/GovernanceProgressProvider';
import { ChapterSpiritHost, ChapterSpiritProvider } from '@/components/chapter-spirit';
import LanFootingHost from '@/components/lan-mascot/LanFootingHost';

import './AppLayout.css';

interface AppLayoutProps {
  children: ReactNode;
}

function AppLayout({ children }: AppLayoutProps) {
  return (
    <GovernanceProgressProvider>
      <ChapterInsightProvider>
        <ChapterSpiritProvider>
          <div className="app-layout">
            <div className="app-layout__navigation-slot" aria-hidden="true" />
            <main className="app-layout__content">{children}</main>
            <div className="app-layout__tools-slot" aria-hidden="true" />
            <div className="app-layout__utility-cluster">
              <ChapterInsightDisplay />
              <GlobalScoreDisplay />
            </div>
            <LanFootingHost />
            <ChapterSpiritHost />
          </div>
        </ChapterSpiritProvider>
      </ChapterInsightProvider>
    </GovernanceProgressProvider>
  );
}

export default AppLayout;
