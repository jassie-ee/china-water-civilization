import { useEffect, useMemo, useState } from 'react';

import type {
  GovernanceQuestionAnswerRecord,
  GovernanceQuestionLevelConfig,
  GovernanceQuestionOption,
} from '@/types/governanceLevel';
import type { GovernanceProgressUpdate } from '@/types/governanceProgress';
import { useGovernanceProgress } from '@/components/common/governanceProgressContext';

import QuestionCard from './QuestionCard';
import ResultPanel from './ResultPanel';
import RemoteGovernanceStage from './RemoteGovernanceStage';
import { governanceDataSource } from '@/services/governanceDataSource';

import './GovernanceQuestionSystem.css';

type GovernanceStagePhase = 'question' | 'result-ready' | 'result';

interface GovernanceStageProps {
  level: GovernanceQuestionLevelConfig;
  onCurrentStarsChange?: (stars: number) => void;
}

function LocalGovernanceStage({ level, onCurrentStarsChange }: GovernanceStageProps) {
  const { recordLevelResult } = useGovernanceProgress();
  const [phase, setPhase] = useState<GovernanceStagePhase>('question');
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<GovernanceQuestionAnswerRecord[]>([]);
  const [progressUpdate, setProgressUpdate] = useState<GovernanceProgressUpdate | null>(null);
  const currentQuestion = level.questions[questionIndex];
  const completedStars = useMemo(
    () => answers.reduce((total, answer) => total + answer.earnedStars, 0),
    [answers],
  );
  const currentStars = completedStars;

  useEffect(() => {
    onCurrentStarsChange?.(currentStars);
  }, [currentStars, onCurrentStarsChange]);
  const handleOptionSelect = async (option: GovernanceQuestionOption): Promise<void> => {
    if (currentQuestion === undefined || phase !== 'question') return;

    const nextAnswer: GovernanceQuestionAnswerRecord = {
      questionNumber: questionIndex + 1,
      questionId: currentQuestion.id,
      selectedOptionId: option.id,
      earnedStars: option.stars,
      metricChanges: option.metricChanges,
    };
    const nextAnswers = [...answers, nextAnswer];
    const isLastQuestion = questionIndex === level.questions.length - 1;

    setAnswers(nextAnswers);

    if (isLastQuestion) {
      const update = await recordLevelResult(
        level.levelId,
        nextAnswers.reduce((total, answer) => total + answer.earnedStars, 0),
      );
      setProgressUpdate(update);
      setPhase('result-ready');
      return;
    }

    setQuestionIndex((currentIndex) => currentIndex + 1);
  };

  if (level.questions.length === 0 || currentQuestion === undefined) {
    return <p className="governance-stage__empty">当前关卡尚未配置治理问答。</p>;
  }

  return (
    <section className="governance-stage" aria-label={`${level.title} 治理问答`}>
      <header className="governance-stage__progress">
        <span>第 {Math.min(questionIndex + 1, level.questions.length)} / {level.questions.length} 题</span>
        <span>本关累计 {currentStars} 星</span>
      </header>
      <div className="governance-stage__workspace">
        <div className="governance-stage__main">
          {phase === 'question' && (
            <QuestionCard
              question={currentQuestion}
              questionNumber={questionIndex + 1}
              totalQuestions={level.questions.length}
              onOptionSelect={(option) => void handleOptionSelect(option)}
            />
          )}
          {phase === 'result-ready' && (
            <section className="governance-result-ready" aria-live="polite">
              <p>八题作答已完成</p>
              <h2>本次治理决策已归档</h2>
              <button type="button" onClick={() => setPhase('result')}>查看治理结果</button>
            </section>
          )}
          {phase === 'result' && <ResultPanel level={level} answers={answers} progressUpdate={progressUpdate} />}
        </div>

      </div>
    </section>
  );
}

function GovernanceStage(props: GovernanceStageProps) {
  if (governanceDataSource.isRemoteQuestionLevel(props.level.levelId)) {
    return <RemoteGovernanceStage {...props} />;
  }

  return <LocalGovernanceStage {...props} />;
}

export default GovernanceStage;
