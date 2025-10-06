import { getServerSupabase } from '@/lib/supabase-server';
import { redirect } from 'next/navigation';

export default async function MyPage() {
  const supabase = await getServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: posts } = await supabase
    .from('post')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-4">
      <h1 className="text-xl font-bold mb-2">My Posts</h1>
      {posts?.map((p) => (
        <div key={p.id} className="border rounded p-4 space-y-1 bg-white">
          <p className="text-xs text-gray-500">{new Date(p.created_at).toLocaleString()}</p>
          <p>{p.corrected || p.original}</p>
          {p.translated && <p className="text-sm text-gray-600">{p.translated}</p>}
          {p.advice && <p className="text-xs text-gray-500 italic">{p.advice}</p>}
        </div>
      ))}
      {!posts?.length && <p className="text-gray-500">まだ投稿がありません。</p>}
    </div>
  );
}
