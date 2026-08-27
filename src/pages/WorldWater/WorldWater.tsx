import { useState, type CSSProperties } from 'react';
import { Link } from 'react-router-dom';

import shanhaiWaterChronicle from '@/assets/images/shanhai-water-chronicle.png';
import { useGovernanceProgress } from '@/components/common/governanceProgressContext';
import ChapterChoicePanel from '@/components/chapter/ChapterChoicePanel';
import ChapterSpirit, { type ChapterSpiritMood } from '@/components/chapter/ChapterSpirit';
import { worldWaterStations, worldWaterSteps } from '@/data/worldWater';
import type { WorldWaterChoice, WorldWaterStation, WorldWaterStationId, WorldWaterStep } from '@/types/worldWater';

import './WorldWater.css';

interface WorldWaterResponse {
  stars: 1 | 2 | 3;
  feedback: string;
}

const waterFeelTotal = 30;

function getStationStepId(station: WorldWaterStation, responseByStep: Record<string, WorldWaterResponse>): WorldWaterStep['id'] | null {
  const nextStepId = station.stepIds.find((stepId) => responseByStep[stepId] === undefined);
  return nextStepId ?? station.stepIds[station.stepIds.length - 1] ?? null;
}

function evaluateStep(step: WorldWaterStep, selectedChoiceIds: readonly string[]): WorldWaterResponse {
  if (step.selectionMode === 'single') {
    const choice = step.choices.find((candidate) => candidate.id === selectedChoiceIds[0]);
    return {
      stars: choice?.stars ?? 1,
      feedback: choice?.feedback || step.partialFeedback,
    };
  }

  const requiredChoiceIds = new Set(step.requiredChoiceIds);
  const selectedChoiceIdSet = new Set(selectedChoiceIds);
  const isComplete = selectedChoiceIdSet.size === requiredChoiceIds.size
    && [...requiredChoiceIds].every((choiceId) => selectedChoiceIdSet.has(choiceId));
  const includesWrongChoice = [...selectedChoiceIdSet].some((choiceId) => !requiredChoiceIds.has(choiceId));

  return {
    stars: isComplete ? 3 : includesWrongChoice ? 1 : 2,
    feedback: isComplete ? step.correctFeedback : step.partialFeedback,
  };
}

function WorldWater() {
  const { recordLevelResult } = useGovernanceProgress();
  const [activeStationId, setActiveStationId] = useState<WorldWaterStationId | null>(null);
  const [activeStepId, setActiveStepId] = useState<WorldWaterStep['id'] | null>(null);
  const [selectedChoiceIdsByStep, setSelectedChoiceIdsByStep] = useState<Record<string, string[]>>({});
  const [responseByStep, setResponseByStep] = useState<Record<string, WorldWaterResponse>>({});
  const [isFinished, setIsFinished] = useState(false);

  const activeStep = worldWaterSteps.find((step) => step.id === activeStepId) ?? null;
  const activeResponse = activeStep === null ? null : responseByStep[activeStep.id] ?? null;
  const activeSelectedChoiceIds = activeStep === null ? [] : selectedChoiceIdsByStep[activeStep.id] ?? [];
  const completedCount = worldWaterSteps.filter((step) => responseByStep[step.id] !== undefined).length;
  const totalScore = Object.values(responseByStep).reduce((total, response) => total + response.stars, 0);
  const waterFeel = worldWaterSteps
    .filter((step) => responseByStep[step.id] !== undefined)
    .reduce((total, step) => total + step.waterGain, 0);
  const progressPercent = Math.round((waterFeel / waterFeelTotal) * 100);
  const nextStep = worldWaterSteps.find((step) => responseByStep[step.id] === undefined) ?? null;
  const nextStepLabel = nextStep === null
    ? '完成同舟共济'
    : `前往 ${nextStep.order.toString().padStart(2, '0')} · ${nextStep.title}`;
  const spiritMood: ChapterSpiritMood = isFinished
    ? 'resolved'
    : activeResponse !== null
      ? 'recorded'
      : activeStepId !== null
        ? 'listening'
        : 'resting';

  const openStation = (station: WorldWaterStation): void => {
    const stepId = getStationStepId(station, responseByStep);
    setIsFinished(false);
    setActiveStationId(station.id);
    setActiveStepId(stepId);
  };

  const saveResponse = (step: WorldWaterStep, selectedChoiceIds: readonly string[]): void => {
    const response = evaluateStep(step, selectedChoiceIds);
    setSelectedChoiceIdsByStep((current) => ({ ...current, [step.id]: [...selectedChoiceIds] }));
    setResponseByStep((current) => ({ ...current, [step.id]: response }));
    void recordLevelResult(`chapter-3-${step.id}`, response.stars).catch(() => undefined);
  };

  const handleChoice = (choice: WorldWaterChoice): void => {
    if (activeStep === null || activeStep.selectionMode !== 'single' || activeResponse !== null) return;
    saveResponse(activeStep, [choice.id]);
  };

  const handleToggleChoice = (choice: WorldWaterChoice): void => {
    if (activeStep === null || activeStep.selectionMode !== 'multiple' || activeResponse !== null) return;

    setSelectedChoiceIdsByStep((current) => {
      const selectedChoiceIds = current[activeStep.id] ?? [];
      const nextChoiceIds = selectedChoiceIds.includes(choice.id)
        ? selectedChoiceIds.filter((choiceId) => choiceId !== choice.id)
        : [...selectedChoiceIds, choice.id];

      return { ...current, [activeStep.id]: nextChoiceIds };
    });
  };

  const handleSubmit = (): void => {
    if (activeStep === null || activeStep.selectionMode !== 'multiple' || activeResponse !== null) return;
    saveResponse(activeStep, activeSelectedChoiceIds);
  };

  const handleContinue = (): void => {
    if (nextStep === null) {
      setActiveStationId(null);
      setActiveStepId(null);
      setIsFinished(true);
      return;
    }

    const nextStation = worldWaterStations.find((station) => station.id === nextStep.stationId);
    if (nextStation !== undefined) {
      setActiveStationId(nextStation.id);
    }
    setActiveStepId(nextStep.id);
  };

  const handleStartSurvey = (): void => {
    setIsFinished(false);
    setActiveStationId(null);
    setActiveStepId('local-survey');
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
          <strong>航 · 同舟共济</strong>
        </div>
        <div className="world-water-page__score" aria-label={`水脉感悟 ${waterFeel} / ${waterFeelTotal}`}>
          <span>水脉感悟</span>
          <strong>{waterFeel.toString().padStart(2, '0')}<small> / 30</small></strong>
        </div>
      </header>

      <div className="world-water-page__grid">
        <section className="world-water-page__intro" aria-labelledby="world-water-title">
          <p className="world-water-page__eyebrow">同舟共济 / GLOBAL WATERWAYS</p>
          <h1 id="world-water-title">让经验随水<br /><em>同行</em></h1>
          <p className="world-water-page__lede">
            从红海的荒漠取水，到湄澜六国共管一条河。真正的共享，不是复制一套答案，而是与当地一起找到水的路。
          </p>
          <div className="world-water-page__principle">
            <span>澜澜的航记</span>
            <p>方法可以共享，答案必须在地生长。</p>
          </div>
          <div className="world-water-page__legend" aria-label="航路图例">
            <span><i className="is-current" />五处水脉</span>
            <span><i className="is-recorded" />已留下回应</span>
            <span><i className="is-question" />七道判断</span>
          </div>
        </section>

        <section className="world-water-route" aria-label="同舟共济五处水脉航路">
          <div className="world-water-route__heading">
            <span>WATER ROUTE / 05 STOPS</span>
            <span>九州 → 红海 → 印度河 → 西非 → 湄澜</span>
          </div>
          <div className="world-water-route__surface">
            <svg className="world-water-route__svg" viewBox="0 0 900 360" preserveAspectRatio="none" aria-hidden="true">
              <path className="world-water-route__contour world-water-route__contour--one" d="M12 103C108 55 178 158 270 120S438 78 539 132s210 71 350-48" />
              <path className="world-water-route__contour world-water-route__contour--two" d="M-20 225c108-67 198 33 300-1s178-66 283-11 206 25 357-67" />
              <path className="world-water-route__line" d="M22 264C112 226 170 284 265 235s142-61 224-19 153 25 243-52 113-92 166-110" />
              <path className="world-water-route__line world-water-route__line--echo" d="M22 276C112 238 170 296 265 247s142-61 224-19 153 25 243-52 113-92 166-110" />
            </svg>
            <ol className="world-water-route__nodes">
              {worldWaterStations.map((station) => {
                const isActive = activeStationId === station.id;
                const isRecorded = station.stepIds.every((stepId) => responseByStep[stepId] !== undefined);
                const completedStationSteps = station.stepIds.filter((stepId) => responseByStep[stepId] !== undefined).length;
                const markerStyle = {
                  '--node-x': `${station.x}%`,
                  '--node-y': `${station.y}%`,
                } as CSSProperties;

                return (
                  <li className={`world-water-route__node${isActive ? ' is-active' : ''}${isRecorded ? ' is-recorded' : ''}`} key={station.id} style={markerStyle}>
                    <button
                      type="button"
                      aria-current={isActive ? 'step' : undefined}
                      aria-label={`${station.order} ${station.region}：${station.title}`}
                      onClick={() => openStation(station)}
                    >
                      <span className="world-water-route__node-dot" aria-hidden="true" />
                      <span className="world-water-route__node-copy">
                        <small>{station.order.toString().padStart(2, '0')} / {station.region}</small>
                        <strong>{station.title}</strong>
                        <em>{completedStationSteps} / {station.stepIds.length} 问</em>
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
          <p className="world-water-route__note">点击节点进入当地情境；湄澜六国会留下最后两道判断。</p>
        </section>

        <aside className="world-water-page__panel">
          {isFinished ? (
            <section className="world-water-page__finish" aria-live="polite">
              <p className="world-water-page__eyebrow">同舟之路已连成 / ROUTE COMPLETE</p>
              <h2>五处水脉连成了<br />一条同舟之路。</h2>
              <p>七道判断已写入航记，水脉感悟抵达 <strong>{waterFeel} / 30</strong>。你解锁了「同舟共济」的能力。</p>
              <p className="world-water-page__quote">共同构建人与自然生命共同体。</p>
              <div className="world-water-page__finish-actions">
                <button type="button" onClick={() => { setIsFinished(false); setActiveStationId(null); setActiveStepId(null); }}>回看航路</button>
                <Link to="/chapters">返回章节图册<span aria-hidden="true">→</span></Link>
              </div>
            </section>
          ) : activeStep !== null ? (
            <ChapterChoicePanel
              idPrefix={`world-water-${activeStep.id}`}
              sectionLabel={`${activeStep.order.toString().padStart(2, '0')} · ${activeStep.region}`}
              sectionTitle={activeStep.title}
              sectionSubtitle={activeStep.subtitle}
              story={activeStep.story}
              question={activeStep.question}
              choices={activeStep.choices}
              selectedChoiceId={activeStep.selectionMode === 'single' ? activeSelectedChoiceIds[0] ?? null : null}
              selectedChoiceIds={activeSelectedChoiceIds}
              isSubmitted={activeResponse !== null}
              selectionMode={activeStep.selectionMode}
              completedCount={completedCount}
              totalCount={worldWaterSteps.length}
              score={totalScore}
              feedbackText={activeResponse?.feedback}
              feedbackStars={activeResponse?.stars}
              onChoice={handleChoice}
              onToggleChoice={handleToggleChoice}
              onSubmit={handleSubmit}
              onContinue={handleContinue}
              submitLabel="确认这组判断"
              continueLabel={nextStepLabel}
            />
          ) : (
            <section className="world-water-page__guide">
              <span className="world-water-page__guide-mark" aria-hidden="true">航</span>
              <p className="world-water-page__eyebrow">澜澜的航记 / FIELD NOTES</p>
              <h2>先看当地，<br />再和水同行。</h2>
              <p>五处水脉、七道判断，从在地勘察开始，走过荒漠、印度河、西非和湄澜六国。</p>
              <span className="world-water-page__guide-line" aria-hidden="true" />
              <button className="world-water-page__text-button" type="button" onClick={handleStartSurvey}>
                开始勘察<span aria-hidden="true">→</span>
              </button>
              <small>也可以自由点击航路上的任一处水脉。</small>
            </section>
          )}
        </aside>
      </div>

      <footer className="world-water-page__footer">
        <span>第三章 · 同舟共济</span>
        <div className="world-water-page__progress" aria-label={`水脉感悟 ${waterFeel} / ${waterFeelTotal}`}>
          <i style={{ '--progress': `${progressPercent}%` } as CSSProperties} />
        </div>
        <span>{waterFeel.toString().padStart(2, '0')} / {waterFeelTotal}</span>
      </footer>
    </main>
  );
}

export default WorldWater;
