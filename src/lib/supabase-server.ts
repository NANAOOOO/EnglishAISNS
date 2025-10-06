import { cookies } from 'next/headers';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';

export async function getServerSupabase() {
  const cookieStore = await cookies();                  // ★ await が必要
  return createServerComponentClient({ cookies: () => cookieStore });
}
