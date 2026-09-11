import ChapterIntroPage from '@/components/chapter-intro/ChapterIntroPage';
import basinAtlasBackground from '@/assets/images/china-three-basins-atlas.webp';
import chapterTwoIntroStill from '@/assets/images/chapter-two-intro-still.webp';

import { chapterTwoIntroVideoSource } from './chapterTwoMedia';

function ChapterTwoIntro() {
  return (
    <ChapterIntroPage
      chapterNumber={2}
      theme="因地制宜"
      title="现代江河治理"
      backgroundImage={basinAtlasBackground}
      videoSource={chapterTwoIntroVideoSource}
      stillSource={chapterTwoIntroStill}
      mediaFilename="chapter-two-intro.mp4"
      entryLabel="开启流域总览"
      entryRoute="/basins"
    />
  );
}

export default ChapterTwoIntro;
