import type { GovernanceQuestionLevelConfig } from '@/types/governanceLevel';

import { longyangxiaQuestionLevel } from './longyangxiaQuestionLevel';
import { loessPlateauQuestionLevel } from './loessPlateauQuestionLevel';
import { sanmenxiaQuestionLevel } from './sanmenxiaQuestionLevel';
import { danjiangkouQuestionLevel } from './danjiangkouQuestionLevel';
import { dujiangyanQuestionLevel } from './dujiangyanQuestionLevel';
import { taihuGovernanceQuestionLevel } from './taihuGovernanceQuestionLevel';
import { threeGorgesQuestionLevel } from './threeGorgesQuestionLevel';
import { xiaolangdiQuestionLevel } from './xiaolangdiQuestionLevel';
import { basinStoryQuestionLevels } from './basinStoryQuestionLevels';

const governanceQuestionLevelConfigs: GovernanceQuestionLevelConfig[] = [
  longyangxiaQuestionLevel,
  loessPlateauQuestionLevel,
  sanmenxiaQuestionLevel,
  xiaolangdiQuestionLevel,
  dujiangyanQuestionLevel,
  threeGorgesQuestionLevel,
  danjiangkouQuestionLevel,
  taihuGovernanceQuestionLevel,
  ...basinStoryQuestionLevels,
];

export { governanceQuestionLevelConfigs };
