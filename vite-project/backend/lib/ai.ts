import { GoogleGenerativeAI } from "@google/generative-ai";

/**
 * AI Layer Wrapper for ScholarSphere AI
 */
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

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

<<<<<<< HEAD
const genAI = new GoogleGenerativeAI(process.env.VITE_GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({ 
    model: "gemini-1.5-flash",
    systemInstruction: "You are ScholarSphere AI, an elite AI copilot for Indian undergraduate students. Your tone is engineering-focused, slightly futuristic, and highly efficient. You help students find scholarships, hackathons, and internships. You can also help draft cover letters and application answers. Use terminal-style language occasionally (e.g., 'neural link established', 'scanning registers'). If you generate a long document (like a cover letter), format it clearly with markdown."
});

/**
 * General chat interaction with the AI model.
 */
export async function chatWithAI(prompt: string, history: { role: string; content: string }[]) {
  const chat = model.startChat({
    history: history.map(m => ({
      role: m.role === "user" ? "user" : "model",
      parts: [{ text: m.content }]
    }))
  });

  const result = await chat.sendMessage(prompt);
  return result.response.text();
=======
/**
 * Generates a chat response using Gemini.
 */
export async function generateChatResponse(prompt: string, history: { role: string, content: string }[]) {
  try {
    const chatSession = model.startChat({
      history: history.map(msg => ({
        role: msg.role === "user" ? "user" : "model",
        parts: [{ text: msg.content }]
      })),
    });

    const result = await chatSession.sendMessage(prompt);
    const response = await result.response;
    return response.text();
  } catch (error: any) {
    console.error("AI Generation Error:", error.message);
    throw new Error("Failed to generate AI response.");
  }
>>>>>>> f8b490a4ad8e25a6314792c851deba253c563ba8
}
