import { NextRequest, NextResponse } from 'next/server';
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
  const user = await getUser(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  // Fetch the profile to analyze
  const { data: profile, error: profileError } = await supabaseAdmin
    .from('student_profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (profileError || !profile) {
    return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
  }

  // Placeholder logic for AI Profile Analysis
  console.log(`AI: Analyzing profile for ${profile.name}`);

  // Simulated analysis results
  const analysis = {
    scores: {
      completeness: 85,
      skill_strength: 78,
      experience_relevance: 65,
      project_impact: 92
    },
    insights: [
      "Your project portfolio is very strong, especially the hardware integration projects.",
      "Consider adding more details to your education history to improve completeness.",
      "Your skill set matches well with current IoT and hardware engineering trends."
    ],
    recommendations: [
      "Add a professional headline if you haven't already.",
      "Include links to your project repositories for better visibility.",
      "Explore hackathons related to Smart India Hackathon (SIH) given your domain interests."
    ],
    timestamp: new Date().toISOString()
  };

  return NextResponse.json(analysis);
}
