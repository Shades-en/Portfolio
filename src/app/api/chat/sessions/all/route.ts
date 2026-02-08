import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { callBackendAllSessions } from '@/lib/backend-api';

export async function GET(): Promise<NextResponse> {
  try {
    const cookieStore = await cookies();
    const userCookie = cookieStore.get('user_cookie');

    if (!userCookie?.value) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const data = await callBackendAllSessions(userCookie.value);
    
    if (!data) {
      return NextResponse.json(
        { error: 'Failed to fetch all sessions' },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in all sessions API route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
