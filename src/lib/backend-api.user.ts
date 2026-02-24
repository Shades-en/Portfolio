import 'server-only';
import { serverConfig } from '@/config';
import type { User } from '@/types/chat';
import { pickTraceHeaders } from '@/lib/trace-headers';
import type { BackendApiResult } from './backend-api.types';

export async function callBackendUser(cookieId: string): Promise<BackendApiResult<User>> {
  console.log('[backend-api] callBackendUser invoked');

  try {
    const response = await fetch(`${serverConfig.backendApiUrl}/users`, {
      headers: {
        accept: 'application/json',
        'x-cookie-id': cookieId,
      },
      cache: 'no-store',
    });

    const traceHeaders = pickTraceHeaders(response.headers);

    if (!response.ok) {
      if (response.status !== 404) {
        console.error('Failed to fetch user from backend:', response.status);
      }
      return {
        data: null,
        ok: false,
        status: response.status,
        traceHeaders,
      };
    }

    return {
      data: (await response.json()) as User,
      ok: true,
      status: response.status,
      traceHeaders,
    };
  } catch (error) {
    console.error('Error calling backend user API:', error);
    return {
      data: null,
      ok: false,
      status: 500,
      traceHeaders: {},
    };
  }
}
