export const publicConfig = {
  publicUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://iqbalowais.com',
} as const;

export const serverConfig = {
  backendApiUrl: process.env.BACKEND_API_URL || 'http://0.0.0.0:8000/api',
} as const;
