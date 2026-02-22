import { all, call, put, takeLatest } from 'redux-saga/effects';
import type { PayloadAction } from '@reduxjs/toolkit';
import {
  fetchSessionsRequest,
  fetchSessionsSuccess,
  fetchSessionsFailure,
  fetchAllSessionsRequest,
  fetchAllSessionsSuccess,
  fetchAllSessionsFailure,
  fetchCurrentSessionRequest,
  fetchCurrentSessionSuccess,
  fetchCurrentSessionFailure,
  renameSessionRequest,
  updateSessionName,
  toggleStarSessionRequest,
  updateSessionStarred,
  deleteAllSessionsRequest,
  clearAllSessions,
  generateSessionNameRequest,
  setPendingSessionName,
} from '@/store/slices/chatSlice';
import {
  fetchSessions,
  fetchAllSessions,
  fetchSession,
  renameSession,
  toggleStarSession,
  deleteAllSessions,
  generateSessionName,
} from '@/lib/api/chat';
import { chatConfig } from '@/config';
import type { Session, SessionsResponse, AllSessionsResponse } from '@/types/chat';
import type { GenerateNameResponse } from '@/lib/api/chat';

function* fetchSessionsSaga(
  action: PayloadAction<{ readonly page: number; readonly pageSize: number }>
): Generator {
  try {
    const { page, pageSize } = action.payload;
    const sessionsData = (yield call(fetchSessions, page, pageSize)) as SessionsResponse | null;

    if (sessionsData) {
      yield put(fetchSessionsSuccess(sessionsData));
    } else {
      yield put(fetchSessionsFailure('Failed to fetch sessions'));
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error occurred';
    yield put(fetchSessionsFailure(message));
  }
}

function* fetchAllSessionsSaga(): Generator {
  try {
    const sessionsData = (yield call(fetchAllSessions)) as AllSessionsResponse | null;

    if (sessionsData) {
      yield put(fetchAllSessionsSuccess(sessionsData));
    } else {
      yield put(fetchAllSessionsFailure('Failed to fetch all sessions'));
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error occurred';
    yield put(fetchAllSessionsFailure(message));
  }
}

function* fetchCurrentSessionSaga(action: PayloadAction<string>): Generator {
  try {
    const sessionId = action.payload;
    const sessionData = (yield call(fetchSession, sessionId)) as Session | null;

    if (!sessionData) {
      yield put(fetchCurrentSessionFailure('not_found'));
      return;
    }

    yield put(fetchCurrentSessionSuccess(sessionData));
  } catch (error) {
    const message = error instanceof Error ? error.message : 'server_error';
    yield put(fetchCurrentSessionFailure(message));
  }
}

function* renameSessionSaga(
  action: PayloadAction<{ readonly sessionId: string; readonly name: string }>
): Generator {
  try {
    const { sessionId, name } = action.payload;
    const success = (yield call(renameSession, sessionId, name)) as boolean;

    if (success) {
      yield put(updateSessionName({ sessionId, name }));
    } else {
      console.error('Failed to rename session');
    }
  } catch (error) {
    console.error('Error in rename session saga:', error);
  }
}

function* toggleStarSessionSaga(
  action: PayloadAction<{ readonly sessionId: string; readonly starred: boolean }>
): Generator {
  try {
    const { sessionId, starred } = action.payload;
    const success = (yield call(toggleStarSession, sessionId, starred)) as boolean;

    if (success) {
      yield put(updateSessionStarred({ sessionId, starred }));
    } else {
      console.error('Failed to toggle star session');
    }
  } catch (error) {
    console.error('Error in toggle star session saga:', error);
  }
}

function* deleteAllSessionsSaga(): Generator {
  try {
    const success = (yield call(deleteAllSessions)) as boolean;

    if (success) {
      yield put(clearAllSessions());
    } else {
      console.error('Failed to delete all sessions');
    }
  } catch (error) {
    console.error('Error in delete all sessions saga:', error);
  }
}

function* generateSessionNameSaga(
  action: PayloadAction<{
    readonly sessionId: string | null;
    readonly query: string;
    readonly isNewSession: boolean;
    readonly turnNumber: number;
  }>
): Generator {
  try {
    const { sessionId, query, isNewSession, turnNumber } = action.payload;
    const { turnsBetweenChatName, maxChatNameLength, maxChatNameWords } = chatConfig;

    const shouldGenerateName = isNewSession || (turnNumber > 0 && turnNumber % turnsBetweenChatName === 0);
    if (!shouldGenerateName) {
      return;
    }

    const result = (yield call(generateSessionName, {
      query,
      sessionId: sessionId ?? undefined,
      turnsBetweenChatName,
      maxChatNameLength,
      maxChatNameWords,
    })) as GenerateNameResponse | null;

    if (result?.name) {
      const targetSessionId = sessionId ?? result.session_id;
      if (targetSessionId) {
        yield put(updateSessionName({ sessionId: targetSessionId, name: result.name }));
        yield put(setPendingSessionName({ sessionId: targetSessionId, name: result.name }));
      }
    }
  } catch (error) {
    console.error('Error in generate session name saga:', error);
  }
}

export function* watchSessionSagas(): Generator {
  yield all([
    takeLatest(fetchSessionsRequest.type, fetchSessionsSaga),
    takeLatest(fetchAllSessionsRequest.type, fetchAllSessionsSaga),
    takeLatest(fetchCurrentSessionRequest.type, fetchCurrentSessionSaga),
    takeLatest(renameSessionRequest.type, renameSessionSaga),
    takeLatest(toggleStarSessionRequest.type, toggleStarSessionSaga),
    takeLatest(deleteAllSessionsRequest.type, deleteAllSessionsSaga),
    takeLatest(generateSessionNameRequest.type, generateSessionNameSaga),
  ]);
}
