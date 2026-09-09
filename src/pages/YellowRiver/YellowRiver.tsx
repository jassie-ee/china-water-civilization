import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

import { useGovernanceProgress } from '@/components/common/governanceProgressContext';
import { useLanFooting, type LanMascotDialogue } from '@/components/lan-mascot';
import { yellowRiverRegions } from '@/data/yellowRiverRegions';
import { yellowRiverGovernanceNodeIds, yellowRiverNodes } from '@/data/yellowRiverNodes';
import { getReleaseMediaUrl } from '@/lib/media';
import { governanceDataSource } from '@/services/governanceDataSource';
import type { YellowRiverNode, YellowRiverNodeId, YellowRiverRegionId } from '@/types/basin';
import RiverSpiritGuide from '@/components/lan/RiverSpiritGuide';

import YellowRiverMap from './components/YellowRiverMap';
import YellowRiverNodeDetailPanel from './components/YellowRiverNodeDetailPanel';
import YellowRiverGovernancePanel from './components/YellowRiverGovernancePanel';
import './YellowRiver.css';

function hasDetailContent(node: YellowRiverNode): boolean {
  return Boolean(
    node.summary
    || node.problemDescription
    || node.causes?.length
    || node.governanceMeasures?.length
    || node.ecologicalImpacts?.length
    || node.culturalMeaning,
  );
}

const detailNodes = yellowRiverNodes
  .filter(hasDetailContent)
  .slice()
  .sort((firstNode, secondNode) => firstNode.sequence - secondNode.sequence);

const governanceNodes = yellowRiverGovernanceNodeIds
  .map((nodeId) => detailNodes.find((node) => node.id === nodeId))
  .filter((node): node is YellowRiverNode => node !== undefined);

type YellowRiverModalMode = 'detail' | 'governance';
type LoessInteractionStep = 'idle' | 'question' | 'correct' | 'downstream-dam' | 'check-dam';

const loessInteractionQuestion = '你看黄河这浑乎乎的样子，一河的泥沙往下冲，下游河床都快比房顶高了。你说要从根上解决泥沙，得从哪儿下手呀？';
const loessInteractionOptions = {
  correct: '在上游山坡种树种草，先把土稳住',
  downstreamDam: '在下游多修大坝，把泥沙全拦住',
  checkDam: '在山沟里一道道筑矮坝，把泥沙一层层拦住',
} as const;

const loessFeedback = {
  correct: {
    video: 'loess-plateau-a.mp4',
    copy: '哈哈果然被你说中了！把山上的土守住，泥沙就进不了河啦～原来治河的答案，居然在岸上！',
  },
  downstreamDam: {
    video: 'loess-plateau-b.mp4',
    copy: '光在下游拦沙可不行，上游源源不断往下冲，大坝迟早会被淤满的，再想想？',
  },
  checkDam: {
    video: 'loess-plateau-c.mp4',
    copy: '在山沟里筑坝确实能拦住不少沙，可如果上游山坡还在往下冲土，这些坝也会很快被填满，最根本的，还得从山上治起。',
  },
} as const;

interface RestoredModalState {
  nodeId: YellowRiverNodeId | null;
  modalMode: YellowRiverModalMode;
}

function getRestoredModalState(locationState: unknown): RestoredModalState {
  if (typeof locationState !== 'object' || locationState === null) {
    return { nodeId: null, modalMode: 'detail' };
  }

  const state = locationState as { selectedNodeId?: unknown; openNodeDetail?: unknown; openGovernance?: unknown };
  if (state.openNodeDetail !== true || typeof state.selectedNodeId !== 'string') {
    return { nodeId: null, modalMode: 'detail' };
  }

  return {
    nodeId: detailNodes.find((node) => node.id === state.selectedNodeId)?.id ?? null,
    modalMode: state.openGovernance === true ? 'governance' : 'detail',
  };
}

function YellowRiver() {
  const location = useLocation();
  const restoredModalState = getRestoredModalState(location.state);
  const restoredNodeId = restoredModalState.nodeId;
  const restoredNode = yellowRiverNodes.find((node) => node.id === restoredNodeId) ?? null;
  const [selectedRegionId, setSelectedRegionId] = useState<YellowRiverRegionId | null>(restoredNode?.regionId ?? null);
  const [previewRegionId, setPreviewRegionId] = useState<YellowRiverRegionId | null>(null);
  const [selectedNodeId, setSelectedNodeId] = useState<YellowRiverNodeId | null>(restoredNodeId);
  const [previewNodeId, setPreviewNodeId] = useState<YellowRiverNodeId | null>(null);
  const [modalMode, setModalMode] = useState<YellowRiverModalMode>(restoredModalState.modalMode);
  const [isDialogueOpen, setIsDialogueOpen] = useState(false);
  const [loessInteractionStep, setLoessInteractionStep] = useState<LoessInteractionStep>('idle');
  const [hasDismissedLoessInteraction, setHasDismissedLoessInteraction] = useState(false);
  const [loessRewardCopy, setLoessRewardCopy] = useState('');
  const { recordLevelResult } = useGovernanceProgress();
  const selectedDetailNode = useMemo(
    () => detailNodes.find((node) => node.id === selectedNodeId) ?? null,
    [selectedNodeId],
  );
  const selectedRegion = useMemo(
    () => yellowRiverRegions.find((region) => region.id === selectedRegionId) ?? yellowRiverRegions[0],
    [selectedRegionId],
  );

  const handleRegionPreview = (regionId: YellowRiverRegionId | null): void => {
    setPreviewRegionId(regionId);
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') setIsDialogueOpen(false);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  /** 节点预览只改变地图高亮，不改变右侧已选河段的说明内容。 */
  const handleNodePreview = (nodeId: YellowRiverNodeId | null): void => {
    const node = yellowRiverNodes.find((item) => item.id === nodeId);
    setPreviewNodeId(nodeId);
    setPreviewRegionId(node?.regionId ?? null);
  };

  const handleRegionSelect = (regionId: YellowRiverRegionId): void => {
    // 区域选择恢复区域面板，避免节点预览与区域说明同时竞争内容区。
    setSelectedRegionId(regionId);
    setPreviewRegionId(null);
    setSelectedNodeId(null);
    setPreviewNodeId(null);
    setModalMode('detail');
    setLoessInteractionStep('idle');
    setHasDismissedLoessInteraction(false);
    setIsDialogueOpen(true);
  };

  const handleNodeSelect = (nodeId: YellowRiverNodeId): void => {
    const node = yellowRiverNodes.find((item) => item.id === nodeId);
    if (!node) return;

    setSelectedNodeId(nodeId);
    setPreviewNodeId(null);
    setPreviewRegionId(null);
    setSelectedRegionId(node.regionId);
    setModalMode('detail');
    setLoessInteractionStep('idle');
    setHasDismissedLoessInteraction(false);
    setLoessRewardCopy('');
    setIsDialogueOpen(false);
  };

  const startLoessInteraction = useCallback((): void => {
    setLoessInteractionStep((currentStep) => currentStep === 'idle' ? 'question' : currentStep);
    setHasDismissedLoessInteraction(false);
    setIsDialogueOpen(true);
  }, []);

  const selectLoessOption = useCallback((option: keyof typeof loessInteractionOptions): void => {
    setHasDismissedLoessInteraction(false);
    setIsDialogueOpen(true);

    if (option === 'correct') {
      setLoessInteractionStep('correct');
      setLoessRewardCopy('正在记录治理星级…');
      void recordLevelResult('loess-plateau', 3).then((update) => {
        setLoessRewardCopy(update.didImprove
          ? '你获得了 3 点黄河治理星级。'
          : '这段治理星级已经记录过了，本次重温不再重复增加。');
      }).catch(() => setLoessRewardCopy('本地互动已完成，治理星级暂未能写入。'));
      return;
    }

    setLoessInteractionStep(option === 'downstreamDam' ? 'downstream-dam' : 'check-dam');
  }, [recordLevelResult]);

  const loessDialogue = useMemo<LanMascotDialogue | undefined>(() => {
    if (selectedDetailNode?.id !== 'loess-plateau' || loessInteractionStep === 'idle') return undefined;

    if (loessInteractionStep === 'question') {
      return {
        conversationId: 'loess-plateau-question',
        dialogLabel: '小澜的黄土高原互动',
        messages: [loessInteractionQuestion],
        actionLabel: '做出选择',
        onAction: () => undefined,
        choices: [
          { id: 'loess-option-a', label: `A. ${loessInteractionOptions.correct}`, onSelect: () => selectLoessOption('correct') },
          { id: 'loess-option-b', label: `B. ${loessInteractionOptions.downstreamDam}`, onSelect: () => selectLoessOption('downstreamDam') },
          { id: 'loess-option-c', label: `C. ${loessInteractionOptions.checkDam}`, onSelect: () => selectLoessOption('checkDam') },
        ],
        closeOnBackdrop: true,
        closeOnEscape: true,
        showClose: true,
      };
    }

    const feedbackKey = loessInteractionStep === 'correct'
      ? 'correct'
      : loessInteractionStep === 'downstream-dam'
        ? 'downstreamDam'
        : 'checkDam';
    const feedback = loessFeedback[feedbackKey];
    const isCorrect = feedbackKey === 'correct';

    return {
      conversationId: `loess-plateau-${feedbackKey}-feedback`,
      dialogLabel: '小澜的黄土高原互动',
      messages: [isCorrect ? `${feedback.copy}${loessRewardCopy ? ` ${loessRewardCopy}` : ''}` : feedback.copy],
      actionLabel: isCorrect ? '完成互动' : '重新选择',
      onAction: () => {
        if (isCorrect) {
          setHasDismissedLoessInteraction(true);
          setIsDialogueOpen(false);
        }
        else setLoessInteractionStep('question');
      },
      media: {
        src: getReleaseMediaUrl(feedback.video),
        title: `黄土高原互动反馈：${feedback.video}`,
      },
      closeOnBackdrop: true,
      closeOnEscape: true,
      showClose: true,
    };
  }, [loessInteractionStep, loessRewardCopy, selectLoessOption, selectedDetailNode?.id]);
  const loessFootingConfig = useMemo(() => ({
    pageId: 'chapter-two-黄河',
    routePath: '/basins/yellow-river',
    sceneId: 'loess-bloom' as const,
    visible: loessDialogue !== undefined,
  }), [loessDialogue]);
  useLanFooting(loessFootingConfig);

  const handleLoessDialogueClose = useCallback((): void => {
    setIsDialogueOpen(false);
    if (selectedDetailNode?.id === 'loess-plateau' && loessInteractionStep !== 'idle') {
      setHasDismissedLoessInteraction(true);
    }
  }, [loessInteractionStep, selectedDetailNode?.id]);

  const handleDetailClose = (): void => {
    const triggerNodeId = selectedNodeId;
    setSelectedNodeId(null);
    setPreviewNodeId(null);
    setPreviewRegionId(null);
    setModalMode('detail');

    // 详情关闭后回到原节点，避免键盘焦点留在已移除的侧栏中。
    window.requestAnimationFrame(() => {
      document.getElementById(`yellow-river-node-${triggerNodeId}`)?.focus();
    });
  };

  const selectedDetailIndex = selectedDetailNode
    ? governanceNodes.findIndex((node) => node.id === selectedDetailNode.id)
    : -1;
  const previousDetailNode = selectedDetailIndex >= 0
    ? governanceNodes[(selectedDetailIndex - 1 + governanceNodes.length) % governanceNodes.length]
    : null;
  const nextDetailNode = selectedDetailIndex >= 0
    ? governanceNodes[(selectedDetailIndex + 1) % governanceNodes.length]
    : null;
  const selectedDetailRegion = selectedDetailNode
    ? yellowRiverRegions.find((region) => region.id === selectedDetailNode.regionId) ?? selectedRegion
    : null;
  const governanceLevel = selectedDetailNode
    ? governanceDataSource.getQuestionLevelConfig(selectedDetailNode.id)
    : null;
  return (
    <section className="yellow-river-page yellow-river-page--atlas" onClick={() => setIsDialogueOpen(false)}>
      <header className="yellow-river-page__header">
        <Link className="yellow-river-page__back" to="/basins" state={{ basinOverviewEntry: 'returning' }}>
          返回中国流域总览
        </Link>
        <div className="river-atlas-heading">
          <h1>黄河流域</h1>
          <p>水沙共生的河流长卷</p>
        </div>
      </header>

      <main className="yellow-river-page__content">
        <section className="yellow-river-page__map-section" aria-label="黄河上中下游互动水脉地图">
          <div className="yellow-river-page__map-stage">
            <YellowRiverMap
              selectedRegionId={selectedRegionId}
              previewRegionId={previewRegionId}
              selectedNodeId={selectedNodeId}
              previewNodeId={previewNodeId}
              onRegionSelect={handleRegionSelect}
              onRegionPreview={handleRegionPreview}
              onNodeSelect={handleNodeSelect}
              onNodePreview={handleNodePreview}
              onBlankClick={() => setIsDialogueOpen(false)}
            />
            <RiverSpiritGuide
              isOpen={isDialogueOpen}
              riverName="黄河"
              region={selectedRegion}
              node={selectedDetailNode}
              dialogueOverride={loessDialogue}
              expressionOverride={loessInteractionStep === 'correct' ? 'happy' : loessDialogue ? 'thinking' : undefined}
              onDialogueClose={handleLoessDialogueClose}
            />
          </div>
        </section>
      </main>
      {selectedDetailNode && selectedDetailRegion && (
        <div className="yellow-river-detail-modal" role="presentation" onClick={handleDetailClose}>
          <div className={`yellow-river-detail-modal__dialog${modalMode === 'governance' ? ' yellow-river-detail-modal__dialog--governance' : ''}`} onClick={(event) => event.stopPropagation()}>
            {modalMode === 'governance' && governanceLevel !== null ? (
              <YellowRiverGovernancePanel
                node={selectedDetailNode}
                region={selectedDetailRegion}
                level={governanceLevel}
                onBackToDetail={() => setModalMode('detail')}
                onClose={handleDetailClose}
              />
            ) : (
              <YellowRiverNodeDetailPanel
                node={selectedDetailNode}
                region={selectedDetailRegion}
                previousNode={previousDetailNode}
                nextNode={nextDetailNode}
                onClose={handleDetailClose}
                onStartGovernance={() => setModalMode('governance')}
                onStartEcologicalInteraction={startLoessInteraction}
                showContinueInteraction={selectedDetailNode.id === 'loess-plateau' && loessInteractionStep !== 'idle' && hasDismissedLoessInteraction}
                onSelectPrevious={previousDetailNode ? () => handleNodeSelect(previousDetailNode.id) : undefined}
                onSelectNext={nextDetailNode ? () => handleNodeSelect(nextDetailNode.id) : undefined}
              />
            )}
          </div>
        </div>
      )}
    </section>
  );
}

export default YellowRiver;
