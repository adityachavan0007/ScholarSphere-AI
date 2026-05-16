import { NextRequest, NextResponse } from 'next/server';
import { discoverOpportunities } from '../../../../../backend/lib/ai';
import { supabaseAdmin } from '../../../../../backend/lib/supabase';

export async function GET(req: NextRequest) {
  try {
    console.log("AI: Starting automated internship discovery...");
    
    // 1. Auto-Delete: Clear out old/expired internships
    const now = new Date().toISOString();
    await supabaseAdmin
      .from('opportunities')
      .delete()
      .match({ type: 'internship' })
      .lt('deadline_date', now);

    // 2. Get recommendations from AI
    const aiInternships = await discoverOpportunities('internship');

    // 3. Map & Filter out hallucinated past years
    const opportunities = aiInternships
      .filter((i: any) => {
        const year = new Date(i.date).getFullYear();
        return year >= 2026; 
      })
      .map((i: any) => ({
        title: i.title,
        type: 'internship',
        domain_tag: i.organizer,
        deadline_date: new Date(i.date).toISOString(),
        eligible_states: [i.mode],
        match_score: i.matchScore,
        eligible_degrees: i.tags,
        status: i.status,
        participants_count: i.participants,
        link: i.link,
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
    console.error("Internship Discovery API Error:", error);
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
