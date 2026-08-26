import { useEffect, useMemo, useState } from 'react';

import type { RiverNode, RiverRegion } from '@/types/basin';

interface YellowRiverSpiritDialogueProps {
  region: RiverRegion;
  node: RiverNode | null;
}

function shorten(text: string | undefined, maxLength = 74): string {
  if (!text) return '';
  return text.length > maxLength ? `${text.slice(0, maxLength)}…` : text;
}

function YellowRiverSpiritDialogue({ region, node }: YellowRiverSpiritDialogueProps) {
  const sceneKey = `${node?.id ?? 'region'}-${region.id}`;
  const segments = useMemo(() => {
    if (node) {
      return [
        `${node.shortName}已经抵达黄河的${region.shortName}。这里，是水脉变化被看见的地方。`,
        shorten(node.problemDescription ?? node.summary) || '先观察这处节点，再决定我们要守护什么。',
        shorten(node.significance) || '点开节点详情，继续了解它与整条黄河的关系。',
      ];
    }

    return [
      `你好，我是水脉灵小澜。让我们沿着黄河，从${region.shortName}开始读懂这条水脉。`,
      region.coreQuestion,
      shorten(region.functionDescription) || region.summary,
    ];
  }, [node, region]);
  const [segmentIndex, setSegmentIndex] = useState(0);

  useEffect(() => {
    setSegmentIndex(0);
  }, [sceneKey]);

  const isLastSegment = segmentIndex === segments.length - 1;
  const handleContinue = (): void => {
    setSegmentIndex((currentIndex) => (isLastSegment ? 0 : currentIndex + 1));
  };

  return (
    <section className="yellow-river-spirit-dialogue" aria-label="水脉灵小澜分段对话">
      <div className="yellow-river-spirit-dialogue__character" role="img" aria-label="水脉灵小澜">
        <span className="yellow-river-spirit-dialogue__halo" aria-hidden="true" />
        <span className="yellow-river-spirit-dialogue__body" aria-hidden="true">
          <span className="yellow-river-spirit-dialogue__face" />
          <span className="yellow-river-spirit-dialogue__ribbon" />
        </span>
      </div>
      <div className="yellow-river-spirit-dialogue__bubble">
        <div className="yellow-river-spirit-dialogue__meta">
          <span>小澜 · 水脉灵</span>
          <span>{segmentIndex + 1} / {segments.length}</span>
        </div>
        <p key={`${sceneKey}-${segmentIndex}`} className="yellow-river-spirit-dialogue__text" aria-live="polite">
          {segments[segmentIndex]}
        </p>
        <button type="button" className="yellow-river-spirit-dialogue__next" onClick={handleContinue}>
          {isLastSegment ? '再听一遍' : '继续听'}
          <span aria-hidden="true"> →</span>
        </button>
      </div>
    </section>
  );
}

export default YellowRiverSpiritDialogue;
