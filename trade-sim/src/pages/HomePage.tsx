import type { ScenarioType } from '../types'

interface Props {
  onStart: (scenario: ScenarioType) => void
}

export const HomePage = ({ onStart }: Props) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-lg w-full">
        <div className="text-center mb-10">
          <div className="text-5xl mb-4">🚢</div>
          <h1 className="text-3xl font-bold text-gray-800">貿易実務シミュレーター</h1>
          <p className="text-gray-500 mt-2">輸出入の通関フローを体験して実務知識を身につけよう</p>
        </div>

        <div className="grid gap-4">
          <button
            className="group bg-white rounded-2xl shadow-md p-6 text-left hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 border-2 border-transparent hover:border-blue-400"
            onClick={() => onStart('import')}
          >
            <div className="flex items-center gap-4">
              <div className="text-4xl">📦</div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-gray-800 group-hover:text-blue-700">輸入通関シミュレーション</h2>
                <p className="text-sm text-gray-500 mt-1">
                  到着通知の受領から貨物引取りまで、7ステップで輸入実務を体験
                </p>
                <div className="mt-2 flex gap-2">
                  <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full">7ステップ</span>
                  <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full">中級</span>
                </div>
              </div>
              <span className="text-gray-400 group-hover:text-blue-500 text-xl">→</span>
            </div>
          </button>

          <button
            className="group bg-white rounded-2xl shadow-md p-6 text-left hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 border-2 border-transparent hover:border-green-400"
            onClick={() => onStart('export')}
          >
            <div className="flex items-center gap-4">
              <div className="text-4xl">✈️</div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-gray-800 group-hover:text-green-700">輸出通関シミュレーション</h2>
                <p className="text-sm text-gray-500 mt-1">
                  契約・書類準備から船積み書類送付まで、6ステップで輸出実務を体験
                </p>
                <div className="mt-2 flex gap-2">
                  <span className="text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded-full">6ステップ</span>
                  <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full">中級</span>
                </div>
              </div>
              <span className="text-gray-400 group-hover:text-green-500 text-xl">→</span>
            </div>
          </button>
        </div>

        <p className="text-center text-xs text-gray-400 mt-8">
          各ステップで選択肢を選んだり書類の不備を見つけて正解を目指しましょう
        </p>
      </div>
    </div>
  )
}
