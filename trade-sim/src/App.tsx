import { useState } from 'react'
import type { ScenarioType } from './types'
import { HomePage } from './pages/HomePage'
import { SimulationPage } from './pages/SimulationPage'

type AppView = { page: 'home' } | { page: 'simulation'; scenario: ScenarioType }

export default function App() {
  const [view, setView] = useState<AppView>({ page: 'home' })

  if (view.page === 'simulation') {
    return (
      <SimulationPage
        scenario={view.scenario}
        onHome={() => setView({ page: 'home' })}
      />
    )
  }

  return <HomePage onStart={(scenario) => setView({ page: 'simulation', scenario })} />
}
