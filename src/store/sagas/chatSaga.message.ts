import { all, call, put, takeLatest } from 'redux-saga/effects';
import type { PayloadAction } from '@reduxjs/toolkit';
import { toast } from '@/hooks/use-toast';
import {
  fetchMessagesRequest,
  fetchMessagesSuccess,
  fetchMessagesFailure,
  updateMessageFeedbackRequest,
  updateMessageFeedbackSuccess,
  updateMessageFeedbackFailure,
} from '@/store/slices/chatSlice';
import { fetchMessages, updateMessageFeedback } from '@/lib/api/chat';
import type { MessagesResponse } from '@/types/chat';

function* fetchMessagesSaga(
  action: PayloadAction<{ readonly sessionId: string; readonly page: number; readonly pageSize: number }>
): Generator {
  try {
    const { sessionId, page, pageSize } = action.payload;
    const messagesData = (yield call(fetchMessages, sessionId, page, pageSize)) as MessagesResponse | null;

    if (messagesData) {
      yield put(fetchMessagesSuccess({
        page: messagesData.page,
        pageSize: messagesData.page_size,
        totalPages: messagesData.total_pages,
        totalCount: messagesData.total_count,
        hasNext: messagesData.has_next,
        hasPrevious: messagesData.has_previous,
      }));
    } else {
      yield put(fetchMessagesFailure('Failed to fetch messages'));
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error occurred';
    yield put(fetchMessagesFailure(message));
  }
}

function* updateMessageFeedbackSaga(
  action: PayloadAction<{
    readonly messageId: string;
    readonly feedback: 'liked' | 'disliked' | 'neutral';
    readonly previousFeedback: 'liked' | 'disliked' | 'neutral';
  }>
): Generator {
  try {
    const { messageId, feedback, previousFeedback } = action.payload;
    const success = (yield call(updateMessageFeedback, messageId, feedback)) as boolean;

    if (success) {
      yield put(updateMessageFeedbackSuccess({ messageId, feedback }));
      return;
    }

    yield put(updateMessageFeedbackFailure({
      messageId,
      previousFeedback,
      error: 'Failed to update feedback',
    }));
    toast({
      title: 'Failed to save feedback',
      description: 'Please try again.',
      variant: 'destructive',
    });
  } catch (error) {
    const { messageId, previousFeedback } = action.payload;
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';

    yield put(updateMessageFeedbackFailure({
      messageId,
      previousFeedback,
      error: errorMessage,
    }));
    toast({
      title: 'Failed to save feedback',
      description: 'Please try again.',
      variant: 'destructive',
    });
  }
}

export function* watchMessageSagas(): Generator {
  yield all([
    takeLatest(fetchMessagesRequest.type, fetchMessagesSaga),
    takeLatest(updateMessageFeedbackRequest.type, updateMessageFeedbackSaga),
  ]);
}
