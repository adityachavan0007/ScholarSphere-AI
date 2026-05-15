import { NextRequest, NextResponse } from 'next/server';
import { chatWithAI } from '../../../../backend/lib/ai';
import { supabaseAdmin } from '../../../../backend/lib/supabase';

async function getUser(req: NextRequest) {
  const authHeader = req.headers.get('Authorization');
  if (!authHeader) return null;
  const token = authHeader.replace('Bearer ', '');
  const { data, error } = await supabaseAdmin.auth.getUser(token);
  if (error || !data?.user) return null;
  return data.user;
}

export async function POST(req: NextRequest) {
  try {
    const { prompt, history } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    // Optional: Get user context for better responses
    const user = await getUser(req);
    let systemContext = "You are ScholarSphere AI, a helpful assistant for Indian undergraduate students looking for scholarships, hackathons, and internships.";
    
    if (user) {
        const { data: profile } = await supabaseAdmin
            .from('student_profiles')
            .select('*')
            .eq('id', user.id)
            .single();
        
        if (profile && profile.profile_data) {
            systemContext += ` The user's profile context: ${JSON.stringify(profile.profile_data)}. Use this to personalize recommendations.`;
        }
    }

    const aiResponse = await chatWithAI(prompt, [
        { role: "model", content: systemContext },
        ...(history || [])
    ]);

    return NextResponse.json({ text: aiResponse });
  } catch (error: any) {
    console.error("AI Chat Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
