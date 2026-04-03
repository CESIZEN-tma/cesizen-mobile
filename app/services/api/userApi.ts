import { apiClient } from './apiClient';
import { ENDPOINTS } from './endpoints';
import { UserProfileDTO, UpdateProfileRequestDTO, SessionDTO } from './types';

export const userApi = {
  getProfile: async (): Promise<UserProfileDTO> => {
    return apiClient.get(ENDPOINTS.USER.GET_PROFILE);
  },

  updateProfile: async (
    data: UpdateProfileRequestDTO
  ): Promise<UserProfileDTO> => {
    return apiClient.put(ENDPOINTS.USER.UPDATE_PROFILE, data);
  },

  deleteAccount: async (): Promise<void> => {
    return apiClient.delete(ENDPOINTS.USER.DELETE_ACCOUNT);
  },

  getSessions: async (): Promise<SessionDTO[]> => {
    return apiClient.get(ENDPOINTS.AUTH.GET_SESSIONS);
  },

  revokeSession: async (sessionId: string): Promise<void> => {
    return apiClient.delete(ENDPOINTS.AUTH.REVOKE_SESSION(sessionId));
  },

  revokeAllSessions: async (): Promise<void> => {
    return apiClient.delete(ENDPOINTS.AUTH.REVOKE_ALL_SESSIONS);
  },
};
