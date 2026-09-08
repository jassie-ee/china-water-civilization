import type { BasinOverviewItem } from '@/types/basin';

interface BasinInfoPanelProps {
  activeBasin: BasinOverviewItem | null;
}

function BasinInfoPanel({ activeBasin }: BasinInfoPanelProps) {
  if (activeBasin === null) {
    return <aside className="basin-info-panel"><p>选择一条江河，进入它的治理世界</p></aside>;
  }

  return (
    <aside className={`basin-info-panel ${activeBasin.themeClassName}`} aria-live="polite">
      <p className="basin-info-panel__eyebrow">{activeBasin.englishName}</p>
      <h2>{activeBasin.name}</h2>
      <p>{activeBasin.description}</p>
    </aside>
  );
}

export default BasinInfoPanel;
