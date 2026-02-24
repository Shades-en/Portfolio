import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { generateSessionName } from '@/lib/backend-api';
import { jsonWithTrace } from '@/app/api/chat/_shared/response';

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const cookieStore = await cookies();
    const userCookie = cookieStore.get('user_cookie');

    if (!userCookie?.value) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 },
      );
    }

    const body = await request.json();
    const { query, session_id, turns_between_chat_name, max_chat_name_length, max_chat_name_words } = body;

    if (!query && !session_id) {
      return NextResponse.json(
        { error: 'Query is required when session_id is not provided' },
        { status: 400 },
      );
    }

    const result = await generateSessionName({
      cookieId: userCookie.value,
      query,
      sessionId: session_id,
      turnsBetweenChatName: turns_between_chat_name,
      maxChatNameLength: max_chat_name_length,
      maxChatNameWords: max_chat_name_words,
    });

    if (!result.ok || !result.data) {
      return jsonWithTrace(
        { error: 'Failed to generate session name' },
        { status: result.status || 500 },
        result.traceHeaders,
      );
    }

    return jsonWithTrace(result.data, undefined, result.traceHeaders);
  } catch (error) {
    console.error('Error in generate-name API route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
