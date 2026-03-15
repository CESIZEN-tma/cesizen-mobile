import { apiClient } from './apiClient';
import { ENDPOINTS } from './endpoints';
import {
  RegisterRequestDTO,
  LoginRequestDTO,
  LoginResponseDTO,
  RefreshTokenRequestDTO,
  RefreshTokenResponseDTO,
  ForgotPasswordRequestDTO,
  ResetPasswordRequestDTO,
  ChangePasswordRequestDTO,
  SessionDTO,
} from './types';

export const authApi = {
  register: async (userData: RegisterRequestDTO): Promise<void> => {
    return apiClient.post(ENDPOINTS.AUTH.REGISTER, userData);
  },

  confirmEmail: async (token: string): Promise<void> => {
    return apiClient.put(ENDPOINTS.AUTH.CONFIRM_EMAIL(token));
  },

  login: async (
    email: string,
    password: string
  ): Promise<LoginResponseDTO> => {
    return apiClient.post(ENDPOINTS.AUTH.LOGIN, { email, password });
  },

  forgotPassword: async (email: string): Promise<void> => {
    return apiClient.post(ENDPOINTS.AUTH.FORGOT_PASSWORD, { email });
  },

  resetPassword: async (
    token: string,
    password: string,
    confirmPassword: string
  ): Promise<void> => {
    return apiClient.post(ENDPOINTS.AUTH.RESET_PASSWORD, {
      token,
      password,
      confirmPassword,
    });
  },

  refreshToken: async (
    refreshToken: string
  ): Promise<RefreshTokenResponseDTO> => {
    return apiClient.post(ENDPOINTS.AUTH.REFRESH_TOKEN, { refreshToken });
  },

  logout: async (): Promise<void> => {
    return apiClient.post(ENDPOINTS.AUTH.LOGOUT);
  },

  changePassword: async (
    oldPassword: string,
    newPassword: string
  ): Promise<void> => {
    return apiClient.post(ENDPOINTS.AUTH.CHANGE_PASSWORD, {
      oldPassword,
      newPassword,
    });
  },

  getSessions: async (): Promise<SessionDTO[]> => {
    return apiClient.get(ENDPOINTS.AUTH.GET_SESSIONS);
  },

  revokeSession: async (sessionId: string): Promise<void> => {
    return apiClient.delete(ENDPOINTS.AUTH.REVOKE_SESSION(sessionId));
  },

  revokeAllOtherSessions: async (): Promise<void> => {
    return apiClient.delete(ENDPOINTS.AUTH.REVOKE_ALL_SESSIONS);
  },
};
