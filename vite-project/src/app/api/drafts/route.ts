import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../../backend/lib/supabase';
import { generateDraftAnswers } from '../../../../backend/lib/ai';

async function getUser(req: NextRequest) {
  const authHeader = req.headers.get('Authorization');
  if (!authHeader) return null;
  const token = authHeader.replace('Bearer ', '');
  const { data, error } = await supabaseAdmin.auth.getUser(token);
  if (error || !data?.user) return null;
  return data.user;
}

export async function GET(req: NextRequest) {
  const user = await getUser(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const opportunity_id = searchParams.get('opportunity_id');

  let query = supabaseAdmin
    .from('application_drafts')
    .select('*')
    .eq('user_id', user.id);

  if (opportunity_id) {
    query = query.eq('opportunity_id', opportunity_id);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const user = await getUser(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { opportunity_id, question_keys } = await req.json();

  if (!opportunity_id || !question_keys || !Array.isArray(question_keys)) {
    return NextResponse.json({ error: 'opportunity_id and question_keys array are required' }, { status: 400 });
  }

  // 1. Fetch profile and opportunity to generate drafts
  const { data: profile } = await supabaseAdmin.from('student_profiles').select('*').eq('id', user.id).single();
  const { data: opportunity } = await supabaseAdmin.from('opportunities').select('*').eq('id', opportunity_id).single();

  if (!profile || !opportunity) {
    return NextResponse.json({ error: 'Profile or Opportunity not found' }, { status: 404 });
  }

  // 2. Generate drafts using AI utility
  // We'll use a placeholder reasons array for now
  const reasons = [`High match score of ${opportunity.min_cgpa ? 'based on CGPA' : 'based on domain'}`];
  const drafts = await generateDraftAnswers(profile, opportunity, reasons, question_keys);

  // 3. Save drafts to database
  const upsertData = Object.entries(drafts).map(([key, answer]) => ({
    user_id: user.id,
    opportunity_id,
    question_key: key,
    draft_answer: answer,
    updated_at: new Date().toISOString(),
  }));

  const { data: savedDrafts, error: saveError } = await supabaseAdmin
    .from('application_drafts')
    .upsert(upsertData)
    .select();

  if (saveError) {
    return NextResponse.json({ error: saveError.message }, { status: 500 });
  }

  return NextResponse.json(savedDrafts);
}
