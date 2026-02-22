import { all, call, put, takeLatest } from 'redux-saga/effects';
import { fetchInitialDataRequest, fetchInitialDataSuccess, fetchInitialDataFailure } from '@/store/slices/chatSlice';
import { fetchUser, fetchAllSessions } from '@/lib/api/chat';
import type { User, AllSessionsResponse } from '@/types/chat';

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

export function* watchUserSagas(): Generator {
  yield takeLatest(fetchInitialDataRequest.type, fetchInitialDataSaga);
}
