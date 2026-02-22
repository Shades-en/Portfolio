import { cache } from 'react';
import 'server-only';
import { serverConfig } from '@/config';
import type { User } from '@/types/chat';

export const callBackendUser = cache(async (cookieId: string): Promise<User | null> => {
  console.log('[backend-api] callBackendUser invoked');
  try {
    const response = await fetch(`${serverConfig.backendApiUrl}/users`, {
      headers: {
        accept: 'application/json',
        'x-cookie-id': cookieId,
      },
      cache: 'no-store',
    });

    if (response.status === 404) {
      return null;
    }

    if (!response.ok) {
      console.error('Failed to fetch user from backend:', response.status);
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error('Error calling backend user API:', error);
    return null;
  }
});
