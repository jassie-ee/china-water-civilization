import { useEffect, useRef, useState, type ReactNode } from 'react';

import HydropowerDepthCarousel, { type HydropowerDepthItem } from './HydropowerDepthCarousel';

type KnowledgeSectionId = 'hydropower' | 'classification' | 'storage' | 'basins';

interface KnowledgeSection {
  id: KnowledgeSectionId;
  label: string;
  title: string;
  lead: string;
  detail: ReactNode;
  visual: ReactNode;
}

const sections: KnowledgeSection[] = [
  {
    id: 'hydropower', label: '水电的三种取水方式', title: '水势如何变成电能',
    lead: '水从高处获得势能，穿过水轮机时带动发电机。工程的差异，不是“有没有发电”，而是怎样组织水流、怎样留出河流的呼吸空间。',
    visual: <span className="hydropower-depth-carousel__water-diagram hydropower-depth-carousel__water-diagram--hydropower" aria-hidden="true"><i /><i /><i /></span>,
    detail: <div className="hydropower-knowledge__columns"><article><strong>水库式</strong><span>蓄水调节</span><p>利用库容在丰枯之间安排水量，也可能承担防洪、供水等任务。</p></article><article><strong>径流式</strong><span>顺流发电</span><p>利用自然来水过程，库容较小，对水位调节的能力有限。</p></article><article><strong>引水式</strong><span>引水落差</span><p>将水引向较低处发电，需要特别关注原河道的生态流量。</p></article></div>,
  },
  {
    id: 'classification', label: '水电站分类', title: '怎样把水头集中起来',
    lead: '水电站依靠上下游水位落差发电。按集中水头的方式，坝式、引水式和混合式是三类基础工程；抽水蓄能、潮汐与梯级开发，则回应不同的能源和水域条件。',
    visual: <span className="hydropower-depth-carousel__water-diagram hydropower-depth-carousel__water-diagram--classification" aria-hidden="true"><i /><i /><i /></span>,
    detail: <div className="hydropower-knowledge__classification">
      <section className="hydropower-knowledge__classification-group">
        <div className="hydropower-knowledge__classification-heading"><span>基础类型</span><strong>集中水头的三种方式</strong></div>
        <dl>
          <div><dt>坝式</dt><dd>在河道筑坝抬高水位，流量大、可调节径流，也能兼顾防洪和供水。河床式多见于平缓河段，坝后式库容更大，三峡属于典型坝后式。</dd></div>
          <div><dt>引水式</dt><dd>在山区利用明渠或隧洞把水引向下游，集中陡坡落差。水头高、淹没少，但库容小，调节能力较弱。</dd></div>
          <div><dt>混合式</dt><dd>让高坝先获得一部分落差，再以有压引水道继续集中水头，适合上游可建库、下游河道突然变陡的河段。</dd></div>
        </dl>
      </section>
      <section className="hydropower-knowledge__classification-group hydropower-knowledge__classification-group--special">
        <div className="hydropower-knowledge__classification-heading"><span>特殊形式</span><strong>把不同水域条件变成能源</strong></div>
        <dl>
          <div><dt>抽水蓄能</dt><dd>利用上下双水库与双向机组，在用电低谷抽水储能、高峰放水发电。</dd></div>
          <div><dt>潮汐电站</dt><dd>在海湾或河口利用涨落潮形成的潮差发电，关键在于稳定的水位差。</dd></div>
          <div><dt>梯级水电站</dt><dd>沿河分段布置水库，逐级利用落差，并优先发挥上游控制性水库的调节作用。</dd></div>
        </dl>
      </section>
    </div>,
  },
  {
    id: 'storage', label: '抽水蓄能', title: '把富余电能存成水的高度',
    lead: '它在用电低谷把水抽到上库，在用电高峰让水回落发电。抽水蓄能服务于电网调峰与储能，不等同于流域调水调沙。',
    visual: <span className="hydropower-depth-carousel__water-diagram hydropower-depth-carousel__water-diagram--storage" aria-hidden="true"><i /><i /><i /></span>,
    detail: <div className="hydropower-knowledge__cycle"><div><strong>低谷用电</strong><span>把水抽往上库</span></div><b aria-hidden="true">↑</b><div><strong>高峰用电</strong><span>让水回落发电</span></div><p>这是一座双向工作的“水电池”：存下的是电网富余时段的能量，不能替代泥沙治理与生态调度。</p></div>,
  },
  {
    id: 'basins', label: '三河的不同任务', title: '同一种工程，回应三条不同的河',
    lead: '工程原理可以相近，但河流面对的生态问题并不相同。真正的流域治理，是让工程服从每条河的水文节律与生命需要。',
    visual: <span className="hydropower-depth-carousel__water-diagram hydropower-depth-carousel__water-diagram--basins" aria-hidden="true"><i /><i /><i /></span>,
    detail: <div className="hydropower-knowledge__rivers"><article><strong>黄河</strong><span>调水调沙</span><p>让水与沙在库群协同中各归其位。</p></article><article><strong>长江</strong><span>生态节律</span><p>让防洪、库容与洄游生命共同被考虑。</p></article><article><strong>珠江</strong><span>压咸补淡</span><p>把城市供水、生态流量和河口生命连在一起。</p></article></div>,
  },
];

interface HydropowerKnowledgeAtlasProps { isOpen: boolean; onClose: () => void; }

function HydropowerKnowledgeAtlas({ isOpen, onClose }: HydropowerKnowledgeAtlasProps) {
  const [activeId, setActiveId] = useState<KnowledgeSectionId>('hydropower');
  const closeRef = useRef<HTMLButtonElement>(null);
  const activeIndex = Math.max(0, sections.findIndex((section) => section.id === activeId));
  const active = sections[activeIndex];
  const carouselItems: HydropowerDepthItem[] = sections.map(({ id, label, visual }) => ({ id, label, visual }));

  useEffect(() => {
    if (!isOpen) return undefined;
    closeRef.current?.focus();
    const handleKeyDown = (event: KeyboardEvent): void => { if (event.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return <div className="hydropower-atlas__backdrop" role="presentation" onPointerDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
    <section className="hydropower-atlas" role="dialog" aria-modal="true" aria-labelledby="hydropower-atlas-title">
      <header><div><p>三大流域共同知识</p><h2 id="hydropower-atlas-title">水电与储能知识册</h2></div><button ref={closeRef} type="button" aria-label="关闭水电与储能知识册" onClick={onClose}>×</button></header>
      <div className="hydropower-atlas__body">
        <aside className="hydropower-atlas__carousel-column"><HydropowerDepthCarousel items={carouselItems} activeIndex={activeIndex} onChange={(index) => setActiveId(sections[index].id)} /></aside>
        <article key={active.id} className="hydropower-knowledge__reading"><p className="hydropower-atlas__eyebrow">{active.label}</p><h3>{active.title}</h3><p className="hydropower-knowledge__lead">{active.lead}</p>{active.detail}</article>
      </div>
    </section>
  </div>;
}

export default HydropowerKnowledgeAtlas;
