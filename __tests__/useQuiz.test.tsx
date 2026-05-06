import React from 'react'
import { renderHook, act } from '@testing-library/react-native'
import { QuizProvider, useQuiz } from '../hooks/useQuiz'
import type { Quiz } from '../types/quiz.types'

jest.mock('../app/services/api/quizApi', () => ({
  quizApi: {
    submitQuizResponses: jest.fn(),
  },
}))

import { quizApi } from '../app/services/api/quizApi'

const mockQuiz: Quiz = {
  id: 'quiz-1',
  nom: 'Test Quiz',
  active: true,
  questions: [
    {
      id: 'q1',
      text: 'Question 1',
      position: 1,
      idQuizz: 'quiz-1',
      responsesOptions: [
        { id: 'opt1', label: 'Option A', position: 1, targetedField: 'field', operation: 'add', value: '1', idQuestions: 'q1' },
        { id: 'opt2', label: 'Option B', position: 2, targetedField: 'field', operation: 'add', value: '2', idQuestions: 'q1' },
      ],
    },
    {
      id: 'q2',
      text: 'Question 2',
      position: 2,
      idQuizz: 'quiz-1',
      responsesOptions: [
        { id: 'opt3', label: 'Option C', position: 1, targetedField: 'field2', operation: 'add', value: '1', idQuestions: 'q2' },
      ],
    },
  ],
}

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QuizProvider>{children}</QuizProvider>
)

describe('useQuiz', () => {
  it('throws when used outside QuizProvider', () => {
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {})
    expect(() => renderHook(() => useQuiz())).toThrow(
      'useQuiz must be used within a QuizProvider'
    )
    spy.mockRestore()
  })

  describe('startQuiz', () => {
    it('initializes quiz state at question index 0 with empty responses', () => {
      const { result } = renderHook(() => useQuiz(), { wrapper })
      act(() => { result.current.startQuiz(mockQuiz) })
      expect(result.current.quizState.currentQuiz).toEqual(mockQuiz)
      expect(result.current.quizState.currentQuestionIndex).toBe(0)
      expect(result.current.quizState.responses).toHaveLength(0)
    })
  })

  describe('selectAnswer', () => {
    it('adds a new response for the current question', () => {
      const { result } = renderHook(() => useQuiz(), { wrapper })
      act(() => { result.current.startQuiz(mockQuiz) })
      act(() => { result.current.selectAnswer('q1', 'opt1') })
      expect(result.current.quizState.responses).toHaveLength(1)
      expect(result.current.quizState.responses[0]).toEqual({
        questionId: 'q1',
        selectedOptionId: 'opt1',
      })
    })

    it('replaces the existing response when same question is answered again', () => {
      const { result } = renderHook(() => useQuiz(), { wrapper })
      act(() => { result.current.startQuiz(mockQuiz) })
      act(() => { result.current.selectAnswer('q1', 'opt1') })
      act(() => { result.current.selectAnswer('q1', 'opt2') })
      expect(result.current.quizState.responses).toHaveLength(1)
      expect(result.current.quizState.responses[0].selectedOptionId).toBe('opt2')
    })
  })

  describe('navigation', () => {
    it('canGoNext is false before answering the current question', () => {
      const { result } = renderHook(() => useQuiz(), { wrapper })
      act(() => { result.current.startQuiz(mockQuiz) })
      expect(result.current.canGoNext).toBe(false)
    })

    it('canGoNext is true after answering the current question', () => {
      const { result } = renderHook(() => useQuiz(), { wrapper })
      act(() => { result.current.startQuiz(mockQuiz) })
      act(() => { result.current.selectAnswer('q1', 'opt1') })
      expect(result.current.canGoNext).toBe(true)
    })

    it('canGoPrevious is false on the first question', () => {
      const { result } = renderHook(() => useQuiz(), { wrapper })
      act(() => { result.current.startQuiz(mockQuiz) })
      expect(result.current.canGoPrevious).toBe(false)
    })

    it('goToNextQuestion advances the index and returns true', () => {
      const { result } = renderHook(() => useQuiz(), { wrapper })
      act(() => { result.current.startQuiz(mockQuiz) })
      act(() => { result.current.selectAnswer('q1', 'opt1') })
      let success: boolean
      act(() => { success = result.current.goToNextQuestion() })
      expect(result.current.quizState.currentQuestionIndex).toBe(1)
      expect(success!).toBe(true)
    })

    it('goToPreviousQuestion decrements the index and returns true', () => {
      const { result } = renderHook(() => useQuiz(), { wrapper })
      act(() => { result.current.startQuiz(mockQuiz) })
      act(() => { result.current.selectAnswer('q1', 'opt1') })
      act(() => { result.current.goToNextQuestion() })
      let success: boolean
      act(() => { success = result.current.goToPreviousQuestion() })
      expect(result.current.quizState.currentQuestionIndex).toBe(0)
      expect(success!).toBe(true)
    })

    it('goToNextQuestion returns false on the last question', () => {
      const { result } = renderHook(() => useQuiz(), { wrapper })
      act(() => { result.current.startQuiz(mockQuiz) })
      act(() => { result.current.selectAnswer('q1', 'opt1') })
      act(() => { result.current.goToNextQuestion() })
      let success: boolean
      act(() => { success = result.current.goToNextQuestion() })
      expect(success!).toBe(false)
    })

    it('isLastQuestion is true on the last question', () => {
      const { result } = renderHook(() => useQuiz(), { wrapper })
      act(() => { result.current.startQuiz(mockQuiz) })
      act(() => { result.current.selectAnswer('q1', 'opt1') })
      act(() => { result.current.goToNextQuestion() })
      expect(result.current.isLastQuestion).toBe(true)
    })
  })

  describe('resetQuiz', () => {
    it('clears all quiz state', () => {
      const { result } = renderHook(() => useQuiz(), { wrapper })
      act(() => { result.current.startQuiz(mockQuiz) })
      act(() => { result.current.selectAnswer('q1', 'opt1') })
      act(() => { result.current.resetQuiz() })
      expect(result.current.quizState.currentQuiz).toBeNull()
      expect(result.current.quizState.responses).toHaveLength(0)
      expect(result.current.quizState.currentQuestionIndex).toBe(0)
    })
  })

  describe('submitQuiz', () => {
    it('calls the API with quiz id and mapped responses', async () => {
      const mockConfig = {
        id: 'config-1', name: 'Config', inhalation: 4, retention1: 4,
        exhalation: 4, retention2: 4, durationMinutes: 5, difficulty: 'easy',
        objective: 'relax', guidanceType: 'visual',
      }
      jest.mocked(quizApi.submitQuizResponses).mockResolvedValue(mockConfig as any)
      const { result } = renderHook(() => useQuiz(), { wrapper })
      act(() => { result.current.startQuiz(mockQuiz) })
      act(() => { result.current.selectAnswer('q1', 'opt1') })

      let config: any
      await act(async () => { config = await result.current.submitQuiz() })

      expect(quizApi.submitQuizResponses).toHaveBeenCalledWith('quiz-1', [
        { questionId: 'q1', selectedOptionId: 'opt1' },
      ])
      expect(config.id).toBe('config-1')
    })
  })
})
