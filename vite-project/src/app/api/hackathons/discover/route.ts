import { NextRequest, NextResponse } from 'next/server';
import { discoverHackathons } from '../../../../../backend/lib/ai';
import { supabaseAdmin } from '../../../../../backend/lib/supabase';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: CORS_HEADERS });
}

export async function GET(req: NextRequest) {
  try {
    console.log("AI: Starting automated hackathon discovery...");
    
    // 1. Get recommendations from AI
    const aiHackathons = await discoverHackathons();

    // 2. Map AI results to our Database Schema
    const opportunities = aiHackathons.map((h: any) => ({
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

    // 3. Automatically update the database (Upsert based on title to avoid duplicates)
    const { data, error } = await supabaseAdmin
      .from('opportunities')
      .upsert(opportunities, { onConflict: 'title' })
      .select();

    if (error) throw error;

    return NextResponse.json({ 
        message: "Discovery successful", 
        count: data?.length || 0,
        data: data 
    }, { headers: CORS_HEADERS });

  } catch (error: any) {
    console.error("Hackathon Discovery API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500, headers: CORS_HEADERS });
  }
}
