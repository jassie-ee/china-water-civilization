import { useState, type CSSProperties } from 'react';
import { Link } from 'react-router-dom';

import shanhaiWaterChronicle from '@/assets/images/shanhai-water-chronicle.png';
import { useGovernanceProgress } from '@/components/common/governanceProgressContext';
import ChapterChoicePanel from '@/components/chapter/ChapterChoicePanel';
import ChapterSpirit, { type ChapterSpiritMood } from '@/components/chapter/ChapterSpirit';
import InkRipple, { type InkRippleTrigger } from '@/components/chapter/InkRipple';
import StatefulActionButton from '@/components/chapter/StatefulActionButton';
import { cosmicActs, cosmicReflectionChoices } from '@/data/cosmicConstraint';
import type { CosmicAct, CosmicActId, CosmicChoice } from '@/types/cosmicConstraint';

import './CosmicFuture.css';

type CosmicPhase = 'assembly' | 'reflection' | 'voyage' | 'awakening' | 'complete';

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
  const [phase, setPhase] = useState<CosmicPhase>('assembly');
  const [assembledShardIds, setAssembledShardIds] = useState<number[]>([]);
  const [reflectionChoiceId, setReflectionChoiceId] = useState<string | null>(null);
  const [reflectionStars, setReflectionStars] = useState<1 | 2 | 3>(3);
  const [ripple, setRipple] = useState<InkRippleTrigger | null>(null);

  const activeActId = getActForPhase(phase);
  const activeAct = cosmicActs.find((act) => act.id === activeActId) ?? cosmicActs[0];
  const isAssemblyComplete = assembledShardIds.length === shardNames.length;
  const waterFeel = phase === 'assembly' ? 0 : phase === 'reflection' ? 10 : phase === 'voyage' ? 20 : 30;
  const progressPercent = Math.round((waterFeel / 30) * 100);
  const spiritMood: ChapterSpiritMood = phase === 'complete' || phase === 'awakening'
    ? 'resolved'
    : phase === 'reflection' || phase === 'voyage'
      ? reflectionChoiceId !== null ? 'recorded' : 'listening'
      : 'resting';

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

  return (
    <main className={`cosmic-future-page cosmic-future-page--${phase}`}>
      <div className="cosmic-future-page__backdrop" aria-hidden="true">
        <img src={shanhaiWaterChronicle} alt="" />
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
          <div className="cosmic-future-orbit__surface">
            <svg className="cosmic-future-orbit__svg" viewBox="0 0 640 560" aria-hidden="true">
              <circle className="cosmic-future-orbit__halo" cx="320" cy="280" r="187" />
              <ellipse className="cosmic-future-orbit__orbit cosmic-future-orbit__orbit--one" cx="320" cy="280" rx="260" ry="108" />
              <ellipse className="cosmic-future-orbit__orbit cosmic-future-orbit__orbit--two" cx="320" cy="280" rx="204" ry="170" />
              <ellipse className="cosmic-future-orbit__orbit cosmic-future-orbit__orbit--three" cx="320" cy="280" rx="132" ry="232" />
              <path className="cosmic-future-orbit__waterline" d="M70 330C157 273 216 358 294 318s124-40 190-4 73 24 104-11" />
              <path className="cosmic-future-orbit__waterline cosmic-future-orbit__waterline--echo" d="M72 342C159 285 218 370 296 330s124-40 190-4 73 24 104-11" />
              <path className={`cosmic-future-orbit__waterline cosmic-future-orbit__waterline--trace${phase === 'assembly' ? '' : ' is-active'}`} d="M70 330C157 273 216 358 294 318s124-40 190-4 73 24 104-11" />
            </svg>
            <InkRipple trigger={ripple} />
            <div className="cosmic-future-orbit__core" aria-hidden="true">
              <span>{phase === 'voyage' ? '水脉' : phase === 'assembly' || phase === 'reflection' ? '连' : '天地'}</span>
              <strong>{phase === 'voyage' ? '贯星河' : phase === 'assembly' || phase === 'reflection' ? '天地' : '人和'}</strong>
              <i />
            </div>
            <div className="cosmic-future-orbit__shards" aria-label="三块水脉碎片">
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
            <ChapterSpirit chapter="horizon" mood={spiritMood} />
          </div>
          <p className="cosmic-future-orbit__note">
            {phase === 'assembly' ? '点击三块水脉碎片，完成记忆拼合。' : phase === 'reflection' ? '没有标准答案，选择你愿意带向宇宙的判断。' : '沿着水线继续向外，直到与星河相遇。'}
          </p>
        </section>

        <aside className="cosmic-future-page__panel">
          {phase === 'complete' ? (
            <section className="cosmic-future-page__finish" aria-live="polite">
              <p className="cosmic-future-page__eyebrow">终极觉醒已完成 / AWAKENING COMPLETE</p>
              <h2>所有散落的记忆，<br />都回到水脉里了。</h2>
              <p>从九州大地到漫天星河，三块碎片已经组成完整的宇宙水脉图。</p>
              <p className="cosmic-future-page__quote">人法地，地法天，天法道，道法自然。</p>
              <p className="cosmic-future-page__reward">水滴精灵最终觉醒：天地人和</p>
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
                <StatefulActionButton className="cosmic-future-page__primary-button" onCommit={handleEnterReflection} completeLabel="已打开共生之问">
                  进入宇宙共生之问
                </StatefulActionButton>
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
              totalCount={3}
              score={reflectionChoiceId === null ? 0 : reflectionStars}
              onChoice={handleReflectionChoice}
              onContinue={handleReflectionContinue}
              continueLabel="沿水脉飞向星河"
            />
          ) : phase === 'voyage' ? (
            <section className="cosmic-future-page__voyage-panel">
              <p className="cosmic-future-page__eyebrow">02 · 水脉贯星河 / LONG SHOT</p>
              <h2>准备好了吗？<br />沿着水脉，飞向星河。</h2>
              <p>镜头将从地球出发，经过月球、火星和更远的星辰。水在宇宙中不再只是河流，而是连接生命的脉络。</p>
              <div className="cosmic-future-page__voyage-route" aria-label="飞行路线">
                <span>地球</span><i /><span>月球</span><i /><span>火星</span><i /><span>银河</span>
              </div>
              <StatefulActionButton className="cosmic-future-page__primary-button" onCommit={handleLaunch} completeLabel="已进入星河">
                开始飞向宇宙
              </StatefulActionButton>
            </section>
          ) : (
            <section className="cosmic-future-page__awakening-panel">
              <p className="cosmic-future-page__eyebrow">03 · 天地人和 / FINAL AWAKENING</p>
              <h2>水流到哪里，<br />共生的道理就用到哪里。</h2>
              <p>地球、星辰和所有未知的水脉，都在同一张图里找到位置。最后一步，让澜澜成为这张图的一部分。</p>
              <p className="cosmic-future-page__quote">治水治到最后，治的不是水，是学会和天地万物好好相处。</p>
              <StatefulActionButton className="cosmic-future-page__primary-button" onCommit={handleComplete} completeLabel="觉醒已完成">
                完成终极觉醒
              </StatefulActionButton>
            </section>
          )}
        </aside>
      </div>

      <footer className="cosmic-future-page__footer">
        <span>第四章 · 天地人和</span>
        <div className="cosmic-future-page__progress" aria-label={`水脉感悟 ${waterFeel} / 30`}>
          <i style={{ '--progress': `${progressPercent}%` } as CSSProperties} />
        </div>
        <span>{waterFeel.toString().padStart(2, '0')} / 30</span>
      </footer>
    </main>
  );
}

export default CosmicFuture;
