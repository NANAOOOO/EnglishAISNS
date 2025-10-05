import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey:  process.env.OPENAI_API_KEY,
  baseURL: process.env.OPENAI_BASE_URL,
});

export async function POST(req: NextRequest) {
  const { text } = await req.json();

  const chat = await openai.chat.completions.create({
    model: process.env.GROQ_MODEL ?? 'gemma2-9b-it',
    temperature: 0,
    messages: [
      {
        role: 'system',
        content: [
          "You are a strict English proof-reader.",
          "Return **pure JSON** exactly like this:",
          '{"corrected":"","translated":"","advice":""}',
          '・corrected = 自然な英語に直した文',
          '・translated = corrected の日本語訳',
          '・advice = どこをどう直したか１文で'
        ].join('\n')
      },
      { role: 'user', content: text },
    ],
   
    response_format: { type: 'json_object' },
  });

  const raw = chat.choices[0].message.content ?? '{}';

  let r: any;
  try { r = JSON.parse(raw); } catch { r = {}; }
  
  // ① まず正規化
  let corrected = (r.corrected ?? '').toString().trim() || text;
  let translated = (r.translated ?? '').toString().trim();
  let advice     = (r.advice ?? '').toString().trim();
  
  // ② 翻訳が空なら "翻訳専用" の2ndコールで必ず埋める（必要時のみ）
  if (!translated) {
    const t = await openai.chat.completions.create({
      model: process.env.GROQ_TRANSLATION_MODEL
              ?? process.env.GROQ_MODEL
              ?? 'gemma2-9b-it',
      temperature: 0,
      messages: [
        { role: 'system',
          content: 'Translate the following English into natural Japanese. Return ONLY the translation text.' },
        { role: 'user', content: corrected }
      ]
    });
    translated = (t.choices[0].message.content ?? '').trim();
  }
  
  return NextResponse.json({ corrected, translated, advice });
  