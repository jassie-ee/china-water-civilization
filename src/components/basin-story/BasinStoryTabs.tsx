import { useEffect, useState, type CSSProperties, type ReactNode } from 'react';

import type { BasinStorySection } from '@/types/basinStory';

interface BasinStoryTabsProps {
  sections: BasinStorySection[];
  storyId: string;
  mediaAfterSectionId?: BasinStorySection['id'];
  mediaSlot?: ReactNode;
  fillHeight?: boolean;
}

function BasinStoryTabs({ sections, storyId, mediaAfterSectionId, mediaSlot, fillHeight = false }: BasinStoryTabsProps) {
  const [activeSectionId, setActiveSectionId] = useState(sections[0]?.id);

  useEffect(() => {
    setActiveSectionId(sections[0]?.id);
  }, [sections, storyId]);

  const activeSection = sections.find((section) => section.id === activeSectionId) ?? sections[0];
  if (!activeSection) return null;

  return (
    <section
      className={`basin-story-tabs${fillHeight ? ' basin-story-tabs--fill-height' : ''}`}
      style={fillHeight ? { '--basin-story-tab-count': sections.length } as CSSProperties : undefined}
      aria-label={`${storyId}知识介绍`}
    >
      <div className="basin-story-tabs__list" role="tablist" aria-label="详情章节">
        {sections.map((section) => (
          <button
            key={section.id}
            type="button"
            role="tab"
            aria-selected={section.id === activeSection.id}
            className={section.id === activeSection.id ? 'is-active' : ''}
            onClick={() => setActiveSectionId(section.id)}
          >
            <span>{section.label}</span>
          </button>
        ))}
      </div>
      <div className="basin-story-tabs__panel" role="tabpanel">
        <div key={activeSection.id} className="basin-story-tabs__copy">
          <h3>{activeSection.label}</h3>
          {activeSection.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          {activeSection.points && <ul>{activeSection.points.map((point) => <li key={point}>{point}</li>)}</ul>}
          {activeSection.id === mediaAfterSectionId && mediaSlot}
        </div>
      </div>
    </section>
  );
}

export default BasinStoryTabs;
