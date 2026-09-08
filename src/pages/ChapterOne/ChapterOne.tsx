import { lazy, Suspense, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, type MouseEvent as ReactMouseEvent } from 'react';
import { Link } from 'react-router-dom';

import floodCover from '@/assets/images/chapter-one/memory-flood.webp';
import homeCover from '@/assets/images/chapter-one/memory-home.webp';
import pathCover from '@/assets/images/chapter-one/memory-path.webp';
import { useChapterInsight } from '@/components/common/chapterInsightContext';
import { useLanFooting, useLanMascot, type LanMascotConfig } from '@/components/lan-mascot';

import './ChapterOne.css';
import { getChapterOneStoryVideoSource } from './chapterOneMedia';

type MemoryId = 1 | 2 | 3;
type ChapterScene = 'launch' | 'video';
type DialogueStep = 'idle' | 'question' | 'wrong' | 'insight' | 'reward';

const MemoryAtmosphere = lazy(() => import('./MemoryAtmosphere'));

interface MemoryStory {
  id: MemoryId;
  cover: string;
  title: string;
  introduction: string;
  insight: string;
  question: string;
  wrongChoice: string;
  correctChoice: string;
  wrongFeedback: string;
  observationCopy: string;
}

const memoryStories: MemoryStory[] = [
  {
    id: 1,
    cover: floodCover,
    title: '鲧阻洪水',
    introduction: '我随暴雨涌入山谷，鲧筑起高堤，想用层层屏障制服我。失去去路的我越积越深，终于冲破堤防，伤及田园。这段沉重的记忆告诉我：一味堵塞无法平息水患，人首先要敬畏自然。',
    insight: '水不可只堵',
    question: '面对不断上涨的洪水，你会怎么做？',
    wrongChoice: '继续加高堤坝，挡住洪水',
    correctChoice: '停下来观察山势与水流方向',
    wrongFeedback: '水位继续升高，墙体出现裂痕。只是一味堵水，会积蓄更大的力量；再换一种看法试试。',
    observationCopy: '山有走势，水有方向。看见高低、辨明去处，洪水才有可能从威胁变成可以被引导的力量。',
  },
  {
    id: 2,
    cover: pathCover,
    title: '大禹疏水',
    introduction: '后来，大禹俯身读懂山川，沿低谷与旧河道为我疏通道路。我终于从围困中舒展开来，不再四处冲撞，而是顺着地势奔向江海。洪水退去，村庄重获安宁。为水寻找去处，也是在为人留下生路。',
    insight: '读懂山川',
    question: '你会怎样为山谷中的水寻找新的去处？',
    wrongChoice: '无视高低，强行开一条笔直的水道',
    correctChoice: '沿山势辨高低，连通低地与旧河道',
    wrongFeedback: '水流被硬拦硬折，新的低洼处反而积起险情。先读懂山川，才能让每一段水路顺畅相连。',
    observationCopy: '山脊划出分水的界线，低地接住来水，旧河道留下水流曾经走过的记忆。顺应这些线索，水路便能自然延展。',
  },
  {
    id: 3,
    cover: homeCover,
    title: '都江堰润泽家园',
    introduction: '岁月流转，我来到岷江。都江堰没有筑墙困住我，而是依山就势分水、排沙、引流。我一部分奔向江海，一部分流入田园，滋养庄稼与村落。那一刻我懂得：天人合一，是人顺应水势，水也长久润泽人间。',
    insight: '安民护土',
    question: '当水路已经被看见，下一步最该守护什么？',
    wrongChoice: '只保住一段堤坝，其余土地自行承受',
    correctChoice: '让村庄、田地、湿地与河湾一起留住安全',
    wrongFeedback: '孤立的一段工程守不住整片家园。水最终会流向土地与人们的生活，需要把每一处相连的空间都放进答案里。',
    observationCopy: '河湾缓住急流，湿地涵养来水，田地与村庄获得更稳妥的守护。治水的终点，是让人与土地安然相依。',
  },
];

interface StoryVideoPlayerProps {
  isInteractionOpen: boolean;
  poster: string;
  source: string;
  onEnded: () => void;
}

function StoryVideoPlayer({ isInteractionOpen, poster, source, onEnded }: StoryVideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (video === null) return undefined;

    let cancelled = false;
    const startPlayback = async (): Promise<void> => {
      try {
        video.muted = false;
        await video.play();
        if (!cancelled) await video.requestFullscreen?.().catch(() => undefined);
      } catch {
        video.muted = true;
        await video.play().catch(() => undefined);
      }
    };

    void startPlayback();
    return () => { cancelled = true; };
  }, [source]);

  useEffect(() => {
    const togglePlayback = (event: KeyboardEvent): void => {
      if (event.code !== 'Space' || isInteractionOpen) return;
      const target = event.target as HTMLElement | null;
      if (target?.closest('button, input, textarea, select, [contenteditable="true"]')) return;

      const video = videoRef.current;
      if (video === null) return;
      event.preventDefault();
      if (video.paused) void video.play().catch(() => undefined);
      else video.pause();
    };

    document.addEventListener('keydown', togglePlayback);
    return () => document.removeEventListener('keydown', togglePlayback);
  }, [isInteractionOpen]);

  const handleEnded = (): void => {
    if (document.fullscreenElement === videoRef.current) {
      void document.exitFullscreen?.().catch(() => undefined);
    }
    onEnded();
  };

  return (
    <video ref={videoRef} controls playsInline preload="metadata" poster={poster} onEnded={handleEnded}>
      <source src={source} />
      您的浏览器不支持视频播放。
    </video>
  );
}

function ChapterOne() {
  const [scene, setScene] = useState<ChapterScene>('launch');
  const [activeMemoryId, setActiveMemoryId] = useState<MemoryId>(1);
  const [previewMemoryId, setPreviewMemoryId] = useState<MemoryId>(1);
  const [hoveredMemoryId, setHoveredMemoryId] = useState<MemoryId | null>(null);
  const [dialogueStep, setDialogueStep] = useState<DialogueStep>('idle');
  const [hasDismissedInteraction, setHasDismissedInteraction] = useState(false);
  const [newlyAwakenedMemoryId, setNewlyAwakenedMemoryId] = useState<MemoryId | null>(null);
  const { awakenedMemories, completeMemory, insight } = useChapterInsight();
  const activeStory = memoryStories.find((story) => story.id === activeMemoryId) ?? memoryStories[0];
  const displayMemoryId = hoveredMemoryId ?? previewMemoryId;
  const previewStory = memoryStories.find((story) => story.id === displayMemoryId) ?? memoryStories[0];
  const nextMemory = memoryStories.find((memory) => !awakenedMemories.includes(memory.id)) ?? memoryStories[0];
  const activeStoryVideoSource = getChapterOneStoryVideoSource(activeStory.id);
  const isActiveStoryAwakened = awakenedMemories.includes(activeStory.id);
  const unlockedMemoryIds = useMemo(() => memoryStories
    .filter((memory) => memory.id === 1 || awakenedMemories.includes((memory.id - 1) as MemoryId))
    .map((memory) => memory.id), [awakenedMemories]);

  useEffect(() => {
    setPreviewMemoryId(nextMemory.id);
  }, [awakenedMemories.length, nextMemory.id]);

  const enterMemory = useCallback((memoryId: MemoryId): void => {
    setActiveMemoryId(memoryId);
    setDialogueStep('idle');
    setHasDismissedInteraction(false);
    setNewlyAwakenedMemoryId(null);
    setScene('video');
  }, []);

  const returnToChapterLaunch = useCallback((): void => {
    setDialogueStep('idle');
    setHasDismissedInteraction(false);
    setNewlyAwakenedMemoryId(null);
    setScene('launch');
  }, []);

  const handleDialogueClose = useCallback((): void => setHasDismissedInteraction(true), []);

  const handleCardPointerMove = useCallback((event: ReactMouseEvent<HTMLElement>): void => {
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - bounds.left) / bounds.width - 0.5) * 2;
    const y = ((event.clientY - bounds.top) / bounds.height - 0.5) * 2;
    event.currentTarget.style.setProperty('--card-tilt-x', `${(-y * 2.2).toFixed(2)}deg`);
    event.currentTarget.style.setProperty('--card-tilt-y', `${(x * 2.8).toFixed(2)}deg`);
  }, []);

  const resetCardTilt = useCallback((event: ReactMouseEvent<HTMLElement>): void => {
    event.currentTarget.style.setProperty('--card-tilt-x', '0deg');
    event.currentTarget.style.setProperty('--card-tilt-y', '0deg');
  }, []);

  const finishMemory = useCallback((): void => {
    setNewlyAwakenedMemoryId(isActiveStoryAwakened ? null : activeStory.id);
    completeMemory(activeStory.id);
    setDialogueStep('reward');
  }, [activeStory.id, completeMemory, isActiveStoryAwakened]);

  const mascotDialogue = useMemo(() => {
    if (dialogueStep === 'wrong') {
      return {
        conversationId: `chapter-one-memory-${activeStory.id}-wrong`,
        messages: [activeStory.wrongFeedback],
        actionLabel: '重新选择',
        onAction: (): void => setDialogueStep('question'),
      };
    }

    if (dialogueStep === 'question') {
      return {
        conversationId: `chapter-one-memory-${activeStory.id}-question`,
        messages: [activeStory.question],
        actionLabel: '做出选择',
        onAction: (): void => undefined,
        choices: [
          { id: 'wrong', label: activeStory.wrongChoice, onSelect: (): void => setDialogueStep('wrong') },
          { id: 'correct', label: activeStory.correctChoice, onSelect: (): void => setDialogueStep('insight') },
        ],
      };
    }

    if (dialogueStep === 'insight') {
      return {
        conversationId: `chapter-one-memory-${activeStory.id}-insight`,
        messages: [activeStory.observationCopy],
        actionLabel: `唤醒“${activeStory.insight}”`,
        onAction: finishMemory,
      };
    }

    if (dialogueStep === 'reward') {
      return {
        conversationId: `chapter-one-memory-${activeStory.id}-awakened`,
        messages: [newlyAwakenedMemoryId === activeStory.id
          ? `“${activeStory.insight}”已经苏醒，水脉感悟值增加 10 点。`
          : `“${activeStory.insight}”已经苏醒。本次为重温作答，水脉感悟值不再重复增加。`],
        actionLabel: '回到水滴记忆',
        onAction: returnToChapterLaunch,
      };
    }

    return {
      conversationId: `chapter-one-memory-${activeStory.id}-idle`,
      messages: [activeStory.introduction],
      actionLabel: '开始作答',
      onAction: (): void => setDialogueStep('question'),
    };
  }, [activeStory, dialogueStep, finishMemory, newlyAwakenedMemoryId, returnToChapterLaunch]);

  const mascotConfig = useMemo<LanMascotConfig>(() => ({
    pageId: 'chapter-one-guide',
    routePath: '/chapters/chapter-1',
    dialogue: {
      ...mascotDialogue,
      closeOnBackdrop: true,
      closeOnEscape: true,
      dialogLabel: '水脉精灵小澜的引导',
      showClose: true,
    },
    dialogueId: 'lan-dialogue-chapter-one',
    expressionId: dialogueStep === 'question'
      ? 'thinking'
      : dialogueStep === 'insight' || dialogueStep === 'reward'
        ? 'happy'
        : dialogueStep === 'wrong' || activeStory.id === 1
          ? 'turbid'
          : 'thinking',
    initialPosition: { x: 16, y: 82 },
    onDialogueClose: handleDialogueClose,
    spriteAlt: '水脉精灵小澜，可以拖动',
    dialoguePresentation: 'modal',
    visible: scene !== 'launch',
  }), [activeStory.id, dialogueStep, handleDialogueClose, mascotDialogue, scene]);
  const { closeDialogue, isDialogueOpen, openDialogue, setPosition } = useLanMascot(mascotConfig);
  const startQuestionDialogue = useCallback((): void => {
    setDialogueStep('question');
    setHasDismissedInteraction(false);
    setNewlyAwakenedMemoryId(null);
    openDialogue();
  }, [openDialogue]);
  const footingConfig = useMemo(() => ({
    pageId: 'chapter-one-guide',
    routePath: '/chapters/chapter-1',
    sceneId: 'water-bloom' as const,
    visible: scene === 'video',
  }), [scene]);
  useLanFooting(footingConfig);

  useLayoutEffect(() => {
    if (scene !== 'launch') setPosition({ x: 16, y: 82 });
  }, [scene, setPosition]);

  useEffect(() => {
    if (scene === 'launch') closeDialogue();
  }, [closeDialogue, scene]);

  return (
    <main className={`chapter-one chapter-one--${scene} chapter-one--memory-${activeStory.id}`}>
      <div className="chapter-one__water-rings" aria-hidden="true"><i /><i /><i /></div>
      <header className="chapter-one__nav">
        {scene === 'video'
          ? <button className="chapter-one__nav-return" type="button" onClick={returnToChapterLaunch}>返回水滴记忆</button>
          : <Link to="/chapters">返回水脉记忆</Link>}
        <span aria-hidden="true">/</span><p>第一章</p>
      </header>
      {scene === 'launch' ? (
        <section className="chapter-one__launch" aria-labelledby="chapter-one-title">
          <Suspense fallback={null}>
            <MemoryAtmosphere
              hoveredMemoryId={hoveredMemoryId}
              selectedMemoryId={previewMemoryId}
              completedMemoryIds={awakenedMemories.filter((memoryId): memoryId is MemoryId => memoryId >= 1 && memoryId <= 3)}
            />
          </Suspense>
          <div className="chapter-one__card-stage" aria-label="三层水脉记忆">
            <ol className="chapter-one__story-cards">
              {memoryStories.map((memory) => {
                const isComplete = awakenedMemories.includes(memory.id);
                const isUnlocked = unlockedMemoryIds.includes(memory.id);
                const isSelected = previewMemoryId === memory.id;
                const isDisplayed = displayMemoryId === memory.id;
                return (
                  <li
                    key={memory.id}
                    className={`chapter-one__story-cover chapter-one__story-cover--${memory.id}${isDisplayed ? ' is-displayed' : ''}${isSelected ? ' is-selected' : ''}${isComplete ? ' is-complete' : ''}`}
                    onMouseEnter={() => setHoveredMemoryId(memory.id)}
                    onMouseMove={handleCardPointerMove}
                    onMouseLeave={(event) => {
                      setHoveredMemoryId(null);
                      resetCardTilt(event);
                    }}
                    onFocus={() => setHoveredMemoryId(memory.id)}
                    onBlur={() => setHoveredMemoryId(null)}
                  >
                    <button
                      className="chapter-one__story-cover-select"
                      type="button"
                      aria-pressed={isSelected}
                      aria-label={isUnlocked
                        ? `进入第 ${memory.id} 层记忆：${memory.title}`
                        : `预览第 ${memory.id} 层记忆：${memory.title}，完成上一段后解锁`}
                      onClick={() => {
                        if (isUnlocked) enterMemory(memory.id);
                        else setPreviewMemoryId(memory.id);
                      }}
                    >
                      <img src={memory.cover} alt="" />
                      <span className="chapter-one__story-cover-shade" aria-hidden="true" />
                      <span className="chapter-one__story-cover-label">
                        <span>0{memory.id}</span>
                        <strong>{memory.title}</strong>
                      </span>
                      <small>{isComplete ? '记忆已唤醒' : isUnlocked ? '可进入' : '待解锁'}</small>
                    </button>
                  </li>
                );
              })}
            </ol>
          </div>
          <div className="chapter-one__launch-copy">
            <p className="chapter-one__launch-kicker">第一章</p>
            <span className="chapter-one__title-rule" aria-hidden="true"><i /></span>
            <h1 id="chapter-one-title">水有去处，人有家园</h1>
            <p className="chapter-one__launch-subtitle">三层记忆，正等待苏醒</p>
            <div key={previewStory.id} className="chapter-one__selected-memory" aria-live="polite">
              <p><span>0{previewStory.id}</span>{previewStory.introduction}</p>
              <strong>本段感悟 · {previewStory.insight}</strong>
              <button
                type="button"
                disabled={!unlockedMemoryIds.includes(previewStory.id)}
                onClick={() => enterMemory(previewStory.id)}
              >
                {awakenedMemories.includes(previewStory.id)
                  ? '重温这段记忆'
                  : unlockedMemoryIds.includes(previewStory.id)
                    ? '进入这段记忆'
                    : '完成上一段后解锁'}
                {unlockedMemoryIds.includes(previewStory.id) && <span aria-hidden="true">→</span>}
              </button>
            </div>
            <p className="chapter-one__memory-progress">已唤醒 {awakenedMemories.length}/3 · 水脉感悟值 {insight}/30</p>
          </div>
        </section>
      ) : (
        <section className={`chapter-one__story chapter-one__story--${scene}`} aria-label={`${activeStory.title}故事影像`}>
          {scene === 'video' && (
            <div className="chapter-one__story-layout">
              <div className="chapter-one__story-card chapter-one__story-card--video">
                <div className="chapter-one__video-frame">
                  {activeStoryVideoSource ? (
                    <StoryVideoPlayer isInteractionOpen={isDialogueOpen} poster={activeStory.cover} source={activeStoryVideoSource} onEnded={startQuestionDialogue} />
                  ) : <p>本段故事影像准备中，请直接进入互动。</p>}
                </div>
                <button className="chapter-one__primary-action" type="button" onClick={startQuestionDialogue}>跳过影像，开始作答<span aria-hidden="true">→</span></button>
                {hasDismissedInteraction && !isDialogueOpen && <button className="chapter-one__continue-interaction" type="button" onClick={() => {
                  startQuestionDialogue();
                }}>继续互动</button>}
              </div>
            </div>
          )}
        </section>
      )}
    </main>
  );
}

export default ChapterOne;
