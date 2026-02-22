import type { PayloadAction } from '@reduxjs/toolkit';
import type { Draft } from 'immer';
import type { User, Session, AllSessionsResponse } from '@/types/chat';
import type { ChatState } from './chatSlice.types';
import { initialState } from './chatSlice.initialState';

export const userReducers = {
  fetchInitialDataRequest: (state: Draft<ChatState>) => {
    state.loading.user = true;
    state.loading.sessions = true;
  },

  fetchInitialDataSuccess: (
    state: Draft<ChatState>,
    action: PayloadAction<{ readonly user: User | null; readonly sessionsData: AllSessionsResponse | null }>
  ) => {
    state.loading.user = false;
    state.loading.sessions = false;

    if (action.payload.user) {
      state.user = action.payload.user;
    }

    if (action.payload.sessionsData) {
      state.sessions = action.payload.sessionsData.results as Session[];
      state.sessionsCount = action.payload.sessionsData.count;
    }
  },

  fetchInitialDataFailure: (state: Draft<ChatState>, action: PayloadAction<string>) => {
    state.loading.user = false;
    state.loading.sessions = false;
    state.error.user = action.payload;
  },

  resetChat: () => initialState,
};
