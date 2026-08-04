import type { GovernanceQuestionLevelConfig } from '@/types/governanceLevel';

import { longyangxiaQuestionLevel } from './longyangxiaQuestionLevel';
import { sanmenxiaQuestionLevel } from './sanmenxiaQuestionLevel';
import { danjiangkouQuestionLevel } from './danjiangkouQuestionLevel';
import { dujiangyanQuestionLevel } from './dujiangyanQuestionLevel';
import { taihuGovernanceQuestionLevel } from './taihuGovernanceQuestionLevel';
import { threeGorgesQuestionLevel } from './threeGorgesQuestionLevel';
import { xiaolangdiQuestionLevel } from './xiaolangdiQuestionLevel';

const governanceQuestionLevelConfigs: GovernanceQuestionLevelConfig[] = [
  longyangxiaQuestionLevel,
  sanmenxiaQuestionLevel,
  xiaolangdiQuestionLevel,
  dujiangyanQuestionLevel,
  threeGorgesQuestionLevel,
  danjiangkouQuestionLevel,
  taihuGovernanceQuestionLevel,
];

export { governanceQuestionLevelConfigs };
