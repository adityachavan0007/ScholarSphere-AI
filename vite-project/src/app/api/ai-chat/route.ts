import { NextRequest, NextResponse } from 'next/server';
import { chatWithAI } from '../../../../backend/lib/ai';

export async function POST(req: NextRequest) {
  try {
    const { prompt, history } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    const aiResponse = await chatWithAI(prompt, history || []);

    return NextResponse.json({ text: aiResponse });
  } catch (error: any) {
    console.error("AI Chat Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
