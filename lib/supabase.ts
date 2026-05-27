import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// 是否已配置 Supabase。未配置时页面/接口据此显示「请先配置」而不是崩溃。
export const supabaseConfigured = Boolean(url && anonKey);

export const supabase: SupabaseClient | null = supabaseConfigured
  ? createClient(url as string, anonKey as string)
  : null;
