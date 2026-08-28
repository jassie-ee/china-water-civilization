import LanMascot from './LanMascot';
import { useLanMascotContext } from './LanMascotContext';

function LanMascotHost() {
  const { activeMascot, closeDialogue, openDialogue, setPosition } = useLanMascotContext();

  if (activeMascot === null) return null;

  const pageId = activeMascot.config.pageId;
  const handleCloseDialogue = (): void => {
    closeDialogue(pageId);
    activeMascot.config.onDialogueClose?.();
  };

  return (
    <div className="lan-mascot-host" onKeyDown={(event) => {
      if (event.key === 'Escape' && activeMascot.isDialogueOpen) {
        event.preventDefault();
        handleCloseDialogue();
      }
    }}>
      <LanMascot
        record={activeMascot}
        onCloseDialogue={handleCloseDialogue}
        onOpenDialogue={() => openDialogue(pageId)}
        onPositionChange={(position) => setPosition(pageId, position)}
      />
    </div>
  );
}

export default LanMascotHost;
