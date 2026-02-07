import { NextRequest, NextResponse } from 'next/server';
import { deleteSession as deleteSessionFromBackend, callBackendSession } from '@/lib/backend-api';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
): Promise<NextResponse> {
  try {
    const { sessionId } = await params;
    const session = await callBackendSession(sessionId);

    if (!session) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }

    return NextResponse.json(session);
  } catch (error) {
    console.error('Error in get session API route:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
): Promise<NextResponse> {
  try {
    const { sessionId } = await params;

    const result = await deleteSessionFromBackend(sessionId);

    if (!result) {
      return NextResponse.json({ error: 'Failed to delete session' }, { status: 500 });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in delete session API route:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
