import type { YellowRiverNode, YellowRiverPanelMode, YellowRiverRegion } from '@/types/basin';

type YellowRiverInfoPanelProps =
  | { mode: Extract<YellowRiverPanelMode, 'region'>; region: YellowRiverRegion }
  | { mode: Extract<YellowRiverPanelMode, 'node'>; node: YellowRiverNode; region: YellowRiverRegion };

function YellowRiverInfoPanel(props: YellowRiverInfoPanelProps) {
  if (props.mode === 'node') {
    const { node, region } = props;
    const typeLabel = node.type === 'ecological' ? '生态问题节点' : '关键工程节点';

    return (
      <aside className={`yellow-river-region-panel yellow-river-region-panel--node yellow-river-node-panel yellow-river-node-panel--${node.type}`} aria-live="polite">
        <p className="yellow-river-region-panel__eyebrow">{typeLabel} · {region.shortName}</p>
        <h2>{node.name}</h2>
        {node.locationDescription && <div className="yellow-river-node-panel__location"><span>节点位置</span><strong>{node.locationDescription}</strong></div>}
        {node.summary && <section><h3>基础简介</h3><p>{node.summary}</p></section>}
        {node.keywords && node.keywords.length > 0 && <section><h3>核心关键词</h3><ul className="yellow-river-node-panel__keywords">{node.keywords.map((keyword) => <li key={keyword}>{keyword}</li>)}</ul></section>}
        {node.significance && <section className="yellow-river-region-panel__governance"><h3>节点意义</h3><p>{node.significance}</p></section>}
        <p className="yellow-river-node-panel__notice">节点治理任务将在下一阶段开放</p>
      </aside>
    );
  }

  const { region } = props;
  return (
    <aside className={`yellow-river-region-panel ${region.themeClassName}`} aria-live="polite">
      <p className="yellow-river-region-panel__eyebrow">{region.metaphor}</p>
      <h2>{region.name}</h2>
      <div className="yellow-river-region-panel__question">
        <span>核心问题</span>
        <strong>{region.coreQuestion}</strong>
      </div>
      <section>
        <h3>区域功能</h3>
        <p>{region.functionDescription}</p>
      </section>
      <section>
        <h3>区域简介</h3>
        <p>{region.overview}</p>
      </section>
      <div className="yellow-river-region-panel__lists">
        <section>
          <h3>主要生态过程</h3>
          <ul>{region.ecologicalProcesses.map((process) => <li key={process}>{process}</li>)}</ul>
        </section>
        <section>
          <h3>主要问题</h3>
          <ul>{region.majorProblems.map((problem) => <li key={problem}>{problem}</li>)}</ul>
        </section>
      </div>
      <section className="yellow-river-region-panel__governance">
        <h3>治理重点</h3>
        <p>{region.governanceFocus}</p>
      </section>
      <p className="yellow-river-region-panel__summary">{region.summary}</p>
    </aside>
  );
}

export default YellowRiverInfoPanel;
