import { useMemo, useState, type CSSProperties } from 'react';
import { Link } from 'react-router-dom';

import shanhaiWaterChronicle from '@/assets/images/shanhai-water-chronicle.png';
import { useGovernanceProgress } from '@/components/common/governanceProgressContext';
import ChapterChoicePanel from '@/components/chapter/ChapterChoicePanel';
import { cosmicSignals } from '@/data/cosmicConstraint';
import type { CosmicChoice, CosmicSignalId } from '@/types/cosmicConstraint';

import './CosmicFuture.css';

function CosmicFuture() {
  const { recordLevelResult } = useGovernanceProgress();
  const [activeSignalId, setActiveSignalId] = useState<CosmicSignalId | null>(null);
  const [selectedChoiceBySignal, setSelectedChoiceBySignal] = useState<Record<string, string>>({});
  const [scoreBySignal, setScoreBySignal] = useState<Record<string, number>>({});
  const [isFinished, setIsFinished] = useState(false);

  const activeSignal = cosmicSignals.find((signal) => signal.id === activeSignalId) ?? null;
  const completedCount = Object.keys(selectedChoiceBySignal).length;
  const totalScore = Object.values(scoreBySignal).reduce((total, score) => total + score, 0);
  const progressPercent = Math.round((completedCount / cosmicSignals.length) * 100);
  const activeChoiceId = activeSignal === null ? null : selectedChoiceBySignal[activeSignal.id] ?? null;

  const nextSignalLabel = useMemo(() => {
    const nextSignal = cosmicSignals.find((signal) => selectedChoiceBySignal[signal.id] === undefined);
    return nextSignal === undefined ? '完成未来坐标' : `前往 ${nextSignal.order.toString().padStart(2, '0')} · ${nextSignal.signal}`;
  }, [selectedChoiceBySignal]);

  const handleChoice = (choice: CosmicChoice): void => {
    if (activeSignal === null || activeChoiceId !== null) return;

    setSelectedChoiceBySignal((current) => ({ ...current, [activeSignal.id]: choice.id }));
    setScoreBySignal((current) => ({ ...current, [activeSignal.id]: choice.stars }));
    void recordLevelResult(`chapter-4-${activeSignal.id}`, choice.stars).catch(() => undefined);
  };

  const handleContinue = (): void => {
    const nextSignal = cosmicSignals.find((signal) => selectedChoiceBySignal[signal.id] === undefined);

    if (nextSignal === undefined) {
      setActiveSignalId(null);
      setIsFinished(true);
      return;
    }

    setActiveSignalId(nextSignal.id);
  };

  return (
    <main className="cosmic-future-page">
      <div className="cosmic-future-page__backdrop" aria-hidden="true">
        <img src={shanhaiWaterChronicle} alt="" />
      </div>
      <div className="cosmic-future-page__wash" aria-hidden="true" />

      <header className="cosmic-future-page__topbar">
        <Link className="cosmic-future-page__back-link" to="/chapters">← 水脉图册</Link>
        <div className="cosmic-future-page__chapter-mark">
          <span>CHAPTER 04</span>
          <strong>望 · 共同家园</strong>
        </div>
        <div className="cosmic-future-page__score" aria-label={`本章已记录 ${totalScore} 记忆星`}>
          <span>未来坐标</span>
          <strong>{totalScore.toString().padStart(2, '0')}</strong>
        </div>
      </header>

      <div className="cosmic-future-page__grid">
        <section className="cosmic-future-page__intro" aria-labelledby="cosmic-future-title">
          <p className="cosmic-future-page__eyebrow">行星约束 / PLANETARY HORIZON</p>
          <h1 id="cosmic-future-title">水脉向<br /><em>未来</em></h1>
          <p className="cosmic-future-page__lede">
            当江河、田野、城市与海洋被看作一张水网，未来就不再是遥远的年份，而是今天每一次取舍留下的方向。
          </p>
          <div className="cosmic-future-page__principle">
            <span>澜澜的望远镜</span>
            <p>边界不是终点。给水留下回旋，也给共同家园留下时间。</p>
          </div>
          <div className="cosmic-future-page__legend" aria-label="未来信号图例">
            <span><i className="is-current" />待回应信号</span>
            <span><i className="is-recorded" />已保存判断</span>
          </div>
        </section>

        <section className="cosmic-future-orbit" aria-label="未来水脉信号">
          <div className="cosmic-future-orbit__heading">
            <span>FUTURE SIGNALS / 01—04</span>
            <span>从变化到约定</span>
          </div>
          <div className="cosmic-future-orbit__surface">
            <svg className="cosmic-future-orbit__svg" viewBox="0 0 640 560" aria-hidden="true">
              <circle className="cosmic-future-orbit__halo" cx="320" cy="280" r="187" />
              <ellipse className="cosmic-future-orbit__orbit cosmic-future-orbit__orbit--one" cx="320" cy="280" rx="260" ry="108" />
              <ellipse className="cosmic-future-orbit__orbit cosmic-future-orbit__orbit--two" cx="320" cy="280" rx="204" ry="170" />
              <ellipse className="cosmic-future-orbit__orbit cosmic-future-orbit__orbit--three" cx="320" cy="280" rx="132" ry="232" />
              <path className="cosmic-future-orbit__waterline" d="M70 330C157 273 216 358 294 318s124-40 190-4 73 24 104-11" />
              <path className="cosmic-future-orbit__waterline cosmic-future-orbit__waterline--echo" d="M72 342C159 285 218 370 296 330s124-40 190-4 73 24 104-11" />
            </svg>
            <div className="cosmic-future-orbit__core" aria-hidden="true">
              <span>共同</span>
              <strong>家园</strong>
              <i />
            </div>
            <ol className="cosmic-future-orbit__signals">
              {cosmicSignals.map((signal) => {
                const isActive = activeSignalId === signal.id;
                const isRecorded = selectedChoiceBySignal[signal.id] !== undefined;
                const markerStyle = {
                  '--signal-x': `${signal.x}%`,
                  '--signal-y': `${signal.y}%`,
                } as CSSProperties;

                return (
                  <li className={`cosmic-future-orbit__signal${isActive ? ' is-active' : ''}${isRecorded ? ' is-recorded' : ''}`} key={signal.id} style={markerStyle}>
                    <button
                      type="button"
                      aria-current={isActive ? 'step' : undefined}
                      aria-label={`${signal.order} ${signal.signal}：${signal.title}`}
                      onClick={() => { setIsFinished(false); setActiveSignalId(signal.id); }}
                    >
                      <span className="cosmic-future-orbit__signal-dot" aria-hidden="true" />
                      <span className="cosmic-future-orbit__signal-copy">
                        <small>{signal.order.toString().padStart(2, '0')} / {signal.signal}</small>
                        <strong>{signal.title}</strong>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ol>
            <div className="cosmic-future-orbit__stamp" aria-hidden="true">
              <span>望</span>
              <small>观其变 · 守其界</small>
            </div>
          </div>
          <p className="cosmic-future-orbit__note">点击一个未来信号，留下你的判断。</p>
        </section>

        <aside className="cosmic-future-page__panel">
          {isFinished ? (
            <section className="cosmic-future-page__finish" aria-live="polite">
              <p className="cosmic-future-page__eyebrow">未来坐标已保存 / HORIZON COMPLETE</p>
              <h2>你为变化留下了余地，<br />也为共同家园留下了时间。</h2>
              <p>四个未来信号已完成记录，本章获得 <strong>{totalScore} / 12</strong> 记忆星。</p>
              <div className="cosmic-future-page__finish-actions">
                <button type="button" onClick={() => { setIsFinished(false); setActiveSignalId(null); }}>回看未来坐标</button>
                <Link to="/chapters">返回章节图册<span aria-hidden="true">→</span></Link>
              </div>
            </section>
          ) : activeSignal !== null ? (
            <ChapterChoicePanel
              idPrefix={`cosmic-future-${activeSignal.id}`}
              sectionLabel={`${activeSignal.order.toString().padStart(2, '0')} · ${activeSignal.signal}`}
              sectionTitle={activeSignal.title}
              sectionSubtitle={activeSignal.subtitle}
              story={activeSignal.story}
              question={activeSignal.question}
              choices={activeSignal.choices}
              selectedChoiceId={activeChoiceId}
              completedCount={completedCount}
              totalCount={cosmicSignals.length}
              score={totalScore}
              onChoice={handleChoice}
              onContinue={handleContinue}
              continueLabel={nextSignalLabel}
            />
          ) : (
            <section className="cosmic-future-page__guide">
              <span className="cosmic-future-page__guide-mark" aria-hidden="true">望</span>
              <p className="cosmic-future-page__eyebrow">澜澜的望远镜 / FUTURE NOTES</p>
              <h2>先看见边界，<br />再决定向哪里生长。</h2>
              <p>四个信号没有唯一答案。请从气候、资源、城市与协商之间，找到一条可以被持续实践的路。</p>
              <span className="cosmic-future-page__guide-line" aria-hidden="true" />
              <small>点击轨道上的信号开始记录。</small>
            </section>
          )}
        </aside>
      </div>

      <footer className="cosmic-future-page__footer">
        <span>第四章 · 水脉向未来</span>
        <div className="cosmic-future-page__progress" aria-label={`已记录 ${completedCount} / ${cosmicSignals.length} 个未来信号`}>
          <i style={{ '--progress': `${progressPercent}%` } as CSSProperties} />
        </div>
        <span>{completedCount.toString().padStart(2, '0')} / {cosmicSignals.length.toString().padStart(2, '0')}</span>
      </footer>
    </main>
  );
}

export default CosmicFuture;
