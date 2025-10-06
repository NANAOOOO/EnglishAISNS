import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

type ChatMessage = { role: 'user' | 'assistant' | 'system'; content: string };
type AiRequest = { messages?: ChatMessage[]; text?: string };
type AiResponse = { corrected: string; translated: string; advice: string };

const openai = new OpenAI({
  apiKey:  process.env.OPENAI_API_KEY,
  baseURL: process.env.OPENAI_BASE_URL,
});

export async function POST(req: NextRequest) {
 const { text } = (await req.json()) as AiRequest;
  if (!text || typeof text !== 'string') {
    return NextResponse.json(
      { error: 'Bad Request: body must include { text: string }' },
      { status: 400 }
    );
  }

  const chat = await openai.chat.completions.create({
    model: process.env.GROQ_MODEL ?? 'gemma2-9b-it',
    temperature: 0,
    messages: [
  {
    role: 'system',
    content: [
      'ROLE: You are a strict English proofreader & translator.',
      'OUTPUT: Return ONLY JSON like {"corrected":"","translated":"","advice":""}.',
      'RULES:',
      '- Do NOT invent names or entities. Do NOT replace "you" with any person name.',
      '- Preserve the original meaning; fix grammar/wording only.',
      '- If no change needed, put the original in corrected and set advice="".',
      '- translated must be a natural Japanese translation of corrected.',
    ].join('\n')
  },
  // few-shot 1
  { role: 'user', content: 'I happy see you' },
  { role: 'assistant', content: '{"corrected":"I am happy to see you.","translated":"あなたに会えて嬉しいです。","advice":"Add the be verb am."}' },
  // few-shot 2
  { role: 'user', content: 'She go to school.' },
  { role: 'assistant', content: '{"corrected":"She goes to school.","translated":"彼女は学校に通っています。","advice":"Add 3rd person singular -s."}' },
  // actual input
  { role: 'user', content: text },
],

   
    response_format: { type: 'json_object' },
  });

  const raw = chat.choices[0].message.content ?? '{}';

 let r: Partial<AiResponse> = {};
 try { r = JSON.parse(raw) as Partial<AiResponse>; } catch { /* noop */ }
  
  // ① まず正規化
  let corrected = (r.corrected ?? '').toString().trim() || text;
  let translated = (r.translated ?? '').toString().trim();
  const advice   = (r.advice ?? '').toString().trim();

  // 固有名の捏造対策 & 意味崩壊の簡易ガード
  if (/nana/i.test(corrected) && !/nana/i.test(text)) {
    corrected = corrected.replace(/nana/gi, 'you');
  }
  if (/^(\b\w+\b)(?:\s+\1){2,}$/i.test(corrected)) {
    corrected = text;
  }

  
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
}