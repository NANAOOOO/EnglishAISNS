import { supabase } from '@/lib/supabase';
import { cookies } from 'next/headers';

export default async function Feed() {
  // 最新 20 件を取得
  const { data: posts } = await supabase
    .from('post')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(20);

  /* ───── ログインユーザー ID 取得 ───── */
  const cookieStore = await cookies();          // ← await を付与（Next 15 以降）
  const uid = cookieStore.get('sb-user-id')?.value ?? null;

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-4">
      {posts?.map((p) => (
        <div key={p.id} className="border rounded p-4 space-y-1 bg-white">
          {/* 投稿日＋自分の投稿なら ★ */}
          <p className="text-xs text-gray-500">
            {new Date(p.created_at).toLocaleString()}
            {p.user_id === uid && ' ★'}
          </p>

          {/* 校正文。空なら original を表示 */}
          <p>{p.corrected || p.original}</p>

          {/* 日本語訳（あれば） */}
          {p.translated && (
            <p className="text-sm text-gray-600">{p.translated}</p>
          )}

          {/* アドバイス（あれば） */}
          {p.advice && (
            <p className="text-xs text-gray-500 italic">{p.advice}</p>
          )}
        </div>
      ))}
    </div>
  );
}
