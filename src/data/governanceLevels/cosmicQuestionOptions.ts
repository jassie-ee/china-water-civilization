import type { GovernanceQuestionOption } from '@/types/governanceLevel';

/**
 * 宇宙共生开放题选项生成器。
 *
 * PDF 第四章·天地人和里的两题均为"开放思辨题"，三个选项均可，
 * 不设唯一正确答案。本生成器返回 3 个等价的 3 星选项，仅在反馈语
 * 上略有差异，避免在 UI 上完全相同的按钮重复出现。
 *
 * 三档指标均保持中性（不变更），让所有选项对指标的影响一致，
 * 由前端根据用户选择展示对应反馈。
 */
function createCosmicOpenOptions(): GovernanceQuestionOption[] {
  const neutralMetric: GovernanceQuestionOption['metricChanges'] = {
    floodSafety: 0,
    sedimentControl: 0,
    ecologicalStability: 0,
    engineeringBenefit: 0,
  };

  return [
    {
      id: 'cosmic-yes',
      text: '成立：和水好好相处是所有生命的共通答案。',
      stars: 3,
      metricChanges: neutralMetric,
      feedback: '无论地球还是外星，核心从来都不是"征服水"，而是懂它、顺它、和它共生。',
      explanation: '宇宙共生开放题：三种回答都可被接受，重点在于表达你对"水与人关系"的开放性思考。',
    },
    {
      id: 'cosmic-maybe',
      text: '不一定：不同星球的水环境会有全新规则。',
      stars: 3,
      metricChanges: neutralMetric,
      feedback: '也有道理——宇宙那么大，说不定真有我们想象不到的水环境，但敬畏水、尊重规律的心，应该到哪儿都不会错。',
      explanation: '宇宙共生开放题：三种回答都可被接受，重点在于表达你对"水与人关系"的开放性思考。',
    },
    {
      id: 'cosmic-explore',
      text: '不好说：得真走到那儿才能知道。',
      stars: 3,
      metricChanges: neutralMetric,
      feedback: '说得对！没走到那儿谁也说不准，但至少带着地球上学到的智慧出发，就不会迷路。',
      explanation: '宇宙共生开放题：三种回答都可被接受，重点在于表达你对"水与人关系"的开放性思考。',
    },
  ];
}

export { createCosmicOpenOptions };