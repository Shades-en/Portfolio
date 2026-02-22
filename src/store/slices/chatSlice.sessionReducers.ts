import type { PayloadAction } from '@reduxjs/toolkit';
import type { Draft } from 'immer';
import type { Session, SessionsResponse, AllSessionsResponse } from '@/types/chat';
import type { ChatState } from './chatSlice.types';

export const sessionReducers = {
  fetchSessionsRequest: (state: Draft<ChatState>, action: PayloadAction<{ readonly page: number; readonly pageSize: number }>) => {
    state.loading.sessions = true;
    state.error.sessions = null;
    state.pagination.sessions.page = action.payload.page;
    state.pagination.sessions.pageSize = action.payload.pageSize;
  },

  fetchSessionsSuccess: (state: Draft<ChatState>, action: PayloadAction<SessionsResponse>) => {
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

  fetchSessionsFailure: (state: Draft<ChatState>, action: PayloadAction<string>) => {
    state.loading.sessions = false;
    state.error.sessions = action.payload;
  },

  fetchAllSessionsRequest: (state: Draft<ChatState>) => {
    state.loading.sessions = true;
    state.error.sessions = null;
  },

  fetchAllSessionsSuccess: (state: Draft<ChatState>, action: PayloadAction<AllSessionsResponse>) => {
    state.loading.sessions = false;
    state.sessions = action.payload.results as Session[];
    state.sessionsCount = action.payload.count;
    state.error.sessions = null;
  },

  fetchAllSessionsFailure: (state: Draft<ChatState>, action: PayloadAction<string>) => {
    state.loading.sessions = false;
    state.error.sessions = action.payload;
  },

  setCurrentSession: (state: Draft<ChatState>, action: PayloadAction<Session | null>) => {
    state.currentSession = action.payload;
    state.error.currentSession = null;
    state.pagination.messages.page = 1;
    state.pagination.messages.totalPages = 0;
    state.pagination.messages.totalCount = 0;
    state.pagination.messages.hasNext = false;
    state.pagination.messages.hasPrevious = false;
  },

  fetchCurrentSessionRequest: (state: Draft<ChatState>, _action: PayloadAction<string>) => {
    state.loading.currentSession = true;
    state.error.currentSession = null;
  },

  fetchCurrentSessionSuccess: (state: Draft<ChatState>, action: PayloadAction<Session>) => {
    state.currentSession = action.payload;
    state.loading.currentSession = false;
    state.error.currentSession = null;
  },

  fetchCurrentSessionFailure: (state: Draft<ChatState>, action: PayloadAction<string>) => {
    state.error.currentSession = action.payload;
    state.loading.currentSession = false;
  },

  setLoadingCurrentSession: (state: Draft<ChatState>, action: PayloadAction<boolean>) => {
    state.loading.currentSession = action.payload;
  },

  setCurrentSessionError: (state: Draft<ChatState>, action: PayloadAction<string | null>) => {
    state.error.currentSession = action.payload;
    state.loading.currentSession = false;
  },

  updateSessionName: (state: Draft<ChatState>, action: PayloadAction<{ readonly sessionId: string; readonly name: string }>) => {
    const sessionIndex = state.sessions.findIndex((session) => session.id === action.payload.sessionId);
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

  setPendingSessionName: (state: Draft<ChatState>, action: PayloadAction<{ readonly sessionId: string; readonly name: string }>) => {
    state.pendingSessionName = {
      sessionId: action.payload.sessionId,
      name: action.payload.name,
    };
  },

  clearPendingSessionName: (state: Draft<ChatState>) => {
    state.pendingSessionName = null;
  },

  updateSessionStarred: (state: Draft<ChatState>, action: PayloadAction<{ readonly sessionId: string; readonly starred: boolean }>) => {
    const sessionIndex = state.sessions.findIndex((session) => session.id === action.payload.sessionId);
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

  renameSessionRequest: (_state: Draft<ChatState>, _action: PayloadAction<{ readonly sessionId: string; readonly name: string }>) => {
    // Saga handles side effects.
  },

  toggleStarSessionRequest: (_state: Draft<ChatState>, _action: PayloadAction<{ readonly sessionId: string; readonly starred: boolean }>) => {
    // Saga handles side effects.
  },

  deleteAllSessionsRequest: (_state: Draft<ChatState>) => {
    // Saga handles side effects.
  },

  generateSessionNameRequest: (
    _state: Draft<ChatState>,
    _action: PayloadAction<{
      readonly sessionId: string | null;
      readonly query: string;
      readonly isNewSession: boolean;
      readonly turnNumber: number;
    }>
  ) => {
    // Saga handles side effects.
  },

  removeSession: (state: Draft<ChatState>, action: PayloadAction<{ readonly sessionId: string }>) => {
    state.sessions = state.sessions.filter((session) => session.id !== action.payload.sessionId);
    if (state.currentSession?.id === action.payload.sessionId) {
      state.currentSession = null;
    }
  },

  restoreSession: (state: Draft<ChatState>, action: PayloadAction<{ readonly session: Session; readonly index: number; readonly wasCurrent: boolean }>) => {
    if (action.payload.index < 0) {
      state.sessions.unshift(action.payload.session);
    } else {
      state.sessions.splice(action.payload.index, 0, action.payload.session);
    }

    if (action.payload.wasCurrent) {
      state.currentSession = action.payload.session;
    }
  },

  clearAllSessions: (state: Draft<ChatState>) => {
    state.sessions = [];
    state.currentSession = null;
  },

  bumpSessionToTop: (state: Draft<ChatState>, action: PayloadAction<{ readonly sessionId: string }>) => {
    const sessionIndex = state.sessions.findIndex((session) => session.id === action.payload.sessionId);
    if (sessionIndex === -1) {
      return;
    }

    const updatedSession = {
      ...state.sessions[sessionIndex],
      updated_at: new Date().toISOString(),
    };

    state.sessions.splice(sessionIndex, 1);
    state.sessions.unshift(updatedSession);

    if (state.currentSession?.id === action.payload.sessionId) {
      state.currentSession = updatedSession;
    }
  },

  addNewSession: (state: Draft<ChatState>, action: PayloadAction<{ readonly sessionId: string; readonly name: string }>) => {
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

  setResponsiveState: (state: Draft<ChatState>, action: PayloadAction<{ readonly isTablet: boolean; readonly isMobile: boolean }>) => {
    state.isTablet = action.payload.isTablet;
    state.isMobile = action.payload.isMobile;
  },

  setSidebarCollapsed: (state: Draft<ChatState>, action: PayloadAction<boolean>) => {
    state.sidebarCollapsed = action.payload;
  },
};
