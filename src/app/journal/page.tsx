// Server wrapper: 認証して userId を渡す
import { redirect } from 'next/navigation';
import { getServerSupabase } from '@/lib/supabase-server';
import Client from './client';

export default async function Page() {
  const supabase = await getServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');
  return <Client userId={user.id} />;
}
