import { useMemo, useState, type CSSProperties } from 'react';
import { Link } from 'react-router-dom';

import shanhaiWaterChronicle from '@/assets/images/shanhai-water-chronicle.png';
import { useGovernanceProgress } from '@/components/common/governanceProgressContext';
import ChapterChoicePanel from '@/components/chapter/ChapterChoicePanel';
import ChapterSpirit, { type ChapterSpiritMood } from '@/components/chapter/ChapterSpirit';
import { worldWaterNodes } from '@/data/worldWater';
import type { WorldWaterChoice, WorldWaterNodeId } from '@/types/worldWater';

import './WorldWater.css';

function WorldWater() {
  const { recordLevelResult } = useGovernanceProgress();
  const [activeNodeId, setActiveNodeId] = useState<WorldWaterNodeId | null>(null);
  const [selectedChoiceByNode, setSelectedChoiceByNode] = useState<Record<string, string>>({});
  const [scoreByNode, setScoreByNode] = useState<Record<string, number>>({});
  const [isFinished, setIsFinished] = useState(false);

  const activeNode = worldWaterNodes.find((node) => node.id === activeNodeId) ?? null;
  const completedCount = Object.keys(selectedChoiceByNode).length;
  const totalScore = Object.values(scoreByNode).reduce((total, score) => total + score, 0);
  const progressPercent = Math.round((completedCount / worldWaterNodes.length) * 100);
  const activeChoiceId = activeNode === null ? null : selectedChoiceByNode[activeNode.id] ?? null;
  const spiritMood: ChapterSpiritMood = isFinished
    ? 'resolved'
    : activeChoiceId !== null
      ? 'recorded'
      : activeNodeId !== null
        ? 'listening'
        : 'resting';

  const nextNodeLabel = useMemo(() => {
    const nextNode = worldWaterNodes.find((node) => selectedChoiceByNode[node.id] === undefined);
    return nextNode === undefined ? '完成航路记录' : `前往 ${nextNode.order.toString().padStart(2, '0')} · ${nextNode.title}`;
  }, [selectedChoiceByNode]);

  const handleChoice = (choice: WorldWaterChoice): void => {
    if (activeNode === null || activeChoiceId !== null) return;

    setSelectedChoiceByNode((current) => ({ ...current, [activeNode.id]: choice.id }));
    setScoreByNode((current) => ({ ...current, [activeNode.id]: choice.stars }));
    void recordLevelResult(`chapter-3-${activeNode.id}`, choice.stars).catch(() => undefined);
  };

  const handleContinue = (): void => {
    const nextNode = worldWaterNodes.find((node) => selectedChoiceByNode[node.id] === undefined);

    if (nextNode === undefined) {
      setActiveNodeId(null);
      setIsFinished(true);
      return;
    }

    setActiveNodeId(nextNode.id);
  };

  const handleRestartView = (): void => {
    setIsFinished(false);
    setActiveNodeId(null);
  };

  return (
    <main className="world-water-page">
      <div className="world-water-page__backdrop" aria-hidden="true">
        <img src={shanhaiWaterChronicle} alt="" />
      </div>
      <div className="world-water-page__wash" aria-hidden="true" />

      <header className="world-water-page__topbar">
        <Link className="world-water-page__back-link" to="/chapters">← 水脉图册</Link>
        <div className="world-water-page__chapter-mark">
          <span>CHAPTER 03</span>
          <strong>航 · 共建共享</strong>
        </div>
        <div className="world-water-page__score" aria-label={`本章已记录 ${totalScore} 记忆星`}>
          <span>航路记忆</span>
          <strong>{totalScore.toString().padStart(2, '0')}</strong>
        </div>
      </header>

      <div className="world-water-page__grid">
        <section className="world-water-page__intro" aria-labelledby="world-water-title">
          <p className="world-water-page__eyebrow">海上水脉 / WORLD WATER</p>
          <h1 id="world-water-title">把水脉带向<br /><em>更远的地方</em></h1>
          <p className="world-water-page__lede">
            从一条河到一片海，水把不同的土地和生活连接起来。请沿着三处水脉，寻找一条不把答案简单复制出去的路。
          </p>
          <div className="world-water-page__principle">
            <span>澜澜的航记</span>
            <p>共享不是把一套答案带去远方，而是和当地一起找到它。</p>
          </div>
          <div className="world-water-page__legend" aria-label="航路图例">
            <span><i className="is-current" />可探索水脉</span>
            <span><i className="is-recorded" />已留下回应</span>
          </div>
        </section>

        <section className="world-water-route" aria-label="世界水域航路">
          <div className="world-water-route__heading">
            <span>WATER ROUTE / 01—03</span>
            <span>河口 → 河廊 → 海湾</span>
          </div>
          <div className="world-water-route__surface">
            <svg className="world-water-route__svg" viewBox="0 0 900 360" preserveAspectRatio="none" aria-hidden="true">
              <path className="world-water-route__contour world-water-route__contour--one" d="M20 110C145 52 186 170 298 126S487 80 596 140s176 52 284-40" />
              <path className="world-water-route__contour world-water-route__contour--two" d="M-20 226c115-68 193 28 304-4s185-66 292-9 207 20 344-58" />
              <path className="world-water-route__line" d="M48 270C167 218 229 265 318 220S440 154 523 189s151 14 250-91" />
              <path className="world-water-route__line world-water-route__line--echo" d="M48 280C167 228 229 275 318 230S440 164 523 199s151 14 250-91" />
            </svg>
            <ol className="world-water-route__nodes">
              {worldWaterNodes.map((node) => {
                const isActive = activeNodeId === node.id;
                const isRecorded = selectedChoiceByNode[node.id] !== undefined;
                const markerStyle = {
                  '--node-x': `${node.x}%`,
                  '--node-y': `${node.y}%`,
                } as CSSProperties;

                return (
                  <li className={`world-water-route__node${isActive ? ' is-active' : ''}${isRecorded ? ' is-recorded' : ''}`} key={node.id} style={markerStyle}>
                    <button
                      type="button"
                      aria-current={isActive ? 'step' : undefined}
                      aria-label={`${node.order} ${node.region}：${node.title}`}
                      onClick={() => { setIsFinished(false); setActiveNodeId(node.id); }}
                    >
                      <span className="world-water-route__node-dot" aria-hidden="true" />
                      <span className="world-water-route__node-copy">
                        <small>{node.order.toString().padStart(2, '0')} / {node.region}</small>
                        <strong>{node.title}</strong>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ol>
            <div className="world-water-route__stamp" aria-hidden="true">
              <span>水行</span>
              <small>同流 · 共识 · 共生</small>
            </div>
            <ChapterSpirit chapter="voyage" mood={spiritMood} />
          </div>
          <p className="world-water-route__note">点击节点，听见当地的水声。</p>
        </section>

        <aside className="world-water-page__panel">
          {isFinished ? (
            <section className="world-water-page__finish" aria-live="polite">
              <p className="world-water-page__eyebrow">航路已连成 / ROUTE COMPLETE</p>
              <h2>你把经验交给了水脉，<br />也把答案留给了当地。</h2>
              <p>三处节点已完成记录，本章获得 <strong>{totalScore} / 9</strong> 记忆星。</p>
              <div className="world-water-page__finish-actions">
                <button type="button" onClick={handleRestartView}>回看航路</button>
                <Link to="/chapters">返回章节图册<span aria-hidden="true">→</span></Link>
              </div>
            </section>
          ) : activeNode !== null ? (
            <ChapterChoicePanel
              idPrefix={`world-water-${activeNode.id}`}
              sectionLabel={`${activeNode.order.toString().padStart(2, '0')} · ${activeNode.region}`}
              sectionTitle={activeNode.title}
              sectionSubtitle={activeNode.subtitle}
              story={activeNode.story}
              question={activeNode.question}
              choices={activeNode.choices}
              selectedChoiceId={activeChoiceId}
              completedCount={completedCount}
              totalCount={worldWaterNodes.length}
              score={totalScore}
              onChoice={handleChoice}
              onContinue={handleContinue}
              continueLabel={nextNodeLabel}
            />
          ) : (
            <section className="world-water-page__guide">
              <span className="world-water-page__guide-mark" aria-hidden="true">澜</span>
              <p className="world-water-page__eyebrow">澜澜的航记 / FIELD NOTES</p>
              <h2>先选一处水脉，<br />再决定如何同行。</h2>
              <p>三处节点没有标准答案。你的选择会留下记忆星，也会改变这段航路的注脚。</p>
              <span className="world-water-page__guide-line" aria-hidden="true" />
              <small>从左至右探索，或自由选择节点。</small>
            </section>
          )}
        </aside>
      </div>

      <footer className="world-water-page__footer">
        <span>第三章 · 中国方案与海上丝路</span>
        <div className="world-water-page__progress" aria-label={`已记录 ${completedCount} / ${worldWaterNodes.length} 处水脉`}>
          <i style={{ '--progress': `${progressPercent}%` } as CSSProperties} />
        </div>
        <span>{completedCount.toString().padStart(2, '0')} / {worldWaterNodes.length.toString().padStart(2, '0')}</span>
      </footer>
    </main>
  );
}

export default WorldWater;
