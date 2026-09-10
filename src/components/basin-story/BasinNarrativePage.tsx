import { useCallback, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

import { useGovernanceProgress } from '@/components/common/governanceProgressContext';
import RiverSpiritGuide from '@/components/lan/RiverSpiritGuide';
import type { LanMascotDialogue, LanMascotExpressionId } from '@/components/lan-mascot';
import type { BasinNarrativeConfig, BasinStoryScene } from '@/types/basinStory';

import BasinStoryStage from './BasinStoryStage';
import './BasinStory.css';

type InteractionPhase = 'idle' | 'question' | 'feedback';

function sceneFromLocation(config: BasinNarrativeConfig, state: unknown): BasinStoryScene {
  const selectedNodeId = typeof state === 'object' && state !== null
    ? (state as { selectedNodeId?: unknown }).selectedNodeId
    : undefined;
  return config.scenes.find((scene) => scene.nodeId === selectedNodeId) ?? config.scenes[0];
}

function BasinNarrativePage({ config }: { config: BasinNarrativeConfig }) {
  const location = useLocation();
  const { recordLevelResult } = useGovernanceProgress();
  const [activeSceneId, setActiveSceneId] = useState(() => sceneFromLocation(config, location.state).id);
  const [interactionSceneId, setInteractionSceneId] = useState<string | null>(null);
  const [interactionPhase, setInteractionPhase] = useState<InteractionPhase>('idle');
  const [selectedChoiceId, setSelectedChoiceId] = useState<string | null>(null);
  const [rewardCopy, setRewardCopy] = useState('');
  const [isDialogueOpen, setIsDialogueOpen] = useState(false);
  const activeScene = config.scenes.find((scene) => scene.id === activeSceneId) ?? config.scenes[0];
  const activeBackground = config.sceneBackgrounds?.[activeScene.id] ?? config.background;
  const interactionScene = config.scenes.find((scene) => scene.id === interactionSceneId);
  const interaction = interactionScene?.interaction;
  const selectedChoice = interaction?.choices.find((choice) => choice.id === selectedChoiceId);
  const node = config.nodes.find((candidate) => candidate.id === activeScene.nodeId) ?? null;
  const region = config.regions.find((candidate) => candidate.id === node?.regionId) ?? config.regions[0];

  const openInteraction = useCallback((scene: BasinStoryScene): void => {
    if (!scene.interaction) return;
    setInteractionSceneId(scene.id);
    setInteractionPhase('question');
    setSelectedChoiceId(null);
    setRewardCopy('');
    setIsDialogueOpen(true);
  }, []);

  const selectChoice = useCallback((choiceId: string): void => {
    if (!interaction) return;
    const choice = interaction.choices.find((item) => item.id === choiceId);
    if (!choice) return;
    setSelectedChoiceId(choiceId);
    setInteractionPhase('feedback');
    if (!choice.isCorrect) return;
    setRewardCopy('正在记录治理星级…');
    void recordLevelResult(interaction.id, interaction.rewardStars)
      .then((result) => setRewardCopy(result.didImprove ? `获得 ${interaction.rewardStars} 点${config.riverName}治理星级。` : '这段治理星级已经记录过了，本次重温不再重复增加。'))
      .catch(() => setRewardCopy('互动已完成，但本地治理星级暂未能写入。'));
  }, [config.riverName, interaction, recordLevelResult]);

  const dialogue = useMemo<LanMascotDialogue | undefined>(() => {
    if (!interaction || interactionPhase === 'idle') return undefined;
    if (interactionPhase === 'question') {
      return {
        conversationId: `${interaction.id}-question`,
        dialogLabel: `${config.riverName}${interactionScene?.title ?? ''}互动`,
        heading: interactionScene?.title,
        messages: [interaction.question],
        actionLabel: '做出选择',
        onAction: () => undefined,
        choicePresentation: interaction.mode === 'species-recognition' ? 'species' : interaction.mode === 'dispatch' ? 'dispatch' : 'list',
        choices: interaction.choices.map((choice) => ({
          id: choice.id,
          label: choice.label,
          description: choice.description,
          onSelect: () => selectChoice(choice.id),
        })),
        closeOnBackdrop: true,
        closeOnEscape: true,
        showClose: true,
      };
    }

    if (!selectedChoice) return undefined;
    return {
      conversationId: `${interaction.id}-${selectedChoice.id}-feedback`,
      dialogLabel: `${config.riverName}${interactionScene?.title ?? ''}互动反馈`,
      heading: selectedChoice.isCorrect ? '小澜明白了' : '再想一想',
      messages: [`${selectedChoice.feedback}${selectedChoice.isCorrect && rewardCopy ? ` ${rewardCopy}` : ''}`],
      actionLabel: selectedChoice.isCorrect ? '完成互动' : '重新选择',
      onAction: () => {
        if (selectedChoice.isCorrect) {
          setIsDialogueOpen(false);
          return;
        }
        setInteractionPhase('question');
        setSelectedChoiceId(null);
      },
      closeOnBackdrop: true,
      closeOnEscape: true,
      showClose: true,
    };
  }, [config.riverName, interaction, interactionPhase, interactionScene?.title, rewardCopy, selectChoice, selectedChoice]);

  const expression: LanMascotExpressionId = selectedChoice
    ? selectedChoice.isCorrect ? 'happy' : 'turbid'
    : dialogue ? 'thinking' : 'happy';

  const selectScene = (scene: BasinStoryScene): void => {
    setActiveSceneId(scene.id);
    setIsDialogueOpen(false);
  };

  return (
    <section className={`basin-narrative basin-narrative--${config.theme}`}>
      <div className="basin-narrative__background" aria-hidden="true"><img key={activeScene.id} src={activeBackground} alt="" /></div>
      <header className="basin-narrative__header">
        <Link to="/basins" state={{ basinOverviewEntry: 'returning' }}>返回中国流域总览</Link>
        <div><h1>{config.pageTitle}</h1><p>{config.pageSubtitle}</p></div>
      </header>
      <nav className="basin-narrative__nav" aria-label={`${config.riverName}叙事章节`}>
        {config.scenes.map((scene) => (
          <button key={scene.id} type="button" className={scene.id === activeScene.id ? 'is-active' : ''} aria-current={scene.id === activeScene.id ? 'step' : undefined} onClick={() => selectScene(scene)}><span>{scene.label}</span></button>
        ))}
      </nav>
      <main className="basin-narrative__stage">
        <div key={activeScene.id} className="basin-narrative__scene-frame">
          <div className="basin-narrative__heading">
            <p>{activeScene.label}</p><h2>{activeScene.title}</h2><span>{activeScene.summary}</span>
          </div>
          <BasinStoryStage scene={activeScene} layout={config.theme === 'yangtze' || config.theme === 'pearl' ? 'split' : 'stacked'} onStartInteraction={() => openInteraction(activeScene)} />
        </div>
      </main>
      {interaction && !isDialogueOpen && interactionSceneId === activeScene.id && (
        <button className="basin-narrative__continue" type="button" onClick={() => setIsDialogueOpen(true)}>继续互动</button>
      )}
      <RiverSpiritGuide
        isOpen={isDialogueOpen}
        riverName={config.riverName}
        region={region}
        node={node}
        dialogueOverride={dialogue}
        expressionOverride={expression}
        onDialogueClose={() => setIsDialogueOpen(false)}
      />
    </section>
  );
}

export default BasinNarrativePage;
