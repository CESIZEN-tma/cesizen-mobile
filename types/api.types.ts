export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  memberSince: Date;
  thumbnailUrl?: string;
}

export interface Session {
  id: string;
  createdAt: Date;
  expiresAt: Date;
}

export interface Quiz {
  id: string;
  name: string;
  active: boolean;
  questions: Question[];
}

export interface Question {
  id: string;
  text: string;
  position: number;
  quizId: string;
  responseOptions: ResponseOption[];
}

export interface ResponseOption {
  id: string;
  label: string;
  position: number;
  targetedField: string;
  operation: 'SET' | 'ADD' | 'MULTIPLY';
  value: string;
  questionId: string;
}

export interface QuizResponse {
  questionId: string;
  selectedOptionId: string;
}

export interface Configuration {
  id: string;
  name: string;
  inhalation: number;
  retention1: number;
  exhalation: number;
  retention2: number;
  durationMinutes: number;
  difficulty: number;
  objective: string;
  guidanceType: 'visual' | 'audio' | 'haptic' | 'combined';
}

export interface Bookmark {
  id: string;
  configurationId: string;
  configuration?: Configuration;
}

export interface InformationPage {
  id: string;
  title: string;
  description: string;
  content: string;
  contentType: 'html' | 'markdown';
  status: 'draft' | 'published';
}

export interface InformationTag {
  id: string;
  name: string;
}

export interface NavigationMenu {
  id: string;
  position: number;
  label: string;
  url: string;
}
