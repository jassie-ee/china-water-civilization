import { HashRouter } from 'react-router-dom';

import AppLayout from '@/components/layout/AppLayout';
import RouteTransition from './RouteTransition';

function AppRouter() {
  return (
    <HashRouter>
      <AppLayout>
        <RouteTransition />
      </AppLayout>
    </HashRouter>
  );
}

export default AppRouter;
