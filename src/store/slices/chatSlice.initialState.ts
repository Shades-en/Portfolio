import type { ChatState } from './chatSlice.types';

export const initialState: ChatState = {
  user: null,
  sessions: [],
  sessionsCount: 0,
  currentSession: null,
  pendingSessionName: null,
  isTablet: false,
  isMobile: false,
  sidebarCollapsed: false,
  loading: {
    user: false,
    sessions: false,
    messages: false,
    currentSession: false,
  },
  error: {
    user: null,
    sessions: null,
    messages: null,
    currentSession: null,
  },
  pagination: {
    sessions: {
      page: 1,
      pageSize: 50,
      totalPages: 0,
      totalCount: 0,
      hasNext: false,
      hasPrevious: false,
    },
    messages: {
      page: 1,
      pageSize: 50,
      totalPages: 0,
      totalCount: 0,
      hasNext: false,
      hasPrevious: false,
    },
  },
};
