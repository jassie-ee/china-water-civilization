import ChapterIntroPage from '@/components/chapter-intro/ChapterIntroPage';
import chapterOneLaunchBackground from '@/assets/images/chapter-one-launch-bg.jpg';

import {
  chapterOneIntroPosterSource,
  chapterOneIntroStillSource,
  chapterOneIntroVideoSource,
} from './chapterOneMedia';
function ChapterOneIntro() {
  return (
    <ChapterIntroPage
      chapterNumber={1}
      theme="顺势而为"
      title="水有去处，人有家园"
      backgroundImage={chapterOneLaunchBackground}
      videoSource={chapterOneIntroVideoSource}
      posterSource={chapterOneIntroPosterSource}
      stillSource={chapterOneIntroStillSource}
      mediaFilename="chapter-one-intro.mp4"
      entryLabel="找寻水脉记忆"
      entryRoute="/chapters/chapter-1"
      hiddenMascotPageId="chapter-one-intro-hidden"
      routePath="/chapters/chapter-1/intro"
    />
  );
}

export default ChapterOneIntro;
