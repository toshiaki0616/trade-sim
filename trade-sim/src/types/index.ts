export type ScenarioType = 'import' | 'export'

export type StepType = 'info' | 'decision' | 'document-check'

export interface Choice {
  id: string
  label: string
  isCorrect: boolean
}

export interface DocumentField {
  id: string
  label: string
  value: string
  hasError: boolean
  errorHint?: string
}

export interface Step {
  id: string
  stepNumber: number
  title: string
  description: string
  type: StepType
  choices?: Choice[]
  documents?: DocumentField[]
  explanation: string
}

export interface SimulationState {
  scenario: ScenarioType
  currentStepIndex: number
  steps: Step[]
  score: number
  maxScore: number
  answered: Record<string, AnswerResult>
  isComplete: boolean
}

export interface AnswerResult {
  stepId: string
  isCorrect: boolean
  selectedChoiceId?: string
  foundErrorIds?: string[]
}
