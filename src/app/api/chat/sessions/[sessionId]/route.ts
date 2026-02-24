import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { deleteSession as deleteSessionFromBackend, callBackendSession } from '@/lib/backend-api';
import { jsonWithTrace } from '@/app/api/chat/_shared/response';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> },
): Promise<NextResponse> {
  try {
    const cookieStore = await cookies();
    const userCookie = cookieStore.get('user_cookie');

    if (!userCookie?.value) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { sessionId } = await params;
    const result = await callBackendSession(sessionId, userCookie.value);

    if (!result.ok || !result.data) {
      const status = result.status === 404 ? 404 : (result.status || 500);
      const error = status === 404 ? 'Session not found' : 'Failed to fetch session';
      return jsonWithTrace({ error }, { status }, result.traceHeaders);
    }

    return jsonWithTrace(result.data, undefined, result.traceHeaders);
  } catch (error) {
    console.error('Error in get session API route:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> },
): Promise<NextResponse> {
  try {
    const cookieStore = await cookies();
    const userCookie = cookieStore.get('user_cookie');

    if (!userCookie?.value) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { sessionId } = await params;
    const result = await deleteSessionFromBackend(sessionId, userCookie.value);

    if (!result.ok || !result.data) {
      return jsonWithTrace({ error: 'Failed to delete session' }, { status: result.status || 500 }, result.traceHeaders);
    }

    return jsonWithTrace(result.data, undefined, result.traceHeaders);
  } catch (error) {
    console.error('Error in delete session API route:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
