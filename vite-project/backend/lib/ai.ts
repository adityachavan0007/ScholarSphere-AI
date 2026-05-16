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
 * Uses AI to discover/recommend trending opportunities (Hackathons, Scholarships, Internships).
 */
export async function discoverOpportunities(type: 'hackathon' | 'scholarship' | 'internship', query?: string) {
  const currentDate = new Intl.DateTimeFormat('en-IN', {
    timeZone: 'Asia/Kolkata',
    dateStyle: 'long'
  }).format(new Date());

  const discoveryPrompt = `
    Today is ${currentDate}. 
    
    TYPE: ${type.toUpperCase()}
    
    TASK: Generate a list of 5 REAL-WORLD, UP-TO-DATE upcoming ${type}s suitable for Indian engineering students.
    
    CRITICAL RULES:
    - YOU MUST PROVIDE THE LATEST DATA AVAILABLE. 
    - THE YEAR MUST BE 2026 OR 2027. 
    - All 'link' URLs must be VALID.
    - HACKATHONS: Use unstop.com or devfolio.co.
    - SCHOLARSHIPS: Use buddy4study.com or official organization sites.
    - INTERNSHIPS: Use unstop.com or company career portals (google.com, microsoft.com, etc.).
    - RETURN ONLY A JSON ARRAY.
    
    JSON Object Structure:
    - id: string (unique)
    - title: string
    - organizer: string
    - date: string (e.g., "Nov 20, 2026")
    - mode: "Online" | "Offline" | "Hybrid"
    - matchScore: number (80-99)
    - tags: string[]
    - status: "Registering" | "Live" | "Open"
    - participants: number
    - link: string (MUST BE VALID)
    
    Do not include any conversational text, only the JSON array.
  `;

  try {
    const result = await model.generateContent(discoveryPrompt);
    const text = result.response.text();
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (jsonMatch) return JSON.parse(jsonMatch[0]);
    throw new Error("Invalid AI response format");
  } catch (error) {
    console.error(`AI ${type} Discovery Error:`, error);
    throw error;
  }
}
