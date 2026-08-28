import type { GovernanceQuestion, GovernanceQuestionOption } from '@/types/governanceLevel';

interface QuestionCardProps {
  question: GovernanceQuestion;
  questionNumber: number;
  totalQuestions: number;
  onOptionSelect: (option: GovernanceQuestionOption) => void;
}

function QuestionCard({
  question,
  questionNumber,
  totalQuestions,
  onOptionSelect,
}: QuestionCardProps) {
  return (
    <section className="governance-question-card" aria-labelledby={`governance-question-${question.id}`}>
      <p className="governance-question-card__eyebrow">知识问答 · 第 {questionNumber} / {totalQuestions} 题</p>
      <p className="governance-question-card__scenario">{question.scenario}</p>
      <h2 id={`governance-question-${question.id}`}>{question.questionText}</h2>
      <div className="governance-question-card__options" role="group" aria-label="选择治理方案">
        {question.options.map((option, index) => (
          <button key={option.id} type="button" className="governance-question-option" onClick={() => onOptionSelect(option)}>
            <span className="governance-question-option__text">{String.fromCharCode(65 + index)}. {option.text}</span>
            <span className="governance-question-option__action">选择答案</span>
          </button>
        ))}
      </div>
    </section>
  );
}

export default QuestionCard;
