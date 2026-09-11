import { useState, type CSSProperties } from 'react';
import { Link } from 'react-router-dom';

import chapter3EquatorialMangrove from '@/assets/images/scenes/chapter-3/equatorial-mangrove.webp';
import chapter3GuineaWaterpower from '@/assets/images/scenes/chapter-3/guinea-waterpower.webp';
import chapter3IndusHub from '@/assets/images/scenes/chapter-3/indus-hub.webp';
import chapter3MekongDelta from '@/assets/images/scenes/chapter-3/mekong-delta.webp';
import chapter3RedSeaDesert from '@/assets/images/scenes/chapter-3/red-sea-desert.webp';
import chapter3WorldSurvey from '@/assets/images/scenes/chapter-3/world-survey.webp';
import { useGovernanceProgress } from '@/components/common/governanceProgressContext';
import ChapterChoicePanel from '@/components/chapter/ChapterChoicePanel';
import { useChapterSpirit, type ChapterSpiritAction, type ChapterSpiritConfig } from '@/components/chapter-spirit';
import ChapterSceneStage from '@/components/chapter/ChapterSceneStage';
import ChapterSceneAnnotations, { type ChapterSceneAnnotation } from '@/components/chapter/ChapterSceneAnnotations';
import InkRipple, { type InkRippleTrigger } from '@/components/chapter/InkRipple';
import Magnet from '@/components/chapter/Magnet';
import StatefulActionButton from '@/components/chapter/StatefulActionButton';
import WaterMist from '@/components/chapter/WaterMist';
import { worldWaterStations, worldWaterSteps } from '@/data/worldWater';
import type { WorldWaterChoice, WorldWaterStation, WorldWaterStationId, WorldWaterStep } from '@/types/worldWater';

import './WorldWater.css';

interface WorldWaterResponse {
  stars: 1 | 2 | 3;
  feedback: string;
}

const waterFeelTotal = 30;

type WorldWaterSceneId = 'survey' | 'red-sea' | 'indus' | 'guinea' | 'equatorial' | 'mekong';

interface WorldWaterScene {
  annotations: readonly ChapterSceneAnnotation[];
  id: WorldWaterSceneId;
  label: string;
  poster: string;
}

const worldWaterScenes: Record<WorldWaterSceneId, WorldWaterScene> = {
  survey: {
    id: 'survey',
    label: '世界水域 · 共享航路',
    poster: chapter3WorldSurvey,
    annotations: [
      { id: 'survey-map', kicker: '世界水域 / 总览', title: '一张水图', detail: '先看水线如何穿过边界。', x: 20, y: 32 },
      { id: 'survey-river', kicker: '河脉 / 连接', title: '跨域相连', detail: '不同地方，共同面对水。', x: 49, y: 27 },
      { id: 'survey-delta', kicker: '三角洲 / 入海', title: '共同入海', detail: '所有选择最后都会回到海。', x: 56, y: 72 },
    ],
  },
  'red-sea': {
    id: 'red-sea',
    label: '红海 · 荒漠取水',
    poster: chapter3RedSeaDesert,
    annotations: [
      { id: 'red-sea-coast', kicker: '红海 / 海水', title: '从海取水', detail: '淡化让海水进入城市生活。', x: 46, y: 37, align: 'right' },
      { id: 'red-sea-plant', kicker: '淡化 / 转化', title: '变成可用的水', detail: '能源、成本与生态要一起计算。', x: 46, y: 64, align: 'right' },
      { id: 'red-sea-inland', kicker: '荒漠 / 内陆', title: '水向内陆', detail: '水路先于边界抵达社区。', x: 30, y: 73 },
    ],
  },
  indus: {
    id: 'indus',
    label: '印度河 · 山地枢纽',
    poster: chapter3IndusHub,
    annotations: [
      { id: 'indus-source', kicker: '山地来水 / 雨季', title: '先蓄住', detail: '把短时洪峰留在山谷。', x: 44, y: 28, align: 'right' },
      { id: 'indus-hub', kicker: '枢纽 / 多目标', title: '蓄洪与发电', detail: '工程服务于更长的水循环。', x: 44, y: 49, align: 'right' },
      { id: 'indus-fields', kicker: '灌溉 / 旱季', title: '再放入田', detail: '把水送到需要它的地方。', x: 47, y: 72, align: 'right' },
    ],
  },
  guinea: {
    id: 'guinea',
    label: '几内亚 · 水能与生态',
    poster: chapter3GuineaWaterpower,
    annotations: [
      { id: 'guinea-fall', kicker: '高地落差 / 水能', title: '借水势发电', detail: '让自然动力转化为公共能力。', x: 43, y: 43, align: 'right' },
      { id: 'guinea-flow', kicker: '生态流量 / 河道', title: '河流继续呼吸', detail: '发电之后，仍要给河留水。', x: 46, y: 70, align: 'right' },
      { id: 'guinea-community', kicker: '社区 / 共享', title: '收益回到当地', detail: '水能发展也要被共同看见。', x: 45, y: 27, align: 'right' },
    ],
  },
  equatorial: {
    id: 'equatorial',
    label: '赤道河口 · 从污染到修复',
    poster: chapter3EquatorialMangrove,
    annotations: [
      { id: 'equatorial-source', kicker: '河口 / 污染源', title: '先截住', detail: '修复从看清污染开始。', x: 23, y: 44 },
      { id: 'equatorial-treatment', kicker: '模块净化 / 小而有效', title: '逐段处理', detail: '让治理落在真实的河段上。', x: 40, y: 56 },
      { id: 'equatorial-mangrove', kicker: '红树林 / 最后一层', title: '让湿地接手', detail: '生态本身也是净水系统。', x: 47, y: 38, align: 'right' },
    ],
  },
  mekong: {
    id: 'mekong',
    label: '澜沧—湄公河 · 共享一条河',
    poster: chapter3MekongDelta,
    annotations: [
      { id: 'mekong-upstream', kicker: '上游 / 监测', title: '先共享信息', detail: '看见变化，才有共同判断。', x: 25, y: 28 },
      { id: 'mekong-river', kicker: '河身 / 预警', title: '让预警同行', detail: '一条河需要跨境协作。', x: 41, y: 48 },
      { id: 'mekong-delta', kicker: '三角洲 / 生活', title: '生态与生活', detail: '分配水，也守住河口。', x: 47, y: 64, align: 'right' },
    ],
  },
};

const worldWaterSceneByStep: Record<WorldWaterStep['id'], WorldWaterSceneId> = {
  'local-survey': 'survey',
  'red-sea-desalination': 'red-sea',
  'karot-hub': 'indus',
  'guinea-hydropower': 'guinea',
  'equatorial-cleanup': 'equatorial',
  'mekong-sharing': 'mekong',
  'mekong-allocation': 'mekong',
};

function getWorldWaterScene(stepId: WorldWaterStep['id'] | null): WorldWaterScene {
  return worldWaterScenes[stepId === null ? 'survey' : worldWaterSceneByStep[stepId]];
}

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
  const [feedbackByStep, setFeedbackByStep] = useState<Record<string, WorldWaterResponse>>({});
  const [insightByStep, setInsightByStep] = useState<Record<string, number>>({});
  const [isFinished, setIsFinished] = useState(false);
  const [ripple, setRipple] = useState<InkRippleTrigger | null>(null);
  const [activeSceneAnnotationId, setActiveSceneAnnotationId] = useState<string | null>(null);

  const activeStep = worldWaterSteps.find((step) => step.id === activeStepId) ?? null;
  const activeWorldWaterScene = getWorldWaterScene(activeStepId);
  const activeResponse = activeStep === null ? null : responseByStep[activeStep.id] ?? null;
  const activeFeedback = activeStep === null ? null : feedbackByStep[activeStep.id] ?? activeResponse;
  const activeSelectedChoiceIds = activeStep === null ? [] : selectedChoiceIdsByStep[activeStep.id] ?? [];
  const completedCount = worldWaterSteps.filter((step) => responseByStep[step.id] !== undefined).length;
  const totalScore = Object.values(responseByStep).reduce((total, response) => total + response.stars, 0);
  const waterFeel = worldWaterSteps.reduce((total, step) => total + (insightByStep[step.id] ?? 0), 0);
  const progressPercent = Math.round((waterFeel / waterFeelTotal) * 100);
  const activeInsightPercent = activeStep === null
    ? 0
    : Math.round(((insightByStep[activeStep.id] ?? 0) / activeStep.waterGain) * 100);
  const activeRouteStation = worldWaterStations.find((station) => station.id === activeStationId) ?? null;
  const routeProgress = isFinished
    ? 1
    : activeRouteStation === null
      ? 0
      : activeRouteStation.order / worldWaterStations.length;
  const nextStep = worldWaterSteps.find((step) => responseByStep[step.id] === undefined) ?? null;
  const nextStepLabel = nextStep === null
    ? '完成同舟共济'
    : `前往 ${nextStep.order.toString().padStart(2, '0')} · ${nextStep.title}`;
  const panelKey = isFinished
    ? 'finish'
    : activeStep === null
      ? 'guide'
      : `${activeStep.id}-${activeResponse === null ? 'open' : 'answered'}`;
  const pagePanelState = isFinished ? 'finish' : activeStep === null ? 'guide' : 'question';

  const triggerRipple = (x: number, y: number): void => {
    setRipple((current) => ({
      id: (current?.id ?? 0) + 1,
      x,
      y,
      tone: 'water',
    }));
  };
  const spiritAction: ChapterSpiritAction = isFinished
    ? 'purify'
    : activeResponse !== null
      ? 'hold-water'
      : activeStepId !== null
        ? 'point-water'
        : 'sleeve';

  const openStation = (station: WorldWaterStation): void => {
    triggerRipple(station.x, station.y);
    const stepId = getStationStepId(station, responseByStep);
    setIsFinished(false);
    setActiveStationId(station.id);
    setActiveStepId(stepId);
    setActiveSceneAnnotationId(null);
  };

  const saveResponse = (step: WorldWaterStep, selectedChoiceIds: readonly string[]): void => {
    const response = evaluateStep(step, selectedChoiceIds);
    setSelectedChoiceIdsByStep((current) => ({ ...current, [step.id]: [...selectedChoiceIds] }));
    setInsightByStep((current) => ({
      ...current,
      [step.id]: Math.max(current[step.id] ?? 0, step.waterGain * response.stars / 3),
    }));
    setFeedbackByStep((current) => ({ ...current, [step.id]: response }));
    if (response.stars !== 3) return;

    setResponseByStep((current) => ({ ...current, [step.id]: response }));
    void recordLevelResult(`chapter-3-${step.id}`, 3).catch(() => undefined);
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

  const handleRetry = (): void => {
    if (activeStep === null || activeResponse !== null) return;
    setSelectedChoiceIdsByStep((current) => ({ ...current, [activeStep.id]: [] }));
    setFeedbackByStep((current) => {
      const rest = { ...current };
      delete rest[activeStep.id];
      return rest;
    });
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

  const guideMessages = isFinished
    ? ['五处水脉已经连成一条航路。', '如果愿意，可以回看每一次留下的判断。']
    : activeStep === null
      ? ['先从当地开始看，别急着给水下结论。', '沿着水线点开任一处水脉，澜澜会陪你记录。']
      : activeResponse === null
        ? [`这一站先看${activeStep.region}的现场。`, activeStep.subtitle || '读完情境，再留下你的判断。']
        : ['你的判断已经写进航记。', '顺着水线，再走下一站。'];
  const guideActionLabel = isFinished
    ? '回看航路'
    : activeStep === null
      ? '开始勘察'
      : activeResponse === null
        ? '查看题面'
          : nextStep === null
            ? '完成航路'
            : '继续下一站';
  const routeInstruction = isFinished
    ? '✓ 航路已完成，可回看节点。'
    : activeStep === null
      ? '① 点击一个金色节点，开始勘察'
      : activeResponse === null
        ? '② 选择一项回应，写入航记'
        : nextStep === null
          ? '✓ 七道判断已记录'
          : '③ 继续下一站';

  const handleGuideAction = (): void => {
    if (isFinished) {
      setIsFinished(false);
      setActiveStationId(null);
      setActiveStepId(null);
      return;
    }

    if (activeStep === null) {
      handleStartSurvey();
      return;
    }

    if (activeResponse !== null) handleContinue();
  };
  const spiritConfig: ChapterSpiritConfig = {
    pageId: 'chapter-three-guide', routePath: '/chapter-3', action: spiritAction,
    initialPosition: { x: 16, y: 82 }, spriteAlt: '小澜水精灵，可拖动并打开同舟共济导览',
    dialogueId: 'world-water-dialogue', dialoguePresentation: 'floating',
    dialogue: { conversationId: `world-water-guide-${panelKey}`, dialogLabel: '小澜：同舟共济航记', messages: guideMessages, actionLabel: guideActionLabel, onAction: handleGuideAction },
  };
  useChapterSpirit(spiritConfig);

  return (
    <main className={`world-water-page world-water-page--scene-${activeWorldWaterScene.id} world-water-page--${pagePanelState}`}>
      <ChapterSceneStage
        key={activeWorldWaterScene.id}
        className="world-water-page__scene"
        label={activeWorldWaterScene.label}
        poster={activeWorldWaterScene.poster}
      />
      <div className="world-water-page__scene-annotations">
        <ChapterSceneAnnotations
          key={activeWorldWaterScene.id}
          activeId={activeSceneAnnotationId ?? undefined}
          annotations={activeWorldWaterScene.annotations}
          onSelect={setActiveSceneAnnotationId}
        />
      </div>

      <header className="world-water-page__topbar">
        <Link className="world-water-page__back-link" to="/chapters">← 水脉图册</Link>
        <div className="world-water-page__chapter-mark">
          <span>CHAPTER 03</span>
          <strong>航 · 同舟共济</strong>
        </div>
        <div className="world-water-page__score" aria-label={`水脉感悟 ${progressPercent}%`}>
          <span>水脉感悟</span>
          <strong>{progressPercent}<small> %</small></strong>
        </div>
      </header>

      <div className="world-water-page__grid">
        <section className="world-water-page__intro" aria-labelledby="world-water-title">
          <p className="world-water-page__eyebrow">第三章 / 世界水域</p>
          <h1 id="world-water-title">让经验随水<br /><em>同行</em></h1>
          <p className="world-water-page__lede">一条水脉，穿过不同的地方。</p>
        </section>

        <section className="world-water-route" aria-label="同舟共济五处水脉航路">
          <div className="world-water-route__heading">
            <span>水脉航路 / 05</span>
            <span className="world-water-route__instruction" aria-live="polite">{routeInstruction}</span>
          </div>
          <WaterMist
            className="world-water-route__mist-layer"
            mistColor="#c6e5d6"
            puffCount={5}
            rippleColor="#b8d8c9"
            rippleCount={2}
            rippleRadius={24}
          >
            <div className="world-water-route__surface">
              <svg className="world-water-route__svg" viewBox="0 0 900 360" preserveAspectRatio="none" aria-hidden="true">
                <path className="world-water-route__contour world-water-route__contour--one" d="M12 103C108 55 178 158 270 120S438 78 539 132s210 71 350-48" />
                <path className="world-water-route__contour world-water-route__contour--two" d="M-20 225c108-67 198 33 300-1s178-66 283-11 206 25 357-67" />
                <path className="world-water-route__line" d="M22 264C112 226 170 284 265 235s142-61 224-19 153 25 243-52 113-92 166-110" />
                <path className="world-water-route__line world-water-route__line--echo" d="M22 276C112 238 170 296 265 247s142-61 224-19 153 25 243-52 113-92 166-110" />
                <path
                  key={`${isFinished ? 'complete' : activeStationId ?? 'idle'}-${activeStepId ?? 'none'}`}
                  className={`world-water-route__trace${routeProgress > 0 ? ' is-active' : ''}`}
                  d="M22 264C112 226 170 284 265 235s142-61 224-19 153 25 243-52 113-92 166-110"
                  pathLength="1"
                  style={{ '--route-progress': routeProgress } as CSSProperties}
                />
              </svg>
              <InkRipple trigger={ripple} />
              <ol className="world-water-route__nodes">
                {worldWaterStations.map((station) => {
                  const isActive = activeStationId === station.id;
                  const isRecorded = station.stepIds.every((stepId) => responseByStep[stepId] !== undefined);
                  const isNext = activeStepId === 'local-survey'
                    ? station.id === worldWaterStations[0]?.id
                    : station.id === nextStep?.stationId;
                  const completedStationSteps = station.stepIds.filter((stepId) => responseByStep[stepId] !== undefined).length;
                  const markerStyle = {
                    '--node-x': `${station.x}%`,
                    '--node-y': `${station.y}%`,
                  } as CSSProperties;

                  return (
                    <li className={`world-water-route__node${isActive ? ' is-active' : ''}${isRecorded ? ' is-recorded' : ''}${isNext ? ' is-next' : ''}`} key={station.id} style={markerStyle}>
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
            </div>
          </WaterMist>
          <p className="world-water-route__note" aria-live="polite">
            {activeStep?.id === 'local-survey'
              ? '开篇勘察 · 先看当地。'
              : activeStep === null
                ? '点选节点，开始记录。'
                : `记录中 · ${activeStep.region} · ${activeStep.title}`}
          </p>
        </section>

        <aside className="world-water-page__panel">
          <div key={panelKey} className="world-water-page__panel-content">
            {isFinished ? (
            <section className="world-water-page__finish" aria-live="polite">
              <p className="world-water-page__eyebrow">同舟之路已连成 / ROUTE COMPLETE</p>
              <h2>五处水脉连成了<br />一条同舟之路。</h2>
              <p>七道判断已写入航记，水脉感悟抵达 <strong>{progressPercent}%</strong>。你解锁了「同舟共济」的能力。</p>
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
               isSubmitted={activeFeedback !== null}
              selectionMode={activeStep.selectionMode}
              completedCount={completedCount}
              totalCount={worldWaterSteps.length}
              score={totalScore}
               feedbackText={activeFeedback?.feedback}
               feedbackStars={activeFeedback?.stars}
               feedbackHeading={activeResponse !== null ? '航记完成' : '部分感悟'}
               feedbackRewardLabel={activeResponse !== null ? '+3 航积分' : `本题感悟 ${activeInsightPercent}%`}
              onChoice={handleChoice}
              onToggleChoice={handleToggleChoice}
              onSubmit={handleSubmit}
               onContinue={activeResponse !== null ? handleContinue : handleRetry}
              submitLabel="确认这组判断"
               continueLabel={nextStepLabel}
               feedbackActionLabel={activeResponse !== null ? undefined : '重新作答'}
            />
            ) : (
            <section className="world-water-page__guide">
              <span className="world-water-page__guide-mark" aria-hidden="true">航</span>
              <p className="world-water-page__eyebrow">澜澜的航记 / FIELD NOTES</p>
              <h2>先看当地，<br />再和水同行。</h2>
              <p>五处水脉，五个现场。</p>
              <span className="world-water-page__guide-line" aria-hidden="true" />
              <Magnet wrapperClassName="world-water-page__magnet" padding={18} magnetStrength={6}>
                <WaterMist className="world-water-page__cta-mist" mistColor="#e7bf6c" rippleColor="#e7bf6c" rippleRadius={20}>
                  <StatefulActionButton className="world-water-page__text-button" onCommit={handleStartSurvey} completeLabel="已进入航路">
                    开始勘察
                  </StatefulActionButton>
                </WaterMist>
              </Magnet>
              <small>点选地图节点。</small>
            </section>
            )}
          </div>
        </aside>
      </div>

      <footer className="world-water-page__footer">
        <span>第三章 · 同舟共济</span>
        <div className="world-water-page__progress" aria-label={`水脉感悟 ${progressPercent}%`}>
          <i style={{ '--progress': `${progressPercent / 100}` } as CSSProperties} />
        </div>
        <span>{progressPercent} %</span>
      </footer>
    </main>
  );
}

export default WorldWater;
