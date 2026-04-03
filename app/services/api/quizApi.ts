import { apiClient } from './apiClient';
import { ENDPOINTS } from './endpoints';
import { QuizDTO, ConfigurationDTO, QuizResponseDTO } from './types';

export const quizApi = {
  getQuizzes: async (): Promise<QuizDTO[]> => {
    return apiClient.get(ENDPOINTS.QUIZZES.GET_ALL);
  },

  getQuizById: async (id: string): Promise<QuizDTO> => {
    return apiClient.get(ENDPOINTS.QUIZZES.GET_BY_ID(id));
  },

  submitQuizResponses: async (
    quizId: string,
    responses: QuizResponseDTO[]
  ): Promise<ConfigurationDTO> => {
    return apiClient.post(ENDPOINTS.USER_CONFIGURATIONS.FROM_QUIZ, {
      quizId,
      responses,
    });
  },
};
