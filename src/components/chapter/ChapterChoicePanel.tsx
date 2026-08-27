import './chapter-choice-panel.css';

export interface ChapterChoice {
  id: string;
  label: string;
  text: string;
  stars: 1 | 2 | 3;
  feedback: string;
}

export type ChapterChoiceSelectionMode = 'single' | 'multiple';

interface ChapterChoicePanelProps {
  idPrefix: string;
  sectionLabel: string;
  sectionTitle: string;
  sectionSubtitle: string;
  story: string;
  question: string;
  choices: readonly ChapterChoice[];
  selectedChoiceId: string | null;
  completedCount: number;
  totalCount: number;
  score: number;
  onChoice: (choice: ChapterChoice) => void;
  onContinue: () => void;
  continueLabel: string;
  selectionMode?: ChapterChoiceSelectionMode;
  selectedChoiceIds?: readonly string[];
  isSubmitted?: boolean;
  onToggleChoice?: (choice: ChapterChoice) => void;
  onSubmit?: () => void;
  submitLabel?: string;
  feedbackText?: string;
  feedbackStars?: number;
  feedbackHeading?: string;
}

function ChapterChoicePanel({
  idPrefix,
  sectionLabel,
  sectionTitle,
  sectionSubtitle,
  story,
  question,
  choices,
  selectedChoiceId,
  completedCount,
  totalCount,
  score,
  onChoice,
  onContinue,
  continueLabel,
  selectionMode,
  selectedChoiceIds,
  isSubmitted = false,
  onToggleChoice,
  onSubmit,
  submitLabel = '提交判断',
  feedbackText,
  feedbackStars,
  feedbackHeading = '水脉回声',
}: ChapterChoicePanelProps) {
  const isMultiple = selectionMode === 'multiple';
  const currentSelectedChoiceIds = selectedChoiceIds ?? [];
  const selectedChoice = choices.find((choice) => choice.id === selectedChoiceId) ?? null;
  const hasResponse = isMultiple ? isSubmitted : selectedChoice !== null;
  const displayedFeedback = feedbackText ?? selectedChoice?.feedback ?? '';
  const displayedStars = feedbackStars ?? selectedChoice?.stars ?? 0;

  return (
    <section className="chapter-choice-panel" aria-labelledby={`${idPrefix}-title`}>
      <header className="chapter-choice-panel__header">
        <p className="chapter-choice-panel__eyebrow">{sectionLabel}</p>
        <p className="chapter-choice-panel__subtitle">{sectionSubtitle}</p>
        <h2 id={`${idPrefix}-title`}>{sectionTitle}</h2>
        <p className="chapter-choice-panel__story">{story}</p>
      </header>

      <div className="chapter-choice-panel__question">
        <span>
          澜澜的记录 · {completedCount} / {totalCount}
          {selectionMode !== undefined ? ` · ${isMultiple ? '多选' : '单选'}` : ''}
        </span>
        <h3>{question}</h3>
      </div>

      <div className="chapter-choice-panel__choices" role="group" aria-label="选择你的回应">
        {choices.map((choice) => {
          const isSelected = isMultiple
            ? currentSelectedChoiceIds.includes(choice.id)
            : choice.id === selectedChoiceId;

          return (
            <button
              className={`chapter-choice-panel__choice${isSelected ? ' is-selected' : ''}`}
              key={choice.id}
              type="button"
              aria-pressed={isSelected}
              disabled={isMultiple ? isSubmitted : selectedChoiceId !== null}
              onClick={() => {
                if (isMultiple) {
                  onToggleChoice?.(choice);
                } else {
                  onChoice(choice);
                }
              }}
            >
              <span className="chapter-choice-panel__choice-label">{choice.label}</span>
              <span className="chapter-choice-panel__choice-text">{choice.text}</span>
              <span className="chapter-choice-panel__choice-action">
                {isMultiple ? (isSelected ? (isSubmitted ? '已选' : '已勾选') : '选择') : (isSelected ? '已记录' : '回应')}
              </span>
            </button>
          );
        })}
      </div>

      {hasResponse ? (
        <div className="chapter-choice-panel__feedback" role="status" aria-live="polite">
          <div className="chapter-choice-panel__feedback-heading">
            <span>{feedbackHeading}</span>
            <strong>+{displayedStars} 记忆星</strong>
          </div>
          <p>{displayedFeedback}</p>
          <button className="chapter-choice-panel__continue" type="button" onClick={onContinue}>
            {continueLabel}<span aria-hidden="true">→</span>
          </button>
        </div>
      ) : isMultiple ? (
        <div className="chapter-choice-panel__submit-row">
          <p className="chapter-choice-panel__hint">已选 {currentSelectedChoiceIds.length} 项。把你认为需要同时考虑的因素一起勾选。</p>
          <button
            className="chapter-choice-panel__submit"
            type="button"
            disabled={currentSelectedChoiceIds.length === 0}
            onClick={onSubmit}
          >
            {submitLabel}<span aria-hidden="true">→</span>
          </button>
        </div>
      ) : (
        <p className="chapter-choice-panel__hint">选择一个回应，澜澜会把你的判断写进这段水脉。</p>
      )}

      <footer className="chapter-choice-panel__footer">
        <span>本章记忆星</span>
        <strong>{score}</strong>
      </footer>
    </section>
  );
}

export default ChapterChoicePanel;
