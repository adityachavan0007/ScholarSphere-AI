-- Table for student profiles
CREATE TABLE student_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  headline TEXT,
  bio TEXT,
  location TEXT,
  website TEXT,
  github TEXT,
  youtube TEXT,
  avatar_url TEXT,
  banner_url TEXT,
  college TEXT,
  degree TEXT,
  branch TEXT,
  year INTEGER,
  cgpa NUMERIC(3, 2),
  income_bracket TEXT CHECK (income_bracket IN ('low', 'medium', 'high')),
  state TEXT,
  skills TEXT[],
  certificates JSONB DEFAULT '[]'::JSONB,
  looking_for TEXT[],
  projects JSONB DEFAULT '[]'::JSONB,
  experiences JSONB DEFAULT '[]'::JSONB,
  education_history JSONB DEFAULT '[]'::JSONB,
  recent_activity JSONB DEFAULT '[]'::JSONB,
  domain_interests TEXT[],
  career_goal TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table for opportunities
CREATE TABLE opportunities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  type TEXT CHECK (type IN ('scholarship', 'hackathon', 'internship', 'job')),
  domain_tag TEXT,
  eligible_states TEXT[],
  eligible_degrees TEXT[],
  min_cgpa NUMERIC(3, 2),
  deadline_date DATE,
  reward_summary TEXT,
  description TEXT,
  apply_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table for user matches and tracking
CREATE TABLE matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  opportunity_id UUID REFERENCES opportunities(id) ON DELETE CASCADE,
  fit_score NUMERIC(5, 2),
  fit_reason_short TEXT,
  status TEXT CHECK (status IN ('saved', 'applied')) DEFAULT 'saved',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, opportunity_id)
);

-- Table for application drafts
CREATE TABLE application_drafts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  opportunity_id UUID REFERENCES opportunities(id) ON DELETE CASCADE,
  question_key TEXT NOT NULL,
  draft_answer TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, opportunity_id, question_key)
);

-- Enable RLS
ALTER TABLE student_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE application_drafts ENABLE ROW LEVEL SECURITY;

-- Policies for student_profiles
CREATE POLICY "Users can view their own profile" ON student_profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON student_profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert their own profile" ON student_profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Policies for opportunities (Public view)
CREATE POLICY "Anyone can view opportunities" ON opportunities FOR SELECT USING (true);

-- Policies for matches
CREATE POLICY "Users can manage their own matches" ON matches FOR ALL USING (auth.uid() = user_id);

-- Policies for application_drafts
CREATE POLICY "Users can manage their own drafts" ON application_drafts FOR ALL USING (auth.uid() = user_id);
