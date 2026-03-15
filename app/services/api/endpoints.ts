export const ENDPOINTS = {
  // Authentication
  AUTH: {
    REGISTER: '/user/register',
    LOGIN: '/user/login/mobile',
    CONFIRM_EMAIL: (token: string) => `/user/confirm-account/${token}`,
    FORGOT_PASSWORD: '/user/forgot-password',
    RESET_PASSWORD: '/user/reset-password',
    REFRESH_TOKEN: '/user/refresh-token',
    LOGOUT: '/user/logout',
    CHANGE_PASSWORD: '/user/change-password',
    GET_SESSIONS: '/user/sessions',
    REVOKE_SESSION: (sessionId: string) => `/user/sessions/${sessionId}`,
    REVOKE_ALL_SESSIONS: '/user/sessions',
  },

  // User Profile
  USER: {
    GET_PROFILE: '/users/profile',
    UPDATE_PROFILE: '/users/profile',
    DELETE_ACCOUNT: '/users/account',
  },

  // Quizzes
  QUIZZES: {
    GET_ALL: '/quizzes',
    GET_BY_ID: (id: string) => `/quizzes/${id}`,
  },

  // User Saved Configurations
  USER_CONFIGURATIONS: {
    GET_ALL: '/user-saved-configurations',
    GET_BY_ID: (id: string) => `/user-saved-configurations/${id}`,
    CREATE: '/user-saved-configurations',
    UPDATE: (id: string) => `/user-saved-configurations/${id}`,
    DELETE: (id: string) => `/user-saved-configurations/${id}`,
    FROM_QUIZ: '/user-saved-configurations/from-quiz',
  },

  // Admin Configurations
  CONFIGURATIONS: {
    GET_ALL: '/configurations',
    GET_BY_ID: (id: string) => `/configurations/${id}`,
  },

  // Bookmarks
  BOOKMARKS: {
    GET_ALL: '/bookmarks',
    ADD: '/bookmarks',
    REMOVE: (configurationId: string) => `/bookmarks/${configurationId}`,
  },

  // Public Content
  CONTENT: {
    GET_PAGES: '/content/pages',
    GET_PAGE_BY_ID: (id: string) => `/content/pages/${id}`,
    GET_TAGS: '/content/tags',
    GET_TAG_BY_ID: (id: string) => `/content/tags/${id}`,
    GET_MENUS: '/content/menus',
    GET_MENU_BY_ID: (id: string) => `/content/menus/${id}`,
  },
};
