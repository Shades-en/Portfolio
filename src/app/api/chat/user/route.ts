import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { callBackendUser } from '@/lib/backend-api';
import { jsonWithTrace } from '@/app/api/chat/_shared/response';

export async function GET(): Promise<NextResponse> {
  const cookieStore = await cookies();
  const userCookie = cookieStore.get('user_cookie')?.value;

  if (!userCookie) {
    return NextResponse.json(null, { status: 404 });
  }

  const result = await callBackendUser(userCookie);

  if (!result.data) {
    return jsonWithTrace(null, { status: 404 }, result.traceHeaders);
  }

  return jsonWithTrace(result.data, undefined, result.traceHeaders);
}
