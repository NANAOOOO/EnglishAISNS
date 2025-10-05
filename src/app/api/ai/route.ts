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
    temperature: 0.1,
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


  const raw = chat.choices[0].message.content;

if (!raw) {
  throw new Error('AI response is empty');
}

const result = JSON.parse(raw);  

return NextResponse.json(result);


  return NextResponse.json(result);     
}
