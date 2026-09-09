import happy from '@/assets/images/lan/mascots/happy.png';
import thinking from '@/assets/images/lan/mascots/thinking.png';
import turbid from '@/assets/images/lan/mascots/turbid.png';

export const lanMascotExpressions = {
  turbid: { src: turbid, motion: 'turbid' },
  thinking: { src: thinking, motion: 'thinking' },
  happy: { src: happy, motion: 'happy' },
} as const;

export type LanMascotExpressionId = keyof typeof lanMascotExpressions;
