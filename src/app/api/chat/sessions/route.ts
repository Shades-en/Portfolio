import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { callBackendSessions, deleteAllSessions } from '@/lib/backend-api';
import { jsonWithTrace } from '@/app/api/chat/_shared/response';

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const cookieStore = await cookies();
    const userCookie = cookieStore.get('user_cookie');

    if (!userCookie?.value) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 },
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const page = Number.parseInt(searchParams.get('page') || '1');
    const pageSize = Number.parseInt(searchParams.get('page_size') || '50');

    const result = await callBackendSessions(userCookie.value, page, pageSize);

    if (!result.ok || !result.data) {
      return jsonWithTrace(
        { error: 'Failed to fetch sessions' },
        { status: result.status || 500 },
        result.traceHeaders,
      );
    }

    return jsonWithTrace(result.data, undefined, result.traceHeaders);
  } catch (error) {
    console.error('Error in sessions API route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}

export async function DELETE(): Promise<NextResponse> {
  try {
    const cookieStore = await cookies();
    const userCookie = cookieStore.get('user_cookie');

    if (!userCookie?.value) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 },
      );
    }

    const result = await deleteAllSessions(userCookie.value);

    if (!result.ok || !result.data) {
      return jsonWithTrace(
        { error: 'Failed to delete all sessions' },
        { status: result.status || 500 },
        result.traceHeaders,
      );
    }

    return jsonWithTrace(result.data, undefined, result.traceHeaders);
  } catch (error) {
    console.error('Error in delete all sessions API route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
