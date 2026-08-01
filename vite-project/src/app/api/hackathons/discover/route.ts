import { NextRequest, NextResponse } from 'next/server';
import { discoverOpportunities } from '@/lib/ai';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { getFromCache, setInCache } from '@/lib/cache';
import { validateLinks } from '@/lib/linkValidator';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function GET() {
  try {
    const CACHE_KEY = 'discover_hackathons';
    const cachedData = getFromCache(CACHE_KEY);
    
    if (cachedData) {
      console.log("Serving hackathons from fast in-memory cache!");
      const response = NextResponse.json({ success: true, count: cachedData.length, data: cachedData });
      response.headers.set('Access-Control-Allow-Origin', '*');
      return response;
    }

    console.log("AI: Starting automated hackathon discovery...");
    
    // 1. Auto-Delete: Clear out old/expired hackathons to keep data fresh
    const now = new Date().toISOString();
    try {
      await supabaseAdmin
        .from('opportunities')
        .delete()
        .match({ type: 'hackathon' })
        .lt('deadline_date', now);
    } catch (e) {
      console.warn("Could not delete old hackathons from DB, proceeding anyway...", e);
    }

    // 2. Get recommendations from AI
    const aiHackathons = await discoverOpportunities('hackathon');

    // 3. Map & Filter out hallucinated past years
    let opportunities = aiHackathons
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

    // 4. Validate Links
    opportunities = await validateLinks(opportunities);

    // 5. Automatically update the database (Graceful Fallback)
    try {
      const { data, error } = await supabaseAdmin
        .from('opportunities')
        .upsert(opportunities, { onConflict: 'title' })
        .select();

      if (!error && data) {
        opportunities = data;
      }
    } catch (e) {
      console.warn("DB Upsert failed (possibly paused or missing keys). Falling back to AI data in memory.", e);
    }

    // 6. Cache the successful result for 5 minutes (300s)
    setInCache(CACHE_KEY, opportunities);

    const response = NextResponse.json({ success: true, count: opportunities.length, data: opportunities });
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
