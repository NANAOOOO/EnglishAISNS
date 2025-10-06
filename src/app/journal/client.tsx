'use client';

import { useState } from 'react';
import { supabaseClient } from '@/lib/supabase-client';

type AiResult = { corrected: string; translated: string; advice: string };

export default function Client({ userId }: { userId: string }) {
  const [text, setText] = useState('');
  const [preview, setPreview] = useState<AiResult | null>(null);
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    if (!text.trim() || loading) return;
    setLoading(true);
    setMsg('⏳ 校正中…');

    try {
      // AI 校正
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });
      if (!res.ok) throw new Error('AI error');

      const j = (await res.json()) as Partial<AiResult>;
      const ai: AiResult = {
        corrected: (j.corrected ?? '').trim() || text,
        translated: (j.translated ?? '').trim(),
        advice: (j.advice ?? '').trim(),
      };

      // 先にプレビュー
      setPreview(ai);

      // DB 保存（認証付きクライアント）
      const { error } = await supabaseClient.from('post').insert({
        user_id: userId,
        original: text,
        corrected: ai.corrected,
        translated: ai.translated,
        advice: ai.advice,
      });
      if (error) throw error;

      setMsg('✅ 保存しました');
      setText('');
    } catch (e: unknown) {
      const m = e instanceof Error ? e.message : 'unknown error';
      setMsg(`❌ ${m}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-xl mx-auto p-6 space-y-4">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="w-full h-40 border rounded p-2"
        placeholder="今日の出来事を英語で書く…"
      />
      <button
        onClick={handleSubmit}
        disabled={loading}
        className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
      >
        {loading ? 'Posting…' : 'Post'}
      </button>

      {msg && <p className="text-sm text-gray-600">{msg}</p>}

      {preview && (
        <div className="border rounded p-4 bg-gray-50 space-y-2">
          <div><span className="font-semibold">Corrected:</span> {preview.corrected || text}</div>
          <div><span className="font-semibold">JP:</span> {preview.translated || '（なし）'}</div>
          <div className="text-sm text-gray-600">{preview.advice || '（アドバイスなし）'}</div>
        </div>
      )}
    </div>
  );
}
