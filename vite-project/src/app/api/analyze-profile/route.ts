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
  // 1. Parse student profile from body or fallback to database
  let profileData = null;
  try {
    const body = await req.json();
    profileData = body.profileData;
  } catch (e) {
    // Ignore and fallback
  }

  // If no profileData in body, we require user authentication to fetch from DB
  if (!profileData) {
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: CORS_HEADERS });
    }

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

  const systemPrompt = `You are the ScholarSphere AI Engine, an elite AI profile analyzer and matching specialist for Indian engineering students. You analyze student profiles (skills, projects, experience, GPA) and calculate ATS scores, other recommended sub-scores, structural profile improvement recommendations, and matched opportunities.`;

  const userPrompt = `
Student Profile:
${JSON.stringify(profileData, null, 2)}

Available Opportunities from Database:
${opportunities && opportunities.length > 0 ? JSON.stringify(opportunities.map(o => ({ id: o.id, title: o.title, type: o.type, tags: o.eligible_degrees, min_cgpa: o.min_cgpa, description: o.description })), null, 2) : "No active opportunities in the database."}

Evaluate the student's profile:
1. ATS Score: Rate the overall resume/profile strength from 0 to 100 based on standard industry expectations for software engineering / tech roles.
2. Sub-scores:
   - Skill Relevance: How well aligned their skill list is (0-100).
   - Profile Completeness: How thoroughly filled out their profile sections are (0-100).
   - Project Impact: The strength and detail of their projects (0-100).
3. Suggestions: Actionable bullet-point improvements to boost their profile strength (e.g. 'Add a live link for project X', 'Mention specific libraries used', 'Include a professional headline').
4. Matches: Generate 2-3 matched opportunities from the database list (with a customized match explanation for each) AND/OR 1-2 relevant external recommendations (like 'Google STEP Internship', 'Reliance Foundation Scholarship', 'Smart India Hackathon') tailored to their tech stack.

Return a JSON object with this exact structure:
{
  "atsScore": 78,
  "subScores": {
    "skillRelevance": 85,
    "completeness": 90,
    "projectImpact": 60
  },
  "suggestions": [
    "Suggestion 1...",
    "Suggestion 2..."
  ],
  "matches": [
    {
      "title": "Opportunity Title",
      "reason": "Why it fits..."
    }
  ]
}
  `;

  try {
    console.log(`AI: Analyzing profile via OpenAI for student ${profileData?.name || user?.id || "Guest"}`);
    
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
        atsScore: 0,
        subScores: {
          skillRelevance: 0,
          completeness: 0,
          projectImpact: 0
        },
        suggestions: [
          "Unable to complete dynamic analysis. Make sure profile details are filled out.",
          `Error Details: ${error.message}`
        ],
        matches: [
          { 
            title: "Analysis Fallback", 
            reason: `Unable to complete dynamic analysis. Check console or backend configuration.` 
          }
        ] 
      }, 
      { status: 200, headers: CORS_HEADERS }
    );
  }
}

