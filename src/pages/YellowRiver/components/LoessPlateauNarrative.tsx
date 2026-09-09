import { useState, type ReactNode } from 'react';

interface LoessPlateauNarrativeProps {
  compact?: boolean;
}

type CompactSectionId = 'background' | 'problem' | 'governance' | 'change' | 'reflection';

interface CompactSection {
  id: CompactSectionId;
  label: string;
  content: ReactNode;
}

/** 黄土高原生态影像后的完整说明，可由详情页与黄河长卷共用。 */
function LoessPlateauNarrative({ compact = false }: LoessPlateauNarrativeProps) {
  const [activeSectionId, setActiveSectionId] = useState<CompactSectionId>('background');
  const compactSections: CompactSection[] = [
    {
      id: 'background', label: '背景介绍',
      content: <p>黄河中游流经黄土高原。这里的黄土细而松，沟壑又多；短时强降雨会把坡上的泥土冲进沟里，再汇入黄河。久而久之，山坡变瘦、沟壑变深，黄河也因此带上了厚厚的“黄衣裳”。</p>,
    },
    {
      id: 'problem', label: '问题剖析',
      content: <><p>水土流失带走的，不只是泥沙，更是最肥沃的表层土。土地难种庄稼，村庄还可能面对山洪和沟坡坍塌；大量泥沙进入黄河后，也会增加下游河道淤积和防洪压力。</p><p className="yellow-river-detail-panel__process-lead">裸露坡面 → 暴雨冲土 → 沟壑汇沙 → 黄河变浑 → 下游压力增大</p></>,
    },
    {
      id: 'governance', label: '怎样治理',
      content: <><p>治理不是只在河里“捞泥”，而是从泥沙出发的山坡开始，给水和土都安排合适的位置。</p><ul><li><strong>坡上种树种草：</strong>用根系抓住土壤，用枝叶减轻雨滴冲刷。</li><li><strong>修梯田、鱼鳞坑：</strong>让雨水暂时留住，慢慢渗进土里。</li><li><strong>沟里建设淤地坝：</strong>让泥沙沉降，清水下泄，逐步形成坝田。</li><li><strong>按小流域整体治理：</strong>山顶、坡面、沟头、沟底一起治理并维护坝体。</li></ul></>,
    },
    {
      id: 'change', label: '治理变化',
      content: <p>树草多了，雨水更愿意留在山坡；梯田和鱼鳞坑让水流变慢；淤地坝把泥沙拦在沟里。黄土高原的水土流失面积已从 2020 年的 23.42 万平方公里下降到 2024 年的 21.88 万平方公里，进入黄河的泥沙也得到有效控制。</p>,
    },
    {
      id: 'reflection', label: '水滴感悟',
      content: <><blockquote className="yellow-river-detail-panel__loess-reflection">“从前，雨一来，我就裹着黄土匆匆奔走；现在，树根拉住泥土，梯田放慢我的脚步，沟坝让我静静沉淀。我明白了：治水不是把水困住，而是读懂山形、尊重水势，让水、土、树和人各得其所。”</blockquote><p className="yellow-river-detail-panel__loess-wisdom">这正是“天人合一”的智慧：<strong>不是强行战胜自然，而是顺应自然规律，与山川共同找到更长久的相处方式。</strong></p></>,
    },
  ];
  const activeCompactSection = compactSections.find((section) => section.id === activeSectionId) ?? compactSections[0];

  if (compact) {
    return (
      <div className="yellow-river-detail-panel__loess-narrative yellow-river-detail-panel__loess-narrative--compact">
        <div className="yellow-river-detail-panel__compact-tabs" role="tablist" aria-label="黄土高原说明">
          {compactSections.map((section) => <button key={section.id} id={`loess-tab-${section.id}`} type="button" role="tab" aria-selected={section.id === activeCompactSection.id} aria-controls="loess-compact-panel" className={section.id === activeCompactSection.id ? 'is-active' : ''} onClick={() => setActiveSectionId(section.id)}>{section.label}</button>)}
        </div>
        <section id="loess-compact-panel" className="yellow-river-detail-panel__compact-panel" role="tabpanel" aria-labelledby={`loess-tab-${activeCompactSection.id}`}>
          <h3>{activeCompactSection.label}</h3>
          {activeCompactSection.content}
        </section>
      </div>
    );
  }

  return (
    <div className="yellow-river-detail-panel__loess-narrative">
      <section className="yellow-river-detail-panel__section">
        <h3>背景介绍</h3>
        <p>黄河中游流经黄土高原。这里的黄土细而松，沟壑又多；一遇到短时强降雨，雨水就像无数把小铲子，把坡上的泥土冲进沟里，再汇入黄河。久而久之，山坡变瘦、沟壑变深，黄河也因此带上了厚厚的“黄衣裳”。</p>
      </section>
      <section className="yellow-river-detail-panel__section">
        <h3>问题剖析</h3>
        <p>水土流失带走的，不只是泥沙，更是最肥沃的表层土。土地难种庄稼，村庄还可能面对山洪和沟坡坍塌；大量泥沙进入黄河后，也会增加下游河道淤积和防洪压力。</p>
        <p className="yellow-river-detail-panel__process-lead">可以把它理解为一个连锁反应：</p>
        <p className="yellow-river-detail-panel__process" aria-label="裸露坡面到下游压力增大的连锁反应">
          <span>裸露坡面</span><b>→</b><span>暴雨冲土</span><b>→</b><span>沟壑汇沙</span><b>→</b><span>黄河变浑</span><b>→</b><span>下游压力增大</span>
        </p>
      </section>
      <section className="yellow-river-detail-panel__section">
        <h3>中国怎样让泥沙慢下来？</h3>
        <p>治理不是只在河里“捞泥”，而是从泥沙出发的山坡开始，给水和土都安排合适的位置。</p>
        <ul>
          <li><strong>坡上种树种草：</strong>陡坡退耕还林还草，种植适合当地的灌木、乔木和草本。植物根系像一张网，抓住土壤；枝叶像一把伞，减轻雨滴直接打在地上的力量。</li>
          <li><strong>顺着等高线修梯田、鱼鳞坑：</strong>把陡坡变成一层层“小台阶”，把雨水暂时留住，让它慢慢渗进土里，而不是急着冲下山。</li>
          <li><strong>沟里建设淤地坝：</strong>在沟道中修建矮坝，让夹着泥沙的洪水放慢速度。泥沙沉下来，清水再向下流；多年后，坝内还能形成较平整、较肥沃的坝田。</li>
          <li><strong>按小流域整体治理：</strong>山顶、坡面、沟头、沟底一起治理，并加强老旧淤地坝的维护和安全监测，避免“只治一处、别处仍流失”。</li>
        </ul>
      </section>
      <section className="yellow-river-detail-panel__section">
        <h3>治理后的变化</h3>
        <p>树草多了，雨水更愿意留在山坡；梯田和鱼鳞坑让水流变慢；淤地坝把泥沙拦在沟里。黄土高原的水土流失面积已从 2020 年的 23.42 万平方公里下降到 2024 年的 21.88 万平方公里。土地逐渐恢复生机，进入黄河的泥沙也得到有效控制。</p>
      </section>
      <section className="yellow-river-detail-panel__section">
        <h3>水滴精灵的感悟</h3>
        <blockquote className="yellow-river-detail-panel__loess-reflection">“从前，雨一来，我就裹着黄土匆匆奔走；现在，树根拉住泥土，梯田放慢我的脚步，沟坝让我静静沉淀。我明白了：治水不是把水困住，而是读懂山形、尊重水势，让水、土、树和人各得其所。”</blockquote>
        <p className="yellow-river-detail-panel__loess-wisdom">这正是“天人合一”的智慧：<strong>不是强行战胜自然，而是顺应自然规律，与山川共同找到更长久的相处方式。</strong></p>
      </section>
    </div>
  );
}

export default LoessPlateauNarrative;
