import { useCallback, useEffect, useMemo, useState } from 'react';

import { useChapterSpirit, type ChapterSpiritAction, type ChapterSpiritConfig, type ChapterSpiritDialogue } from '@/components/chapter-spirit';
import type { RiverNode, RiverRegion } from '@/types/basin';

interface RiverSpiritGuideProps {
  isOpen: boolean;
  riverName: string;
  region: RiverRegion;
  node: RiverNode | null;
  dialogueOverride?: ChapterSpiritDialogue;
  actionOverride?: ChapterSpiritAction;
  onDialogueClose?: () => void;
}

const riverRoutePaths: Record<string, string> = {
  黄河: '/basins/yellow-river',
  长江: '/basins/yangtze-river',
  珠江: '/basins/pearl-river',
};

function shorten(text: string | undefined, maxLength = 74): string {
  if (!text) return '';
  return text.length > maxLength ? `${text.slice(0, maxLength)}…` : text;
}

function RiverSpiritGuide({ isOpen, riverName, region, node, dialogueOverride, actionOverride, onDialogueClose }: RiverSpiritGuideProps) {
  const [replayKey, setReplayKey] = useState(0);
  const sceneKey = `${riverName}-${node?.id ?? 'region'}-${region.id}`;
  const messages = useMemo(() => {
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
  const replayDialogue = useCallback(() => setReplayKey((currentKey) => currentKey + 1), []);
  const mascotConfig = useMemo<ChapterSpiritConfig>(() => ({
    pageId: `chapter-two-${riverName}`,
    routePath: riverRoutePaths[riverName],
    dialogue: dialogueOverride ?? {
      conversationId: `${sceneKey}-${replayKey}`,
      dialogLabel: `${riverName}水脉导览`,
      messages,
      actionLabel: '再听一遍',
      onAction: replayDialogue,
    },
    dialogueId: `lan-dialogue-${riverName}`,
    action: actionOverride ?? (node ? 'point-water' : 'happy'),
    initialPosition: { x: 16, y: 82 },
    spriteAlt: `${riverName}水脉精灵小澜，点击打开或关闭导览，也可以拖动`,
    dialoguePresentation: dialogueOverride ? 'modal' : 'floating',
    onDialogueClose,
  }), [actionOverride, dialogueOverride, messages, node, onDialogueClose, replayDialogue, replayKey, riverName, sceneKey]);
  const { closeDialogue, openDialogue } = useChapterSpirit(mascotConfig);

  useEffect(() => {
    if (isOpen) {
      openDialogue();
    } else {
      closeDialogue();
    }
  }, [closeDialogue, isOpen, openDialogue, sceneKey]);

  return null;
}

export default RiverSpiritGuide;
