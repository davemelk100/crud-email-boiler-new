import { createClient } from "@supabase/supabase-js";
import { env } from "@/services/config/env";

export const supabase = createClient(env.supabaseUrl, env.supabaseAnonKey);
