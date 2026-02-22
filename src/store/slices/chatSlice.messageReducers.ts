import type { PayloadAction } from '@reduxjs/toolkit';
import type { Draft } from 'immer';
import type { ChatState } from './chatSlice.types';

export const messageReducers = {
  fetchMessagesRequest: (state: Draft<ChatState>, action: PayloadAction<{ readonly sessionId: string; readonly page: number; readonly pageSize: number }>) => {
    state.loading.messages = true;
    state.error.messages = null;
    state.pagination.messages.page = action.payload.page;
    state.pagination.messages.pageSize = action.payload.pageSize;
  },

  fetchMessagesSuccess: (
    state: Draft<ChatState>,
    action: PayloadAction<{
      readonly page: number;
      readonly pageSize: number;
      readonly totalPages: number;
      readonly totalCount: number;
      readonly hasNext: boolean;
      readonly hasPrevious: boolean;
    }>
  ) => {
    state.loading.messages = false;
    state.pagination.messages = action.payload;
    state.error.messages = null;
  },

  fetchMessagesFailure: (state: Draft<ChatState>, action: PayloadAction<string>) => {
    state.loading.messages = false;
    state.error.messages = action.payload;
  },

  updateMessageFeedbackRequest: (
    _state: Draft<ChatState>,
    _action: PayloadAction<{
      readonly messageId: string;
      readonly feedback: 'liked' | 'disliked' | 'neutral';
      readonly previousFeedback: 'liked' | 'disliked' | 'neutral';
    }>
  ) => {
    // Saga handles side effects; component handles optimistic UI.
  },

  updateMessageFeedbackSuccess: (
    _state: Draft<ChatState>,
    _action: PayloadAction<{ readonly messageId: string; readonly feedback: 'liked' | 'disliked' | 'neutral' }>
  ) => {
    // No reducer update required.
  },

  updateMessageFeedbackFailure: (
    _state: Draft<ChatState>,
    _action: PayloadAction<{
      readonly messageId: string;
      readonly previousFeedback: 'liked' | 'disliked' | 'neutral';
      readonly error: string;
    }>
  ) => {
    // Component reverts optimistic state when needed.
  },
};
