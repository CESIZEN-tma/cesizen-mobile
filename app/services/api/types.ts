export interface RegisterRequestDTO {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
}

export interface LoginRequestDTO {
  email: string;
  password: string;
}

export interface LoginResponseDTO {
  accessToken: string;
  refreshToken: string;
}

export interface RefreshTokenRequestDTO {
  refreshToken: string;
}

export interface RefreshTokenResponseDTO {
  accessToken: string;
}

export interface ForgotPasswordRequestDTO {
  email: string;
}

export interface ResetPasswordRequestDTO {
  token: string;
  password: string;
  confirmPassword: string;
}

export interface ChangePasswordRequestDTO {
  oldPassword: string;
  newPassword: string;
}

export interface UserProfileDTO {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  memberSince: string;
  thumbnailUrl?: string;
}

export interface UpdateProfileRequestDTO {
  firstName?: string;
  lastName?: string;
  thumbnailUrl?: string;
}

export interface SessionDTO {
  id: string;
  createdAt: string;
  expiresAt: string;
}

export interface QuizDTO {
  id: string;
  nom: string;
  active: boolean;
  questions: QuestionDTO[];
}

export interface QuestionDTO {
  id: string;
  text: string;
  position: number;
  idQuizz: string;
  responsesOptions: ResponseOptionDTO[];
}

export interface ResponseOptionDTO {
  id: string;
  label: string;
  position: number;
  targetedField: string;
  operation: string;
  value: string;
  idQuestions: string;
}

export interface QuizResponseDTO {
  questionId: string;
  selectedOptionId: string;
}

export interface SubmitQuizRequestDTO {
  quizId: string;
  responses: QuizResponseDTO[];
}

export interface ConfigurationDTO {
  id: string;
  name: string;
  inhalation: number;
  retention1: number;
  exhalation: number;
  retention2: number;
  durationMinutes: number;
  difficulty: number;
  objective: string;
  guidanceType: string;
}

export interface CreateConfigurationRequestDTO {
  name: string;
  inhalation: number;
  retention1: number;
  exhalation: number;
  retention2: number;
  durationMinutes: number;
  difficulty: number;
  objective: string;
  guidanceType: string;
}

export interface UpdateConfigurationRequestDTO {
  name?: string;
  inhalation?: number;
  retention1?: number;
  exhalation?: number;
  retention2?: number;
  durationMinutes?: number;
  difficulty?: number;
  objective?: string;
  guidanceType?: string;
}

export interface BookmarkDTO {
  id: string;
  idConfigurations: string;
}

export interface AddBookmarkRequestDTO {
  configurationId: string;
}

export interface InformationPageDTO {
  id: string;
  title: string;
  description: string;
  content: string;
  contentType: string;
  status: string;
}

export interface InformationTagDTO {
  id: string;
  name: string;
}

export interface NavigationMenuDTO {
  id: string;
  position: number;
  label: string;
  url: string;
}
