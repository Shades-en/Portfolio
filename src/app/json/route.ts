import personalInfo from '@/data/personal-info.json';

export type PersonalInfo = typeof personalInfo;
export type PublicPersonalInfo = Omit<PersonalInfo, 'seo'>;

export async function GET(): Promise<Response> {
  const { seo, ...publicData } = personalInfo;

  return Response.json(publicData as PublicPersonalInfo, {
    headers: {
      // Cache for 5 minutes at the edge/CDN and allow SWR for 10 minutes
      'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
    },
  });
}
