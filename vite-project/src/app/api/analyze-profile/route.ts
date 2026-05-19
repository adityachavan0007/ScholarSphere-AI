import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../../backend/lib/supabase';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: CORS_HEADERS });
}

async function getUser(req: NextRequest) {
  const authHeader = req.headers.get('Authorization');
  if (!authHeader) return null;
  const token = authHeader.replace('Bearer ', '');
  const { data, error } = await supabaseAdmin.auth.getUser(token);
  if (error || !data?.user) return null;
  return data.user;
}

export async function POST(req: NextRequest) {
  const user = await getUser(req);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: CORS_HEADERS });
  }

  // 1. Parse student profile from body or fallback to database
  let profileData = null;
  try {
    const body = await req.json();
    profileData = body.profileData;
  } catch (e) {
    // Ignore and fallback
  }

  if (!profileData) {
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('student_profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (profileError || !profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404, headers: CORS_HEADERS });
    }
    profileData = profile.profile_data || profile;
  }

  // 2. Fetch active opportunities to run matching
  const { data: opportunities, error: oppsError } = await supabaseAdmin
    .from('opportunities')
    .select('*')
    .limit(20);

  // 3. Query OpenAI for dynamic matching and recommendations
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: 'OPENAI_API_KEY is not configured in the environment' },
      { status: 500, headers: CORS_HEADERS }
    );
  }

  const systemPrompt = `You are the ScholarSphere AI Engine, an elite AI profile analyzer and matching specialist for Indian engineering students. You analyze student profiles (skills, projects, experience, GPA) and match them to real opportunities or make custom recommendations.`;

  const userPrompt = `
Student Profile:
${JSON.stringify(profileData, null, 2)}

Available Opportunities from Database:
${opportunities && opportunities.length > 0 ? JSON.stringify(opportunities.map(o => ({ id: o.id, title: o.title, type: o.type, tags: o.eligible_degrees, min_cgpa: o.min_cgpa, description: o.description })), null, 2) : "No active opportunities in the database."}

Evaluate the student's profile strengths and matches.
Generate 3-4 matched opportunities or strategic recommendations.
- If there are relevant opportunities in the database list, match the student to the best 2-3 of them and write a custom reason for each.
- In addition (or as a fallback if the database list is empty), generate 1-2 highly relevant, specific real-world recommendations/opportunities (e.g. 'Google Summer of Code', 'Smart India Hackathon', 'Reliance Foundation Scholarship', 'Microsoft Internships') customized to their tech stack, interests, and branch.
- For each recommendation, provide a short, motivational 'reason' that highlights their profile strengths (e.g., 'Matches your React and Node.js skills', 'Great fit for your CGPA of 9.2').

Return a JSON object with this exact structure:
{
  "matches": [
    {
      "title": "Opportunity Title or Recommendation Name",
      "reason": "Personalized match explanation and actionable advice."
    }
  ]
}
  `;

  try {
    console.log(`AI: Analyzing profile via OpenAI for student ${profileData.name || user.id}`);
    
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        response_format: { type: "json_object" },
        temperature: 0.3
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`OpenAI API request failed: ${response.status} - ${errText}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    if (!content) throw new Error("Empty response from OpenAI");

    const analysisResult = JSON.parse(content);
    return NextResponse.json(analysisResult, { headers: CORS_HEADERS });
  } catch (error: any) {
    console.error("AI Profile Analyzer Error:", error);
    return NextResponse.json(
      { 
        matches: [
          { 
            title: "Analysis Fallback", 
            reason: `Unable to complete dynamic analysis. Make sure profile details are filled out. Error: ${error.message}` 
          }
        ] 
      }, 
      { status: 200, headers: CORS_HEADERS }
    );
  }
}

