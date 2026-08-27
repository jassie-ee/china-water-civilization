import spiritBase from '@/assets/images/characters/spirit_base_ink_atlas_v1.png';

import './chapter-spirit.css';

export type ChapterSpiritChapter = 'voyage' | 'horizon';
export type ChapterSpiritMood = 'resting' | 'listening' | 'recorded' | 'resolved';

interface ChapterSpiritProps {
  chapter: ChapterSpiritChapter;
  mood: ChapterSpiritMood;
}

const moodLabels: Record<ChapterSpiritMood, string> = {
  resting: '在水脉旁安静观察',
  listening: '正在听你说话',
  recorded: '已经记下你的回应',
  resolved: '为这段水脉感到欣慰',
};

function ChapterSpirit({ chapter, mood }: ChapterSpiritProps) {
  return (
    <div className={`chapter-spirit chapter-spirit--${chapter} chapter-spirit--${mood}`} role="img" aria-label={`澜澜，${moodLabels[mood]}`}>
      <span className="chapter-spirit__waterlight" aria-hidden="true" />
      <span className="chapter-spirit__ripple chapter-spirit__ripple--one" aria-hidden="true" />
      <span className="chapter-spirit__ripple chapter-spirit__ripple--two" aria-hidden="true" />
      <img className="chapter-spirit__image" src={spiritBase} alt="" />
    </div>
  );
}

export default ChapterSpirit;
