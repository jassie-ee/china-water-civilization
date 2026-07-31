import type { GovernanceQuestionLevelConfig } from '@/types/governanceLevel';

import { longyangxiaQuestionLevel } from './longyangxiaQuestionLevel';
import { sanmenxiaQuestionLevel } from './sanmenxiaQuestionLevel';
import { jiangduQuestionLevel } from './jiangduQuestionLevel';
import { threeGorgesQuestionLevel } from './threeGorgesQuestionLevel';
import { xiaolangdiQuestionLevel } from './xiaolangdiQuestionLevel';
import { xiluoduQuestionLevel } from './xiluoduQuestionLevel';

const governanceQuestionLevelConfigs: GovernanceQuestionLevelConfig[] = [
  longyangxiaQuestionLevel,
  sanmenxiaQuestionLevel,
  xiaolangdiQuestionLevel,
  xiluoduQuestionLevel,
  threeGorgesQuestionLevel,
  jiangduQuestionLevel,
];

export { governanceQuestionLevelConfigs };
