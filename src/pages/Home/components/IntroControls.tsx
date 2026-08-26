import './IntroControls.css';

interface IntroControlsProps {
  isReplayEnabled: boolean;
  onReplay: () => void;
  onSkip: () => void;
}

function IntroControls({ isReplayEnabled, onReplay, onSkip }: IntroControlsProps) {
  return (
    <div className="intro-controls">
      <button className="intro-controls__button" type="button" disabled={!isReplayEnabled} onClick={onReplay}>重新播放</button>
      <button className="intro-controls__button" type="button" onClick={onSkip}>跳过序章</button>
    </div>
  );
}

export default IntroControls;
