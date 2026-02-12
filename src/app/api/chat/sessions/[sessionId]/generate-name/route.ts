import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { generateSessionName, callBackendUser } from '@/lib/backend-api';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
): Promise<NextResponse> {
  try {
    const cookieStore = await cookies();
    const userCookie = cookieStore.get('user_cookie');

    if (!userCookie?.value) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const user = await callBackendUser(userCookie.value);
    if (!user?.id) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 401 }
      );
    }

    const { sessionId } = await params;
    const body = await request.json();
    const { query, turns_between_chat_name, max_chat_name_length, max_chat_name_words } = body;

    const result = await generateSessionName(sessionId, user.id, {
      query: query ?? '',
      turnsBetweenChatName: turns_between_chat_name,
      maxChatNameLength: max_chat_name_length,
      maxChatNameWords: max_chat_name_words,
    });

    if (!result) {
      return NextResponse.json(
        { error: 'Failed to generate session name' },
        { status: 500 }
      );
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in generate-name API route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
