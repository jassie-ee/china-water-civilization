import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Origin': '*',
};

/** 只删除当前 JWT 对应的用户；管理员密钥仅存在于函数服务端。 */
Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (request.method !== 'POST') return Response.json({ error: 'Method not allowed' }, { status: 405, headers: corsHeaders });

  const authorization = request.headers.get('Authorization');
  if (authorization === null) return Response.json({ error: 'Authentication required' }, { status: 401, headers: corsHeaders });

  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const anonKey = Deno.env.get('SUPABASE_ANON_KEY');
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  if (supabaseUrl === undefined || anonKey === undefined || serviceRoleKey === undefined) {
    return Response.json({ error: 'Server configuration is incomplete' }, { status: 500, headers: corsHeaders });
  }

  const userClient = createClient(supabaseUrl, anonKey, { global: { headers: { Authorization: authorization } } });
  const { data: userData, error: userError } = await userClient.auth.getUser();
  if (userError !== null || userData.user === null || userData.user.is_anonymous) {
    return Response.json({ error: 'A signed-in account is required' }, { status: 401, headers: corsHeaders });
  }

  const adminClient = createClient(supabaseUrl, serviceRoleKey);
  const { error: deleteError } = await adminClient.auth.admin.deleteUser(userData.user.id);
  if (deleteError !== null) return Response.json({ error: deleteError.message }, { status: 500, headers: corsHeaders });

  return Response.json({ deleted: true }, { headers: corsHeaders });
});
