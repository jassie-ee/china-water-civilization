import { useEffect, useMemo, useState } from 'react';

import type { RiverNode, RiverRegion } from '@/types/basin';

interface RiverSpiritDialogueProps {
  isOpen: boolean;
  riverName: string;
  region: RiverRegion;
  node: RiverNode | null;
}

function shorten(text: string | undefined, maxLength = 74): string {
  if (!text) return '';
  return text.length > maxLength ? `${text.slice(0, maxLength)}…` : text;
}

function RiverSpiritDialogue({ isOpen, riverName, region, node }: RiverSpiritDialogueProps) {
  const sceneKey = `${riverName}-${node?.id ?? 'region'}-${region.id}`;
  const segments = useMemo(() => {
    if (node?.summary === '资料待整理') {
      return [`${node.shortName}的资料仍在整理中。我们先沿着${riverName}继续寻找水脉的线索。`];
    }

    if (node) {
      return [
        `${node.shortName}位于${riverName}${region.shortName}。这里，是水脉变化被看见的地方。`,
        shorten(node.problemDescription ?? node.summary) || '先观察这处节点，再决定我们要守护什么。',
        shorten(node.significance) || '点开节点详情，继续了解它与整条水脉的关系。',
      ];
    }

    return [
      `你好，我是水脉灵小澜。让我们沿着${riverName}，从${region.shortName}开始读懂这条水脉。`,
      region.coreQuestion,
      shorten(region.functionDescription) || region.summary,
    ];
  }, [node, region, riverName]);
  const [segmentIndex, setSegmentIndex] = useState(0);

  useEffect(() => {
    setSegmentIndex(0);
  }, [sceneKey]);

  const isLastSegment = segmentIndex === segments.length - 1;

  return (
    <section
      className={`yellow-river-spirit-dialogue${isOpen ? '' : ' yellow-river-spirit-dialogue--dormant'}`}
      aria-hidden={!isOpen}
      aria-label={isOpen ? '水脉灵小澜分段对话' : undefined}
      onClick={(event) => event.stopPropagation()}
    >
      <div className="yellow-river-spirit-dialogue__character" role="img" aria-label="水脉灵小澜">
        <span className="yellow-river-spirit-dialogue__halo" aria-hidden="true" />
        <span className="yellow-river-spirit-dialogue__body" aria-hidden="true">
          <span className="yellow-river-spirit-dialogue__face" />
          <span className="yellow-river-spirit-dialogue__ribbon" />
        </span>
      </div>
      {isOpen && (
        <div className="yellow-river-spirit-dialogue__bubble">
          <div className="yellow-river-spirit-dialogue__meta">
            <span>小澜 · 水脉灵</span>
            <span>{segmentIndex + 1} / {segments.length}</span>
          </div>
          <p key={`${sceneKey}-${segmentIndex}`} className="yellow-river-spirit-dialogue__text" aria-live="polite">
            {segments[segmentIndex]}
          </p>
          <button
            type="button"
            className="yellow-river-spirit-dialogue__next"
            onClick={() => setSegmentIndex((currentIndex) => (isLastSegment ? 0 : currentIndex + 1))}
          >
            {isLastSegment ? '再听一遍' : '继续听'}
            <span aria-hidden="true"> →</span>
          </button>
        </div>
      )}
    </section>
  );
}

export default RiverSpiritDialogue;
