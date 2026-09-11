import { useCallback, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

import { useGovernanceProgress } from '@/components/common/governanceProgressContext';
import RiverSpiritGuide from '@/components/lan/RiverSpiritGuide';
import type { ChapterSpiritAction, ChapterSpiritDialogue } from '@/components/chapter-spirit';
import type { BasinNarrativeConfig, BasinStoryScene } from '@/types/basinStory';
import type { BasinStoryChoice } from '@/types/basinStory';
import { getLocalVideoAssetUrl } from '@/assets/videos/mediaSources';

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
  const [completedInteractionIds, setCompletedInteractionIds] = useState<string[]>([]);
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
    if (completedInteractionIds.includes(interaction.id)) {
      setRewardCopy('本次重温不再重复增加。');
      return;
    }
    setCompletedInteractionIds((current) => [...current, interaction.id]);
    setRewardCopy('正在记录“治”积分…');
    void recordLevelResult(interaction.id, interaction.rewardStars)
      .then((result) => setRewardCopy(result.didImprove ? `获得 ${interaction.rewardStars} 点“治”积分。` : '这道题的“治”积分已经记录过了，本次重温不再重复增加。'))
      .catch(() => setRewardCopy('互动已完成，但本地积分暂未能写入。'));
  }, [completedInteractionIds, interaction, recordLevelResult]);

  const resolveMaozhouChoice = useCallback((choice: BasinStoryChoice): void => {
    const maozhouInteraction = config.scenes.find((scene) => scene.id === 'pearl-city')?.interaction;
    if (!maozhouInteraction?.choices.some((item) => item.id === choice.id) || !choice.isCorrect || completedInteractionIds.includes(maozhouInteraction.id)) return;
    setCompletedInteractionIds((current) => [...current, maozhouInteraction.id]);
    void recordLevelResult(maozhouInteraction.id, maozhouInteraction.rewardStars);
  }, [completedInteractionIds, config.scenes, recordLevelResult]);

  const dialogue = useMemo<ChapterSpiritDialogue | undefined>(() => {
    if (!interaction || interactionPhase === 'idle') return undefined;
    if (interactionPhase === 'question') {
      return {
        conversationId: `${interaction.id}-question`,
        dialogLabel: `${config.riverName}${interactionScene?.title ?? ''}互动`,
        heading: interactionScene?.title,
        messages: [interaction.question],
        actionLabel: '做出选择',
        onAction: () => undefined,
        choicePresentation: interaction.id === 'pearl-maozhou-governance' ? 'maozhou' : interaction.mode === 'species-recognition' ? 'species' : interaction.mode === 'dispatch' ? 'dispatch' : 'list',
        choices: interaction.choices.map((choice) => ({
          id: choice.id,
          label: choice.label,
          description: choice.description,
          imageSrc: choice.imageSrc,
          feedback: choice.feedback,
          videoSrc: choice.feedbackVideoFilename ? getLocalVideoAssetUrl(choice.feedbackVideoFilename) : undefined,
          onSelect: () => interaction.id === 'pearl-maozhou-governance' ? resolveMaozhouChoice(choice) : selectChoice(choice.id),
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
  }, [config.riverName, interaction, interactionPhase, interactionScene?.title, resolveMaozhouChoice, rewardCopy, selectChoice, selectedChoice]);

  const action: ChapterSpiritAction = selectedChoice
    ? selectedChoice.isCorrect ? 'purify' : 'point-water'
    : dialogue ? 'point-water' : 'happy';

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
          <BasinStoryStage scene={activeScene} layout={config.theme === 'yangtze' || config.theme === 'pearl' ? 'split' : 'stacked'} onStartInteraction={() => openInteraction(activeScene)} interactionLabel={activeScene.interaction && completedInteractionIds.includes(activeScene.interaction.id) ? '再次互动' : '开始治理决策'} />
        </div>
      </main>
      <RiverSpiritGuide
        isOpen={isDialogueOpen}
        riverName={config.riverName}
        region={region}
        node={node}
        dialogueOverride={dialogue}
        actionOverride={action}
        onDialogueClose={() => setIsDialogueOpen(false)}
      />
    </section>
  );
}

export default BasinNarrativePage;
