import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { updateMessageFeedback } from '@/lib/backend-api';
import { jsonWithTrace } from '@/app/api/chat/_shared/response';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ messageId: string }> },
): Promise<NextResponse> {
  try {
    const cookieStore = await cookies();
    const userCookie = cookieStore.get('user_cookie');

    if (!userCookie?.value) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 },
      );
    }

    const { messageId } = await params;
    const body = await request.json();
    const { feedback } = body;

    if (!['liked', 'disliked', 'neutral'].includes(feedback)) {
      return NextResponse.json(
        { error: 'Invalid feedback value. Must be "liked", "disliked", or "neutral"' },
        { status: 400 },
      );
    }

    const result = await updateMessageFeedback(messageId, userCookie.value, feedback);

    if (!result.ok || !result.data) {
      return jsonWithTrace(
        { error: 'Failed to update message feedback' },
        { status: result.status || 500 },
        result.traceHeaders,
      );
    }

    return jsonWithTrace(result.data, undefined, result.traceHeaders);
  } catch (error) {
    console.error('Error in message feedback API route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
