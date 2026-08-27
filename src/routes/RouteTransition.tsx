import { Navigate, Route, Routes, useLocation } from 'react-router-dom';

import BasinDetail from '@/pages/BasinDetail/BasinDetail';
import BasinOverview from '@/pages/BasinOverview/BasinOverview';
import ChapterOverview from '@/pages/ChapterOverview/ChapterOverview';
import CosmicFuture from '@/pages/CosmicFuture/CosmicFuture';
import GovernanceLevel from '@/pages/GovernanceLevel/GovernanceLevel';
import Home from '@/pages/Home/Home';
import NotFound from '@/pages/NotFound/NotFound';
import WorldWater from '@/pages/WorldWater/WorldWater';

import './RouteTransition.css';

/** 保持独立路由容器，但不再为页面切换额外制造透明过渡。 */
function RouteTransition() {
  const location = useLocation();

  return (
    <div className="route-transition">
      <Routes location={location}>
        <Route path="/" element={<Home />} />
        <Route path="/chapters" element={<ChapterOverview />} />
        <Route path="/chapter-3" element={<WorldWater />} />
        <Route path="/chapter-4" element={<CosmicFuture />} />
        <Route path="/basins" element={<BasinOverview />} />
        <Route path="/basins/yellow-river" element={<BasinDetail basinId="yellow-river" />} />
        <Route path="/basins/yellow-river/nodes/:nodeId" element={<GovernanceLevel />} />
        <Route path="/basins/yangtze-river" element={<BasinDetail basinId="yangtze-river" />} />
        <Route path="/map" element={<Navigate to="/basins" replace />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default RouteTransition;
