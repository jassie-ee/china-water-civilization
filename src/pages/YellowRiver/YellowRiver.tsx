import { lazy, Suspense, useCallback, useMemo, useState, type MouseEvent } from 'react';
import { Link, useLocation } from 'react-router-dom';

import { useGovernanceProgress } from '@/components/common/governanceProgressContext';
import { useLanFooting, type LanMascotDialogue } from '@/components/lan-mascot';
import RiverSpiritGuide from '@/components/lan/RiverSpiritGuide';
import { yellowRiverNodes } from '@/data/yellowRiverNodes';
import { yellowRiverRegions } from '@/data/yellowRiverRegions';
import usePrefersReducedMotion from '@/hooks/usePrefersReducedMotion';
import { getReleaseMediaUrl } from '@/lib/media';
import loessStormBackground from '@/assets/images/basins/yellow-river-loess-storm.webp';
import engineeringWaterBackground from '@/assets/images/basins/yellow-river-engineering-water.webp';
import deltaWetlandBackground from '@/assets/images/basins/yellow-river-delta-wetland.webp';

import LoessPlateauNarrative from './components/LoessPlateauNarrative';
import NodeVideoPanel from './components/NodeVideoPanel';
import YellowRiverDeltaAtlas, { type DeltaAtlasSectionId } from './components/YellowRiverDeltaAtlas';
import type { YellowRiverNarrativeId } from './components/YellowRiverAtmosphere';
import './YellowRiver.css';

const YellowRiverAtmosphere = lazy(() => import('./components/YellowRiverAtmosphere'));
type LoessInteractionStep = 'idle' | 'question' | 'correct' | 'downstream-dam' | 'check-dam';
type XiaolangdiInteractionStep = 'idle' | 'question' | 'correct' | 'single-operation' | 'flat-operation';

const narratives: Array<{ id: YellowRiverNarrativeId; label: string; title: string; summary: string }> = [
  { id: 'sediment', label: '黄土入河', title: '泥沙从哪里来', summary: '先看见黄土高原的每一次冲刷，才能理解黄河为何浑黄。' },
  { id: 'system', label: '水沙协同', title: '怎样让水沙慢下来', summary: '三座工程不是各自工作，而是共同组织黄河的水与沙。' },
  { id: 'delta', label: '河海之间', title: '最终滋养什么', summary: '治理的终点，是让河口湿地与生命继续生长。' },
];
const loessQuestion = '你看黄河这浑乎乎的样子，一河的泥沙往下冲，下游河床都快比房顶高了。你说要从根上解决泥沙，得从哪儿下手呀？';
const loessOptions = { correct: '在上游山坡种树种草，先把土稳住', downstreamDam: '在下游多修大坝，把泥沙全拦住', checkDam: '在山沟里一道道筑矮坝，把泥沙一层层拦住' } as const;
const loessFeedback = {
  correct: { video: 'loess-plateau-a.mp4', copy: '哈哈果然被你说中了！把山上的土守住，泥沙就进不了河啦～原来治河的答案，居然在岸上！' },
  downstreamDam: { video: 'loess-plateau-b.mp4', copy: '光在下游拦沙可不行，上游源源不断往下冲，大坝迟早会被淤满的，再想想？' },
  checkDam: { video: 'loess-plateau-c.mp4', copy: '在山沟里筑坝确实能拦住不少沙，可如果上游山坡还在往下冲土，这些坝也会很快被填满，最根本的，还得从山上治起。' },
} as const;
const xiaolangdiQuestion = '来水、来沙都在变化。若想让调水调沙真正帮助下游河道，最关键的做法是什么？';
const xiaolangdiOptions = {
  correct: '共享预报与库情，让水库群按时序联合调度',
  singleOperation: '只依据小浪底自身库情独立安排泄流',
  flatOperation: '所有水库保持固定下泄，不再根据河道响应调整',
} as const;
const xiaolangdiFeedback = {
  correct: '答对了！调水调沙不是一座水库单独排水，而是让上游来水、库群调节和下游河道响应形成同一个过程。',
  singleOperation: '小浪底很关键，但单库运行无法掌握整条黄河的来水来沙过程。再想一想怎样让库群彼此配合。',
  flatOperation: '固定下泄看似稳定，却可能错过排沙、削峰和生态补水所需的时机。调度需要跟着预报与河道响应走。',
} as const;
const narrativeBackgrounds: Partial<Record<YellowRiverNarrativeId, string>> = {
  sediment: loessStormBackground,
  system: engineeringWaterBackground,
  delta: deltaWetlandBackground,
};

interface SceneRipple {
  id: number;
  x: number;
  y: number;
}

function YellowRiverSceneBackground({ activeSceneId }: { activeSceneId: YellowRiverNarrativeId }) {
  const image = narrativeBackgrounds[activeSceneId];
  if (!image) return null;
  return <div className="yellow-river-chronicle__scene-background" aria-hidden="true"><img key={activeSceneId} src={image} alt="" /></div>;
}

function YellowRiverRoute({ activeSceneId }: { activeSceneId: YellowRiverNarrativeId }) {
  const paths: Record<YellowRiverNarrativeId, string> = {
    sediment: 'M 5 78 C 24 62, 31 82, 47 59 S 75 32, 96 17',
    system: 'M 4 68 C 21 63, 31 38, 48 50 S 72 70, 96 26',
    delta: 'M 4 72 C 26 63, 43 62, 56 47 S 78 31, 96 43',
  };
  return <svg className="yellow-river-chronicle__route" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><path key={activeSceneId} className="yellow-river-chronicle__route-path" d={paths[activeSceneId]} /></svg>;
}

function getInitialNarrativeId(locationState: unknown): YellowRiverNarrativeId {
  const selectedNodeId = typeof locationState === 'object' && locationState !== null ? (locationState as { selectedNodeId?: unknown }).selectedNodeId : undefined;
  if (selectedNodeId === 'loess-plateau') return 'sediment';
  if (selectedNodeId === 'yellow-river-delta-wetland') return 'delta';
  if (typeof selectedNodeId === 'string') return 'system';
  return 'sediment';
}

function YellowRiver() {
  const location = useLocation();
  const prefersReducedMotion = usePrefersReducedMotion();
  const [activeNarrativeId, setActiveNarrativeId] = useState<YellowRiverNarrativeId>(() => getInitialNarrativeId(location.state));
  const [isDialogueOpen, setIsDialogueOpen] = useState(false);
  const [loessStep, setLoessStep] = useState<LoessInteractionStep>('idle');
  const [isLoessDialogueDismissed, setIsLoessDialogueDismissed] = useState(false);
  const [loessRewardCopy, setLoessRewardCopy] = useState('');
  const [xiaolangdiStep, setXiaolangdiStep] = useState<XiaolangdiInteractionStep>('idle');
  const [xiaolangdiRewardCopy, setXiaolangdiRewardCopy] = useState('');
  const [sceneRipple, setSceneRipple] = useState<SceneRipple | null>(null);
  const [deltaSectionId, setDeltaSectionId] = useState<DeltaAtlasSectionId>('estuary');
  const { recordLevelResult } = useGovernanceProgress();
  const loessNode = yellowRiverNodes.find((node) => node.id === 'loess-plateau');
  const deltaNode = yellowRiverNodes.find((node) => node.id === 'yellow-river-delta-wetland');
  const activeNarrative = narratives.find((item) => item.id === activeNarrativeId) ?? narratives[0];

  const selectNarrative = useCallback((id: YellowRiverNarrativeId): void => { setActiveNarrativeId(id); setIsDialogueOpen(false); }, []);
  const handleAnchorSelection = useCallback((id: YellowRiverNarrativeId, event: MouseEvent<HTMLButtonElement>): void => {
    const bounds = event.currentTarget.getBoundingClientRect();
    setSceneRipple({ id: Date.now(), x: event.clientX || bounds.left + bounds.width / 2, y: event.clientY || bounds.top + bounds.height / 2 });
    selectNarrative(id);
  }, [selectNarrative]);
  const startLoessInteraction = useCallback((): void => {
    setLoessStep((current) => current === 'idle' ? 'question' : current);
    setIsLoessDialogueDismissed(false);
    setIsDialogueOpen(true);
  }, []);
  const startXiaolangdiInteraction = useCallback((): void => {
    setXiaolangdiStep((current) => current === 'idle' ? 'question' : current);
    setIsDialogueOpen(true);
  }, []);
  const selectLoessOption = useCallback((option: keyof typeof loessOptions): void => {
    setIsLoessDialogueDismissed(false);
    setIsDialogueOpen(true);
    if (option === 'correct') {
      setLoessStep('correct');
      setLoessRewardCopy('正在记录治理星级…');
      void recordLevelResult('loess-plateau', 3).then((update) => setLoessRewardCopy(update.didImprove ? '你获得了 3 点黄河治理星级。' : '这段治理星级已经记录过了，本次重温不再重复增加。')).catch(() => setLoessRewardCopy('本地互动已完成，治理星级暂未能写入。'));
      return;
    }
    setLoessStep(option === 'downstreamDam' ? 'downstream-dam' : 'check-dam');
  }, [recordLevelResult]);
  const selectXiaolangdiOption = useCallback((option: keyof typeof xiaolangdiOptions): void => {
    setIsDialogueOpen(true);
    if (option === 'correct') {
      setXiaolangdiStep('correct');
      setXiaolangdiRewardCopy('正在记录治理星级…');
      void recordLevelResult('xiaolangdi', 3).then((update) => setXiaolangdiRewardCopy(update.didImprove ? '你获得了 3 点黄河治理星级。' : '这段治理星级已经记录过了，本次重温不再重复增加。')).catch(() => setXiaolangdiRewardCopy('本地互动已完成，治理星级暂未能写入。'));
      return;
    }
    setXiaolangdiStep(option === 'singleOperation' ? 'single-operation' : 'flat-operation');
  }, [recordLevelResult]);

  const loessDialogue = useMemo<LanMascotDialogue | undefined>(() => {
    if (activeNarrativeId === 'system' && xiaolangdiStep !== 'idle') {
      if (xiaolangdiStep === 'question') return {
        conversationId: 'xiaolangdi-water-sediment-question', dialogLabel: '小澜的调水调沙互动', heading: '小浪底调水调沙', messages: [xiaolangdiQuestion], actionLabel: '做出选择', onAction: () => undefined,
        choicePresentation: 'dispatch', choices: [
          { id: 'xiaolangdi-a', label: `A. ${xiaolangdiOptions.correct}`, onSelect: () => selectXiaolangdiOption('correct') },
          { id: 'xiaolangdi-b', label: `B. ${xiaolangdiOptions.singleOperation}`, onSelect: () => selectXiaolangdiOption('singleOperation') },
          { id: 'xiaolangdi-c', label: `C. ${xiaolangdiOptions.flatOperation}`, onSelect: () => selectXiaolangdiOption('flatOperation') },
        ], closeOnBackdrop: true, closeOnEscape: true, showClose: true,
      };
      const feedbackKey = xiaolangdiStep === 'correct' ? 'correct' : xiaolangdiStep === 'single-operation' ? 'singleOperation' : 'flatOperation';
      const isCorrect = feedbackKey === 'correct';
      return {
        conversationId: `xiaolangdi-water-sediment-${feedbackKey}`, dialogLabel: '小澜的调水调沙互动', heading: isCorrect ? '水沙协同完成' : '再想一想',
        messages: [`${xiaolangdiFeedback[feedbackKey]}${isCorrect && xiaolangdiRewardCopy ? ` ${xiaolangdiRewardCopy}` : ''}`], actionLabel: isCorrect ? '完成互动' : '重新选择',
        onAction: () => { if (isCorrect) setIsDialogueOpen(false); else setXiaolangdiStep('question'); }, closeOnBackdrop: true, closeOnEscape: true, showClose: true,
      };
    }
    if (loessStep === 'idle') return undefined;
    if (loessStep === 'question') return {
      conversationId: 'loess-plateau-question', dialogLabel: '小澜的黄土高原互动', messages: [loessQuestion], actionLabel: '做出选择', onAction: () => undefined,
      choices: [
        { id: 'loess-a', label: `A. ${loessOptions.correct}`, onSelect: () => selectLoessOption('correct') },
        { id: 'loess-b', label: `B. ${loessOptions.downstreamDam}`, onSelect: () => selectLoessOption('downstreamDam') },
        { id: 'loess-c', label: `C. ${loessOptions.checkDam}`, onSelect: () => selectLoessOption('checkDam') },
      ], closeOnBackdrop: true, closeOnEscape: true, showClose: true,
    };
    const feedbackKey = loessStep === 'correct' ? 'correct' : loessStep === 'downstream-dam' ? 'downstreamDam' : 'checkDam';
    const feedback = loessFeedback[feedbackKey];
    const isCorrect = feedbackKey === 'correct';
    return {
      conversationId: `loess-plateau-${feedbackKey}-feedback`, dialogLabel: '小澜的黄土高原互动',
      messages: [isCorrect ? `${feedback.copy}${loessRewardCopy ? ` ${loessRewardCopy}` : ''}` : feedback.copy], actionLabel: isCorrect ? '完成互动' : '重新选择',
      onAction: () => { if (isCorrect) { setIsLoessDialogueDismissed(true); setIsDialogueOpen(false); } else setLoessStep('question'); },
      media: { src: getReleaseMediaUrl(feedback.video), title: `黄土高原互动反馈：${feedback.video}` }, closeOnBackdrop: true, closeOnEscape: true, showClose: true,
    };
  }, [activeNarrativeId, loessRewardCopy, loessStep, selectLoessOption, selectXiaolangdiOption, xiaolangdiRewardCopy, xiaolangdiStep]);

  useLanFooting({ pageId: 'yellow-river-chronicle', routePath: '/basins/yellow-river', sceneId: 'loess-bloom', visible: loessDialogue !== undefined });
  const handleDialogueClose = useCallback((): void => { setIsDialogueOpen(false); if (loessStep !== 'idle') setIsLoessDialogueDismissed(true); }, [loessStep]);

  return (
    <section className={`yellow-river-chronicle yellow-river-chronicle--${activeNarrativeId}`}>
      <YellowRiverSceneBackground activeSceneId={activeNarrativeId} />
      <YellowRiverRoute activeSceneId={activeNarrativeId} />
      {sceneRipple && !prefersReducedMotion && <span key={sceneRipple.id} className="yellow-river-chronicle__ripple" style={{ left: sceneRipple.x, top: sceneRipple.y }} aria-hidden="true"><i /><i /><i /></span>}
      <Suspense fallback={null}><YellowRiverAtmosphere activeNarrativeId={activeNarrativeId} deltaSectionId={deltaSectionId} reducedMotion={prefersReducedMotion} /></Suspense>
      <header className="yellow-river-chronicle__header">
        <Link className="yellow-river-chronicle__back" to="/basins" state={{ basinOverviewEntry: 'returning' }}>返回中国流域总览</Link>
        <div className="yellow-river-chronicle__title"><p>黄河水沙命运长卷</p><h1>黄河流域</h1></div>
      </header>
      <nav className="yellow-river-chronicle__anchors" aria-label="黄河叙事章节">
        {narratives.map((item) => <button key={item.id} type="button" className={item.id === activeNarrativeId ? 'is-active' : ''} aria-current={item.id === activeNarrativeId ? 'step' : undefined} onClick={(event) => handleAnchorSelection(item.id, event)}><span>{item.label}</span></button>)}
      </nav>
      <main className="yellow-river-chronicle__stage">
        <div key={`annotation-${activeNarrativeId}`} className="yellow-river-chronicle__heading" aria-live="polite"><p>{activeNarrative.label}</p><h2>{activeNarrative.title}</h2><span>{activeNarrative.summary}</span></div>
        {activeNarrativeId === 'sediment' && loessNode && <article className="yellow-river-chronicle__scene yellow-river-chronicle__scene--sediment">
          <div className="yellow-river-chronicle__media">
            <NodeVideoPanel video={loessNode.media?.video} onComplete={startLoessInteraction} skipLabel="跳过影像，开始互动" />
            <button className="yellow-river-chronicle__interaction" type="button" onClick={startLoessInteraction}>{isLoessDialogueDismissed && loessStep !== 'idle' ? '继续与小澜互动' : '开始互动'}</button>
          </div>
          <div className="yellow-river-chronicle__reading"><LoessPlateauNarrative compact /></div>
        </article>}
        {activeNarrativeId === 'system' && <article className="yellow-river-chronicle__scene yellow-river-chronicle__scene--system">
          <div className="yellow-river-chronicle__media">
            <NodeVideoPanel video={{ title: '小浪底调水调沙影像', description: '视频将从 Release 按需加载。', src: getReleaseMediaUrl('xiaolangdi-water-sediment.mp4') }} onComplete={startXiaolangdiInteraction} skipLabel="跳过影像，开始互动" />
            <button className="yellow-river-chronicle__interaction" type="button" onClick={startXiaolangdiInteraction}>{xiaolangdiStep === 'idle' ? '开始互动' : '继续与小澜互动'}</button>
          </div>
          <div className="yellow-river-chronicle__engineering-copy" aria-live="polite"><p>水库群联合调度</p><h3>让水与沙在同一次行动中抵达下游</h3><span>小浪底不是单独工作的“拦水墙”。它与上游水库共享预报、库情和河道响应，在合适的时机共同组织来水与泄流。</span><div className="yellow-river-chronicle__system-process"><strong>来水研判</strong><b>→</b><strong>库群协同</strong><b>→</b><strong>排沙塑槽</strong></div><blockquote>工程的角色不是把黄河困住，而是在尊重水沙规律的前提下，为洪水、泥沙、供水与生态补水安排合适的节奏。</blockquote></div>
        </article>}
        {activeNarrativeId === 'delta' && deltaNode && <article className="yellow-river-chronicle__scene yellow-river-chronicle__scene--delta">
          <YellowRiverDeltaAtlas activeSectionId={deltaSectionId} onSectionChange={setDeltaSectionId} />
        </article>}
      </main>
      <RiverSpiritGuide isOpen={isDialogueOpen} riverName="黄河" region={yellowRiverRegions[1]} node={activeNarrativeId === 'sediment' ? loessNode ?? null : yellowRiverNodes.find((node) => node.id === 'xiaolangdi') ?? null} dialogueOverride={loessDialogue} expressionOverride={loessStep === 'correct' || xiaolangdiStep === 'correct' ? 'happy' : loessDialogue ? 'thinking' : undefined} onDialogueClose={handleDialogueClose} />
    </section>
  );
}

export default YellowRiver;
