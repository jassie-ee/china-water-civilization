import { useEffect, useState } from 'react';

import spiritBase from '@/assets/images/characters/spirit_base_ink_transparent.png';
import happyAnimation from '@/assets/images/lan/animated/happy-pingpong.webp';
import holdWaterAnimation from '@/assets/images/lan/animated/hold-water-pingpong.webp';
import pointWaterAnimation from '@/assets/images/lan/animated/point-water-pingpong.webp';
import sleeveAnimation from '@/assets/images/lan/animated/sleeve-pingpong.webp';
import purifyAnimation from '@/assets/images/lan/animated/turbid-to-clear-pingpong.webp';

import './chapter-spirit.css';

export type ChapterSpiritChapter = 'voyage' | 'horizon';
export type ChapterSpiritMood = 'resting' | 'listening' | 'recorded' | 'resolved';
export type ChapterSpiritAction = 'happy' | 'sleeve' | 'point-water' | 'hold-water' | 'purify';

const spiritAnimations: Record<ChapterSpiritAction, string> = {
  happy: happyAnimation,
  sleeve: sleeveAnimation,
  'point-water': pointWaterAnimation,
  'hold-water': holdWaterAnimation,
  purify: purifyAnimation,
};

const actionLabels: Record<ChapterSpiritAction, string> = {
  happy: '保持清澈的水滴姿态',
  sleeve: '用水袖引导水脉流动',
  'point-water': '指向正在发生的水脉变化',
  'hold-water': '捧住这段正在记录的水脉',
  purify: '正在由浑浊回到清澈',
};

// The first half of the ping-pong WebP is the intended turbid → clear pass.
// Switch to the stable happy loop before the reverse half can make the spirit turbid again.
const PURIFY_FORWARD_DURATION_MS = 8000;

interface ChapterSpiritProps {
  animationSrc?: string;
  chapter: ChapterSpiritChapter;
  mood: ChapterSpiritMood;
  action?: ChapterSpiritAction;
}

const moodLabels: Record<ChapterSpiritMood, string> = {
  resting: '在水脉旁安静观察',
  listening: '正在听你说话',
  recorded: '已经记下你的回应',
  resolved: '为这段水脉感到欣慰',
};

function ChapterSpirit({ animationSrc, chapter, mood, action = 'happy' }: ChapterSpiritProps) {
  const [displayAction, setDisplayAction] = useState<ChapterSpiritAction>(action);
  const [animationKey, setAnimationKey] = useState(0);

  useEffect(() => {
    setDisplayAction(action);
    setAnimationKey((current) => current + 1);

    if (action !== 'purify') return undefined;

    const timeoutId = window.setTimeout(() => {
      setDisplayAction('happy');
      setAnimationKey((current) => current + 1);
    }, PURIFY_FORWARD_DURATION_MS);

    return () => window.clearTimeout(timeoutId);
  }, [action, animationSrc]);

  const spiritAnimation = animationSrc ?? spiritAnimations[displayAction];

  return (
    <div
      className={`chapter-spirit chapter-spirit--${chapter} chapter-spirit--${mood} chapter-spirit--action-${displayAction}${animationSrc ? ' chapter-spirit--custom-animation' : ''}`}
      role="img"
      aria-label={`澜澜，${moodLabels[mood]}，${actionLabels[displayAction]}`}
    >
      <span className="chapter-spirit__waterlight" aria-hidden="true" />
      <span className="chapter-spirit__ripple chapter-spirit__ripple--one" aria-hidden="true" />
      <span className="chapter-spirit__ripple chapter-spirit__ripple--two" aria-hidden="true" />
      <picture className="chapter-spirit__picture">
        <source media="(prefers-reduced-motion: reduce)" srcSet={spiritBase} />
        <img key={`${displayAction}-${animationKey}-${animationSrc ?? 'default'}`} className={`chapter-spirit__image chapter-spirit__image--animated${animationSrc ? ' chapter-spirit__image--custom' : ''}`} src={spiritAnimation} alt="" />
      </picture>
    </div>
  );
}

export default ChapterSpirit;
