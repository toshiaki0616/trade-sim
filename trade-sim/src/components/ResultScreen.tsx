import type { ScenarioType } from '../types'

interface Props {
  score: number
  maxScore: number
  scenario: ScenarioType
  onRestart: () => void
  onHome: () => void
}

export const ResultScreen = ({ score, maxScore, scenario, onRestart, onHome }: Props) => {
  const pct = Math.round((score / maxScore) * 100)
  const label =
    pct >= 80 ? '優秀！実務でも活躍できます' : pct >= 50 ? 'もう少し！復習して再挑戦しましょう' : '基礎から学び直しましょう'
  const emoji = pct >= 80 ? '🏆' : pct >= 50 ? '📚' : '💡'
  const scenarioName = scenario === 'import' ? '輸入通関' : '輸出通関'

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
        <div className="text-6xl mb-4">{emoji}</div>
        <h1 className="text-2xl font-bold text-gray-800 mb-1">{scenarioName} 完了！</h1>
        <p className="text-gray-500 text-sm mb-6">{label}</p>

        <div className="bg-blue-50 rounded-xl p-6 mb-6">
          <p className="text-5xl font-bold text-blue-600">{score} <span className="text-2xl text-blue-400">/ {maxScore}</span></p>
          <p className="text-gray-500 text-sm mt-1">正解ポイント（正答率 {pct}%）</p>
        </div>

        <div className="flex flex-col gap-3">
          <button
            className="w-full px-5 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium"
            onClick={onRestart}
          >
            もう一度挑戦する
          </button>
          <button
            className="w-full px-5 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-medium"
            onClick={onHome}
          >
            シナリオ選択に戻る
          </button>
        </div>
      </div>
    </div>
  )
}
