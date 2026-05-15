import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Server-side client with service role for administrative tasks (if needed)
// Use the request session for user-specific tasks in route handlers
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey);

// Helper to create a client from a request (useful in App Router)
// Note: In a real app, you'd use @supabase/auth-helpers-nextjs or @supabase/ssr
// But for now, we'll implement a simple session check helper.
