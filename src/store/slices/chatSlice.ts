import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { User, Session, SessionsResponse } from '@/types/chat';

interface ChatState {
  readonly user: User | null;
  readonly sessions: Session[];
  readonly sessionsCount: number;
  readonly currentSession: Session | null;
  readonly isTablet: boolean;
  readonly isMobile: boolean;
  readonly sidebarCollapsed: boolean;
  readonly loading: {
    readonly user: boolean;
    readonly sessions: boolean;
    readonly messages: boolean;
    readonly currentSession: boolean;
  };
  readonly error: {
    readonly user: string | null;
    readonly sessions: string | null;
    readonly messages: string | null;
    readonly currentSession: string | null;
  };
  readonly pagination: {
    readonly sessions: {
      readonly page: number;
      readonly pageSize: number;
      readonly totalPages: number;
      readonly totalCount: number;
      readonly hasNext: boolean;
      readonly hasPrevious: boolean;
    };
    readonly messages: {
      readonly page: number;
      readonly pageSize: number;
      readonly totalPages: number;
      readonly totalCount: number;
      readonly hasNext: boolean;
      readonly hasPrevious: boolean;
    };
  };
}

const initialState: ChatState = {
  user: null,
  sessions: [],
  sessionsCount: 0,
  currentSession: null,
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

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    fetchSessionsRequest: (state, action: PayloadAction<{ readonly page: number; readonly pageSize: number }>) => {
      state.loading.sessions = true;
      state.error.sessions = null;
      state.pagination.sessions.page = action.payload.page;
      state.pagination.sessions.pageSize = action.payload.pageSize;
    },
    fetchSessionsSuccess: (state, action: PayloadAction<SessionsResponse>) => {
      state.loading.sessions = false;
      const newSessions = action.payload.results as Session[];
      
      if (action.payload.page === 1) {
        state.sessions = newSessions;
      } else {
        state.sessions = [...state.sessions, ...newSessions];
      }
      
      state.sessionsCount = action.payload.count;
      state.pagination.sessions.page = action.payload.page;
      state.pagination.sessions.pageSize = action.payload.page_size;
      state.pagination.sessions.totalPages = action.payload.total_pages;
      state.pagination.sessions.totalCount = action.payload.total_count;
      state.pagination.sessions.hasNext = action.payload.has_next;
      state.pagination.sessions.hasPrevious = action.payload.has_previous;
      state.error.sessions = null;
    },
    fetchSessionsFailure: (state, action: PayloadAction<string>) => {
      state.loading.sessions = false;
      state.error.sessions = action.payload;
    },

    fetchMessagesRequest: (state, action: PayloadAction<{ readonly sessionId: string; readonly page: number; readonly pageSize: number }>) => {
      state.loading.messages = true;
      state.error.messages = null;
      state.pagination.messages.page = action.payload.page;
      state.pagination.messages.pageSize = action.payload.pageSize;
    },
    fetchMessagesSuccess: (state, action: PayloadAction<{ readonly page: number; readonly pageSize: number; readonly totalPages: number; readonly totalCount: number; readonly hasNext: boolean; readonly hasPrevious: boolean }>) => {
      state.loading.messages = false;
      state.pagination.messages = action.payload;
      state.error.messages = null;
    },
    fetchMessagesFailure: (state, action: PayloadAction<string>) => {
      state.loading.messages = false;
      state.error.messages = action.payload;
    },

    setCurrentSession: (state, action: PayloadAction<Session | null>) => {
      state.currentSession = action.payload;
      state.error.currentSession = null;
      // Reset message pagination when switching sessions
      state.pagination.messages.page = 1;
      state.pagination.messages.totalPages = 0;
      state.pagination.messages.totalCount = 0;
      state.pagination.messages.hasNext = false;
      state.pagination.messages.hasPrevious = false;
    },

    setLoadingCurrentSession: (state, action: PayloadAction<boolean>) => {
      state.loading.currentSession = action.payload;
    },

    setCurrentSessionError: (state, action: PayloadAction<string | null>) => {
      state.error.currentSession = action.payload;
      state.loading.currentSession = false;
    },

    updateSessionName: (state, action: PayloadAction<{ readonly sessionId: string; readonly name: string }>) => {
      const sessionIndex = state.sessions.findIndex(s => s.id === action.payload.sessionId);
      if (sessionIndex !== -1) {
        state.sessions[sessionIndex] = {
          ...state.sessions[sessionIndex],
          name: action.payload.name,
        };
      }
      if (state.currentSession?.id === action.payload.sessionId) {
        state.currentSession = {
          ...state.currentSession,
          name: action.payload.name,
        };
      }
    },

    updateSessionStarred: (state, action: PayloadAction<{ readonly sessionId: string; readonly starred: boolean }>) => {
      const sessionIndex = state.sessions.findIndex(s => s.id === action.payload.sessionId);
      if (sessionIndex !== -1) {
        state.sessions[sessionIndex] = {
          ...state.sessions[sessionIndex],
          starred: action.payload.starred,
        };
      }
      if (state.currentSession?.id === action.payload.sessionId) {
        state.currentSession = {
          ...state.currentSession,
          starred: action.payload.starred,
        };
      }
    },

    renameSessionRequest: (state, action: PayloadAction<{ readonly sessionId: string; readonly name: string }>) => {
      // Saga will handle the API call
    },

    toggleStarSessionRequest: (state, action: PayloadAction<{ readonly sessionId: string; readonly starred: boolean }>) => {
      // Saga will handle the API call
    },

    deleteAllSessionsRequest: (state) => {
      // Saga will handle the API call
    },

    removeSession: (state, action: PayloadAction<{ readonly sessionId: string }>) => {
      state.sessions = state.sessions.filter(s => s.id !== action.payload.sessionId);
      if (state.currentSession?.id === action.payload.sessionId) {
        state.currentSession = null;
      }
    },

    restoreSession: (state, action: PayloadAction<{ readonly session: Session; readonly index: number; readonly wasCurrent: boolean }>) => {
      if (action.payload.index < 0) {
        state.sessions.unshift(action.payload.session);
      } else {
        state.sessions.splice(action.payload.index, 0, action.payload.session);
      }
      if (action.payload.wasCurrent) {
        state.currentSession = action.payload.session;
      }
    },

    clearAllSessions: (state) => {
      state.sessions = [];
      state.currentSession = null;
    },

    bumpSessionToTop: (state, action: PayloadAction<{ readonly sessionId: string }>) => {
      const sessionIndex = state.sessions.findIndex(s => s.id === action.payload.sessionId);
      if (sessionIndex !== -1) {
        const updatedSession = {
          ...state.sessions[sessionIndex],
          updated_at: new Date().toISOString(),
        };
        state.sessions.splice(sessionIndex, 1);
        state.sessions.unshift(updatedSession);
        if (state.currentSession?.id === action.payload.sessionId) {
          state.currentSession = updatedSession;
        }
      }
    },

    addNewSession: (state, action: PayloadAction<{ readonly sessionId: string; readonly name: string }>) => {
      const newSession: Session = {
        id: action.payload.sessionId,
        name: action.payload.name,
        latest_turn_number: 0,
        starred: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      state.sessions.unshift(newSession);
      state.currentSession = newSession;
      state.sessionsCount += 1;
    },

    fetchInitialDataRequest: (state) => {
      state.loading.user = true;
      state.loading.sessions = true;
    },

    fetchInitialDataSuccess: (state, action: PayloadAction<{ readonly user: User | null; readonly sessionsData: SessionsResponse | null }>) => {
      state.loading.user = false;
      state.loading.sessions = false;
      
      if (action.payload.user) {
        state.user = action.payload.user;
      }
      
      if (action.payload.sessionsData) {
        state.sessions = action.payload.sessionsData.results as Session[];
        state.sessionsCount = action.payload.sessionsData.count;
        state.pagination.sessions.page = action.payload.sessionsData.page;
        state.pagination.sessions.pageSize = action.payload.sessionsData.page_size;
        state.pagination.sessions.totalPages = action.payload.sessionsData.total_pages;
        state.pagination.sessions.totalCount = action.payload.sessionsData.total_count;
        state.pagination.sessions.hasNext = action.payload.sessionsData.has_next;
        state.pagination.sessions.hasPrevious = action.payload.sessionsData.has_previous;
      }
    },

    fetchInitialDataFailure: (state, action: PayloadAction<string>) => {
      state.loading.user = false;
      state.loading.sessions = false;
      state.error.user = action.payload;
    },


    setResponsiveState: (state, action: PayloadAction<{ readonly isTablet: boolean; readonly isMobile: boolean }>) => {
      state.isTablet = action.payload.isTablet;
      state.isMobile = action.payload.isMobile;
    },

    setSidebarCollapsed: (state, action: PayloadAction<boolean>) => {
      state.sidebarCollapsed = action.payload;
    },

    resetChat: () => initialState,
  },
});

export const {
  fetchSessionsRequest,
  fetchSessionsSuccess,
  fetchSessionsFailure,
  fetchMessagesRequest,
  fetchMessagesSuccess,
  fetchMessagesFailure,
  setCurrentSession,
  setLoadingCurrentSession,
  setCurrentSessionError,
  updateSessionName,
  updateSessionStarred,
  renameSessionRequest,
  toggleStarSessionRequest,
  deleteAllSessionsRequest,
  removeSession,
  restoreSession,
  clearAllSessions,
  bumpSessionToTop,
  addNewSession,
  fetchInitialDataRequest,
  fetchInitialDataSuccess,
  fetchInitialDataFailure,
  setResponsiveState,
  setSidebarCollapsed,
  resetChat,
} = chatSlice.actions;

export default chatSlice.reducer;
