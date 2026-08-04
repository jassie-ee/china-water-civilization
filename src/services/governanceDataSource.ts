import { governanceQuestionLevelConfigs } from '@/data/governanceLevels/questionLevelConfigs';
import type { GovernanceDataSource } from '@/types/governanceData';
import { clearLevelBestStars, getGovernanceProgress, saveGovernanceProgress, updateLevelBestStars } from '@/utils/governanceProgress';
import { getSupabaseClient, isSupabaseConfigured } from '@/services/supabaseClient';

const remoteQuestionLevelIds = new Set(['dujiangyan', 'danjiangkou']);

function readRemoteChallenge(value: unknown) {
  if (typeof value !== 'object' || value === null) throw new Error('云端题库返回格式异常。');
  const payload = value as { attemptId?: unknown; questions?: unknown };
  if (typeof payload.attemptId !== 'string' || !Array.isArray(payload.questions)) {
    throw new Error('云端题库未返回可用题目。');
  }
  return {
    attemptId: payload.attemptId,
    questions: payload.questions.map((question) => {
      const item = question as { id?: unknown; scenario?: unknown; questionText?: unknown; options?: unknown };
      if (typeof item.id !== 'string' || typeof item.questionText !== 'string' || !Array.isArray(item.options)) {
        throw new Error('云端题目格式异常。');
      }
      return {
        id: item.id,
        scenario: typeof item.scenario === 'string' ? item.scenario : '',
        questionText: item.questionText,
        options: item.options.map((option) => {
          const choice = option as { id?: unknown; text?: unknown; order?: unknown };
          if (typeof choice.id !== 'string' || typeof choice.text !== 'string' || typeof choice.order !== 'number') {
            throw new Error('云端选项格式异常。');
          }
          return { id: choice.id, text: choice.text, order: choice.order };
        }),
      };
    }),
  };
}

async function requireSupabaseClient() {
  const client = await getSupabaseClient();
  if (client === null) throw new Error('尚未配置 Supabase，无法加载正式题库。');
  return client;
}

/**
 * 当前 demo 的数据源：关卡配置来自本地代码，账户进度保存在浏览器本机。
 * 后续接 API 时，仅替换此模块导出的实现。
 */
const localGovernanceDataSource: GovernanceDataSource = {
  getQuestionLevelConfig: (levelId) => (
    governanceQuestionLevelConfigs.find((level) => level.levelId === levelId) ?? null
  ),
  getQuestionLevelConfigs: () => governanceQuestionLevelConfigs,
  loadProgress: async (accountId) => {
    const localProgress = getGovernanceProgress();
    if (!isSupabaseConfigured || accountId === 'local-demo-account') return localProgress;

    const client = await getSupabaseClient();
    if (client === null) return localProgress;
    const { data, error } = await client
      .from('governance_level_progress')
      .select('level_id, earned_stars')
      .eq('user_id', accountId)
      .in('level_id', [...remoteQuestionLevelIds]);
    if (error !== null) throw new Error(error.message);

    const levelBestStars = { ...localProgress.levelBestStars };
    for (const levelId of remoteQuestionLevelIds) delete levelBestStars[levelId];
    for (const item of data ?? []) {
      if (typeof item.level_id === 'string' && typeof item.earned_stars === 'number') {
        levelBestStars[item.level_id] = item.earned_stars;
      }
    }
    return { levelBestStars };
  },
  recordLevelResult: async ({ currentProgress, levelId, completedStars }) => {
    const { progress, update } = updateLevelBestStars(currentProgress, levelId, completedStars);

    if (progress !== currentProgress) {
      saveGovernanceProgress(progress);
    }

    return { progress, update };
  },
  clearProgress: async (_accountId, currentProgress, scope) => {
    const levelIds = scope === 'all'
      ? undefined
      : governanceQuestionLevelConfigs
        .filter((level) => level.basinId === scope)
        .map((level) => level.levelId);
    const progress = clearLevelBestStars(currentProgress, levelIds);

    if (progress !== currentProgress) saveGovernanceProgress(progress);
    return progress;
  },
  isRemoteQuestionLevel: (levelId) => isSupabaseConfigured && remoteQuestionLevelIds.has(levelId),
  startRemoteChallenge: async (levelId) => {
    const client = await requireSupabaseClient();
    const { data, error } = await client.rpc('start_governance_challenge', { p_level_id: levelId });
    if (error !== null) throw new Error(error.message);
    return readRemoteChallenge(data);
  },
  submitRemoteAnswer: async (attemptId, questionId, optionId) => {
    const client = await requireSupabaseClient();
    const { data, error } = await client.rpc('submit_governance_answer', {
      p_attempt_id: attemptId,
      p_question_id: questionId,
      p_option_id: optionId,
    });
    if (error !== null || typeof data !== 'object' || data === null) throw new Error(error?.message ?? '提交答案失败。');
    const result = data as { isCorrect?: unknown; awardedStars?: unknown; levelStars?: unknown; explanation?: unknown };
    if (typeof result.isCorrect !== 'boolean' || (result.awardedStars !== 0 && result.awardedStars !== 3) || typeof result.levelStars !== 'number' || typeof result.explanation !== 'string') {
      throw new Error('云端判题返回格式异常。');
    }
    return { isCorrect: result.isCorrect, awardedStars: result.awardedStars, levelStars: result.levelStars, explanation: result.explanation };
  },
};

const governanceDataSource = localGovernanceDataSource;

export { governanceDataSource };
