import { useState } from 'react'
import type { Choice } from '../types'

interface Props {
  choices: Choice[]
  answered: boolean
  selectedChoiceId?: string
  onAnswer: (choiceId: string) => void
  explanation: string
  onNext: () => void
}

export const DecisionPanel = ({
  choices,
  answered,
  selectedChoiceId,
  onAnswer,
  explanation,
  onNext,
}: Props) => {
  const [selected, setSelected] = useState<string | null>(selectedChoiceId ?? null)

  const handleSelect = (id: string) => {
    if (answered) return
    setSelected(id)
    onAnswer(id)
  }

  return (
    <div className="space-y-3">
      {choices.map((choice) => {
        const isSelected = selected === choice.id
        let btnClass =
          'w-full text-left px-4 py-3 rounded-lg border-2 transition-all duration-200 '
        if (!answered) {
          btnClass += 'border-gray-200 hover:border-blue-400 hover:bg-blue-50 cursor-pointer'
        } else if (isSelected && choice.isCorrect) {
          btnClass += 'border-green-500 bg-green-50 text-green-800'
        } else if (isSelected && !choice.isCorrect) {
          btnClass += 'border-red-500 bg-red-50 text-red-800'
        } else if (!isSelected && choice.isCorrect) {
          btnClass += 'border-green-400 bg-green-50 text-green-700'
        } else {
          btnClass += 'border-gray-200 bg-gray-50 text-gray-500'
        }

        return (
          <button key={choice.id} className={btnClass} onClick={() => handleSelect(choice.id)}>
            <span className="font-semibold mr-2">
              {choice.id.toUpperCase()}.
            </span>
            {choice.label}
            {answered && isSelected && (
              <span className="ml-2 font-bold">
                {choice.isCorrect ? ' ✓ 正解' : ' ✗ 不正解'}
              </span>
            )}
            {answered && !isSelected && choice.isCorrect && (
              <span className="ml-2 text-green-600 font-bold"> ← 正解</span>
            )}
          </button>
        )
      })}

      {answered && (
        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm font-semibold text-blue-800 mb-1">解説</p>
          <p className="text-sm text-blue-700">{explanation}</p>
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
