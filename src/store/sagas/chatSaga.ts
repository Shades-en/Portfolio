import { all } from 'redux-saga/effects';
import { watchSessionSagas } from './chatSaga.session';
import { watchMessageSagas } from './chatSaga.message';
import { watchUserSagas } from './chatSaga.user';

export default function* chatSaga(): Generator {
  yield all([
    watchSessionSagas(),
    watchMessageSagas(),
    watchUserSagas(),
  ]);
}
