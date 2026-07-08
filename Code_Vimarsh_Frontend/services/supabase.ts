import { createClient } from '@supabase/supabase-js';

const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL || '').replace(/['"]/g, '');
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || '').replace(/['"]/g, '');

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
