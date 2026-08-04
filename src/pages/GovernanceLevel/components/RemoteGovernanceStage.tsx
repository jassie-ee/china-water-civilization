import { useEffect, useMemo, useState } from 'react';

import { useAccount } from '@/components/common/accountContext';
import { useGovernanceProgress } from '@/components/common/governanceProgressContext';
import { governanceDataSource } from '@/services/governanceDataSource';
import type { GovernanceQuestionLevelConfig } from '@/types/governanceLevel';
import type { RemoteGovernanceAnswerResult, RemoteGovernanceChallenge } from '@/types/governanceData';

import StarScore from './StarScore';

interface RemoteGovernanceStageProps {
  level: GovernanceQuestionLevelConfig;
  onCurrentStarsChange?: (stars: number) => void;
}

interface AnswerRecord {
  questionId: string;
  awardedStars: 0 | 3;
}

function RemoteGovernanceStage({ level, onCurrentStarsChange }: RemoteGovernanceStageProps) {
  const { isLoading: isAccountLoading, user, errorMessage: accountErrorMessage } = useAccount();
  const { getLevelBestStars, refreshProgress } = useGovernanceProgress();
  const [challenge, setChallenge] = useState<RemoteGovernanceChallenge | null>(null);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<AnswerRecord[]>([]);
  const [feedback, setFeedback] = useState<RemoteGovernanceAnswerResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const initialLevelStars = getLevelBestStars(level.levelId);
  const sessionStars = useMemo(() => answers.reduce((total, answer) => total + answer.awardedStars, 0), [answers]);
  const displayedStars = feedback?.levelStars ?? initialLevelStars + sessionStars;
  const currentQuestion = challenge?.questions[questionIndex];
  const isComplete = challenge !== null && answers.length === challenge.questions.length;

  useEffect(() => {
    if (isAccountLoading || user === null) return undefined;
    let isMounted = true;
    setChallenge(null);
    setQuestionIndex(0);
    setAnswers([]);
    setFeedback(null);
    setErrorMessage(null);

    void governanceDataSource.startRemoteChallenge(level.levelId)
      .then((nextChallenge) => {
        if (isMounted) setChallenge(nextChallenge);
      })
      .catch((error: unknown) => {
        if (isMounted) setErrorMessage(error instanceof Error ? error.message : '正式题库加载失败。');
      });

    return () => {
      isMounted = false;
    };
  }, [isAccountLoading, level.levelId, user]);

  useEffect(() => {
    onCurrentStarsChange?.(displayedStars);
  }, [displayedStars, onCurrentStarsChange]);

  const selectOption = async (optionId: string): Promise<void> => {
    if (challenge === null || currentQuestion === undefined || feedback !== null || isSubmitting) return;
    setIsSubmitting(true);
    setErrorMessage(null);
    try {
      const result = await governanceDataSource.submitRemoteAnswer(challenge.attemptId, currentQuestion.id, optionId);
      setFeedback(result);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : '答案提交失败，请重试。');
    } finally {
      setIsSubmitting(false);
    }
  };

  const continueChallenge = (): void => {
    if (currentQuestion === undefined || feedback === null) return;
    const nextAnswers = [...answers, { questionId: currentQuestion.id, awardedStars: feedback.awardedStars }];
    setAnswers(nextAnswers);
    setFeedback(null);
    if (nextAnswers.length < (challenge?.questions.length ?? 0)) {
      setQuestionIndex((index) => index + 1);
    } else {
      void refreshProgress();
    }
  };

  if (isAccountLoading) {
    return <p className="governance-stage__empty">正在建立学习账户…</p>;
  }

  if (user === null) {
    return <p className="governance-stage__empty" role="alert">{accountErrorMessage ?? '未能建立游客会话。请检查 Supabase 是否已启用 Anonymous Sign-Ins，或先通过右上角登录账户。'}</p>;
  }

  if (challenge === null) {
    return <p className="governance-stage__empty">{errorMessage ?? '正在从云端准备本次随机题目…'}</p>;
  }

  if (isComplete) {
    return (
      <section className="governance-question-result" aria-live="polite">
        <p className="governance-question-result__eyebrow">正式题库结果</p>
        <h2>完成 {answers.length} 题 · 本次新增 {sessionStars} 星</h2>
        <p className="governance-question-result__history">本关累计积分 ★：{displayedStars} / 120</p>
        <div className="governance-question-result__stars" aria-label="本次答题星级">
          {answers.map((answer, index) => (
            <div key={answer.questionId}>
              <span>第 {index + 1} 题</span>
              <StarScore stars={answer.awardedStars} label={`第 ${index + 1} 题得分`} />
            </div>
          ))}
        </div>
        <section className="governance-question-result__evaluation">
          <h3>学习提示</h3>
          <p>本关题目会在后续挑战中随机轮换；已答对题目可复习，但不会重复获得积分。</p>
        </section>
      </section>
    );
  }

  if (currentQuestion === undefined) return <p className="governance-stage__empty">未能读取本次题目。</p>;

  return (
    <section className="governance-stage" aria-label={`${level.title} 正式问答`}>
      <header className="governance-stage__progress">
        <span>第 {questionIndex + 1} / {challenge.questions.length} 题 · 正式题库</span>
        <span>本关累计 {displayedStars} / 120 星</span>
      </header>
      {feedback === null ? (
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
      ) : (
        <section className="governance-feedback-card" aria-live="polite">
          <p className="governance-feedback-card__eyebrow">本题反馈</p>
          <h2>{feedback.isCorrect ? '回答正确' : '本题未答对'} · 获得 {feedback.awardedStars} 星</h2>
          <div className="governance-feedback-card__score-row"><StarScore stars={feedback.awardedStars} /><span>{feedback.awardedStars} / 3 星</span></div>
          <section className="governance-feedback-card__explanation"><h3>知识解释</h3><p>{feedback.explanation}</p></section>
          <div className="governance-feedback-card__actions">
            <button className="governance-feedback-card__continue" type="button" onClick={continueChallenge}>
              {questionIndex === challenge.questions.length - 1 ? '查看本关结果' : '进入下一题'}
            </button>
          </div>
        </section>
      )}
      {errorMessage !== null && <p className="governance-stage__empty" role="alert">{errorMessage}</p>}
    </section>
  );
}

export default RemoteGovernanceStage;
