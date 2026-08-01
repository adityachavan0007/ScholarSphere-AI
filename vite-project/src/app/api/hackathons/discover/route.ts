import { NextRequest, NextResponse } from 'next/server';
import { discoverOpportunities } from '@/lib/ai';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function GET() {
  try {
    console.log("AI: Starting automated hackathon discovery...");
    
    // 1. Auto-Delete: Clear out old/expired hackathons to keep data fresh
    const now = new Date().toISOString();
    await supabaseAdmin
      .from('opportunities')
      .delete()
      .match({ type: 'hackathon' })
      .lt('deadline_date', now);

    // 2. Get recommendations from AI
    const aiHackathons = await discoverOpportunities('hackathon');

    // 3. Map & Filter out hallucinated past years (ONLY allow 2026-2027)
    const opportunities = aiHackathons
      .filter((h: any) => {
        const year = new Date(h.date).getFullYear();
        return year >= 2026; 
      })
      .map((h: any) => ({
        title: h.title,
        type: 'hackathon',
        domain_tag: h.organizer,
        deadline_date: new Date(h.date).toISOString(),
        eligible_states: [h.mode],
        match_score: h.matchScore,
        eligible_degrees: h.tags,
        status: h.status,
        participants_count: h.participants,
        link: h.link,
        updated_at: new Date().toISOString(),
      }));

    // 4. Automatically update the database
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
    console.error("Hackathon Discovery API Error:", error);
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
