import type { GovernanceQuestionLevelConfig } from '@/types/governanceLevel';

import { longyangxiaQuestionLevel } from './longyangxiaQuestionLevel';
import { sanmenxiaQuestionLevel } from './sanmenxiaQuestionLevel';
import { xiaolangdiQuestionLevel } from './xiaolangdiQuestionLevel';

const governanceQuestionLevelConfigs: GovernanceQuestionLevelConfig[] = [
  longyangxiaQuestionLevel,
  sanmenxiaQuestionLevel,
  xiaolangdiQuestionLevel,
];

export { governanceQuestionLevelConfigs };
