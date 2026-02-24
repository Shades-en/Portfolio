import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { callBackendAllSessions } from '@/lib/backend-api';
import { jsonWithTrace } from '@/app/api/chat/_shared/response';

export async function GET(): Promise<NextResponse> {
  try {
    const cookieStore = await cookies();
    const userCookie = cookieStore.get('user_cookie');

    if (!userCookie?.value) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 },
      );
    }

    const result = await callBackendAllSessions(userCookie.value);

    if (!result.ok || !result.data) {
      return jsonWithTrace(
        { error: 'Failed to fetch all sessions' },
        { status: result.status || 500 },
        result.traceHeaders,
      );
    }

    return jsonWithTrace(result.data, undefined, result.traceHeaders);
  } catch (error) {
    console.error('Error in all sessions API route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
