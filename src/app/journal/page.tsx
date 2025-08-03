'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';

type AiResult = { corrected: string; translated: string; advice: string };

export default function JournalPage() {
  const [text, setText] = useState('');
  const [preview, setPreview] = useState<AiResult | null>(null);
  const [msg, setMsg] = useState('');

  async function handleSubmit() {
    if (!text.trim()) return;

    setMsg('⏳ 校正中…');
    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        body: JSON.stringify({ text }),
        headers: { 'Content-Type': 'application/json' },
      });
      if (!res.ok) throw new Error('AI error');

      const { corrected, translated, advice } = await res.json();
      const ai: AiResult = { corrected, translated, advice };


      const { error } = await supabase.from('post').insert({
        original: text,
        corrected,
        translated,
        advice: advice ?? '',
      });
      if (error) throw error;

      setPreview(ai);
      setMsg('✅ 保存しました');
      setText('');
    } catch (err: unknown) {
      console.error(err);
      setMsg(`❌ ${err.message ?? 'エラー'}`);
    }
  }

  return (
    <div className="max-w-xl mx-auto p-6 space-y-4">
      <textarea
        value={text}
        onChange={e => setText(e.target.value)}
        className="w-full h-40 border rounded p-2"
        placeholder="今日の出来事を英語で書く…"
      />
      <button
        onClick={handleSubmit}
        className="px-4 py-2 bg-blue-600 text-white rounded"
      >
        Post
      </button>

      {msg && <p className="text-sm text-gray-600">{msg}</p>}

      {preview && (
        <div className="border rounded p-4 bg-gray-50 space-y-2">
          <div><span className="font-semibold">Corrected:</span> {preview.corrected}</div>
          <div><span className="font-semibold">JP:</span> {preview.translated}</div>
          <div className="text-sm text-gray-600">{preview.advice}</div>
        </div>
      )}
    </div>
  );
}
