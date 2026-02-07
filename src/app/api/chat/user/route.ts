import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { callBackendUser } from '@/lib/backend-api';

export async function GET(): Promise<NextResponse> {
  const cookieStore = await cookies();
  const userCookie = cookieStore.get('user_cookie')?.value;

  if (!userCookie) {
    return NextResponse.json(null, { status: 404 });
  }

  const user = await callBackendUser(userCookie);
  
  if (!user) {
    return NextResponse.json(null, { status: 404 });
  }

  return NextResponse.json(user);
}
