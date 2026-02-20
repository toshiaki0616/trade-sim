import { useState } from 'react'
import type { DocumentField } from '../types'

interface Props {
  documents: DocumentField[]
  answered: boolean
  foundErrorIds?: string[]
  onSubmit: (foundIds: string[]) => void
  explanation: string
  onNext: () => void
}

export const DocumentChecker = ({
  documents,
  answered,
  foundErrorIds,
  onSubmit,
  explanation,
  onNext,
}: Props) => {
  const [checked, setChecked] = useState<Set<string>>(new Set(foundErrorIds ?? []))

  const toggle = (id: string) => {
    if (answered) return
    setChecked((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  const handleSubmit = () => {
    onSubmit(Array.from(checked))
  }

  return (
    <div className="space-y-3">
      <p className="text-sm text-gray-500 mb-2">不備のある項目にチェックを入れてください</p>
      {documents.map((doc) => {
        const isChecked = checked.has(doc.id)
        let rowClass = 'flex items-start gap-3 p-3 rounded-lg border-2 transition-all duration-200 '
        if (!answered) {
          rowClass += isChecked
            ? 'border-amber-400 bg-amber-50 cursor-pointer'
            : 'border-gray-200 hover:border-gray-300 cursor-pointer'
        } else if (doc.hasError && isChecked) {
          rowClass += 'border-green-500 bg-green-50'
        } else if (doc.hasError && !isChecked) {
          rowClass += 'border-red-400 bg-red-50'
        } else if (!doc.hasError && isChecked) {
          rowClass += 'border-amber-400 bg-amber-50'
        } else {
          rowClass += 'border-gray-200 bg-gray-50'
        }

        return (
          <div key={doc.id} className={rowClass} onClick={() => toggle(doc.id)}>
            <input
              type="checkbox"
              checked={isChecked}
              readOnly
              className="mt-0.5 h-4 w-4 accent-amber-500"
            />
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-700">{doc.label}</p>
              <p className="text-sm text-gray-500 font-mono">{doc.value}</p>
              {answered && doc.hasError && (
                <p className="text-xs text-red-600 mt-1">⚠ {doc.errorHint}</p>
              )}
              {answered && !doc.hasError && isChecked && (
                <p className="text-xs text-amber-600 mt-1">この項目は正常です</p>
              )}
            </div>
            {answered && doc.hasError && isChecked && (
              <span className="text-green-600 font-bold text-sm">✓</span>
            )}
            {answered && doc.hasError && !isChecked && (
              <span className="text-red-500 font-bold text-sm">✗ 見落とし</span>
            )}
          </div>
        )
      })}

      {!answered && (
        <button
          className="mt-2 px-5 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors text-sm font-medium"
          onClick={handleSubmit}
        >
          確認する
        </button>
      )}

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
