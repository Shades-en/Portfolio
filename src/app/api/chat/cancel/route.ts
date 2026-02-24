import { NextRequest, NextResponse } from 'next/server';
import { cancelChatGeneration } from '@/lib/backend-api';
import { jsonWithTrace } from '@/app/api/chat/_shared/response';

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const { session_id } = body;

    if (!session_id) {
      return NextResponse.json(
        { error: 'Session ID is required' },
        { status: 400 },
      );
    }

    const result = await cancelChatGeneration(session_id);

    if (!result.ok || !result.data) {
      return jsonWithTrace(
        { error: 'Failed to cancel chat generation' },
        { status: result.status || 500 },
        result.traceHeaders,
      );
    }

    return jsonWithTrace(result.data, undefined, result.traceHeaders);
  } catch (error) {
    console.error('Error in cancel API route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
