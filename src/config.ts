export const publicConfig = {
  publicUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://iqbalowais.com',
} as const;

export const serverConfig = {
  backendApiUrl: process.env.BACKEND_API_URL || 'http://0.0.0.0:8000/api',
} as const;

export const chatConfig = {
  questionTopics: [
    'who I am',
    'my projects',
    'my experience',
    'my skills',
    'my accomplishments',
  ],
  requestTimeoutMs: 10000, // 10 seconds timeout for chat requests
  turnsBetweenChatName: 20,
  maxChatNameLength: 50,
  maxChatNameWords: 5,
} as const;

export const breakpoints = {
  mobile: 640,
  tablet: 950,
} as const;
