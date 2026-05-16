import { NextRequest, NextResponse } from 'next/server';
import { chatWithAI } from '../../../../backend/lib/ai';
import { supabaseAdmin } from '../../../../backend/lib/supabase';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

async function getUser(req: NextRequest) {
  const authHeader = req.headers.get('Authorization');
  if (!authHeader) return null;
  const token = authHeader.replace('Bearer ', '');
  const { data, error } = await supabaseAdmin.auth.getUser(token);
  if (error || !data?.user) return null;
  return data.user;
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: CORS_HEADERS });
}

/**
 * GET Handler: Allows testing the AI directly in the browser or health checks.
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const prompt = searchParams.get('prompt');

  if (!prompt) {
    return NextResponse.json({ 
      status: "Neural link active",
      message: "Send a 'prompt' query parameter to chat via GET, or use POST for full history support." 
    }, { headers: CORS_HEADERS });
  }

  try {
    const aiResponse = await chatWithAI(prompt, []);
    return NextResponse.json({ text: aiResponse }, { headers: CORS_HEADERS });
  } catch (error: any) {
    console.error("AI Chat GET Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500, headers: CORS_HEADERS });
  }
}

/**
 * POST Handler: The main entry point for the AI Copilot frontend.
 */
export async function POST(req: NextRequest) {
  try {
    const { prompt, history } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400, headers: CORS_HEADERS });
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

    // The systemInstruction is already handled in backend/lib/ai.ts
    // We only pass the actual conversation history here.
    // We filter history to ensure it starts with 'user' if possible, 
    // or just pass it directly if Gemini handles the initial 'model' message.
    // Most importantly, we avoid adding a 'model' message at the very beginning 
    // which conflicts with the UI's welcome message.
    
    const aiResponse = await chatWithAI(prompt, history || []);

    return NextResponse.json({ text: aiResponse }, { headers: CORS_HEADERS });
  } catch (error: any) {
    console.error("AI Chat POST Error:", error);
    // Return the actual error message for easier debugging in dev
    return NextResponse.json({ 
      error: "AI Chat Error", 
      details: error.message 
    }, { status: 500, headers: CORS_HEADERS });
  }
}
