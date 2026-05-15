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

  const { opportunity_id, status, fit_score, fit_reason_short } = await req.json();

  if (!opportunity_id) {
    return NextResponse.json({ error: 'opportunity_id is required' }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin
    .from('matches')
    .upsert({
      user_id: user.id,
      opportunity_id,
      status: status || 'saved',
      fit_score,
      fit_reason_short,
      created_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function PATCH(req: NextRequest) {
  const user = await getUser(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { opportunity_id, status } = await req.json();

  if (!opportunity_id || !status) {
    return NextResponse.json({ error: 'opportunity_id and status are required' }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin
    .from('matches')
    .update({ status })
    .eq('user_id', user.id)
    .eq('opportunity_id', opportunity_id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
