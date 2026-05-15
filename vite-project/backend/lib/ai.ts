/**
 * AI Layer Wrapper for ScholarSphere AI
 */

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
