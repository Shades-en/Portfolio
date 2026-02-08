import { call, put, takeLatest, all } from 'redux-saga/effects';
import type { PayloadAction } from '@reduxjs/toolkit';
import {
  fetchSessionsRequest,
  fetchSessionsSuccess,
  fetchSessionsFailure,
  fetchAllSessionsRequest,
  fetchAllSessionsSuccess,
  fetchAllSessionsFailure,
  fetchMessagesRequest,
  fetchMessagesSuccess,
  fetchMessagesFailure,
  renameSessionRequest,
  updateSessionName,
  toggleStarSessionRequest,
  updateSessionStarred,
  deleteAllSessionsRequest,
  clearAllSessions,
  fetchInitialDataRequest,
  fetchInitialDataSuccess,
  fetchInitialDataFailure,
  fetchCurrentSessionRequest,
  fetchCurrentSessionSuccess,
  fetchCurrentSessionFailure,
} from '@/store/slices/chatSlice';
import { fetchUser, fetchSessions, fetchAllSessions, fetchMessages, renameSession, toggleStarSession, deleteAllSessions, fetchSession } from '@/lib/api/chat';
import type { User, SessionsResponse, MessagesResponse, AllSessionsResponse } from '@/types/chat';

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

function* fetchMessagesSaga(
  action: PayloadAction<{ readonly sessionId: string; readonly page: number; readonly pageSize: number }>
): Generator {
  try {
    const { sessionId, page, pageSize } = action.payload;
    const messagesData = (yield call(fetchMessages, sessionId, page, pageSize)) as MessagesResponse | null;
    
    if (messagesData) {
      // Update pagination metadata in Redux
      yield put(fetchMessagesSuccess({
        page: messagesData.page,
        pageSize: messagesData.page_size,
        totalPages: messagesData.total_pages,
        totalCount: messagesData.total_count,
        hasNext: messagesData.has_next,
        hasPrevious: messagesData.has_previous,
      }));
      // Note: Actual messages are synced to AI SDK in the component
      // This saga only manages pagination metadata
    } else {
      yield put(fetchMessagesFailure('Failed to fetch messages'));
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error occurred';
    yield put(fetchMessagesFailure(message));
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

function* watchFetchSessions(): Generator {
  yield takeLatest(fetchSessionsRequest.type, fetchSessionsSaga); // need for client side pagination
}

function* watchFetchMessages(): Generator {
  yield takeLatest(fetchMessagesRequest.type, fetchMessagesSaga); // need for client side pagination
}

function* watchRenameSession(): Generator {
  yield takeLatest(renameSessionRequest.type, renameSessionSaga);
}

function* watchToggleStarSession(): Generator {
  yield takeLatest(toggleStarSessionRequest.type, toggleStarSessionSaga);
}

function* watchDeleteAllSessions(): Generator {
  yield takeLatest(deleteAllSessionsRequest.type, deleteAllSessionsSaga);
}

function* fetchInitialDataSaga(): Generator {
  try {
    const [userData, sessionsData] = (yield all([
      call(fetchUser),
      call(fetchAllSessions),
    ])) as [User | null, AllSessionsResponse | null];

    yield put(fetchInitialDataSuccess({ user: userData, sessionsData }));
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch initial data';
    yield put(fetchInitialDataFailure(message));
  }
}

function* watchFetchInitialData(): Generator {
  yield takeLatest(fetchInitialDataRequest.type, fetchInitialDataSaga);
}

function* fetchCurrentSessionSaga(action: PayloadAction<string>): Generator {
  try {
    const sessionId = action.payload;
    const sessionData = (yield call(fetchSession, sessionId)) as any;
    
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

function* watchFetchCurrentSession(): Generator {
  yield takeLatest(fetchCurrentSessionRequest.type, fetchCurrentSessionSaga);
}

function* watchFetchAllSessions(): Generator {
  yield takeLatest(fetchAllSessionsRequest.type, fetchAllSessionsSaga);
}

export default function* chatSaga(): Generator {
  yield all([
    watchFetchSessions(),
    watchFetchAllSessions(),
    watchFetchMessages(),
    watchRenameSession(),
    watchToggleStarSession(),
    watchDeleteAllSessions(),
    watchFetchInitialData(),
    watchFetchCurrentSession(),
  ]);
}
