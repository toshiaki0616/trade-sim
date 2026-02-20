import type { Step, AnswerResult } from '../types'
import { DecisionPanel } from './DecisionPanel'
import { DocumentChecker } from './DocumentChecker'

interface Props {
  step: Step
  answerResult?: AnswerResult
  onAnswerDecision: (stepId: string, choiceId: string) => void
  onAnswerDocumentCheck: (stepId: string, foundErrorIds: string[]) => void
  onNext: () => void
}

const typeLabel: Record<string, string> = {
  info: 'ℹ 情報',
  decision: '❓ 判断',
  'document-check': '📄 書類確認',
}

export const StepCard = ({
  step,
  answerResult,
  onAnswerDecision,
  onAnswerDocumentCheck,
  onNext,
}: Props) => {
  const answered = !!answerResult

  return (
    <div className="bg-white rounded-2xl shadow-md p-6">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xs font-semibold px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
          Step {step.stepNumber}
        </span>
        <span className="text-xs font-semibold px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
          {typeLabel[step.type]}
        </span>
      </div>

      <h2 className="text-lg font-bold text-gray-800 mb-2">{step.title}</h2>
      <p className="text-gray-600 text-sm mb-5 leading-relaxed">{step.description}</p>

      {step.type === 'decision' && step.choices && (
        <DecisionPanel
          choices={step.choices}
          answered={answered}
          selectedChoiceId={answerResult?.selectedChoiceId}
          onAnswer={(choiceId) => onAnswerDecision(step.id, choiceId)}
          explanation={step.explanation}
          onNext={onNext}
        />
      )}

      {step.type === 'document-check' && step.documents && (
        <DocumentChecker
          documents={step.documents}
          answered={answered}
          foundErrorIds={answerResult?.foundErrorIds}
          onSubmit={(ids) => onAnswerDocumentCheck(step.id, ids)}
          explanation={step.explanation}
          onNext={onNext}
        />
      )}

      {step.type === 'info' && (
        <div className="p-4 bg-gray-50 rounded-lg text-sm text-gray-700">
          {step.explanation}
          <br />
          <button
            className="mt-3 px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
            onClick={onNext}
          >
            次のステップへ →
          </button>
        </div>
      )}
    </div>
  )
}
