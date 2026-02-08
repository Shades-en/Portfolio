import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { toggleStarSession, callBackendUser } from '@/lib/backend-api';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
): Promise<NextResponse> {
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
      return NextResponse.json(
        { error: 'User not found' },
        { status: 401 }
      );
    }

    const { sessionId } = await params;
    const body = await request.json();
    const { starred } = body;

    if (typeof starred !== 'boolean') {
      return NextResponse.json(
        { error: 'Invalid starred value provided' },
        { status: 400 }
      );
    }

    const result = await toggleStarSession(sessionId, user.id, starred);

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
