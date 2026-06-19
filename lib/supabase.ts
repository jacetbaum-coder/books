import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabaseServerKey = supabaseServiceRoleKey ?? supabaseAnonKey;

export const supabase =
  supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null;

export const supabaseServer =
  supabaseUrl && supabaseServerKey
    ? createClient(supabaseUrl, supabaseServerKey, {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      })
    : null;
