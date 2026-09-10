import BasinNarrativePage from '@/components/basin-story/BasinNarrativePage';
import { yangtzeNarrative } from '@/data/basinNarratives';

function YangtzeRiver() {
  return <BasinNarrativePage config={yangtzeNarrative} />;
}

export default YangtzeRiver;
