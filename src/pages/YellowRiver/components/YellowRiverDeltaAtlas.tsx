import type { ReactNode } from 'react';

export type DeltaAtlasSectionId = 'estuary' | 'reserve' | 'pressure' | 'protection' | 'change' | 'reflection';

interface DeltaAtlasSection {
  id: DeltaAtlasSectionId;
  label: string;
  content: ReactNode;
}

interface YellowRiverDeltaAtlasProps {
  activeSectionId: DeltaAtlasSectionId;
  onSectionChange: (sectionId: DeltaAtlasSectionId) => void;
}

const sections: DeltaAtlasSection[] = [
  {
    id: 'estuary', label: '河海之间',
    content: <><h3>一条河流的终点，并不是消失在大海里。</h3><p>当黄河穿过高原、平原与城市，带着水和泥沙来到渤海岸边，它会在河流与海洋交汇的地方，创造出新的滩涂、湿地和生命空间。这里既承接着整条黄河的来水来沙，也受到海潮涨落的影响，是陆地、河流与海洋彼此连接的生态边界。</p><p>因此，治理黄河的最终目的，不只是让洪水安全入海、让泥沙顺利下泄，更是让河口保持生命力，使湿地能够更新、鸟类拥有家园、河海生态持续相连。</p></>,
  },
  {
    id: 'reserve', label: '自然保护区',
    content: <><h3>黄河三角洲国家级自然保护区</h3><p>黄河三角洲国家级自然保护区位于黄河入海口。黄河携带的泥沙在这里逐渐沉积，与海水、潮汐共同塑造出滩涂、盐沼、潮沟和浅水湿地。</p><p>这些看似平静的湿地，其实是一座繁忙的“生命驿站”。迁徙候鸟在这里停歇、补充食物，一些鸟类在此繁殖或越冬；鱼类、底栖动物和湿地植物也在淡水与海水交融的环境中生长。纵横交错的潮沟，则像湿地的血管，让水、盐分、泥沙和营养物质不断流动。</p><p>河口湿地还像一块巨大的天然海绵，能够调蓄水分、净化水质、缓冲风暴潮，并为沿海地区构筑一道柔软而有生命的生态屏障。</p></>,
  },
  {
    id: 'pressure', label: '面临什么问题',
    content: <><h3>年轻湿地，需要水、沙与海潮的平衡</h3><p>黄河三角洲是一片仍在变化和生长的年轻湿地，它对水、沙和海潮之间的平衡十分敏感。</p><p>如果黄河入海的淡水减少，海水影响就可能增强，土壤盐度随之发生变化；如果来沙过程改变，湿地可能失去持续塑造和更新的条件。如果潮沟被泥沙、杂物或不合理工程阻塞，海水与淡水便难以正常交换，一些湿地可能逐渐干涸或退化。</p><p>此外，港口建设、道路开发、养殖活动、游客惊扰和外来入侵植物，也可能挤压鸟类觅食、休息与繁殖的空间。</p><div className="yellow-river-delta-atlas__chain" aria-label="湿地退化连锁过程"><span>水沙过程改变</span><b>→</b><span>淡咸水交换受阻</span><b>→</b><span>植被和滩涂退化</span><b>→</b><span>食物减少</span><b>→</b><span>鸟类与水生动物失去栖息地</span></div></>,
  },
  {
    id: 'protection', label: '怎样守护',
    content: <><h3>让河口继续呼吸</h3><ul><li><strong>保障生态补水，维持河口水沙过程。</strong>通过流域水库联合调度，在保障防洪、供水等需求的同时，为河口湿地补充必要的淡水。适量的水与沙抵达河口，有助于维持湿地水面、调节盐度，并为滩涂更新提供物质基础。</li><li><strong>疏通潮沟，恢复湿地的“毛细血管”。</strong>对阻塞或退化的潮沟进行科学疏通，使海潮能够有序进退，让淡水、海水和营养物质重新流动起来，恢复河流、湿地与海洋之间的联系。</li><li><strong>修复本土植被，恢复完整的湿地家园。</strong>根据不同区域的水深、盐度和土壤条件，保护并恢复适合当地生长的盐沼植物。植物能够固定滩涂、减缓海浪，也为昆虫、鱼虾和鸟类提供食物与隐蔽空间。</li><li><strong>保护鸟类栖息地，减少人为惊扰。</strong>对候鸟集中停歇、觅食和繁殖的区域进行重点保护，控制高强度旅游和开发活动，并通过巡护、监测和救助，及时发现生态变化。</li><li><strong>守住生态红线，控制高扰动开发。</strong>河口不是等待开发的空地，而是具有重要生态功能的生命空间。通过自然保护区和生态保护红线，限制破坏湿地连通性、挤占滩涂或干扰野生动物的活动。</li></ul></>,
  },
  {
    id: 'change', label: '治理带来什么',
    content: <><h3>河流健康，也要看它抵达海洋之后</h3><p>随着生态补水、湿地修复、潮沟疏通和栖息地保护持续推进，部分退化湿地重新获得水分，淡水与海水的交换更加顺畅，本土植物逐渐恢复，鱼类、底栖动物和鸟类也拥有了更完整的生存空间。</p><p>这些变化说明，黄河治理的成果不能只用“拦住多少泥沙”或“减少多少洪水”来衡量。河流是否健康，还要看它抵达海洋之后，能否继续滋养湿地，能否为万千生命留下栖息之所。</p></>,
  },
  {
    id: 'reflection', label: '水滴感悟',
    content: <><blockquote>“一路上，人们让我慢下来、清起来，也为泥沙找到了合适的归宿。当我终于抵达大海，才发现旅程并没有结束——我化作潮沟与湿地，托起植物、鱼虾和候鸟的新生活。原来，治水的答案不只藏在河道里，也生长在每一个被河流滋养的生命之中。”</blockquote><h3>从治水走向生态文明</h3><p>黄河三角洲告诉我们：保护一条河，不能只治理某一段河道，而要把上游水源、中游水土保持、下游水沙调度和河口湿地保护联系起来。山上的一片林、沟里的一座坝、水库的一次调度，都可能影响千里之外的一片湿地。</p><p>这正是生态文明所强调的系统观念，也是“天人合一”的现代实践。人不是站在自然之外改造一切，而是身处山水林田湖草沙共同组成的生命系统之中。</p><p className="yellow-river-delta-atlas__final">让水有所归、沙有所安、鸟有所栖、人有所依，才是黄河真正抵达大海时，留给我们的答案。</p></>,
  },
];

function YellowRiverDeltaAtlas({ activeSectionId, onSectionChange }: YellowRiverDeltaAtlasProps) {
  const activeSection = sections.find((section) => section.id === activeSectionId) ?? sections[0];
  return <section className="yellow-river-delta-atlas" aria-label="黄河三角洲河口生命图册">
    <nav className="yellow-river-delta-atlas__tabs" aria-label="河口生命图册章节">
      {sections.map((section) => <button key={section.id} type="button" className={section.id === activeSection.id ? 'is-active' : ''} aria-current={section.id === activeSection.id ? 'page' : undefined} onClick={() => onSectionChange(section.id)}><span>{section.label}</span></button>)}
    </nav>
    <article key={activeSection.id} className="yellow-river-delta-atlas__content">
      {activeSection.content}
    </article>
  </section>;
}

export default YellowRiverDeltaAtlas;
