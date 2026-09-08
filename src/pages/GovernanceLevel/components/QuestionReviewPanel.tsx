import { useState } from 'react';

import type { RemoteGovernanceQuestion, RemoteGovernanceQuestionReview } from '@/types/governanceData';

interface QuestionReviewPanelProps {
  question: RemoteGovernanceQuestion;
  review: RemoteGovernanceQuestionReview;
  questionNumber: number;
  totalQuestions: number;
  awardedStars: 0 | 3;
  onPrevious: (() => void) | null;
  onNext: (() => void) | null;
  onBackToResult: () => void;
}

/**
 * 正式题库的逐题复盘单元。AI 解析入口只保留交互契约，后续接入服务时不必改动结果页结构。
 */
function QuestionReviewPanel({
  question,
  review,
  questionNumber,
  totalQuestions,
  awardedStars,
  onPrevious,
  onNext,
  onBackToResult,
}: QuestionReviewPanelProps) {
  const [isExplanationOpen, setIsExplanationOpen] = useState(false);

  return (
    <article className="question-review-panel" aria-labelledby={`question-review-${question.id}`}>
      <header className="question-review-panel__header">
        <span>第 {questionNumber} / {totalQuestions} 题 · {awardedStars} 星</span>
        <span>{review.selectedOptionId === review.correctOptionId ? '回答正确' : '需要复习'}</span>
      </header>
      {question.scenario && <p className="question-review-panel__scenario">{question.scenario}</p>}
      <h3 id={`question-review-${question.id}`}>{question.questionText}</h3>
      <div className="question-review-panel__options" aria-label={`第 ${questionNumber} 题选项回顾`}>
        {question.options.map((option) => {
          const isSelected = option.id === review.selectedOptionId;
          const isCorrect = option.id === review.correctOptionId;
          const className = [
            'question-review-panel__option',
            isSelected ? 'is-selected' : '',
            isCorrect ? 'is-correct' : '',
          ].filter(Boolean).join(' ');

          return (
            <div key={option.id} className={className}>
              <span>{String.fromCharCode(64 + option.order)}. {option.text}</span>
              <span className="question-review-panel__option-status">
                {isCorrect ? '正确答案' : isSelected ? '你的选择' : ''}
              </span>
            </div>
          );
        })}
      </div>
      <div className="question-review-panel__explanation">
        <button type="button" onClick={() => setIsExplanationOpen((isOpen) => !isOpen)} aria-expanded={isExplanationOpen}>
          查看解析
        </button>
        {isExplanationOpen && (
          <div>
            <p>{review.explanation}</p>
            <p className="question-review-panel__ai-placeholder">AI 深度解析入口已预留，后续接入 API 后可在此继续追问。</p>
          </div>
        )}
      </div>
      <footer className="question-review-panel__actions">
        <button type="button" disabled={onPrevious === null} onClick={onPrevious ?? undefined}>上一题</button>
        <button type="button" onClick={onBackToResult}>返回结果</button>
        <button type="button" disabled={onNext === null} onClick={onNext ?? undefined}>下一题</button>
      </footer>
    </article>
  );
}

export default QuestionReviewPanel;
