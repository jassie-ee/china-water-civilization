import type { GovernanceQuestionLevelConfig } from '@/types/governanceLevel';

import { longyangxiaQuestionLevel } from './longyangxiaQuestionLevel';
import { sanmenxiaQuestionLevel } from './sanmenxiaQuestionLevel';
import { danjiangkouQuestionLevel } from './danjiangkouQuestionLevel';
import { dujiangyanQuestionLevel } from './dujiangyanQuestionLevel';
import { taihuGovernanceQuestionLevel } from './taihuGovernanceQuestionLevel';
import { threeGorgesQuestionLevel } from './threeGorgesQuestionLevel';
import { xiaolangdiQuestionLevel } from './xiaolangdiQuestionLevel';
import { saudiDesalQuestionLevel } from './saudiDesalQuestionLevel';
import { pakistanDamQuestionLevel } from './pakistanDamQuestionLevel';
import { guineaHydropowerQuestionLevel } from './guineaHydropowerQuestionLevel';
import { equatorialGuineaSewageQuestionLevel } from './equatorialGuineaSewageQuestionLevel';
import { lancangMekongJointAllocation, lancangMekongSharedMonitoring } from './lancangMekongQuestionLevel';
import { cosmicSymbiosisQuestionLevel } from './cosmicQuestionLevel';

const governanceQuestionLevelConfigs: GovernanceQuestionLevelConfig[] = [
  longyangxiaQuestionLevel,
  sanmenxiaQuestionLevel,
  xiaolangdiQuestionLevel,
  dujiangyanQuestionLevel,
  threeGorgesQuestionLevel,
  danjiangkouQuestionLevel,
  taihuGovernanceQuestionLevel,
  saudiDesalQuestionLevel,
  pakistanDamQuestionLevel,
  guineaHydropowerQuestionLevel,
  equatorialGuineaSewageQuestionLevel,
  lancangMekongSharedMonitoring,
  lancangMekongJointAllocation,
  cosmicSymbiosisQuestionLevel,
];

export { governanceQuestionLevelConfigs };
