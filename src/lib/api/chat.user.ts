import type { User } from '@/types/chat';

export async function fetchUser(): Promise<User | null> {
  try {
    const response = await fetch('/api/chat/user', {
      headers: {
        accept: 'application/json',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching user:', error);
    return null;
  }
}
