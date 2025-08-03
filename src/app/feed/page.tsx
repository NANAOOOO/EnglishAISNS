import { supabase } from '@/lib/supabase';
import { cookies } from 'next/headers';            // ユーザー判定用

export default async function Feed() {
  const { data: posts } = await supabase
    .from('post')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(20);

  const uid = cookies().get('sb-user-id')?.value;  

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-4">
      {posts?.map(p => (
        <div key={p.id} className="border rounded p-4 space-y-1">
          <p className="text-xs text-gray-500">
            {new Date(p.created_at).toLocaleString()}
            {p.user_id === uid && ' ★'}
          </p>
          <p>{p.corrected}</p>
          <p className="text-sm text-gray-600">{p.advice}</p>
        </div>
      ))}
    </div>
  );
}
