import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
} from "react";
import { Quiz, QuizResponse, QuizState } from "@/types/quiz.types";
import { quizApi } from "@/app/services/api/quizApi";
import { Configuration } from "@/types/api.types";

type QuizContextType = {
  quizState: QuizState;
  startQuiz: (quiz: Quiz) => void;
  restoreQuiz: (quiz: Quiz, responses: QuizResponse[]) => void;
  selectAnswer: (questionId: string, optionId: string) => void;
  goToNextQuestion: () => boolean;
  goToPreviousQuestion: () => boolean;
  submitQuiz: () => Promise<Configuration>;
  resetQuiz: () => void;
  canGoNext: boolean;
  canGoPrevious: boolean;
  isLastQuestion: boolean;
};

const QuizContext = createContext<QuizContextType | undefined>(undefined);

export function QuizProvider({ children }: { children: ReactNode }) {
  const [quizState, setQuizState] = useState<QuizState>({
    currentQuiz: null,
    currentQuestionIndex: 0,
    responses: [],
    isSubmitting: false,
  });

  const startQuiz = (quiz: Quiz) => {
    setQuizState({
      currentQuiz: quiz,
      currentQuestionIndex: 0,
      responses: [],
      isSubmitting: false,
    });
  };

  const restoreQuiz = (quiz: Quiz, responses: QuizResponse[]) => {
    setQuizState({
      currentQuiz: quiz,
      currentQuestionIndex: quiz.questions.length - 1,
      responses,
      isSubmitting: false,
    });
  };

  const selectAnswer = (questionId: string, optionId: string) => {
    setQuizState((prev) => {
      const existingIndex = prev.responses.findIndex(
        (r) => r.questionId === questionId
      );

      const newResponses = [...prev.responses];

      if (existingIndex >= 0) {
        newResponses[existingIndex] = { questionId, selectedOptionId: optionId };
      } else {
        newResponses.push({ questionId, selectedOptionId: optionId });
      }

      return { ...prev, responses: newResponses };
    });
  };

  const goToNextQuestion = (): boolean => {
    if (!quizState.currentQuiz) return false;

    const nextIndex = quizState.currentQuestionIndex + 1;
    if (nextIndex < quizState.currentQuiz.questions.length) {
      setQuizState((prev) => ({
        ...prev,
        currentQuestionIndex: nextIndex,
      }));
      return true;
    }
    return false;
  };

  const goToPreviousQuestion = (): boolean => {
    const prevIndex = quizState.currentQuestionIndex - 1;
    if (prevIndex >= 0) {
      setQuizState((prev) => ({
        ...prev,
        currentQuestionIndex: prevIndex,
      }));
      return true;
    }
    return false;
  };

  const submitQuiz = async (): Promise<Configuration> => {
    setQuizState((prev) => ({ ...prev, isSubmitting: true }));

    try {
      const apiResponses = quizState.responses.map((r) => ({
        questionId: r.questionId,
        selectedOptionId: r.selectedOptionId,
      }));

      const configDTO = await quizApi.submitQuizResponses(quizState.currentQuiz!.id, apiResponses);

      const configuration: Configuration = {
        id: configDTO.id,
        name: configDTO.name,
        inhalation: configDTO.inhalation,
        retention1: configDTO.retention1,
        exhalation: configDTO.exhalation,
        retention2: configDTO.retention2,
        durationMinutes: configDTO.durationMinutes,
        difficulty: configDTO.difficulty,
        objective: configDTO.objective,
        guidanceType: configDTO.guidanceType as 'visual' | 'audio' | 'haptic' | 'combined',
      };

      return configuration;
    } catch (error) {
      throw error;
    } finally {
      setQuizState((prev) => ({ ...prev, isSubmitting: false }));
    }
  };

  const resetQuiz = () => {
    setQuizState({
      currentQuiz: null,
      currentQuestionIndex: 0,
      responses: [],
      isSubmitting: false,
    });
  };

  const currentQuestion = quizState.currentQuiz?.questions[quizState.currentQuestionIndex];
  const hasAnsweredCurrent = currentQuestion
    ? quizState.responses.some((r) => r.questionId === currentQuestion.id)
    : false;

  const canGoNext = hasAnsweredCurrent;
  const canGoPrevious = quizState.currentQuestionIndex > 0;
  const isLastQuestion =
    quizState.currentQuiz
      ? quizState.currentQuestionIndex === quizState.currentQuiz.questions.length - 1
      : false;

  return (
    <QuizContext.Provider
      value={{
        quizState,
        startQuiz,
        restoreQuiz,
        selectAnswer,
        goToNextQuestion,
        goToPreviousQuestion,
        submitQuiz,
        resetQuiz,
        canGoNext,
        canGoPrevious,
        isLastQuestion,
      }}
    >
      {children}
    </QuizContext.Provider>
  );
}

export function useQuiz() {
  const context = useContext(QuizContext);
  if (context === undefined) {
    throw new Error("useQuiz must be used within a QuizProvider");
  }
  return context;
}
