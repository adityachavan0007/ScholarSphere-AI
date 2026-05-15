import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../../backend/lib/supabase';
import { scoreMatch } from '../../../../backend/lib/ai';

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

  // 1. Fetch user profile
  const { data: profile, error: profileError } = await supabaseAdmin
    .from('student_profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (profileError || !profile) {
    return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
  }

  // 2. Pre-filter opportunities based on basic eligibility
  let query = supabaseAdmin
    .from('opportunities')
    .select('*')
    .lte('min_cgpa', profile.cgpa); // Student CGPA must be >= minimum required

  // Filter by state if applicable
  if (profile.state) {
    // If eligible_states is null or contains the student's state
    // Note: Supabase supports array-to-array overlap or contains
    query = query.or(`eligible_states.is.null,eligible_states.cs.{${profile.state}}`);
  }

  const { data: opportunities, error: oppError } = await query;

  if (oppError || !opportunities) {
    return NextResponse.json({ error: oppError?.message || 'No opportunities found' }, { status: 500 });
  }

  // Filter by domain tag if student has interests
  let filteredOpps = opportunities;
  if (profile.domain_interests && profile.domain_interests.length > 0) {
    // Soft filter: prioritize domain interests in the AI scoring phase
    // But for the initial list, we might want to keep it broad or filter strictly
    // For now, we'll keep all that pass CGPA and State, and let AI score them
  }

  // 3. AI Scoring Placeholder
  // In a real app, you might do this in batches or on-demand
  const matches = await Promise.all(
    opportunities.map(async (opp) => {
      const { fitScore, reasons } = await scoreMatch(profile, opp);
      return {
        opportunity: opp,
        fitScore,
        reasons
      };
    })
  );

  // Sort by fit score descending
  matches.sort((a, b) => b.fitScore - a.fitScore);

  return NextResponse.json(matches);
}
