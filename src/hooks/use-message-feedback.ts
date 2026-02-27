import { useCallback, useState } from 'react';
import { useAppDispatch } from '@/store/hooks';
import { updateMessageFeedbackRequest } from '@/store/slices/chatSlice';
import { toast } from '@/hooks/use-toast';

type FeedbackType = 'liked' | 'disliked' | 'neutral';

interface UseMessageFeedbackProps {
  readonly messageId: string;
  readonly initialFeedback: FeedbackType;
}

interface UseMessageFeedbackReturn {
  readonly liked: boolean;
  readonly disliked: boolean;
  readonly handleLike: () => void;
  readonly handleDislike: () => void;
  readonly canSubmitFeedback: boolean;
}

export function useMessageFeedback({
  messageId,
  initialFeedback,
}: UseMessageFeedbackProps): UseMessageFeedbackReturn {
  const dispatch = useAppDispatch();
  const [currentFeedback, setCurrentFeedback] = useState<FeedbackType>(initialFeedback);

  const canSubmitFeedback = messageId.trim().length > 0;

  const submitFeedback = useCallback((newFeedback: FeedbackType) => {
    if (!canSubmitFeedback) {
      toast({
        title: 'Unable to save feedback',
        description: 'Please try again later.',
        variant: 'destructive',
      });
      return;
    }

    const previousFeedback = currentFeedback;
    setCurrentFeedback(newFeedback);

    dispatch(updateMessageFeedbackRequest({
      messageId,
      feedback: newFeedback,
      previousFeedback,
    }));
  }, [canSubmitFeedback, dispatch, messageId, currentFeedback]);

  const handleLike = useCallback(() => {
    const newFeedback: FeedbackType = currentFeedback === 'liked' ? 'neutral' : 'liked';
    submitFeedback(newFeedback);
  }, [currentFeedback, submitFeedback]);

  const handleDislike = useCallback(() => {
    const newFeedback: FeedbackType = currentFeedback === 'disliked' ? 'neutral' : 'disliked';
    submitFeedback(newFeedback);
  }, [currentFeedback, submitFeedback]);

  return {
    liked: currentFeedback === 'liked',
    disliked: currentFeedback === 'disliked',
    handleLike,
    handleDislike,
    canSubmitFeedback,
  };
}
