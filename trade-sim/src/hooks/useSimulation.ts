import { useState, useCallback } from 'react'
import type { ScenarioType, SimulationState, AnswerResult, Step } from '../types'
import { importFlow } from '../data/importFlow'
import { exportFlow } from '../data/exportFlow'

function calcMaxScore(steps: Step[]): number {
  return steps.reduce((sum, step) => {
    if (step.type === 'document-check') {
      const errorCount = step.documents?.filter((d) => d.hasError).length ?? 0
      return sum + errorCount
    }
    return sum + 1
  }, 0)
}

export function useSimulation(scenario: ScenarioType) {
  const steps = scenario === 'import' ? importFlow : exportFlow
  const maxScore = calcMaxScore(steps)

  const [state, setState] = useState<SimulationState>({
    scenario,
    currentStepIndex: 0,
    steps,
    score: 0,
    maxScore,
    answered: {},
    isComplete: false,
  })

  const answerDecision = useCallback(
    (stepId: string, choiceId: string) => {
      setState((prev) => {
        if (prev.answered[stepId]) return prev
        const step = prev.steps.find((s) => s.id === stepId)
        if (!step || step.type !== 'decision') return prev
        const isCorrect = step.choices?.find((c) => c.id === choiceId)?.isCorrect ?? false
        const result: AnswerResult = { stepId, isCorrect, selectedChoiceId: choiceId }
        return {
          ...prev,
          score: prev.score + (isCorrect ? 1 : 0),
          answered: { ...prev.answered, [stepId]: result },
        }
      })
    },
    [],
  )

  const answerDocumentCheck = useCallback(
    (stepId: string, foundErrorIds: string[]) => {
      setState((prev) => {
        if (prev.answered[stepId]) return prev
        const step = prev.steps.find((s) => s.id === stepId)
        if (!step || step.type !== 'document-check') return prev
        const errorDocs = step.documents?.filter((d) => d.hasError) ?? []
        const correctFound = foundErrorIds.filter((id) =>
          errorDocs.some((d) => d.id === id),
        ).length
        const result: AnswerResult = { stepId, isCorrect: correctFound === errorDocs.length, foundErrorIds }
        return {
          ...prev,
          score: prev.score + correctFound,
          answered: { ...prev.answered, [stepId]: result },
        }
      })
    },
    [],
  )

  const nextStep = useCallback(() => {
    setState((prev) => {
      const next = prev.currentStepIndex + 1
      if (next >= prev.steps.length) {
        return { ...prev, isComplete: true }
      }
      return { ...prev, currentStepIndex: next }
    })
  }, [])

  const restart = useCallback(() => {
    setState({
      scenario,
      currentStepIndex: 0,
      steps,
      score: 0,
      maxScore,
      answered: {},
      isComplete: false,
    })
  }, [scenario, steps, maxScore])

  return { state, answerDecision, answerDocumentCheck, nextStep, restart }
}
