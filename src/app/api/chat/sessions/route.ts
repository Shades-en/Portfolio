import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { callBackendSessions, deleteAllSessions, callBackendUser } from '@/lib/backend-api';

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const cookieStore = await cookies();
    const userCookie = cookieStore.get('user_cookie');

    if (!userCookie?.value) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const page = Number.parseInt(searchParams.get('page') || '1');
    const pageSize = Number.parseInt(searchParams.get('page_size') || '50');

    const data = await callBackendSessions(userCookie.value, page, pageSize);
    
    if (!data) {
      return NextResponse.json(
        { error: 'Failed to fetch sessions' },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in sessions API route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
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
        { status: 401 }
      );
    }

    const user = await callBackendUser(userCookie.value);
    
    if (!user?.id) {
      return NextResponse.json({ error: 'Failed to get user information' }, { status: 500 });
    }

    const result = await deleteAllSessions(user.id);

    if (!result) {
      return NextResponse.json({ error: 'Failed to delete all sessions' }, { status: 500 });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in delete all sessions API route:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
