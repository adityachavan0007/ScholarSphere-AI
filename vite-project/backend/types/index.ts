export type IncomeBracket = 'low' | 'medium' | 'high';

export interface Certificate { id: string; name: string; fileUrl: string; }
export interface Project { id: string; name: string; description: string; tags: string[]; link?: string; }
export interface Experience { id: string; role: string; company: string; duration: string; description: string; }
export interface Education { id: string; degree: string; school: string; duration: string; details: string; }
export interface ActivityLog { id: string; date: string; action: string; }

export interface StudentProfile {
  id: string;
  name: string;
  headline: string;
  bio: string;
  location: string;
  website: string;
  github: string;
  youtube: string;
  avatarUrl: string;
  bannerUrl: string;
  college: string;
  degree: string;
  branch: string;
  year: number;
  cgpa: number;
  income_bracket: IncomeBracket;
  state: string;
  skills: string[];
  certificates: Certificate[];
  lookingFor: string[];
  projects: Project[];
  experiences: Experience[];
  education: Education[];
  recentActivity: ActivityLog[];
  domain_interests: string[];
  career_goal: string;
  created_at?: string;
  updated_at?: string;
}

export type OpportunityType = 'scholarship' | 'hackathon' | 'internship' | 'job';

export interface Opportunity {
  id: string;
  title: string;
  type: OpportunityType;
  domain_tag: string;
  eligible_states: string[];
  eligible_degrees: string[];
  min_cgpa: number;
  deadline_date: string;
  reward_summary: string;
  description: string;
  apply_url: string;
  created_at?: string;
}

export type MatchStatus = 'saved' | 'applied';

export interface Match {
  id: string;
  user_id: string;
  opportunity_id: string;
  fit_score: number;
  fit_reason_short: string;
  status: MatchStatus;
  created_at?: string;
}

export interface ApplicationDraft {
  id: string;
  user_id: string;
  opportunity_id: string;
  question_key: string;
  draft_answer: string;
  updated_at?: string;
}
