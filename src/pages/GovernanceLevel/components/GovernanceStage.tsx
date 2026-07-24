import { useMemo, useState } from 'react';

import type {
  GovernanceQuestionAnswerRecord,
  GovernanceQuestionLevelConfig,
  GovernanceQuestionOption,
} from '@/types/governanceLevel';
import type { GovernanceProgressUpdate } from '@/types/governanceProgress';
import { useGovernanceProgress } from '@/components/common/governanceProgressContext';

import FeedbackCard from './FeedbackCard';
import QuestionCard from './QuestionCard';
import ResultPanel from './ResultPanel';

import './GovernanceQuestionSystem.css';

type GovernanceStagePhase = 'question' | 'feedback' | 'result';

interface GovernanceStageProps {
  level: GovernanceQuestionLevelConfig;
}

function GovernanceStage({ level }: GovernanceStageProps) {
  const { recordLevelResult } = useGovernanceProgress();
  const [phase, setPhase] = useState<GovernanceStagePhase>('question');
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<GovernanceQuestionAnswerRecord[]>([]);
  const [lockedAnswer, setLockedAnswer] = useState<GovernanceQuestionAnswerRecord | null>(null);
  const [lockedOption, setLockedOption] = useState<GovernanceQuestionOption | null>(null);
  const [progressUpdate, setProgressUpdate] = useState<GovernanceProgressUpdate | null>(null);
  const currentQuestion = level.questions[questionIndex];
  const completedStars = useMemo(
    () => answers.reduce((total, answer) => total + answer.earnedStars, 0),
    [answers],
  );
  const handleOptionSelect = (option: GovernanceQuestionOption): void => {
    if (currentQuestion === undefined || phase !== 'question') return;

    setLockedOption(option);
    setLockedAnswer({
      questionNumber: questionIndex + 1,
      questionId: currentQuestion.id,
      selectedOptionId: option.id,
      earnedStars: option.stars,
      metricChanges: option.metricChanges,
    });
    setPhase('feedback');
  };

  const handleContinue = (): void => {
    if (lockedAnswer === null) return;

    const nextAnswers = [...answers, lockedAnswer];
    const isLastQuestion = questionIndex === level.questions.length - 1;

    setAnswers(nextAnswers);
    setLockedAnswer(null);
    setLockedOption(null);

    if (isLastQuestion) {
      setProgressUpdate(recordLevelResult(level.levelId, nextAnswers.reduce((total, answer) => total + answer.earnedStars, 0)));
      setPhase('result');
      return;
    }

    setQuestionIndex((currentIndex) => currentIndex + 1);
    setPhase('question');
  };

  const handleReconsider = (): void => {
    setLockedAnswer(null);
    setLockedOption(null);
    setPhase('question');
  };

  if (level.questions.length === 0 || currentQuestion === undefined) {
    return <p className="governance-stage__empty">当前关卡尚未配置治理问答。</p>;
  }

  return (
    <section className="governance-stage" aria-label={`${level.title} 治理问答`}>
      <header className="governance-stage__progress">
        <span>第 {Math.min(questionIndex + 1, level.questions.length)} / {level.questions.length} 题</span>
        <span>本关累计 {completedStars + (lockedAnswer?.earnedStars ?? 0)} 星</span>
      </header>
      <div className="governance-stage__workspace">
        <div className="governance-stage__main">
          {phase === 'question' && (
            <QuestionCard
              question={currentQuestion}
              questionNumber={questionIndex + 1}
              totalQuestions={level.questions.length}
              onOptionSelect={handleOptionSelect}
            />
          )}
          {phase === 'feedback' && lockedAnswer !== null && lockedOption !== null && (
            <FeedbackCard
              answer={lockedAnswer}
              option={lockedOption}
              totalStars={completedStars + lockedAnswer.earnedStars}
              continueLabel={questionIndex === level.questions.length - 1 ? '查看治理结果' : '进入下一题'}
              onContinue={handleContinue}
              onReconsider={handleReconsider}
            />
          )}
          {phase === 'result' && <ResultPanel level={level} answers={answers} progressUpdate={progressUpdate} />}
        </div>

      </div>
    </section>
  );
}

export default GovernanceStage;
