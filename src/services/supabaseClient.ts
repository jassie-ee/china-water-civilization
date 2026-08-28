import type { SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

const isSupabaseConfigured = Boolean(supabaseUrl && supabasePublishableKey);

/** 未配置环境变量时保持 demo 模式，避免本地或 Pages 构建时意外请求云端。 */
let supabaseClient: SupabaseClient | null | undefined;

async function getSupabaseClient(): Promise<SupabaseClient | null> {
  if (!isSupabaseConfigured) return null;
  if (supabaseClient !== undefined) return supabaseClient;

  const { createClient } = await import('@supabase/supabase-js');
  supabaseClient = createClient(supabaseUrl, supabasePublishableKey, {
    auth: { persistSession: true, autoRefreshToken: true },
  });
  return supabaseClient;
}

export { getSupabaseClient, isSupabaseConfigured };
