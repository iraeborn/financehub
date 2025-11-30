import { db } from '@/lib/db';

export async function getDashboard(userId: string) {
  if (!userId) {
    return { error: 'User ID required', status: 400 };
  }

  try {
    const data = await db.dashboard.findMany({
      where: { userId },
    });

    return { data, status: 200 };
  } catch (error) {
    return { error: 'Internal server error', status: 500 };
  }
}
