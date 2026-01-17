import { NextRequest, NextResponse } from 'next/server';
import { toggleStarSession } from '@/lib/backend-api';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
): Promise<NextResponse> {
  try {
    const { sessionId } = await params;
    const body = await request.json();
    const { starred } = body;

    if (typeof starred !== 'boolean') {
      return NextResponse.json(
        { error: 'Invalid starred value provided' },
        { status: 400 }
      );
    }

    const result = await toggleStarSession(sessionId, starred);

    if (!result) {
      return NextResponse.json(
        { error: 'Failed to toggle star session' },
        { status: 500 }
      );
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in toggle star session API route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
