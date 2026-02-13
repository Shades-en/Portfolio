import { NextRequest, NextResponse } from 'next/server';
import { cancelChatGeneration } from '@/lib/backend-api';

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const { session_id } = body;

    if (!session_id) {
      return NextResponse.json(
        { error: 'Session ID is required' },
        { status: 400 }
      );
    }

    const result = await cancelChatGeneration(session_id);

    if (!result) {
      return NextResponse.json(
        { error: 'Failed to cancel chat generation' },
        { status: 500 }
      );
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in cancel API route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
