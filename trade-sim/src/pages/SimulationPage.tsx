import type { ScenarioType } from '../types'
import { useSimulation } from '../hooks/useSimulation'
import { ProgressBar } from '../components/ProgressBar'
import { StepCard } from '../components/StepCard'
import { ResultScreen } from '../components/ResultScreen'

interface Props {
  scenario: ScenarioType
  onHome: () => void
}

export const SimulationPage = ({ scenario, onHome }: Props) => {
  const { state, answerDecision, answerDocumentCheck, nextStep, restart } = useSimulation(scenario)
  const { steps, currentStepIndex, score, maxScore, answered, isComplete } = state

  if (isComplete) {
    return (
      <ResultScreen
        score={score}
        maxScore={maxScore}
        scenario={scenario}
        onRestart={restart}
        onHome={onHome}
      />
    )
  }

  const currentStep = steps[currentStepIndex]
  const scenarioName = scenario === 'import' ? '輸入通関' : '輸出通関'

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-2xl mx-auto">
        {/* ヘッダー */}
        <div className="flex items-center justify-between mb-4">
          <button
            className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
            onClick={onHome}
          >
            ← シナリオ選択
          </button>
          <h1 className="text-sm font-semibold text-gray-700">{scenarioName}シミュレーション</h1>
          <div className="text-sm text-gray-500">
            スコア: <span className="font-bold text-blue-600">{score}</span> / {maxScore}
          </div>
        </div>

        {/* プログレスバー */}
        <div className="mb-5">
          <ProgressBar current={currentStepIndex + 1} total={steps.length} />
        </div>

        {/* ステップカード */}
        <StepCard
          step={currentStep}
          answerResult={answered[currentStep.id]}
          onAnswerDecision={answerDecision}
          onAnswerDocumentCheck={answerDocumentCheck}
          onNext={nextStep}
        />
      </div>
    </div>
  )
}
