import { useState } from 'react';

import type {
  RemoteGovernanceChallengeReview,
  RemoteGovernanceQuestion,
} from '@/types/governanceData';

import QuestionReviewPanel from './QuestionReviewPanel';
import StarScore from './StarScore';

interface FormalChallengeAnswer {
  questionId: string;
  selectedOptionId: string;
  awardedStars: 0 | 3;
}

interface FormalChallengeResultProps {
  mode: 'demo' | 'official';
  questions: RemoteGovernanceQuestion[];
  answers: FormalChallengeAnswer[];
  reviews: RemoteGovernanceChallengeReview['questions'] | null;
  levelStars?: number;
}

/** 正式题库与待导入题库共用的结果、得分卡与单题复盘结构。 */
function FormalChallengeResult({ mode, questions, answers, reviews, levelStars }: FormalChallengeResultProps) {
  const [reviewQuestionIndex, setReviewQuestionIndex] = useState<number | null>(null);
  const sessionStars = answers.reduce((total, answer) => total + answer.awardedStars, 0);

  if (reviewQuestionIndex !== null) {
    const question = questions[reviewQuestionIndex];
    const review = reviews?.find((item) => item.questionId === question?.id);
    const answer = answers.find((item) => item.questionId === question?.id);

    return (
      <section className="governance-question-review" aria-label="逐题复盘">
        {question === undefined || review === undefined || answer === undefined ? (
          <p className="governance-question-review__loading">正在准备正确答案与解析…</p>
        ) : (
          <QuestionReviewPanel
            question={question}
            review={review}
            questionNumber={reviewQuestionIndex + 1}
            totalQuestions={questions.length}
            awardedStars={answer.awardedStars}
            onPrevious={reviewQuestionIndex > 0 ? () => setReviewQuestionIndex((index) => (index ?? 1) - 1) : null}
            onNext={reviewQuestionIndex < questions.length - 1 ? () => setReviewQuestionIndex((index) => (index ?? 0) + 1) : null}
            onBackToResult={() => setReviewQuestionIndex(null)}
          />
        )}
      </section>
    );
  }

  const isDemo = mode === 'demo';
  return (
    <section className="governance-question-result" aria-live="polite">
      <p className="governance-question-result__eyebrow">{isDemo ? '演示练习结果' : '正式题库结果'}</p>
      <h2>完成 {answers.length} 题 · 本次获得 {sessionStars} 星</h2>
      <p className="governance-question-result__history">
        {isDemo ? '演示练习成绩不计入全站治理星级' : `本关累计治理星级 ★：${levelStars ?? 0} / 120`}
      </p>
      <div className="governance-question-result__stars" aria-label="本次答题星级">
        {answers.map((answer, index) => (
          <button key={answer.questionId} type="button" className="governance-question-result__score-button" onClick={() => setReviewQuestionIndex(index)}>
            <span>第 {index + 1} 题 · 查看题目</span>
            <StarScore stars={answer.awardedStars} label={`第 ${index + 1} 题得分`} />
          </button>
        ))}
      </div>
      <button className="governance-question-result__review-button" type="button" onClick={() => setReviewQuestionIndex(0)}>
        查看逐题复盘
      </button>
      <section className="governance-question-result__evaluation">
        <h3>学习提示</h3>
        <p>{isDemo
          ? '本节点正在使用临时题库结构；正式 40 题导入后将自动切换为随机抽题与正式治理星级。'
          : '本关题目会在后续挑战中随机轮换；已答对题目可复习，但不会重复获得治理星级。'}
        </p>
      </section>
    </section>
  );
}

export type { FormalChallengeAnswer };
export default FormalChallengeResult;
