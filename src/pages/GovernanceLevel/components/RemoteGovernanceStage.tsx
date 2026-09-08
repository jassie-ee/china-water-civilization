import { useEffect, useRef, useState } from 'react';

import { useAccount } from '@/components/common/accountContext';
import { useGovernanceProgress } from '@/components/common/governanceProgressContext';
import { governanceDataSource } from '@/services/governanceDataSource';
import type { GovernanceQuestionLevelConfig } from '@/types/governanceLevel';
import type { RemoteGovernanceChallenge, RemoteGovernanceChallengeReview } from '@/types/governanceData';

import FormalChallengeResult, { type FormalChallengeAnswer } from './FormalChallengeResult';

interface RemoteGovernanceStageProps {
  level: GovernanceQuestionLevelConfig;
  onCurrentStarsChange?: (stars: number) => void;
}

/** 正式题库采用连续答题模式：判题入库后立即推进到下一题。 */
function RemoteGovernanceStage({ level, onCurrentStarsChange }: RemoteGovernanceStageProps) {
  const { isLoading: isAccountLoading, user, errorMessage: accountErrorMessage } = useAccount();
  const { refreshProgress } = useGovernanceProgress();
  const [challenge, setChallenge] = useState<RemoteGovernanceChallenge | null>(null);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<FormalChallengeAnswer[]>([]);
  const [review, setReview] = useState<RemoteGovernanceChallengeReview | null>(null);
  const [settledLevelStars, setSettledLevelStars] = useState(0);
  const [isResultVisible, setIsResultVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  // React 状态更新并非同步；用 ref 防止末题在点击重放期间被重复提交。
  const submissionLockRef = useRef(false);
  const currentQuestion = challenge?.questions[questionIndex];
  const isComplete = challenge !== null && answers.length === challenge.questions.length;

  useEffect(() => {
    if (isAccountLoading || user === null) return undefined;
    let isMounted = true;
    setChallenge(null);
    setQuestionIndex(0);
    setAnswers([]);
    setReview(null);
    submissionLockRef.current = false;
    setSettledLevelStars(0);
    setIsResultVisible(false);
    setErrorMessage(null);

    void governanceDataSource.startRemoteChallenge(level.levelId)
      .then((nextChallenge) => {
        if (isMounted) {
          setChallenge(nextChallenge);
          setSettledLevelStars(nextChallenge.levelStars);
        }
      })
      .catch((error: unknown) => {
        if (isMounted) setErrorMessage(error instanceof Error ? error.message : '正式题库加载失败。');
      });

    return () => {
      isMounted = false;
    };
  }, [isAccountLoading, level.levelId, user]);

  useEffect(() => {
    onCurrentStarsChange?.(settledLevelStars);
  }, [onCurrentStarsChange, settledLevelStars]);

  const loadReview = async (attemptId: string): Promise<RemoteGovernanceChallengeReview | null> => {
    try {
      const nextReview = await governanceDataSource.loadRemoteChallengeReview(attemptId);
      setReview(nextReview);
      return nextReview;
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : '答题完成，但暂时无法读取逐题复盘。');
      return null;
    }
  };

  const selectOption = async (optionId: string): Promise<void> => {
    if (challenge === null || currentQuestion === undefined || isSubmitting || submissionLockRef.current) return;
    submissionLockRef.current = true;
    setIsSubmitting(true);
    setErrorMessage(null);
    try {
      const result = await governanceDataSource.submitRemoteAnswer(challenge.attemptId, currentQuestion.id, optionId);
      let nextAnswers = [...answers, {
        questionId: currentQuestion.id,
        selectedOptionId: optionId,
        awardedStars: result.awardedStars,
      }];

      if (result.isComplete) {
        const nextReview = await loadReview(challenge.attemptId);
        if (nextReview !== null) {
          nextAnswers = nextAnswers.map((answer) => ({
            ...answer,
            awardedStars: nextReview.questions.find((item) => item.questionId === answer.questionId)?.awardedStars ?? 0,
          }));
        }
        setAnswers(nextAnswers);
        setSettledLevelStars(result.levelStars ?? settledLevelStars);
        await refreshProgress();
      } else {
        setAnswers(nextAnswers);
        setQuestionIndex((index) => index + 1);
      }
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : '答案提交失败，请重试。');
    } finally {
      submissionLockRef.current = false;
      setIsSubmitting(false);
    }
  };

  if (isAccountLoading) return <p className="governance-stage__empty">正在建立学习账户…</p>;
  if (user === null) return <p className="governance-stage__empty" role="alert">{accountErrorMessage ?? '未能建立游客会话。请检查 Supabase 是否已启用 Anonymous Sign-Ins，或先通过右上角登录账户。'}</p>;
  if (challenge === null) return <p className="governance-stage__empty">{errorMessage ?? '正在从云端准备本次随机题目…'}</p>;

  if (isComplete && !isResultVisible) {
    return (
      <section className="governance-result-ready" aria-live="polite">
        <p>八题作答已完成</p>
        <h2>本次学习记录已归档</h2>
        <button type="button" onClick={() => setIsResultVisible(true)}>查看治理结果</button>
      </section>
    );
  }

  if (isComplete) return <FormalChallengeResult mode="official" questions={challenge.questions} answers={answers} reviews={review?.questions ?? null} levelStars={settledLevelStars} />;

  if (currentQuestion === undefined) return <p className="governance-stage__empty">未能读取本次题目。</p>;

  return (
    <section className="governance-stage" aria-label={`${level.title} 正式问答`}>
      <header className="governance-stage__progress">
        <span>第 {questionIndex + 1} / {challenge.questions.length} 题 · 正式题库</span>
        <span>本关累计 {settledLevelStars} / 120 星</span>
      </header>
      <section className="governance-question-card" aria-labelledby={`governance-question-${currentQuestion.id}`}>
        <p className="governance-question-card__eyebrow">知识问答 · 第 {questionIndex + 1} / {challenge.questions.length} 题</p>
        {currentQuestion.scenario && <p className="governance-question-card__scenario">{currentQuestion.scenario}</p>}
        <h2 id={`governance-question-${currentQuestion.id}`}>{currentQuestion.questionText}</h2>
        <div className="governance-question-card__options" role="group" aria-label="选择答案">
          {currentQuestion.options.map((option) => (
            <button key={option.id} type="button" className="governance-question-option" disabled={isSubmitting} onClick={() => void selectOption(option.id)}>
              <span className="governance-question-option__text">{String.fromCharCode(64 + option.order)}. {option.text}</span>
              <span className="governance-question-option__action">{isSubmitting ? '提交中…' : '选择答案'}</span>
            </button>
          ))}
        </div>
      </section>
      {errorMessage !== null && <p className="governance-stage__empty" role="alert">{errorMessage}</p>}
    </section>
  );
}

export default RemoteGovernanceStage;
