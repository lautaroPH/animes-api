import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.0.0';
import { load } from 'https://deno.land/std@0.177.0/dotenv/mod.ts';

const env = await load();

const supabaseUrl = env['SUPABASE_URL'];
const supabaseAnonKey = env['SUPABASE_ANON_KEY'];

console.log(supabaseAnonKey, supabaseUrl);

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
