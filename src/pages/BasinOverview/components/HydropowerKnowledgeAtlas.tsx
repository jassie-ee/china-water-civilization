import { useEffect, useRef, useState } from 'react';

type KnowledgeSectionId = 'hydropower' | 'storage' | 'basins';

const sections: Array<{ id: KnowledgeSectionId; label: string; title: string; lead: string }> = [
  { id: 'hydropower', label: '水电怎样发电', title: '让水势转化为电能', lead: '水从较高处经过水轮机，带动发电机。不同工程的差异，在于如何组织水流和是否需要蓄水。' },
  { id: 'storage', label: '抽水蓄能', title: '把多余电能暂存为水势', lead: '用电低谷把水抽到上库；用电高峰让水回落发电。它是储能系统，不等同于流域调水调沙。' },
  { id: 'basins', label: '三河如何不同', title: '相似工程，回应不同河流', lead: '工程原理可以相近，但每条河面对的生态问题不同，治理目标也就不同。' },
];

interface HydropowerKnowledgeAtlasProps {
  isOpen: boolean;
  onClose: () => void;
}

function HydropowerKnowledgeAtlas({ isOpen, onClose }: HydropowerKnowledgeAtlasProps) {
  const [activeId, setActiveId] = useState<KnowledgeSectionId>('hydropower');
  const closeRef = useRef<HTMLButtonElement>(null);
  const active = sections.find((section) => section.id === activeId) ?? sections[0];

  useEffect(() => {
    if (!isOpen) return undefined;
    closeRef.current?.focus();
    const handleKeyDown = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="hydropower-atlas__backdrop" role="presentation" onPointerDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <section className="hydropower-atlas" role="dialog" aria-modal="true" aria-labelledby="hydropower-atlas-title">
        <header>
          <div><p>三大流域共同知识</p><h2 id="hydropower-atlas-title">水电与储能知识册</h2></div>
          <button ref={closeRef} type="button" aria-label="关闭水电与储能知识册" onClick={onClose}>×</button>
        </header>
        <div className="hydropower-atlas__body">
          <nav aria-label="知识册章节">
            {sections.map((section) => <button key={section.id} type="button" className={section.id === active.id ? 'is-active' : ''} onClick={() => setActiveId(section.id)}>{section.label}</button>)}
          </nav>
          <div key={active.id} className="hydropower-atlas__content">
            <p className="hydropower-atlas__eyebrow">{active.label}</p>
            <h3>{active.title}</h3>
            <p>{active.lead}</p>
            {active.id === 'hydropower' && <div className="hydropower-atlas__diagram" aria-label="三类水电站示意">
              <article><strong>水库式</strong><span>蓄水调节</span><small>适合在丰枯之间安排水量，也可能承担防洪、供水等任务。</small></article>
              <article><strong>径流式</strong><span>顺流发电</span><small>利用自然来水过程，库容较小，对水位调节的能力有限。</small></article>
              <article><strong>引水式</strong><span>引水落差</span><small>将水引向较低处发电，需要特别关注原河道生态流量。</small></article>
            </div>}
            {active.id === 'storage' && <div className="hydropower-atlas__storage" aria-label="抽水蓄能双向过程">
              <div><strong>低谷用电</strong><span>把水抽往上库</span></div><b aria-hidden="true">↑</b><div><strong>高峰用电</strong><span>让水回落发电</span></div>
              <p>它储存的是电网富余时段的能量，不是为了拦截泥沙，也不替代河流生态调度。</p>
            </div>}
            {active.id === 'basins' && <div className="hydropower-atlas__basins">
              <article><strong>黄河</strong><span>调水调沙</span><small>重点是让水与沙在库群协同中各归其位。</small></article>
              <article><strong>长江</strong><span>生态节律</span><small>重点是让防洪、库容与洄游生命共同被考虑。</small></article>
              <article><strong>珠江</strong><span>压咸补淡</span><small>重点是把城市供水、生态流量和河口生命连在一起。</small></article>
            </div>}
          </div>
        </div>
      </section>
    </div>
  );
}

export default HydropowerKnowledgeAtlas;
