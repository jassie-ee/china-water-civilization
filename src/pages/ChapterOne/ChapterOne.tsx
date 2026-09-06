import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

import { useChapterInsight } from '@/components/common/chapterInsightContext';
import { useLanMascot, type LanMascotConfig } from '@/components/lan-mascot';
import { introPosterSource, introVideoSource } from '@/pages/Home/introMedia';

import './ChapterOne.css';

type MemoryId = 1 | 2 | 3;
type ChapterScene = 'launch' | 'memory-entry' | 'video' | 'question' | 'observation' | 'awakened';

interface MemoryStory {
  id: MemoryId;
  title: string;
  guidance: string;
  insight: string;
  opening: string;
  videoHeading: string;
  question: string;
  wrongChoice: string;
  correctChoice: string;
  wrongFeedback: string;
  observationHeading: string;
  observationCopy: string;
  markers: [string, string, string, string];
}

const memoryStories: MemoryStory[] = [
  {
    id: 1,
    title: '洪水压境',
    guidance: '从洪水的力量里，找回第一段记忆。',
    insight: '水不可只堵',
    opening: '洪水压境',
    videoHeading: '水声渐高，山谷正在等待答案',
    question: '面对不断上涨的洪水，你会怎么做？',
    wrongChoice: '继续加高堤坝，挡住洪水',
    correctChoice: '停下来观察山势与水流方向',
    wrongFeedback: '水位继续升高，墙体出现裂痕。只是一味堵水，会积蓄更大的力量；再换一种看法试试。',
    observationHeading: '让水找到可以走的路',
    observationCopy: '山有走势，水有方向。看见高低、辨明去处，洪水才有可能从威胁变成可以被引导的力量。',
    markers: ['山谷', '低地', '古河道', '入海方向'],
  },
  {
    id: 2,
    title: '为水寻找道路',
    guidance: '第一段记忆苏醒后，山川的走向才会显现。',
    insight: '读懂山川',
    opening: '为水寻找道路',
    videoHeading: '顺着山川的起伏，水会告诉我们答案',
    question: '你会怎样为山谷中的水寻找新的去处？',
    wrongChoice: '无视高低，强行开一条笔直的水道',
    correctChoice: '沿山势辨高低，连通低地与旧河道',
    wrongFeedback: '水流被硬拦硬折，新的低洼处反而积起险情。先读懂山川，才能让每一段水路顺畅相连。',
    observationHeading: '读懂山川，才能为水寻路',
    observationCopy: '山脊划出分水的界线，低地接住来水，旧河道留下水流曾经走过的记忆。顺应这些线索，水路便能自然延展。',
    markers: ['山脊', '低地', '旧河道', '汇流方向'],
  },
  {
    id: 3,
    title: '智慧留在土地上',
    guidance: '第二段记忆苏醒后，家园的答案才会浮现。',
    insight: '安民护土',
    opening: '智慧留在土地上',
    videoHeading: '水流之外，还有等待安宁的土地与人家',
    question: '当水路已经被看见，下一步最该守护什么？',
    wrongChoice: '只保住一段堤坝，其余土地自行承受',
    correctChoice: '让村庄、田地、湿地与河湾一起留住安全',
    wrongFeedback: '孤立的一段工程守不住整片家园。水最终会流向土地与人们的生活，需要把每一处相连的空间都放进答案里。',
    observationHeading: '让智慧留在土地上',
    observationCopy: '河湾缓住急流，湿地涵养来水，田地与村庄获得更稳妥的守护。治水的终点，是让人与土地安然相依。',
    markers: ['村庄', '田地', '湿地', '河湾'],
  },
];

function ChapterOne() {
  const [scene, setScene] = useState<ChapterScene>('launch');
  const [activeMemoryId, setActiveMemoryId] = useState<MemoryId>(1);
  const [isQuestionChoiceVisible, setIsQuestionChoiceVisible] = useState(false);
  const [isWrongChoiceSelected, setIsWrongChoiceSelected] = useState(false);
  const { awakenedMemories, completeMemory, insight } = useChapterInsight();
  const activeStory = memoryStories.find((story) => story.id === activeMemoryId) ?? memoryStories[0];
  const allMemoriesAwakened = awakenedMemories.length === memoryStories.length;
  const nextMemory = memoryStories.find((memory) => !awakenedMemories.includes(memory.id)) ?? memoryStories[0];

  const enterMemory = useCallback((memoryId: MemoryId): void => {
    setActiveMemoryId(memoryId);
    setIsQuestionChoiceVisible(false);
    setIsWrongChoiceSelected(false);
    setScene('video');
  }, []);

  const returnToMemoryEntry = useCallback((): void => {
    setIsQuestionChoiceVisible(false);
    setIsWrongChoiceSelected(false);
    setScene('memory-entry');
  }, []);

  const finishMemory = useCallback((): void => {
    completeMemory(activeStory.id);
    setScene('awakened');
  }, [activeStory.id, completeMemory]);

  const mascotDialogue = useMemo(() => {
    if (scene === 'launch') {
      return {
        conversationId: 'chapter-one-launch',
        messages: ['那些关于山川、洪水与家园的记忆，正在水滴深处等待苏醒。'],
        actionLabel: '唤醒水滴记忆',
        onAction: () => setScene('memory-entry'),
      };
    }

    if (scene === 'memory-entry') {
      return {
        conversationId: `chapter-one-memory-entry-${awakenedMemories.length}`,
        messages: [allMemoriesAwakened
          ? '三层记忆已经苏醒，顺势之纹重新连成完整的水脉。'
          : '我从华夏的江河中醒来，却遗失了关于治水的记忆。请陪我找回它们。'],
        actionLabel: allMemoriesAwakened ? '重温第一层记忆' : `进入第 ${nextMemory.id} 层记忆`,
        onAction: () => enterMemory(allMemoriesAwakened ? 1 : nextMemory.id),
      };
    }

    if (scene === 'question' && isWrongChoiceSelected) {
      return {
        conversationId: `chapter-one-memory-${activeStory.id}-wrong`,
        messages: [activeStory.wrongFeedback],
        actionLabel: '重新选择',
        onAction: () => setIsWrongChoiceSelected(false),
      };
    }

    if (scene === 'question') {
      return {
        conversationId: `chapter-one-memory-${activeStory.id}-question`,
        messages: [activeStory.question],
        actionLabel: '做出选择',
        onAction: () => setIsQuestionChoiceVisible(true),
      };
    }

    if (scene === 'awakened') {
      return {
        conversationId: `chapter-one-memory-${activeStory.id}-awakened`,
        messages: [`“${activeStory.insight}”已经苏醒，水脉感悟值增加 10 点。`],
        actionLabel: '回到水滴记忆',
        onAction: returnToMemoryEntry,
      };
    }

    return {
      conversationId: `chapter-one-memory-${activeStory.id}-${scene}`,
      messages: [activeStory.observationCopy],
      actionLabel: '继续探索',
      onAction: () => undefined,
    };
  }, [activeStory, allMemoriesAwakened, awakenedMemories.length, enterMemory, isWrongChoiceSelected, nextMemory.id, returnToMemoryEntry, scene]);

  const mascotConfig = useMemo<LanMascotConfig>(() => ({
    pageId: 'chapter-one-guide',
    routePath: '/chapters/chapter-1',
    dialogue: {
      ...mascotDialogue,
      dialogLabel: '水脉精灵小澜的引导',
    },
    dialogueId: 'lan-dialogue-chapter-one',
    expressionId: scene === 'question' ? 'thinking' : scene === 'launch' ? 'turbid' : 'happy',
    initialPosition: { x: 82, y: 82 },
    spriteAlt: '水脉精灵小澜，点击打开或关闭引导，也可以拖动',
  }), [mascotDialogue, scene]);
  const { closeDialogue, openDialogue } = useLanMascot(mascotConfig);
  const shouldOpenMascotDialogue = scene === 'launch'
    || scene === 'memory-entry'
    || scene === 'awakened'
    || (scene === 'question' && (!isQuestionChoiceVisible || isWrongChoiceSelected));

  useEffect(() => {
    if (shouldOpenMascotDialogue) {
      openDialogue();
    } else {
      closeDialogue();
    }
  }, [closeDialogue, mascotDialogue.conversationId, openDialogue, shouldOpenMascotDialogue]);

  return (
    <main className={`chapter-one chapter-one--${scene} chapter-one--memory-${activeStory.id}`}>
      <div className="chapter-one__water-rings" aria-hidden="true"><i /><i /><i /></div>
      <header className="chapter-one__nav">
        <Link to="/chapters">返回水脉记忆</Link><span aria-hidden="true">/</span><p>第一章</p>
      </header>
      {scene === 'launch' ? (
        <section className="chapter-one__content" aria-labelledby="chapter-one-title">
          <p className="chapter-one__eyebrow">第一章 · 远古治水溯源</p>
          <p className="chapter-one__theme">顺势而为</p>
          <h1 id="chapter-one-title">水有去处，人有家园</h1>
          <p className="chapter-one__description">水脉精灵正在苏醒。那些关于山川、洪水与家园的记忆，也将在水波重新荡开时归来。</p>
          <button className="chapter-one__primary-action" type="button" onClick={() => setScene('memory-entry')}>
            唤醒水滴记忆<span aria-hidden="true">→</span>
          </button>
        </section>
      ) : scene === 'memory-entry' ? (
        <section className="chapter-one__memory-entry" aria-labelledby="memory-entry-title">
          <div className="chapter-one__memory-heading">
            <p>水滴记忆入口</p>
            <h1 id="memory-entry-title">三层记忆，正等待苏醒</h1>
          </div>
          <div className="chapter-one__memory-stage">
            <div className={`chapter-one__memory-drop${allMemoriesAwakened ? ' chapter-one__memory-drop--complete' : ''}`} aria-hidden="true">
              {memoryStories.map((memory) => <span key={memory.id} className={`chapter-one__memory-ripple chapter-one__memory-ripple--${memory.id}${awakenedMemories.includes(memory.id) ? ' chapter-one__memory-ripple--awake' : ''}`} />)}
            </div>
            <ol className="chapter-one__memory-list">
              {memoryStories.map((memory) => {
                const isComplete = awakenedMemories.includes(memory.id);
                const isUnlocked = memory.id === 1 || awakenedMemories.includes(memory.id - 1);
                return (
                  <li key={memory.id} className={`chapter-one__memory-node${isUnlocked ? ' chapter-one__memory-node--unlocked' : ''}${isComplete ? ' chapter-one__memory-node--complete' : ''}`}>
                    <span className="chapter-one__memory-number">0{memory.id}</span>
                    <div>
                      <h2>{memory.title}</h2>
                      <p>{isComplete ? `记忆已唤醒 · ${memory.insight}` : memory.guidance}</p>
                    </div>
                    <button className="chapter-one__memory-state" type="button" disabled={!isUnlocked} onClick={() => enterMemory(memory.id)}>
                      {isComplete ? '重温记忆' : isUnlocked ? '进入记忆' : '待解锁'}
                    </button>
                  </li>
                );
              })}
            </ol>
          </div>
          <p className="chapter-one__memory-progress">已唤醒 {awakenedMemories.length}/3 段记忆 · 水脉感悟值 {insight}/30</p>
          {allMemoriesAwakened && <p className="chapter-one__memory-complete">三道纹路已连成“顺势之纹”，第二章的水路已经亮起。</p>}
          <button className="chapter-one__return-action" type="button" onClick={() => setScene('launch')}>返回第一章序页</button>
        </section>
      ) : (
        <section className={`chapter-one__story chapter-one__story--${scene}`} aria-labelledby="memory-story-title">
          <header className="chapter-one__story-header">
            <button className="chapter-one__story-back" type="button" onClick={returnToMemoryEntry}>← 返回水滴记忆</button>
            <p>第 {activeStory.id} 层记忆 · {activeStory.insight}</p>
          </header>
          <div className="chapter-one__story-landscape" aria-hidden="true">
            <span className="chapter-one__story-mountain chapter-one__story-mountain--left" />
            <span className="chapter-one__story-mountain chapter-one__story-mountain--right" />
            <span className="chapter-one__story-water" />
            <span className="chapter-one__story-dam" />
          </div>
          {scene === 'video' && (
            <div className="chapter-one__story-card chapter-one__story-card--video">
              <div className="chapter-one__story-intro"><p>{activeStory.opening}</p><h1 id="memory-story-title">{activeStory.videoHeading}</h1></div>
              <div className="chapter-one__video-frame">
                {introVideoSource ? (
                  <video controls preload="metadata" poster={introPosterSource} onEnded={() => setScene('question')}>
                    <source src={introVideoSource} />
                    您的浏览器不支持视频播放。
                  </video>
                ) : <p>故事影像准备中，请直接进入互动。</p>}
              </div>
              <button className="chapter-one__primary-action" type="button" onClick={() => setScene('question')}>跳过影像，进入互动<span aria-hidden="true">→</span></button>
            </div>
          )}
          {scene === 'question' && isQuestionChoiceVisible && (
            <div className={`chapter-one__story-card chapter-one__story-card--choice${isWrongChoiceSelected ? ' chapter-one__story-card--flooded' : ''}`}>
              <p className="chapter-one__story-kicker">{activeStory.question}</p>
              <h1 id="memory-story-title">先看清水与土地的关系</h1>
              <div className="chapter-one__choice-list">
                <button className="chapter-one__choice" type="button" onClick={() => setIsWrongChoiceSelected(true)}>{activeStory.wrongChoice}</button>
                <button className="chapter-one__choice chapter-one__choice--correct" type="button" onClick={() => setScene('observation')}>{activeStory.correctChoice}</button>
              </div>
            </div>
          )}
          {scene === 'observation' && (
            <div className="chapter-one__story-card chapter-one__story-card--observation">
              <p className="chapter-one__story-kicker">沿着水势看山川</p>
              <h1 id="memory-story-title">{activeStory.observationHeading}</h1>
              <div className="chapter-one__water-map" aria-label={`${activeStory.markers.join('、')}被金色纹路标记`}>
                {activeStory.markers.map((marker, index) => <span key={marker} className={`chapter-one__map-mark chapter-one__map-mark--${index + 1}`}>{marker}</span>)}
              </div>
              <p className="chapter-one__observation-copy">{activeStory.observationCopy}</p>
              <button className="chapter-one__primary-action" type="button" onClick={finishMemory}>唤醒“{activeStory.insight}”<span aria-hidden="true">→</span></button>
            </div>
          )}
          {scene === 'awakened' && (
            <div className="chapter-one__story-card chapter-one__story-card--awakened">
              <p className="chapter-one__story-kicker">第 {activeStory.id} 层记忆已唤醒</p>
              <h1 id="memory-story-title">{activeStory.insight}</h1>
              <p>{activeStory.observationCopy}</p>
              <p className="chapter-one__insight-reward">水脉感悟值 +10 · 当前 {insight}/30</p>
              {activeStory.id === 3 ? (
                <div className="chapter-one__completion-actions">
                  <button className="chapter-one__primary-action" type="button" onClick={returnToMemoryEntry}>查看顺势之纹</button>
                  <Link className="chapter-one__next-chapter" to="/basins">前往第二章<span aria-hidden="true">→</span></Link>
                </div>
              ) : <button className="chapter-one__primary-action" type="button" onClick={returnToMemoryEntry}>回到水滴记忆<span aria-hidden="true">→</span></button>}
            </div>
          )}
        </section>
      )}
    </main>
  );
}

export default ChapterOne;
