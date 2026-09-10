import BasinNarrativePage from '@/components/basin-story/BasinNarrativePage';
import { pearlNarrative } from '@/data/basinNarratives';

function PearlRiver() {
  return <BasinNarrativePage config={pearlNarrative} />;
}

export default PearlRiver;
