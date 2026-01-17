import { NextRequest, NextResponse } from 'next/server';
import { renameSession } from '@/lib/backend-api';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
): Promise<NextResponse> {
  try {
    const { sessionId } = await params;
    const body = await request.json();
    const { name } = body;

    if (!name || typeof name !== 'string') {
      return NextResponse.json(
        { error: 'Invalid name provided' },
        { status: 400 }
      );
    }

    const updatedSession = await renameSession(sessionId, name);

    if (!updatedSession) {
      return NextResponse.json(
        { error: 'Failed to rename session' },
        { status: 500 }
      );
    }

    return NextResponse.json(updatedSession);
  } catch (error) {
    console.error('Error in rename session API route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
