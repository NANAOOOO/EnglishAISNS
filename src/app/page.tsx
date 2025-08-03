import { supabase } from '@/lib/supabase';

export default async function Home() {
  const { data } = await supabase
    .from('post')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(10);

  return <pre className="p-6">{JSON.stringify(data, null, 2)}</pre>;
}

