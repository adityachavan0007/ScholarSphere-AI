import { NextRequest, NextResponse } from 'next/server';
import { discoverOpportunities } from '../../../../../backend/lib/ai';
import { supabaseAdmin } from '../../../../../backend/lib/supabase';

export async function GET(req: NextRequest) {
  try {
    console.log("AI: Starting automated scholarship discovery...");
    
    // 1. Auto-Delete: Clear out old/expired scholarships
    const now = new Date().toISOString();
    await supabaseAdmin
      .from('opportunities')
      .delete()
      .match({ type: 'scholarship' })
      .lt('deadline_date', now);

    // 2. Get recommendations from AI
    const aiScholarships = await discoverOpportunities('scholarship');

    // 3. Map & Filter out hallucinated past years
    const opportunities = aiScholarships
      .filter((s: any) => {
        const year = new Date(s.date).getFullYear();
        return year >= 2026; 
      })
      .map((s: any) => ({
        title: s.title,
        type: 'scholarship',
        domain_tag: s.organizer,
        deadline_date: new Date(s.date).toISOString(),
        eligible_states: [s.mode],
        match_score: s.matchScore,
        eligible_degrees: s.tags,
        status: s.status,
        participants_count: s.participants,
        link: s.link,
        updated_at: new Date().toISOString(),
      }));

    // 4. Update the database
    const { data, error } = await supabaseAdmin
      .from('opportunities')
      .upsert(opportunities, { onConflict: 'title' })
      .select();

    if (error) throw error;
    const response = NextResponse.json({ success: true, count: data?.length, data });
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    return response;
  } catch (error: any) {
    console.error("Scholarship Discovery API Error:", error);
    const response = NextResponse.json({ error: error.message }, { status: 500 });
    response.headers.set('Access-Control-Allow-Origin', '*');
    return response;
  }
}

export async function OPTIONS() {
  const response = new NextResponse(null, { status: 204 });
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  return response;
}
