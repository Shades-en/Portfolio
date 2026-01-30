import { call, put, takeLatest, all } from 'redux-saga/effects';
import type { PayloadAction } from '@reduxjs/toolkit';
import {
  fetchSessionsRequest,
  fetchSessionsSuccess,
  fetchSessionsFailure,
  fetchMessagesRequest,
  fetchMessagesSuccess,
  fetchMessagesFailure,
  renameSessionRequest,
  updateSessionName,
  toggleStarSessionRequest,
  updateSessionStarred,
  deleteSessionRequest,
  removeSession,
  deleteAllSessionsRequest,
  clearAllSessions,
} from '@/store/slices/chatSlice';
import { fetchSessions, fetchMessages, renameSession, toggleStarSession, deleteSession, deleteAllSessions } from '@/lib/api/chat';
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

function* deleteSessionSaga(
  action: PayloadAction<{ readonly sessionId: string }>
): Generator {
  try {
    const { sessionId } = action.payload;
    const success = (yield call(deleteSession, sessionId)) as boolean;
    
    if (success) {
      yield put(removeSession({ sessionId }));
    } else {
      console.error('Failed to delete session');
    }
  } catch (error) {
    console.error('Error in delete session saga:', error);
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

function* watchDeleteSession(): Generator {
  yield takeLatest(deleteSessionRequest.type, deleteSessionSaga);
}

function* watchDeleteAllSessions(): Generator {
  yield takeLatest(deleteAllSessionsRequest.type, deleteAllSessionsSaga);
}

export default function* chatSaga(): Generator {
  yield all([
    watchFetchSessions(),
    watchFetchMessages(),
    watchRenameSession(),
    watchToggleStarSession(),
    watchDeleteSession(),
    watchDeleteAllSessions(),
  ]);
}
