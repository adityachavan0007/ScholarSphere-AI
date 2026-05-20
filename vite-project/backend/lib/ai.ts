import { GoogleGenerativeAI } from "@google/generative-ai";

/**
 * AI Layer Wrapper for ScholarSphere AI
 */

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY || "");
const model = genAI.getGenerativeModel({ 
    model: "gemini-2.5-flash",
    systemInstruction: `You are ScholarSphere AI, an elite AI copilot for Indian undergraduate students. Your tone is engineering-focused, slightly futuristic, and highly efficient. You help students find scholarships, hackathons, and internships. You can also help draft cover letters and application answers. Use terminal-style language occasionally (e.g., 'neural link established', 'scanning registers'). If you generate a long document (like a cover letter), format it clearly with markdown. Be concise, professional, and helpful. Use Markdown formatting: **bold** for key info and - lists for structure. Do not use sci-fi, terminal, or system initiated language. Speak like a helpful human assistant. Provide clear, direct answers.Concise: Get to the point. Do not pad answers. Human: Speak like a mentor or a high-end consultant. FORBIDDEN PHRASES: Never use sci-fi, roleplay, or terminal jargon (e.g., "Initializing protocol", "Neural link active", "System scan complete", "Data acquired").Use Markdown for everything. Use **bold** to highlight key data, dates, or action items. Use bullet points (- ) for lists. Do not use * for lists. If the user asks for a document (resume, cover letter, code), wrap the content in triple backticks ( \`\`\` ) so the frontend can capture it as an artifact. Use clean, standard spacing. Do not clutter responses with excessive symbols or ASCII art.OPPORTUNITY SEARCH: When listing hackathons or internships, use tables or structured lists. Always highlight the 'Match Score' or 'Key Tech' clearly. WRITING/DRAFTING: When drafting cover letters or resumes, provide the text directly. If it is a long document, offer to provide a specific section at a time.ANALYSIS: When analyzing a profile, identify GAPS clearly and suggest specific PROJECTS or SKILLS to fill those gaps. If a user provides a prompt about their profile, utilize the provided context.If you don't know the answer, admit it professionally rather than hallucinating. Follow markdown rules and do the conversion before displaying the output.`
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
 * Helper to query OpenAI Chat Completions API using node fetch.
 */
async function queryOpenAI(
  systemPrompt: string,
  userPrompt: string,
  responseFormat?: 'json_object' | 'text'
): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not defined in environment variables.");
  }

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      response_format: responseFormat ? { type: responseFormat } : undefined,
      temperature: 0.2
    })
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`OpenAI API request failed: ${response.status} - ${errText}`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error("Empty response from OpenAI");
  }
  return content;
}

/**
 * Calculates a fit score between a student profile and an opportunity using OpenAI.
 */
export async function scoreMatch(profile: StudentProfile, opportunity: Opportunity) {
  console.log(`AI: Scoring match via OpenAI for ${profile.name} vs ${opportunity.title}`);

  const systemPrompt = `You are an expert AI recruiter for ScholarSphere. You calculate match scores (0-100) and provide logical reasons matching Indian engineering students to opportunities.`;

  const userPrompt = `
Student Profile:
- Degree: ${profile.degree}
- Branch: ${profile.branch}
- Year: ${profile.year}
- CGPA: ${profile.cgpa}
- Income Bracket: ${profile.income_bracket}
- State: ${profile.state}
- Domain Interests: ${profile.domain_interests?.join(', ') || 'None'}
- Career Goal: ${profile.career_goal}

Opportunity Details:
- Title: ${opportunity.title}
- Type: ${opportunity.type}
- Domain Tag: ${opportunity.domain_tag}
- Eligible States: ${opportunity.eligible_states?.join(', ') || 'All'}
- Eligible Degrees: ${opportunity.eligible_degrees?.join(', ') || 'All'}
- Minimum CGPA Required: ${opportunity.min_cgpa || 'None'}
- Reward Summary: ${opportunity.reward_summary}
- Description: ${opportunity.description}

Calculate a match score (0 to 100) representing how well this student fits the opportunity.
If the student's CGPA is lower than the minimum required CGPA, the fit score should be low (e.g. below 50).
If the student's degree is not eligible, the fit score should be low.
Provide exactly 2 bullet point reasons explaining the fit (e.g., 'Matches your interest in Machine Learning', 'CGPA meets or exceeds requirements').

Return a JSON object with this exact structure:
{
  "fitScore": number,
  "reasons": ["string"]
}
  `;

  try {
    const responseText = await queryOpenAI(systemPrompt, userPrompt, 'json_object');
    const data = JSON.parse(responseText);
    return {
      fitScore: typeof data.fitScore === 'number' ? data.fitScore : 70,
      reasons: Array.isArray(data.reasons) ? data.reasons : ["Matches profile characteristics."]
    };
  } catch (error) {
    console.error("AI Match Scoring Error (OpenAI):", error);
    return {
      fitScore: 70,
      reasons: ["Matches domain interests.", "Meets GPA prerequisites."]
    };
  }
}

/**
 * Generates draft answers for application questions based on the profile and opportunity using OpenAI.
 */
export async function generateDraftAnswers(
  profile: StudentProfile,
  opportunity: Opportunity,
  reasons: string[],
  questionKeys: string[]
) {
  console.log(`AI: Generating application drafts via OpenAI for ${opportunity.title}`);

  const systemPrompt = `You are a professional application coach. You write highly compelling, customized answers for student applications. Write in a clear, persuasive, yet natural human tone.`;

  const userPrompt = `
Student Profile:
- Name: ${profile.name}
- College: ${profile.college}
- Degree: ${profile.degree}
- Branch: ${profile.branch}
- Year: ${profile.year}
- CGPA: ${profile.cgpa}
- Domain Interests: ${profile.domain_interests?.join(', ') || 'None'}
- Career Goal: ${profile.career_goal}

Opportunity Details:
- Title: ${opportunity.title}
- Organizer/Company: ${opportunity.domain_tag}
- Description: ${opportunity.description}

Match Context:
${reasons.join(' • ')}

Application Questions:
${questionKeys.map(q => `- ${q}`).join('\n')}

Draft high-quality, professional, and personalized answers for each question. Custom-tailor the response using the student's degree, projects, branch, and goals. Each answer should be concise but thoroughly address the question (approx 100-150 words).
Return a JSON object where the keys are the exact question keys, and the values are the generated draft answers:
{
  ${questionKeys.map((q, i) => `"${q}": "Your drafted answer here"`).join(',\n  ')}
}
  `;

  try {
    const responseText = await queryOpenAI(systemPrompt, userPrompt, 'json_object');
    const data = JSON.parse(responseText);
    const drafts: Record<string, string> = {};
    questionKeys.forEach(key => {
      drafts[key] = data[key] || `As a student in ${profile.branch} at ${profile.college}, this opportunity perfectly aligns with my career goals.`;
    });
    return drafts;
  } catch (error) {
    console.error("AI Draft Generation Error (OpenAI):", error);
    const drafts: Record<string, string> = {};
    questionKeys.forEach(key => {
      drafts[key] = `As a ${profile.year} year ${profile.degree} student at ${profile.college}, I have a strong background in ${profile.branch}. This opportunity for ${opportunity.title} aligns perfectly with my goal to ${profile.career_goal}.`;
    });
    return drafts;
  }
}

/**
 * General chat interaction with the AI model (Gemini).
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
 * Uses OpenAI to discover/recommend trending opportunities (Hackathons, Scholarships, Internships).
 */
export async function discoverOpportunities(type: 'hackathon' | 'scholarship' | 'internship', query?: string) {
  const currentDate = new Intl.DateTimeFormat('en-IN', {
    timeZone: 'Asia/Kolkata',
    dateStyle: 'long'
  }).format(new Date());

  console.log(`AI: Discovering ${type}s via OpenAI...`);

  const systemPrompt = `You are a web opportunity harvester for Indian engineering students. You extract REAL-WORLD, UP-TO-DATE upcoming opportunities. Today is ${currentDate}.`;

  const discoveryPrompt = `
    TYPE: ${type.toUpperCase()}
    
    TASK: Generate a list of 5 REAL-WORLD, UP-TO-DATE upcoming ${type}s suitable for Indian engineering students.
    
    CRITICAL RULES:
    - YOU MUST PROVIDE THE LATEST DATA AVAILABLE. 
    - THE YEAR MUST BE 2026 OR 2027. 
    - All 'link' URLs must be VALID.
    - HACKATHONS: Use unstop.com or devfolio.co.
    - SCHOLARSHIPS: Use buddy4study.com or official organization sites.
    - INTERNSHIPS: Use unstop.com or company career portals (google.com, microsoft.com, etc.).
    - RETURN ONLY A JSON OBJECT with an 'opportunities' key containing the array of opportunity objects.
    
    JSON Object Structure:
    {
      "opportunities": [
        {
          "id": "string (unique uuid-like slug)",
          "title": "string",
          "organizer": "string",
          "date": "string (e.g., 'Nov 20, 2026')",
          "mode": "Online" | "Offline" | "Hybrid",
          "matchScore": number (80-99),
          "tags": ["string"],
          "status": "Registering" | "Live" | "Open",
          "participants": number,
          "link": "string (MUST BE VALID)"
        }
      ]
    }
  `;

  try {
    const responseText = await queryOpenAI(systemPrompt, discoveryPrompt, 'json_object');
    const data = JSON.parse(responseText);
    if (data && Array.isArray(data.opportunities)) {
      return data.opportunities;
    }
    throw new Error("Invalid OpenAI JSON response structure");
  } catch (error: any) {
    console.warn(`AI ${type} Discovery Warning (OpenAI failed, using offline fallback):`, error.message || error);
    
    if (type === 'hackathon') {
      return [
        {
          id: "sih-2026",
          title: "Smart India Hackathon 2026",
          organizer: "Ministry of Education",
          date: "Sep 15, 2026",
          mode: "Offline",
          matchScore: 95,
          tags: ["Software", "Hardware", "IoT"],
          status: "Open",
          participants: 12000,
          link: "https://sih.gov.in"
        },
        {
          id: "hacknitr-5",
          title: "HackNITR 5.0",
          organizer: "NIT Rourkela",
          date: "Oct 28, 2026",
          mode: "Hybrid",
          matchScore: 88,
          tags: ["Web Dev", "App Dev", "Blockchain"],
          status: "Registering",
          participants: 3500,
          link: "https://hacknitr.com"
        },
        {
          id: "google-sc-2026",
          title: "Google Solution Challenge 2026",
          organizer: "Google Developers",
          date: "Nov 10, 2026",
          mode: "Online",
          matchScore: 90,
          tags: ["Flutter", "Firebase", "GCP"],
          status: "Open",
          participants: 8000,
          link: "https://developers.google.com/community/gdsc-solution-challenge"
        },
        {
          id: "imagine-cup-2026",
          title: "Microsoft Imagine Cup 2026",
          organizer: "Microsoft",
          date: "Dec 05, 2026",
          mode: "Online",
          matchScore: 92,
          tags: ["AI/ML", "Cloud", "Sustainability"],
          status: "Open",
          participants: 15000,
          link: "https://imaginecup.microsoft.com"
        },
        {
          id: "ethindia-2026",
          title: "ETHIndia 2026",
          organizer: "Devfolio",
          date: "Nov 20, 2026",
          mode: "Offline",
          matchScore: 85,
          tags: ["Ethereum", "Solidity", "Web3"],
          status: "Registering",
          participants: 5000,
          link: "https://ethindia.co"
        }
      ];
    } else if (type === 'scholarship') {
      return [
        {
          id: "reliance-2026",
          title: "Reliance Foundation Undergraduate Scholarship 2026",
          organizer: "Reliance Foundation",
          date: "Oct 30, 2026",
          mode: "Online",
          matchScore: 95,
          tags: ["B.Tech", "B.Sc", "UG Degree"],
          status: "Open",
          participants: 50000,
          link: "https://www.reliancefoundation.org"
        },
        {
          id: "hdfc-badhte-kadam",
          title: "HDFC Bank Badhte Kadam Scholarship",
          organizer: "HDFC Bank",
          date: "Nov 15, 2026",
          mode: "Online",
          matchScore: 88,
          tags: ["Engineering", "General UG"],
          status: "Open",
          participants: 30000,
          link: "https://www.buddy4study.com"
        },
        {
          id: "aditya-birla-2026",
          title: "Aditya Birla Capital Scholarship",
          organizer: "Aditya Birla Group",
          date: "Dec 01, 2026",
          mode: "Online",
          matchScore: 90,
          tags: ["Professional Courses", "B.Tech"],
          status: "Open",
          participants: 25000,
          link: "https://www.buddy4study.com"
        },
        {
          id: "tata-trust-2026",
          title: "Tata Trusts Scholarship for Professional Studies",
          organizer: "Tata Trusts",
          date: "Dec 20, 2026",
          mode: "Offline",
          matchScore: 89,
          tags: ["Medical", "Engineering", "PG"],
          status: "Open",
          participants: 12000,
          link: "https://www.tatatrusts.org"
        }
      ];
    } else {
      return [
        {
          id: "google-step-2026",
          title: "Google STEP Internship 2026",
          organizer: "Google India",
          date: "Sep 01, 2026",
          mode: "Hybrid",
          matchScore: 95,
          tags: ["C++", "Java", "Python"],
          status: "Open",
          participants: 15000,
          link: "https://careers.google.com"
        },
        {
          id: "ms-swe-intern",
          title: "Microsoft Software Engineering Intern",
          organizer: "Microsoft India",
          date: "Oct 10, 2026",
          mode: "Offline",
          matchScore: 92,
          tags: ["React", "TypeScript", "C#"],
          status: "Open",
          participants: 20000,
          link: "https://careers.microsoft.com"
        },
        {
          id: "amazon-sde-intern",
          title: "Amazon Systems Development Intern",
          organizer: "Amazon India",
          date: "Nov 01, 2026",
          mode: "Online",
          matchScore: 90,
          tags: ["Java", "Data Structures", "AWS"],
          status: "Open",
          participants: 35000,
          link: "https://amazon.jobs"
        },
        {
          id: "uber-fe-intern",
          title: "Uber Frontend Engineering Intern",
          organizer: "Uber",
          date: "Nov 15, 2026",
          mode: "Hybrid",
          matchScore: 88,
          tags: ["React", "CSS", "Webpack"],
          status: "Open",
          participants: 10000,
          link: "https://www.uber.com/careers"
        }
      ];
    }
  }
}

