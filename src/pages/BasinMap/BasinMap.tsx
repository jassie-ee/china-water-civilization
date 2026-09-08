import { Link } from 'react-router-dom';
import './BasinMap.css';

function BasinMap() {
  return (
    <section className="basin-map-page">
      <h1>中国流域地图</h1>
      <p>地图功能将在下一阶段开发</p>
      <Link to="/">返回首页</Link>
    </section>
  );
}

export default BasinMap;
