import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

function generateUserCookie(): string {
  return `user_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
}

export function middleware(request: NextRequest): NextResponse {
  const response = NextResponse.next();
  
  const userCookie = request.cookies.get('user_cookie');
  const isNewUser = !userCookie;
  
  if (isNewUser && request.nextUrl.pathname.startsWith('/chat')) {
    const newUserCookie = generateUserCookie();
    response.cookies.set('user_cookie', newUserCookie, {
      maxAge: 60 * 60 * 24 * 365,
      path: '/',
      sameSite: 'lax',
      httpOnly: false,
    });
    response.headers.set('x-is-new-user', 'true');
  } else {
    response.headers.set('x-is-new-user', 'false');
  }
  
  return response;
}

export const config = {
  matcher: '/chat/:path*',
};
