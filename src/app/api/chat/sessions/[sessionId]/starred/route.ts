import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { toggleStarSession } from '@/lib/backend-api';
import { jsonWithTrace } from '@/app/api/chat/_shared/response';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> },
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

    const { sessionId } = await params;
    const body = await request.json();
    const { starred } = body;

    if (typeof starred !== 'boolean') {
      return NextResponse.json(
        { error: 'Invalid starred value provided' },
        { status: 400 },
      );
    }

    const result = await toggleStarSession(sessionId, userCookie.value, starred);

    if (!result.ok || !result.data) {
      return jsonWithTrace(
        { error: 'Failed to toggle star session' },
        { status: result.status || 500 },
        result.traceHeaders,
      );
    }

    return jsonWithTrace(result.data, undefined, result.traceHeaders);
  } catch (error) {
    console.error('Error in toggle star session API route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
