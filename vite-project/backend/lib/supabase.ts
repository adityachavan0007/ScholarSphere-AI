import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  // We throw here because the backend CANNOT function without these.
  throw new Error('CRITICAL: Backend Supabase credentials (NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY) are missing.');
}

// Server-side client with service role for administrative tasks
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey);
