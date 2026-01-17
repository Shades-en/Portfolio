import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { User, Session, Message, SessionsResponse, MessagesResponse } from '@/types/chat';

interface ChatState {
  readonly user: User | null;
  readonly sessions: Session[];
  readonly sessionsCount: number;
  readonly currentSession: Session | null;
  readonly messages: Message[];
  readonly messagesCount: number;
  readonly isTablet: boolean;
  readonly isMobile: boolean;
  readonly loading: {
    readonly user: boolean;
    readonly sessions: boolean;
    readonly messages: boolean;
  };
  readonly error: {
    readonly user: string | null;
    readonly sessions: string | null;
    readonly messages: string | null;
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
  messages: [],
  messagesCount: 0,
  isTablet: false,
  isMobile: false,
  loading: {
    user: false,
    sessions: false,
    messages: false,
  },
  error: {
    user: null,
    sessions: null,
    messages: null,
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
    fetchMessagesSuccess: (state, action: PayloadAction<MessagesResponse>) => {
      state.loading.messages = false;
      const newMessages = action.payload.results as Message[];
      
      if (action.payload.page === 1) {
        state.messages = newMessages;
      } else {
        state.messages = [...state.messages, ...newMessages];
      }
      
      state.messagesCount = action.payload.count;
      state.pagination.messages.page = action.payload.page;
      state.pagination.messages.pageSize = action.payload.page_size;
      state.pagination.messages.totalPages = action.payload.total_pages;
      state.pagination.messages.totalCount = action.payload.total_count;
      state.pagination.messages.hasNext = action.payload.has_next;
      state.pagination.messages.hasPrevious = action.payload.has_previous;
      state.error.messages = null;
    },
    fetchMessagesFailure: (state, action: PayloadAction<string>) => {
      state.loading.messages = false;
      state.error.messages = action.payload;
    },

    setCurrentSession: (state, action: PayloadAction<Session | null>) => {
      state.currentSession = action.payload;
      state.messages = [];
      state.messagesCount = 0;
      state.pagination.messages.page = 1;
      state.pagination.messages.totalPages = 0;
      state.pagination.messages.totalCount = 0;
      state.pagination.messages.hasNext = false;
      state.pagination.messages.hasPrevious = false;
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

    deleteSessionRequest: (state, action: PayloadAction<{ readonly sessionId: string }>) => {
      // Saga will handle the API call
    },

    deleteAllSessionsRequest: (state) => {
      // Saga will handle the API call
    },

    removeSession: (state, action: PayloadAction<{ readonly sessionId: string }>) => {
      state.sessions = state.sessions.filter(s => s.id !== action.payload.sessionId);
      if (state.currentSession?.id === action.payload.sessionId) {
        state.currentSession = null;
        state.messages = [];
        state.messagesCount = 0;
      }
    },

    clearAllSessions: (state) => {
      state.sessions = [];
      state.currentSession = null;
      state.messages = [];
      state.messagesCount = 0;
    },

    resetMessages: (state) => {
      state.messages = [];
      state.messagesCount = 0;
      state.pagination.messages.page = 1;
      state.pagination.messages.totalPages = 0;
      state.pagination.messages.totalCount = 0;
      state.pagination.messages.hasNext = false;
      state.pagination.messages.hasPrevious = false;
      state.error.messages = null;
    },

    hydrateUserAndSessions: (state, action: PayloadAction<{ readonly user: User | null; readonly sessionsData: SessionsResponse | null }>) => {
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

    hydrateMessages: (state, action: PayloadAction<MessagesResponse>) => {
      state.messages = action.payload.results as Message[];
      state.messagesCount = action.payload.count;
      state.pagination.messages.page = action.payload.page;
      state.pagination.messages.pageSize = action.payload.page_size;
      state.pagination.messages.totalPages = action.payload.total_pages;
      state.pagination.messages.totalCount = action.payload.total_count;
      state.pagination.messages.hasNext = action.payload.has_next;
      state.pagination.messages.hasPrevious = action.payload.has_previous;
      state.loading.messages = false;
      state.error.messages = null;
    },

    setResponsiveState: (state, action: PayloadAction<{ readonly isTablet: boolean; readonly isMobile: boolean }>) => {
      state.isTablet = action.payload.isTablet;
      state.isMobile = action.payload.isMobile;
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
  updateSessionName,
  updateSessionStarred,
  renameSessionRequest,
  toggleStarSessionRequest,
  deleteSessionRequest,
  deleteAllSessionsRequest,
  removeSession,
  clearAllSessions,
  resetMessages,
  hydrateUserAndSessions,
  hydrateMessages,
  setResponsiveState,
  resetChat,
} = chatSlice.actions;

export default chatSlice.reducer;
