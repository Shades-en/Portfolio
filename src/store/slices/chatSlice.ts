import { createSlice } from '@reduxjs/toolkit';
import { initialState } from './chatSlice.initialState';
import { userReducers } from './chatSlice.userReducers';
import { sessionReducers } from './chatSlice.sessionReducers';
import { messageReducers } from './chatSlice.messageReducers';

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    ...userReducers,
    ...sessionReducers,
    ...messageReducers,
  },
});

export const {
  fetchSessionsRequest,
  fetchSessionsSuccess,
  fetchSessionsFailure,
  fetchAllSessionsRequest,
  fetchAllSessionsSuccess,
  fetchAllSessionsFailure,
  fetchMessagesRequest,
  fetchMessagesSuccess,
  fetchMessagesFailure,
  setCurrentSession,
  fetchCurrentSessionRequest,
  fetchCurrentSessionSuccess,
  fetchCurrentSessionFailure,
  setLoadingCurrentSession,
  setCurrentSessionError,
  updateSessionName,
  setPendingSessionName,
  clearPendingSessionName,
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
  updateMessageFeedbackRequest,
  updateMessageFeedbackSuccess,
  updateMessageFeedbackFailure,
  generateSessionNameRequest,
  resetChat,
} = chatSlice.actions;

export default chatSlice.reducer;
