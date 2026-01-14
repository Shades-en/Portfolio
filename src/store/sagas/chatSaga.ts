import { call, put, takeLatest, all } from 'redux-saga/effects';
import type { PayloadAction } from '@reduxjs/toolkit';
import {
  fetchSessionsRequest,
  fetchSessionsSuccess,
  fetchSessionsFailure,
  fetchMessagesRequest,
  fetchMessagesSuccess,
  fetchMessagesFailure,
} from '@/store/slices/chatSlice';
import { fetchSessions, fetchMessages } from '@/lib/api/chat';
import type { SessionsResponse, MessagesResponse } from '@/types/chat';

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

function* fetchMessagesSaga(
  action: PayloadAction<{ readonly sessionId: string; readonly page: number; readonly pageSize: number }>
): Generator {
  try {
    const { sessionId, page, pageSize } = action.payload;
    const messagesData = (yield call(fetchMessages, sessionId, page, pageSize)) as MessagesResponse | null;
    
    if (messagesData) {
      yield put(fetchMessagesSuccess(messagesData));
    } else {
      yield put(fetchMessagesFailure('Failed to fetch messages'));
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error occurred';
    yield put(fetchMessagesFailure(message));
  }
}

function* watchFetchSessions(): Generator {
  yield takeLatest(fetchSessionsRequest.type, fetchSessionsSaga);
}

function* watchFetchMessages(): Generator {
  yield takeLatest(fetchMessagesRequest.type, fetchMessagesSaga);
}

export default function* chatSaga(): Generator {
  yield all([
    watchFetchSessions(),
    watchFetchMessages(),
  ]);
}
