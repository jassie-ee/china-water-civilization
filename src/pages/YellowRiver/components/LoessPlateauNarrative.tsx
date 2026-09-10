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
      content: <><p>黄河中游流经广阔的黄土高原。这里的黄土颗粒细、土层深，却比较疏松；地表又被雨水切割成一条条沟壑。每到夏秋雨季，短时间的大暴雨落在陡坡上，雨水便会迅速汇成水流，把没有植被保护的表层黄土冲走。</p><p>这些泥水先流入小沟，再进入支流，最后汇入黄河。因此，黄河中游常常水色浑黄、含沙量很高。黄土高原既是黄河的重要水源地，也是黄河泥沙的主要来源地。</p></>,
    },
    {
      id: 'problem', label: '问题剖析',
      content: <><p>水土流失带走的并不只是普通泥土，而是土地最肥沃、最适合植物和庄稼生长的表层土。坡上的土越来越薄，植物更难扎根；植物变少后，土地失去遮挡和根系保护，下一场雨又会冲走更多土。</p><p className="yellow-river-detail-panel__process-lead">坡面裸露 → 暴雨冲刷 → 沟壑加深 → 泥沙入河 → 土地更难恢复</p><p>对当地而言，水土流失会影响耕地质量，也可能增加山洪、滑坡和沟头坍塌的风险；对黄河下游而言，大量泥沙会在河道中沉积，增加防洪和河道治理的压力。看似是一座山坡上的问题，最后会影响整条黄河。</p></>,
    },
    {
      id: 'governance', label: '怎样治理',
      content: <><p>治理黄土高原，不能只在黄河里“捞泥沙”，更重要的是从泥沙产生的地方开始，让土留在山上，让水慢慢流下。</p><ul><li><strong>坡上种树种草，先把土稳住。</strong> 对坡度过大、不适合耕种的土地实施退耕还林还草；树冠和草叶减轻雨滴冲刷，根系则把松散黄土牢牢抓住。</li><li><strong>沿等高线修梯田，让急雨慢下来。</strong> 梯田、鱼鳞坑和植草带把陡坡分成“小台阶”，让雨水暂时停留、慢慢下渗。</li><li><strong>在沟里筑淤地坝，把泥沙留下来。</strong> 泥沙随山洪进入沟道后会逐渐沉降，较清的水继续下流，并形成平整肥沃的坝田。</li><li><strong>按整个小流域协同治理。</strong> 将林草恢复、梯田建设、沟道坝系和安全监测结合，形成从山顶到河道的完整防护线。</li></ul></>,
    },
    {
      id: 'change', label: '治理变化',
      content: <><p>树草多了，黄土被根系固定；梯田和鱼鳞坑让雨水停留得更久；淤地坝让泥沙沉在沟里。原本“雨一大、土就跑”的山坡，开始恢复绿色和生机。</p><p>黄土高原的水土流失面积已从 2020 年的 23.42 万平方公里下降到 2024 年的 21.88 万平方公里。治理不仅减少了进入黄河的泥沙，也改善了当地耕地条件、蓄水能力和生态环境。<a href="https://app.www.gov.cn/govdata/gov/202508/29/535472/article.html" target="_blank" rel="noreferrer">水利部相关数据</a></p></>,
    },
    {
      id: 'reflection', label: '水滴感悟',
      content: <><blockquote className="yellow-river-detail-panel__loess-reflection">“从前，暴雨一来，我总会裹着黄土匆匆奔向远方。后来，树根拉住泥土，梯田放慢我的脚步，沟坝让我静静沉淀。我才明白，人们不是要把我困住，而是在读懂山势、尊重水势后，为我和黄土都找到了安稳的位置。”</blockquote><p className="yellow-river-detail-panel__loess-wisdom">这正是天人合一的智慧：<strong>人不必强行征服山川，而应顺应自然规律，让水有路可走、让土有根可依、让土地与人长久共生。</strong></p></>,
    },
  ];
  const activeCompactSection = compactSections.find((section) => section.id === activeSectionId) ?? compactSections[0];

  if (compact) {
    return (
      <div className="yellow-river-detail-panel__loess-narrative yellow-river-detail-panel__loess-narrative--compact">
        <div className="yellow-river-detail-panel__compact-tabs" role="tablist" aria-label="黄土高原说明">
          {compactSections.map((section) => <button key={section.id} id={`loess-tab-${section.id}`} type="button" role="tab" aria-selected={section.id === activeCompactSection.id} aria-controls="loess-compact-panel" className={section.id === activeCompactSection.id ? 'is-active' : ''} onClick={() => setActiveSectionId(section.id)}><span>{section.label}</span></button>)}
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
        <p>黄河中游流经广阔的黄土高原。这里的黄土颗粒细、土层深，却比较疏松；地表又被雨水切割成一条条沟壑。每到夏秋雨季，短时间的大暴雨落在陡坡上，雨水便会迅速汇成水流，把没有植被保护的表层黄土冲走。</p>
        <p>这些泥水先流入小沟，再进入支流，最后汇入黄河。因此，黄河中游常常水色浑黄、含沙量很高。黄土高原既是黄河的重要水源地，也是黄河泥沙的主要来源地。</p>
      </section>
      <section className="yellow-river-detail-panel__section">
        <h3>问题剖析</h3>
        <p>水土流失带走的并不只是普通泥土，而是土地最肥沃、最适合植物和庄稼生长的表层土。坡上的土越来越薄，植物更难扎根；植物变少后，土地失去遮挡和根系保护，下一场雨又会冲走更多土。</p>
        <p className="yellow-river-detail-panel__process-lead">可以把它理解为一个连锁反应：</p>
        <p className="yellow-river-detail-panel__process" aria-label="裸露坡面到下游压力增大的连锁反应">
          <span>坡面裸露</span><b>→</b><span>暴雨冲刷</span><b>→</b><span>沟壑加深</span><b>→</b><span>泥沙入河</span><b>→</b><span>土地更难恢复</span>
        </p>
        <p>对当地而言，水土流失会影响耕地质量，也可能增加山洪、滑坡和沟头坍塌的风险；对黄河下游而言，大量泥沙会在河道中沉积，增加防洪和河道治理的压力。看似是一座山坡上的问题，最后会影响整条黄河。</p>
      </section>
      <section className="yellow-river-detail-panel__section">
        <h3>中国怎样让泥沙慢下来？</h3>
        <p>治理黄土高原，不能只在黄河里“捞泥沙”，更重要的是从泥沙产生的地方开始，让土留在山上，让水慢慢流下。</p>
        <ul>
          <li><strong>坡上种树种草，先把土稳住。</strong> 对坡度过大、不适合耕种的土地实施退耕还林还草，种植适合当地的乔木、灌木和草本植物。树冠和草叶能减轻雨滴直接击打地面，根系则像一张网，把松散黄土牢牢抓住。</li>
          <li><strong>沿等高线修梯田，让急雨慢下来。</strong> 水平梯田、鱼鳞坑、植草带等措施，会把长长的陡坡分成许多“小台阶”。雨水不再一路猛冲，而是被暂时拦住、慢慢下渗；既能减少冲刷，也能为植物和农田保存更多水分。</li>
          <li><strong>在沟里筑淤地坝，把泥沙留下来。</strong> 当山洪裹挟泥沙进入沟道，淤地坝能让水流减速，较重的泥沙自然沉降，较清的水继续向下流。经过多年淤积，原本深切的沟壑还能形成平整、肥沃的坝田，实现“拦泥、蓄水、造地”。</li>
          <li><strong>按整个小流域协同治理。</strong> 山顶、坡面、沟头、沟坡和沟底不是彼此分开的。治理时需要把林草恢复、梯田建设、沟道坝系和安全监测结合起来，形成从“山顶到河道”的完整防护线。</li>
        </ul>
      </section>
      <section className="yellow-river-detail-panel__section">
        <h3>治理后的变化</h3>
        <p>树草多了，黄土被根系固定；梯田和鱼鳞坑让雨水停留得更久；淤地坝让泥沙沉在沟里。原本“雨一大、土就跑”的山坡，开始恢复绿色和生机。</p>
        <p>黄土高原的水土流失面积已从 2020 年的 23.42 万平方公里下降到 2024 年的 21.88 万平方公里。治理不仅减少了进入黄河的泥沙，也改善了当地耕地条件、蓄水能力和生态环境。<a href="https://app.www.gov.cn/govdata/gov/202508/29/535472/article.html" target="_blank" rel="noreferrer">水利部相关数据</a></p>
      </section>
      <section className="yellow-river-detail-panel__section">
        <h3>水滴精灵的感悟</h3>
        <blockquote className="yellow-river-detail-panel__loess-reflection">“从前，暴雨一来，我总会裹着黄土匆匆奔向远方。后来，树根拉住泥土，梯田放慢我的脚步，沟坝让我静静沉淀。我才明白，人们不是要把我困住，而是在读懂山势、尊重水势后，为我和黄土都找到了安稳的位置。”</blockquote>
        <p className="yellow-river-detail-panel__loess-wisdom">这正是天人合一的智慧：<strong>人不必强行征服山川，而应顺应自然规律，让水有路可走、让土有根可依、让土地与人长久共生。</strong></p>
      </section>
    </div>
  );
}

export default LoessPlateauNarrative;
