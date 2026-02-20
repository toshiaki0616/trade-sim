import { renderHook, act } from '@testing-library/react'
import { useSimulation } from './useSimulation'

describe('useSimulation - import scenario', () => {
  it('初期状態: 最初のステップから始まる', () => {
    const { result } = renderHook(() => useSimulation('import'))
    expect(result.current.state.currentStepIndex).toBe(0)
    expect(result.current.state.score).toBe(0)
    expect(result.current.state.isComplete).toBe(false)
  })

  it('正解を選ぶとスコアが増える', () => {
    const { result } = renderHook(() => useSimulation('import'))
    const step = result.current.state.steps[0]
    const correctChoice = step.choices!.find((c) => c.isCorrect)!

    act(() => {
      result.current.answerDecision(step.id, correctChoice.id)
    })

    expect(result.current.state.score).toBe(1)
    expect(result.current.state.answered[step.id].isCorrect).toBe(true)
  })

  it('不正解を選んでもスコアは増えない', () => {
    const { result } = renderHook(() => useSimulation('import'))
    const step = result.current.state.steps[0]
    const wrongChoice = step.choices!.find((c) => !c.isCorrect)!

    act(() => {
      result.current.answerDecision(step.id, wrongChoice.id)
    })

    expect(result.current.state.score).toBe(0)
    expect(result.current.state.answered[step.id].isCorrect).toBe(false)
  })

  it('同じステップに二重回答できない', () => {
    const { result } = renderHook(() => useSimulation('import'))
    const step = result.current.state.steps[0]
    const correctChoice = step.choices!.find((c) => c.isCorrect)!
    const wrongChoice = step.choices!.find((c) => !c.isCorrect)!

    act(() => {
      result.current.answerDecision(step.id, correctChoice.id)
    })
    act(() => {
      result.current.answerDecision(step.id, wrongChoice.id)
    })

    // 最初の回答が保持される
    expect(result.current.state.score).toBe(1)
    expect(result.current.state.answered[step.id].selectedChoiceId).toBe(correctChoice.id)
  })

  it('nextStep でステップが進む', () => {
    const { result } = renderHook(() => useSimulation('import'))
    act(() => {
      result.current.nextStep()
    })
    expect(result.current.state.currentStepIndex).toBe(1)
  })

  it('全ステップ完了後 isComplete が true になる', () => {
    const { result } = renderHook(() => useSimulation('import'))
    const { steps } = result.current.state

    act(() => {
      steps.forEach((step) => {
        if (step.type === 'decision') {
          const correct = step.choices!.find((c) => c.isCorrect)!
          result.current.answerDecision(step.id, correct.id)
        } else if (step.type === 'document-check') {
          const errorIds = step.documents!.filter((d) => d.hasError).map((d) => d.id)
          result.current.answerDocumentCheck(step.id, errorIds)
        }
        result.current.nextStep()
      })
    })

    expect(result.current.state.isComplete).toBe(true)
  })

  it('restart で初期状態に戻る', () => {
    const { result } = renderHook(() => useSimulation('import'))
    const step = result.current.state.steps[0]
    const correct = step.choices!.find((c) => c.isCorrect)!

    act(() => {
      result.current.answerDecision(step.id, correct.id)
      result.current.nextStep()
    })

    act(() => {
      result.current.restart()
    })

    expect(result.current.state.currentStepIndex).toBe(0)
    expect(result.current.state.score).toBe(0)
    expect(result.current.state.answered).toEqual({})
  })
})

describe('useSimulation - document-check スコア計算', () => {
  it('書類チェックで正解のエラーを発見するとスコアが加算される', () => {
    const { result } = renderHook(() => useSimulation('import'))
    // Step 2 が document-check (index=1)
    const docStep = result.current.state.steps.find((s) => s.type === 'document-check')!
    const errorIds = docStep.documents!.filter((d) => d.hasError).map((d) => d.id)

    act(() => {
      result.current.answerDocumentCheck(docStep.id, errorIds)
    })

    expect(result.current.state.score).toBe(errorIds.length)
  })
})
