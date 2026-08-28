import type { RiverRegion } from '@/types/basin';

interface YellowRiverInfoPanelProps {
  region: RiverRegion;
}

function YellowRiverInfoPanel({ region }: YellowRiverInfoPanelProps) {
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
