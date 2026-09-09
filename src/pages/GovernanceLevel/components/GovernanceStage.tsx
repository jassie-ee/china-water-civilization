import { useEffect, useMemo, useState } from 'react';

import type { GovernanceQuestionLevelConfig, GovernanceQuestionOption } from '@/types/governanceLevel';
import type { RemoteGovernanceChallengeReview, RemoteGovernanceQuestion } from '@/types/governanceData';

import FormalChallengeResult, { type FormalChallengeAnswer } from './FormalChallengeResult';
import QuestionCard from './QuestionCard';

import './GovernanceQuestionSystem.css';

type GovernanceStagePhase = 'question' | 'result-ready' | 'result';

interface GovernanceStageProps {
  level: GovernanceQuestionLevelConfig;
  onCurrentStarsChange?: (stars: number) => void;
}

function toReviewQuestion(question: GovernanceQuestion): RemoteGovernanceQuestion {
  return {
    id: question.id,
    scenario: question.scenario,
    questionText: question.questionText,
    options: question.options.map((option, index) => ({
      id: option.id,
      text: option.text,
      order: index + 1,
    })),
  };
}

interface GovernanceQuestion {
  id: string;
  scenario: string;
  questionText: string;
  options: Array<{ id: string; text: string; stars: 1 | 2 | 3 }>;
}

/** 临时题库采用正式题库的答题与复盘界面，但不会写入正式治理星级。 */
function DemoFormalGovernanceStage({ level, onCurrentStarsChange }: GovernanceStageProps) {
  const [phase, setPhase] = useState<GovernanceStagePhase>('question');
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<FormalChallengeAnswer[]>([]);
  const reviewQuestions = useMemo(() => level.questions.map(toReviewQuestion), [level.questions]);
  const temporaryCorrectOptions = useMemo(
    () => level.questions.map((question) => question.options.filter((option) => option.stars === 3)),
    [level.questions],
  );
  const currentQuestion = level.questions[questionIndex];
  const completedStars = useMemo(() => answers.reduce((total, answer) => total + answer.awardedStars, 0), [answers]);
  const hasInvalidQuestion = temporaryCorrectOptions.some((options) => options.length !== 1);

  useEffect(() => {
    onCurrentStarsChange?.(completedStars);
  }, [completedStars, onCurrentStarsChange]);

  const handleOptionSelect = (option: GovernanceQuestionOption): void => {
    if (currentQuestion === undefined || phase !== 'question') return;
    const correctOption = temporaryCorrectOptions[questionIndex]?.[0];
    const nextAnswer: FormalChallengeAnswer = {
      questionId: currentQuestion.id,
      selectedOptionId: option.id,
      awardedStars: option.id === correctOption?.id ? 3 : 0,
    };
    const nextAnswers = [...answers, nextAnswer];

    setAnswers(nextAnswers);
    if (nextAnswers.length === level.questions.length) {
      setPhase('result-ready');
    } else {
      setQuestionIndex((index) => index + 1);
    }
  };

  if (level.questions.length === 0 || currentQuestion === undefined) {
    return <p className="governance-stage__empty">当前关卡尚未配置治理问答。</p>;
  }
  if (hasInvalidQuestion) {
    return <p className="governance-stage__empty" role="alert">临时题库需要每题恰有一个 3 星方案作为正确答案。</p>;
  }

  const reviews: RemoteGovernanceChallengeReview['questions'] = level.questions.map((question, index) => ({
    questionId: question.id,
    selectedOptionId: answers.find((answer) => answer.questionId === question.id)?.selectedOptionId ?? '',
    correctOptionId: temporaryCorrectOptions[index][0].id,
    awardedStars: answers.find((answer) => answer.questionId === question.id)?.awardedStars ?? 0,
    explanation: temporaryCorrectOptions[index][0].explanation,
  }));

  return (
    <section className="governance-stage" aria-label={`${level.title} 演示练习`}>
      <header className="governance-stage__progress">
        <span>第 {Math.min(questionIndex + 1, level.questions.length)} / {level.questions.length} 题 · 演示练习</span>
        <span>本次得分 {completedStars} 星</span>
      </header>
      {phase === 'question' && (
        <QuestionCard
          question={currentQuestion}
          questionNumber={questionIndex + 1}
          totalQuestions={level.questions.length}
          onOptionSelect={handleOptionSelect}
        />
      )}
      {phase === 'result-ready' && (
        <section className="governance-result-ready" aria-live="polite">
          <p>八题作答已完成</p>
          <h2>本次演示练习已完成</h2>
          <button type="button" onClick={() => setPhase('result')}>查看治理结果</button>
        </section>
      )}
      {phase === 'result' && <FormalChallengeResult mode="demo" questions={reviewQuestions} answers={answers} reviews={reviews} />}
    </section>
  );
}

function GovernanceStage(props: GovernanceStageProps) {
  return <DemoFormalGovernanceStage {...props} />;
}

export default GovernanceStage;
