import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

import { basinDetailConfigs } from '@/data/basinOverview';
import type { BasinId } from '@/types/basin';

import YellowRiver from '@/pages/YellowRiver/YellowRiver';
import YangtzeRiver from '@/pages/YangtzeRiver/YangtzeRiver';

import './BasinDetail.css';

interface BasinDetailProps {
  basinId: BasinId;
}

function GenericBasinDetail({ basinId }: BasinDetailProps) {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const basin = basinDetailConfigs.find((config) => config.id === basinId);

  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  if (basin === undefined) {
    return null;
  }

  return (
    <section className={`basin-detail ${basin.themeClassName}`}>
      <div className="basin-detail__content">
        <Link className="basin-detail__back" to="/basins" state={{ basinOverviewEntry: 'returning' }}>
          返回中国流域总览
        </Link>
        <p className="basin-detail__eyebrow">{basin.subtitle}</p>
        <h1 ref={headingRef} tabIndex={-1}>{basin.title}</h1>
        <p className="basin-detail__description">{basin.description}</p>
        <div className="basin-detail__future-slot" aria-label="后续上中下游专门地图内容预留区">
          <span>流域专门地图</span>
          <p>上中下游分区与治理节点将在后续阶段展开。</p>
        </div>
      </div>
    </section>
  );
}

function BasinDetail({ basinId }: BasinDetailProps) {
  if (basinId === 'yellow-river') {
    return <YellowRiver />;
  }

  if (basinId === 'yangtze-river') {
    return <YangtzeRiver />;
  }

  return <GenericBasinDetail basinId={basinId} />;
}

export default BasinDetail;
