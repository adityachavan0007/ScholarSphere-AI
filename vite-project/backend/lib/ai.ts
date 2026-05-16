import { GoogleGenerativeAI } from "@google/generative-ai";

/**
 * AI Layer Wrapper for ScholarSphere AI
 */

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY || "");
const model = genAI.getGenerativeModel({ 
    model: "gemini-2.5-flash",
    systemInstruction: "You are ScholarSphere AI, an elite AI copilot for Indian undergraduate students. Your tone is engineering-focused, slightly futuristic, and highly efficient. You help students find scholarships, hackathons, and internships. You can also help draft cover letters and application answers. Use terminal-style language occasionally (e.g., 'neural link established', 'scanning registers'). If you generate a long document (like a cover letter), format it clearly with markdown."
});

export interface StudentProfile {
  name: string;
  college: string;
  degree: string;
  branch: string;
  year: number;
  cgpa: number;
  income_bracket: 'low' | 'medium' | 'high';
  state: string;
  domain_interests: string[];
  career_goal: string;
}

export interface Opportunity {
  id: string;
  title: string;
  type: string;
  domain_tag: string;
  eligible_states: string[];
  eligible_degrees: string[];
  min_cgpa: number;
  reward_summary: string;
  description: string;
}

/**
 * Calculates a fit score between a student profile and an opportunity.
 */
export async function scoreMatch(profile: StudentProfile, opportunity: Opportunity) {
  // Placeholder logic for LLM scoring
  console.log(`AI: Scoring match for ${profile.name} vs ${opportunity.title}`);
  
  // Basic heuristic-based scoring as a placeholder
  let score = 70; // Base score
  
  const reasons = [
    `Matches ${opportunity.domain_tag} domain interest.`,
    `Meets CGPA requirement of ${opportunity.min_cgpa}.`,
  ];

  if (profile.degree === 'B.Tech' && opportunity.eligible_degrees.includes('B.Tech')) {
    score += 10;
  }

  // Ensure score is between 0 and 100
  score = Math.min(100, Math.max(0, score));

  return {
    fitScore: score,
    reasons: reasons
  };
}

/**
 * Generates draft answers for application questions based on the profile and opportunity.
 */
export async function generateDraftAnswers(
  profile: StudentProfile,
  opportunity: Opportunity,
  reasons: string[],
  questionKeys: string[]
) {
  // Placeholder logic for LLM drafting
  console.log(`AI: Generating drafts for ${opportunity.title}`);

  const drafts: Record<string, string> = {};

  questionKeys.forEach(key => {
    drafts[key] = `[Drafted for ${key}]: As a ${profile.year} year ${profile.degree} student at ${profile.college}, I have a strong background in ${profile.branch}. This opportunity for ${opportunity.title} aligns perfectly with my goal to ${profile.career_goal}. ${reasons.join(' ')}`;
  });

  return drafts;
}

/**
 * General chat interaction with the AI model.
 */
export async function chatWithAI(prompt: string, history: { role: string; content: string }[]) {
  try {
    // Ensure history alternates between user and model roles
    const cleanedHistory = [];
    let lastRole = "";
    
    for (const m of history) {
      const currentRole = m.role === "user" ? "user" : "model";
      if (currentRole !== lastRole) {
        cleanedHistory.push({
          role: currentRole,
          parts: [{ text: m.content }]
        });
        lastRole = currentRole;
      }
    }

    // CRITICAL: Gemini requires the first message in history to be from the 'user'.
    // If our history starts with a 'model' message (like a welcome message), we must remove it.
    while (cleanedHistory.length > 0 && cleanedHistory[0].role === "model") {
      cleanedHistory.shift();
    }

    const chat = model.startChat({
      history: cleanedHistory
    });

    const result = await chat.sendMessage(prompt);
    return result.response.text();
  } catch (error: any) {
    console.error("AI Chat Error:", error);
    throw new Error("Failed to generate AI response.");
  }
}
/**
 * Uses AI to discover/recommend trending hackathons.
 */
export async function discoverHackathons(query?: string) {
  const discoveryPrompt = `
    Generate a list of 5 real-world or highly plausible upcoming hackathons suitable for Indian engineering students. 
    Focus on areas like: ${query || 'Web3, AI, FinTech, and Open Source'}.
    
    RETURN ONLY A JSON ARRAY of objects. Each object must have:
    - id: string (unique)
    - title: string
    - organizer: string
    - date: string (e.g., "Oct 15, 2026")
    - mode: "Online" | "Offline" | "Hybrid"
    - matchScore: number (80-99)
    - tags: string[] (at least 3 tech tags)
    - status: "Registering" | "Live"
    - participants: number
    - link: string (URL)
    
    Do not include any conversational text, only the JSON array.
  `;

  try {
    const result = await model.generateContent(discoveryPrompt);
    const text = result.response.text();
    
    // Extract JSON from the response (in case of markdown blocks)
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
    }
    throw new Error("Invalid AI response format");
  } catch (error) {
    console.error("AI Discovery Error:", error);
    throw error;
  }
}
