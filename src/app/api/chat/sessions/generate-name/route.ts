import { NextRequest, NextResponse } from 'next/server';
import { generateNewSessionName } from '@/lib/backend-api';

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const { query, turns_between_chat_name, max_chat_name_length, max_chat_name_words } = body;

    if (!query) {
      return NextResponse.json(
        { error: 'Query is required' },
        { status: 400 }
      );
    }

    const result = await generateNewSessionName({
      query,
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
