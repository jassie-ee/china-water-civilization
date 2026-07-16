import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import AppLayout from '@/components/layout/AppLayout';
import BasinDetail from '@/pages/BasinDetail/BasinDetail';
import BasinOverview from '@/pages/BasinOverview/BasinOverview';
import Home from '@/pages/Home/Home';
import NotFound from '@/pages/NotFound/NotFound';

function AppRouter() {
  return (
    <BrowserRouter>
      <AppLayout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/basins" element={<BasinOverview />} />
          <Route path="/basins/yellow-river" element={<BasinDetail basinId="yellow-river" />} />
          <Route path="/basins/yangtze-river" element={<BasinDetail basinId="yangtze-river" />} />
          <Route path="/map" element={<Navigate to="/basins" replace />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AppLayout>
    </BrowserRouter>
  );
}

export default AppRouter;
