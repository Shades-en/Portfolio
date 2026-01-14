import { all } from 'redux-saga/effects';
import chatSaga from './chatSaga';

export default function* rootSaga(): Generator {
  yield all([
    chatSaga(),
  ]);
}
