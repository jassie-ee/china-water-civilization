import './IntroControls.css';

interface IntroControlsProps {
  onReplay: () => void;
  onSkip: () => void;
}

function IntroControls({ onReplay, onSkip }: IntroControlsProps) {
  return (
    <div className="intro-controls">
      <button className="intro-controls__button" type="button" onClick={onReplay}>重新播放</button>
      <button className="intro-controls__button" type="button" onClick={onSkip}>跳过序章</button>
    </div>
  );
}

export default IntroControls;
