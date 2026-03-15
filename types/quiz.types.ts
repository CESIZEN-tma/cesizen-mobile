export interface Quiz {
  id: string;
  nom: string;
  active: boolean;
  questions: Question[];
}

export interface Question {
  id: string;
  text: string;
  position: number;
  idQuizz: string;
  responsesOptions: ResponseOption[];
}

export interface ResponseOption {
  id: string;
  label: string;
  position: number;
  targetedField: string;
  operation: string;
  value: string;
  idQuestions: string;
}

export interface QuizResponse {
  questionId: string;
  selectedOptionId: string;
}

export interface QuizState {
  currentQuiz: Quiz | null;
  currentQuestionIndex: number;
  responses: QuizResponse[];
  isSubmitting: boolean;
}
