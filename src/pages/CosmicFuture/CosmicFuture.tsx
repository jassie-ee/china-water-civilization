import { Fragment, useRef, useState, type CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';

import chapter4Awakening from '@/assets/images/scenes/chapter-4/awakening.webp';
import chapter4CosmicVoyage from '@/assets/images/scenes/chapter-4/cosmic-voyage.webp';
import chapter4EarthReflection from '@/assets/images/scenes/chapter-4/earth-reflection.webp';
import chapter4MemoryAssembly from '@/assets/images/scenes/chapter-4/memory-assembly.webp';
import { useGovernanceProgress } from '@/components/common/governanceProgressContext';
import ChapterChoicePanel from '@/components/chapter/ChapterChoicePanel';
import ChapterGuide from '@/components/chapter/ChapterGuide';
import { type ChapterSpiritAction, type ChapterSpiritMood } from '@/components/chapter/ChapterSpirit';
import EnergyOrb from '@/components/chapter/EnergyOrb';
import FlowingContours from '@/components/chapter/FlowingContours';
import InkRipple, { type InkRippleTrigger } from '@/components/chapter/InkRipple';
import Magnet from '@/components/chapter/Magnet';
import StatefulActionButton from '@/components/chapter/StatefulActionButton';
import WaterMist from '@/components/chapter/WaterMist';
import { cosmicActs, cosmicReflectionChoices } from '@/data/cosmicConstraint';
import type { CosmicAct, CosmicActId, CosmicChoice } from '@/types/cosmicConstraint';
import { loadChapterCompletion, markChapterComplete } from '@/utils/chapterCompletion';

import './CosmicFuture.css';

gsap.registerPlugin(useGSAP);

type CosmicPhase = 'assembly' | 'reflection' | 'voyage' | 'awakening' | 'complete';
type CosmicSceneId = 'assembly' | 'reflection' | 'voyage' | 'awakening';

interface CosmicScene {
  id: CosmicSceneId;
  objectPosition: string;
  poster: string;
}

const cosmicScenes: Record<CosmicSceneId, CosmicScene> = {
  assembly: { id: 'assembly', objectPosition: '50% 48%', poster: chapter4MemoryAssembly },
  reflection: { id: 'reflection', objectPosition: '48% 44%', poster: chapter4EarthReflection },
  voyage: { id: 'voyage', objectPosition: '50% 50%', poster: chapter4CosmicVoyage },
  awakening: { id: 'awakening', objectPosition: '50% 50%', poster: chapter4Awakening },
};

function getCosmicScene(phase: CosmicPhase): CosmicScene {
  if (phase === 'reflection') return cosmicScenes.reflection;
  if (phase === 'voyage') return cosmicScenes.voyage;
  if (phase === 'awakening' || phase === 'complete') return cosmicScenes.awakening;
  return cosmicScenes.assembly;
}

const shardNames = ['源', '行', '望'];
const shardPositions = [
  { x: 24, y: 18 },
  { x: 71, y: 34 },
  { x: 22, y: 73 },
] as const;

function getActForPhase(phase: CosmicPhase): CosmicActId {
  if (phase === 'assembly' || phase === 'reflection') return 'earth-heaven';
  if (phase === 'voyage') return 'galaxy-voyage';
  return 'all-things';
}

function isActRecorded(act: CosmicAct, phase: CosmicPhase, assembledShardIds: readonly number[]): boolean {
  if (act.kind === 'assembly') return assembledShardIds.length === shardNames.length;
  if (act.kind === 'voyage') return phase === 'voyage' || phase === 'awakening' || phase === 'complete';
  return phase === 'awakening' || phase === 'complete';
}

function CosmicFuture() {
  const { recordLevelResult } = useGovernanceProgress();
  const pageRef = useRef<HTMLElement | null>(null);
  const [initialChapter4Complete] = useState(() => loadChapterCompletion().chapter4);
  const [isChapter4Complete, setIsChapter4Complete] = useState(initialChapter4Complete);
  const [phase, setPhase] = useState<CosmicPhase>(initialChapter4Complete ? 'complete' : 'assembly');
  const [assembledShardIds, setAssembledShardIds] = useState<number[]>(
    initialChapter4Complete ? [0, 1, 2] : [],
  );
  const [reflectionChoiceId, setReflectionChoiceId] = useState<string | null>(null);
  const [reflectionStars, setReflectionStars] = useState<1 | 2 | 3>(3);
  const [ripple, setRipple] = useState<InkRippleTrigger | null>(null);

  const activeActId = getActForPhase(phase);
  const activeAct = cosmicActs.find((act) => act.id === activeActId) ?? cosmicActs[0];
  const routeStops = activeAct.routeStops ?? [];
  const activeCosmicScene = getCosmicScene(phase);
  const isAssemblyComplete = assembledShardIds.length === shardNames.length;
  const waterFeel = phase === 'assembly' ? 0 : phase === 'reflection' ? 10 : phase === 'voyage' ? 20 : 30;
  const progressPercent = Math.round((waterFeel / 30) * 100);
  const panelKey = `phase-${phase}`;
  const spiritMood: ChapterSpiritMood = phase === 'complete' || phase === 'awakening'
    ? 'resolved'
    : phase === 'reflection' || phase === 'voyage'
      ? reflectionChoiceId !== null ? 'recorded' : 'listening'
      : 'resting';
  const spiritAction: ChapterSpiritAction = phase === 'awakening'
    ? 'purify'
    : phase === 'complete'
      ? 'happy'
      : phase === 'reflection'
        ? 'hold-water'
        : phase === 'voyage'
          ? 'sleeve'
          : isAssemblyComplete
            ? 'sleeve'
            : 'point-water';

  const triggerRipple = (x: number, y: number): void => {
    setRipple((current) => ({
      id: (current?.id ?? 0) + 1,
      x,
      y,
      tone: 'gold',
    }));
  };

  const handleAssembleShard = (shardIndex: number): void => {
    if (phase !== 'assembly') return;
    const position = shardPositions[shardIndex] ?? { x: 50, y: 50 };
    triggerRipple(position.x, position.y);
    setAssembledShardIds((current) => current.includes(shardIndex) ? current : [...current, shardIndex]);
  };

  const handleReflectionChoice = (choice: CosmicChoice): void => {
    if (phase !== 'reflection' || reflectionChoiceId !== null) return;
    setReflectionChoiceId(choice.id);
    setReflectionStars(choice.stars);
  };

  const handleEnterReflection = (): void => {
    if (isAssemblyComplete) setPhase('reflection');
  };

  const handleReflectionContinue = (): void => {
    if (reflectionChoiceId !== null) setPhase('voyage');
  };

  const handleLaunch = (): void => {
    if (reflectionChoiceId !== null) setPhase('awakening');
  };

  const handleComplete = (): void => {
    if (phase !== 'awakening') return;
    markChapterComplete('chapter4');
    setIsChapter4Complete(true);
    setPhase('complete');
    void recordLevelResult('chapter-4-final-awakening', reflectionStars).catch(() => undefined);
  };

  const handleStageClick = (act: CosmicAct): void => {
    if (act.kind === 'assembly') {
      setPhase('assembly');
      return;
    }

    if (act.kind === 'voyage' && isAssemblyComplete && reflectionChoiceId !== null) {
      setPhase('voyage');
    }

    if (act.kind === 'awakening' && (phase === 'voyage' || phase === 'awakening' || phase === 'complete')) {
      setPhase('awakening');
    }
  };

  const handleReplay = (): void => {
    setPhase('assembly');
    setAssembledShardIds([]);
    setReflectionChoiceId(null);
    setReflectionStars(3);
  };

  const guideMessages = phase === 'assembly'
    ? ['先把三块水脉碎片拼回同一张图。', '点击碎片，让它们回到水线上。']
    : phase === 'reflection'
      ? ['现在没有标准答案。', '选择你愿意带向星河的判断。']
      : phase === 'voyage'
        ? ['水线已经连上星河。', '准备好后，启动这一段航行。']
        : phase === 'awakening'
          ? ['所有记忆正在重新合流。', '让最后一道水线回到天地之间。']
          : ['散落的记忆已经回到水脉。', '如果愿意，可以重新观看这段旅程。'];
  const guideActionLabel = phase === 'assembly'
    ? isAssemblyComplete ? '进入共生之问' : '去拼合碎片'
    : phase === 'reflection'
      ? reflectionChoiceId === null ? '回到共生之问' : '继续向星河'
      : phase === 'voyage'
        ? '启动航行'
        : phase === 'awakening'
          ? '完成觉醒'
          : '重新体验';

  useGSAP(() => {
    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)', () => {
      const page = pageRef.current;
      if (page === null) return;

      const backdrop = page.querySelector<HTMLElement>('.cosmic-future-page__backdrop');
      const orbitSurface = page.querySelector<HTMLElement>('.cosmic-future-orbit__surface');
      const panel = page.querySelector<HTMLElement>('.cosmic-future-page__panel-content');
      const signals = Array.from(page.querySelectorAll<HTMLElement>('.cosmic-future-orbit__signal'));
      const activeSignal = page.querySelector<HTMLElement>('.cosmic-future-orbit__signal.is-active');
      const core = page.querySelector<HTMLElement>('.cosmic-future-orbit__core');
      const progressBar = page.querySelector<HTMLElement>('.cosmic-future-page__progress i');
      const timeline = gsap.timeline({ defaults: { ease: 'power3.out' } });

      timeline.addLabel('scene');
      if (backdrop !== null) {
        timeline.fromTo(backdrop, { scale: 1.018 }, { scale: 1, duration: 0.72 }, 'scene');
      }
      if (orbitSurface !== null) {
        timeline.fromTo(orbitSurface, { y: 8 }, { y: 0, duration: 0.46 }, 'scene+=0.08');
      }
      if (signals.length > 0) {
        timeline.fromTo(
          signals,
          { y: 6 },
          { y: 0, duration: 0.26, stagger: { each: 0.05, from: 'edges' } },
          'scene+=0.12',
        );
      }
      if (core !== null) {
        timeline.fromTo(core, { scale: 0.94 }, { scale: 1.035, duration: 0.4, ease: 'back.out(1.2)' }, 'scene+=0.12');
        timeline.to(core, { scale: 1, duration: 0.28, ease: 'power2.out' });
      }
      if (activeSignal !== null) {
        timeline.fromTo(activeSignal, { scale: 0.96 }, { scale: 1.035, duration: 0.3, ease: 'back.out(1.35)' }, 'scene+=0.18');
        timeline.to(activeSignal, { scale: 1, duration: 0.22, ease: 'power2.out' });
      }
      if (panel !== null) {
        timeline.fromTo(panel, { x: 12 }, { x: 0, duration: 0.42 }, 'scene+=0.1');
      }
      if (progressBar !== null) {
        timeline.fromTo(progressBar, { scaleX: 0 }, { scaleX: progressPercent / 100, duration: 0.62 }, 'scene+=0.16');
      }
    });

    return () => media.revert();
  }, { scope: pageRef, dependencies: [panelKey, activeCosmicScene.id, progressPercent], revertOnUpdate: true });

  useGSAP(() => {
    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)', () => {
      const page = pageRef.current;
      if (page === null) return;

      const assembledShards = Array.from(page.querySelectorAll<HTMLElement>('.cosmic-future-orbit__shard.is-assembled'));
      if (assembledShards.length === 0) return;

      gsap.fromTo(
        assembledShards,
        { scale: 0.82, rotation: 40 },
        { scale: 1, rotation: 45, duration: 0.56, stagger: 0.08, ease: 'back.out(1.45)' },
      );
    });

    return () => media.revert();
  }, { scope: pageRef, dependencies: [assembledShardIds.length], revertOnUpdate: true });

  const handleGuideAction = (): void => {
    if (phase === 'assembly') {
      if (isAssemblyComplete) handleEnterReflection();
      return;
    }

    if (phase === 'reflection') {
      if (reflectionChoiceId !== null) handleReflectionContinue();
      return;
    }

    if (phase === 'voyage') {
      handleLaunch();
      return;
    }

    if (phase === 'awakening') {
      handleComplete();
      return;
    }

    handleReplay();
  };

  return (
    <main ref={pageRef} className={`cosmic-future-page cosmic-future-page--${phase} cosmic-future-page--scene-${activeCosmicScene.id}`}>
      <div className="cosmic-future-page__backdrop" aria-hidden="true">
        <img key={activeCosmicScene.id} src={activeCosmicScene.poster} alt="" style={{ objectPosition: activeCosmicScene.objectPosition }} />
      </div>
      <div className="cosmic-future-page__wash" aria-hidden="true" />

      <header className="cosmic-future-page__topbar">
        <Link className="cosmic-future-page__back-link" to="/chapters">← 水脉图册</Link>
        <div className="cosmic-future-page__chapter-mark">
          <span>CHAPTER 04</span>
          <strong>望 · 天地人和</strong>
        </div>
        <div className="cosmic-future-page__score" aria-label={`水脉感悟 ${waterFeel} / 30`}>
          <span>水脉感悟</span>
          <strong>{waterFeel.toString().padStart(2, '0')}<small> / 30</small></strong>
        </div>
      </header>

      <div className="cosmic-future-page__grid">
        <section className="cosmic-future-page__intro" aria-labelledby="cosmic-future-title">
          <p className="cosmic-future-page__eyebrow">天地人和 / COSMIC WATERLINE</p>
          <h1 id="cosmic-future-title">水脉向<br /><em>穹苍</em></h1>
          <p className="cosmic-future-page__lede">
            从九州大地到漫天星河，从一滴水珠到宇宙水脉，关于水的探索不会停止。最后一章，请把记忆拼回完整的图景。
          </p>
          <div className="cosmic-future-page__principle">
            <span>澜澜的望远镜</span>
            <p>治水治到最后，学会和天地万物好好相处。</p>
          </div>
          <div className="cosmic-future-page__legend" aria-label="终章图例">
            <span><i className="is-current" />正在发生</span>
            <span><i className="is-recorded" />已连接</span>
            <span><i className="is-shard" />水脉碎片</span>
          </div>
        </section>

        <section className="cosmic-future-orbit" aria-label="天地人和终章水脉">
          <div className="cosmic-future-orbit__heading">
            <span>WATER MEMORY / 03 ACTS</span>
            <span>连天地 → 贯星河 → 万物生</span>
          </div>
          <WaterMist
            className="cosmic-future-orbit__mist-layer"
            mistColor="#ded09b"
            puffCount={5}
            rippleColor="#d7bd72"
            rippleCount={2}
            rippleRadius={25}
          >
            <div className="cosmic-future-orbit__surface">
              <FlowingContours
                className="cosmic-future-orbit__contours"
                lineColor="rgba(173, 208, 195, .16)"
                lineCount={5}
                lineGap={68}
                amplitude={6}
                speed={0.00024}
              />
              <svg className="cosmic-future-orbit__svg" viewBox="0 0 640 560" aria-hidden="true">
                <circle className="cosmic-future-orbit__halo" cx="320" cy="280" r="187" />
                <ellipse className="cosmic-future-orbit__orbit cosmic-future-orbit__orbit--one" cx="320" cy="280" rx="260" ry="108" />
                <ellipse className="cosmic-future-orbit__orbit cosmic-future-orbit__orbit--two" cx="320" cy="280" rx="204" ry="170" />
                <ellipse className="cosmic-future-orbit__orbit cosmic-future-orbit__orbit--three" cx="320" cy="280" rx="132" ry="232" />
                <path className="cosmic-future-orbit__waterline" d="M54 346C142 278 214 376 300 329s122-40 190-5 74 24 106-15" pathLength="1" />
                <path className="cosmic-future-orbit__waterline cosmic-future-orbit__waterline--echo" d="M57 357C145 289 217 387 303 340s122-40 190-5 74 24 106-15" pathLength="1" />
                <path key={`trace-${phase}`} className={`cosmic-future-orbit__waterline cosmic-future-orbit__waterline--trace${phase === 'assembly' ? '' : ' is-active'}`} d="M54 346C142 278 214 376 300 329s122-40 190-5 74 24 106-15" pathLength="1" />
              </svg>
              <InkRipple trigger={ripple} />
              <div className={`cosmic-future-orbit__core cosmic-future-orbit__core--${phase}`} aria-hidden="true">
                <div className="cosmic-future-orbit__globe">
                  <EnergyOrb
                    className="cosmic-future-orbit__energy-orb"
                    speed={0.17}
                    scale={1.04}
                    smokeScale={1.12}
                    smokeStrength={0.58}
                    smokeSpeed={0.3}
                    saturation={0.62}
                    glow={0.52}
                    starDensity={0.12}
                    starSpeed={0.18}
                    starSize={0.72}
                    brightness={0.9}
                    opacity={0.82}
                  />
                  <svg className="cosmic-future-orbit__globe-map" viewBox="0 0 180 180" aria-hidden="true">
                  <defs>
                    <radialGradient id="cosmic-globe-fill" cx="35%" cy="28%" r="78%">
                      <stop offset="0" stopColor="#507f7b" stopOpacity=".68" />
                      <stop offset=".64" stopColor="#173f48" stopOpacity=".92" />
                      <stop offset="1" stopColor="#0a2b35" stopOpacity=".98" />
                    </radialGradient>
                    <clipPath id="cosmic-globe-clip">
                      <circle cx="90" cy="90" r="66" />
                    </clipPath>
                  </defs>
                  <circle className="cosmic-future-orbit__globe-disc" cx="90" cy="90" r="66" />
                  <g className="cosmic-future-orbit__globe-map" clipPath="url(#cosmic-globe-clip)">
                    <ellipse className="cosmic-future-orbit__globe-grid" cx="90" cy="90" rx="24" ry="66" />
                    <ellipse className="cosmic-future-orbit__globe-grid" cx="90" cy="90" rx="47" ry="66" />
                    <path className="cosmic-future-orbit__globe-grid" d="M24 62C58 78 122 78 156 62M24 90C58 103 122 103 156 90M24 118C58 102 122 102 156 118" />
                    <path className="cosmic-future-orbit__globe-land" d="M48 54c9-7 18-7 27-2l10-7 11 6 12-3 13 10-4 9 10 6-11 8-12-3-8 10-10-5-10 8-12-9-12 2-5-9 5-8-8-6 8-7z" />
                    <path className="cosmic-future-orbit__globe-land" d="M50 98c8-5 16-2 19 6l-5 11-9-4-8 5-5-9z" />
                    <path className="cosmic-future-orbit__globe-route" d="M34 94c25-17 46 2 68-9s33-13 45 2" pathLength="1" />
                    <circle className="cosmic-future-orbit__globe-island" cx="125" cy="111" r="2.4" />
                    <circle className="cosmic-future-orbit__globe-island" cx="133" cy="116" r="1.4" />
                  </g>
                  <circle className="cosmic-future-orbit__globe-rim" cx="90" cy="90" r="66" />
                  <path className="cosmic-future-orbit__globe-meridian" d="M47 48c21-13 65-17 87 1" />
                  </svg>
                </div>
                <span>{phase === 'voyage' ? '水脉' : phase === 'assembly' || phase === 'reflection' ? '连' : '天地'}</span>
                <strong>{phase === 'voyage' ? '贯星河' : phase === 'assembly' || phase === 'reflection' ? '天地' : '人和'}</strong>
                <i />
              </div>
              <div className="cosmic-future-orbit__shards" role="group" aria-label="三块水脉碎片">
                {shardNames.map((shardName, shardIndex) => {
                  const isAssembled = assembledShardIds.includes(shardIndex);
                  return (
                    <button
                      className={`cosmic-future-orbit__shard${isAssembled ? ' is-assembled' : ''}`}
                      key={shardName}
                      type="button"
                      disabled={phase !== 'assembly'}
                      aria-pressed={isAssembled}
                      aria-label={`${shardName}之纹${isAssembled ? '，已拼合' : '，点击拼合'}`}
                      onClick={() => handleAssembleShard(shardIndex)}
                    >
                      <span>{shardName}</span>
                    </button>
                  );
                })}
              </div>
              <ol className="cosmic-future-orbit__signals">
                {cosmicActs.map((act) => {
                  const isActive = activeAct.id === act.id;
                  const isRecorded = isActRecorded(act, phase, assembledShardIds);
                  const isUnlocked = act.kind === 'assembly'
                    || (act.kind === 'voyage' && isAssemblyComplete && reflectionChoiceId !== null)
                    || (act.kind === 'awakening' && (phase === 'voyage' || phase === 'awakening' || phase === 'complete'));
                  const markerStyle = {
                    '--signal-x': `${act.x}%`,
                    '--signal-y': `${act.y}%`,
                  } as CSSProperties;

                  return (
                    <li className={`cosmic-future-orbit__signal${isActive ? ' is-active' : ''}${isRecorded ? ' is-recorded' : ''}`} key={act.id} style={markerStyle}>
                      <button
                        type="button"
                        aria-current={isActive ? 'step' : undefined}
                        disabled={!isUnlocked}
                        aria-label={`${act.order} ${act.signal}：${act.title}`}
                        onClick={() => handleStageClick(act)}
                      >
                        <span className="cosmic-future-orbit__signal-dot" aria-hidden="true" />
                        <span className="cosmic-future-orbit__signal-copy">
                          <small>{act.order.toString().padStart(2, '0')} / {act.signal}</small>
                          <strong>{act.title}</strong>
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ol>
              <div className="cosmic-future-orbit__assembly-count" aria-live="polite">
                水脉碎片 · {assembledShardIds.length} / 3
              </div>
              <div className="cosmic-future-orbit__stamp" aria-hidden="true">
                <span>望</span>
                <small>观其变 · 守其界</small>
              </div>
              <ChapterGuide
                action={spiritAction}
                actionLabel={guideActionLabel}
                chapter="horizon"
                conversationId={`cosmic-guide-${phase}-${assembledShardIds.length}-${reflectionChoiceId ?? 'none'}`}
                dialogLabel="小澜：天地人和终章导览"
                dialogueId="cosmic-future-dialogue"
                messages={guideMessages}
                mood={spiritMood}
                onAction={handleGuideAction}
                position={{ x: 6, y: 82 }}
              />
            </div>
          </WaterMist>
          <p className="cosmic-future-orbit__note">
            {phase === 'assembly' ? '点击三块水脉碎片，完成记忆拼合。' : phase === 'reflection' ? '没有标准答案，选择你愿意带向宇宙的判断。' : '沿着水线继续向外，直到与星河相遇。'}
          </p>
        </section>

        <aside className="cosmic-future-page__panel">
          <div key={panelKey} className="cosmic-future-page__panel-content">
            {phase === 'complete' ? (
            <section className="cosmic-future-page__finish" aria-live="polite">
              <p className="cosmic-future-page__eyebrow">终极觉醒已完成 / AWAKENING COMPLETE</p>
              <h2>所有散落的记忆，<br />都回到水脉里了。</h2>
               <p>从九州大地到漫天星河，三块碎片已经组成完整的宇宙水脉图。</p>
               <div className="cosmic-future-page__spirit-lines" aria-live="polite">
                 {activeAct.narrative?.spiritLines.map((line, index) => (
                   <p key={line} style={{ '--line-index': index } as CSSProperties}>{line}</p>
                 ))}
               </div>
               <div className="cosmic-future-page__philosophy" aria-label="终章哲理">
                 {activeAct.narrative?.philosophyLines.map((line, index) => (
                   <span key={line} style={{ '--line-index': index } as CSSProperties}>{line}</span>
                 ))}
               </div>
               <p className="cosmic-future-page__reward">
                 水滴精灵最终觉醒：天地人和 · {isChapter4Complete ? '完整星河拼图已保存' : '完整星河拼图待保存'}
               </p>
              <div className="cosmic-future-page__finish-actions">
                <button type="button" onClick={handleReplay}>重新体验</button>
                <Link to="/chapters">返回章节图册<span aria-hidden="true">→</span></Link>
              </div>
            </section>
            ) : phase === 'assembly' ? (
            <section className="cosmic-future-page__ritual">
              <p className="cosmic-future-page__eyebrow">01 · 水脉连天地 / MEMORY RITUAL</p>
              <h2>把散落的记忆，<br />拼回同一条水脉。</h2>
              <p>三块碎片分别来自九州大地、同舟之路和一路同行的你。它们合在一起，才会显出通向穹苍的水线。</p>
              <div className="cosmic-future-page__shard-meter" aria-label={`已拼合 ${assembledShardIds.length} / 3 块水脉碎片`}>
                {shardNames.map((shardName, index) => <i className={assembledShardIds.includes(index) ? 'is-assembled' : ''} key={shardName}><span>{shardName}</span></i>)}
              </div>
              {isAssemblyComplete ? (
                <Magnet wrapperClassName="cosmic-future-page__magnet" padding={18} magnetStrength={6}>
                  <WaterMist className="cosmic-future-page__cta-mist" mistColor="#d7bd72" rippleColor="#d7bd72" rippleRadius={20}>
                    <StatefulActionButton className="cosmic-future-page__primary-button" onCommit={handleEnterReflection} completeLabel="已打开共生之问">
                      进入宇宙共生之问
                    </StatefulActionButton>
                  </WaterMist>
                </Magnet>
              ) : (
                <small>点击中部的三块碎片，完成拼合仪式。</small>
              )}
            </section>
            ) : phase === 'reflection' ? (
            <ChapterChoicePanel
              idPrefix="cosmic-future-reflection"
              sectionLabel="02 · 宇宙共生之问"
              sectionTitle="把地球的答案带上路"
              sectionSubtitle="REFLECTION / OPEN ANSWER"
              story="水真的把人和天连在了一起。走到宇宙边缘，你愿意怎样理解这段从地球出发的经验？"
              question="地球上的水治理智慧，能成为宇宙治理的起点吗？"
              choices={cosmicReflectionChoices}
               selectedChoiceId={reflectionChoiceId}
               completedCount={reflectionChoiceId === null ? 0 : 1}
               totalCount={1}
              score={reflectionChoiceId === null ? 0 : reflectionStars}
              onChoice={handleReflectionChoice}
              onContinue={handleReflectionContinue}
              continueLabel="沿水脉飞向星河"
            />
            ) : phase === 'voyage' ? (
            <section className="cosmic-future-page__voyage-panel">
              <p className="cosmic-future-page__eyebrow">02 · 水脉贯星河 / LONG SHOT</p>
              <h2>准备好了吗？<br />沿着水脉，飞向星河。</h2>
               <p>{activeAct.story}</p>
               <div className="cosmic-future-page__voyage-route" aria-label="飞行路线">
                 {routeStops.map((stop, index) => (
                   <Fragment key={stop}>
                     <span>{stop}</span>
                     {index < routeStops.length - 1 && <i aria-hidden="true" />}
                   </Fragment>
                 ))}
               </div>
              <Magnet wrapperClassName="cosmic-future-page__magnet" padding={18} magnetStrength={6}>
                <WaterMist className="cosmic-future-page__cta-mist" mistColor="#d7bd72" rippleColor="#d7bd72" rippleRadius={20}>
                  <StatefulActionButton className="cosmic-future-page__primary-button" onCommit={handleLaunch} completeLabel="已进入星河">
                    开始飞向宇宙
                  </StatefulActionButton>
                </WaterMist>
              </Magnet>
            </section>
            ) : (
            <section className="cosmic-future-page__awakening-panel">
              <p className="cosmic-future-page__eyebrow">03 · 天地人和 / FINAL AWAKENING</p>
              <h2>水流到哪里，<br />共生的道理就用到哪里。</h2>
              <p>地球、星辰和所有未知的水脉，都在同一张图里找到位置。最后一步，让澜澜成为这张图的一部分。</p>
              <p className="cosmic-future-page__quote">治水治到最后，治的不是水，是学会和天地万物好好相处。</p>
              <Magnet wrapperClassName="cosmic-future-page__magnet" padding={18} magnetStrength={6}>
                <WaterMist className="cosmic-future-page__cta-mist" mistColor="#d7bd72" rippleColor="#d7bd72" rippleRadius={20}>
                  <StatefulActionButton className="cosmic-future-page__primary-button" onCommit={handleComplete} completeLabel="觉醒已完成">
                    完成终极觉醒
                  </StatefulActionButton>
                </WaterMist>
              </Magnet>
            </section>
            )}
          </div>
        </aside>
      </div>

      <footer className="cosmic-future-page__footer">
        <span>第四章 · 天地人和</span>
        <div className="cosmic-future-page__progress" aria-label={`水脉感悟 ${waterFeel} / 30`}>
          <i style={{ '--progress': `${progressPercent / 100}` } as CSSProperties} />
        </div>
        <span>{waterFeel.toString().padStart(2, '0')} / 30</span>
      </footer>
    </main>
  );
}

export default CosmicFuture;
