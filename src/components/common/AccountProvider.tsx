import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { User } from '@supabase/supabase-js';

import { getSupabaseClient, isSupabaseConfigured } from '@/services/supabaseClient';

import { AccountContext } from './accountContext';

interface AccountProviderProps {
  children: ReactNode;
}

interface GuestMigrationClaim {
  guestId: string;
  token: string;
}

const guestMigrationStorageKey = 'chinese-water-ecological-civilization:guest-migration-claim';

async function readGuestMigrationClaim(): Promise<GuestMigrationClaim | null> {
  const client = await getSupabaseClient();
  if (client === null) return null;
  const { data: userData } = await client.auth.getUser();
  if (userData.user === null || !userData.user.is_anonymous) return null;
  const { data, error } = await client.from('profiles').select('migration_token').eq('user_id', userData.user.id).maybeSingle();
  if (error !== null || data?.migration_token === undefined) return null;
  return { guestId: userData.user.id, token: data.migration_token as string };
}

async function claimGuestProgress(claim: GuestMigrationClaim | null): Promise<string | null> {
  if (claim === null) return null;
  const client = await getSupabaseClient();
  if (client === null) return null;
  const { error } = await client.rpc('claim_guest_progress', {
    p_guest_id: claim.guestId,
    p_migration_token: claim.token,
  });
  return error?.message ?? null;
}

function saveGuestMigrationClaim(claim: GuestMigrationClaim | null): void {
  if (claim === null || typeof window === 'undefined') return;
  window.localStorage.setItem(guestMigrationStorageKey, JSON.stringify(claim));
}

function getSavedGuestMigrationClaim(): GuestMigrationClaim | null {
  if (typeof window === 'undefined') return null;
  try {
    const stored = JSON.parse(window.localStorage.getItem(guestMigrationStorageKey) ?? 'null') as Partial<GuestMigrationClaim> | null;
    return typeof stored?.guestId === 'string' && typeof stored.token === 'string'
      ? { guestId: stored.guestId, token: stored.token }
      : null;
  } catch {
    return null;
  }
}

function clearSavedGuestMigrationClaim(): void {
  if (typeof window !== 'undefined') window.localStorage.removeItem(guestMigrationStorageKey);
}

function AccountProvider({ children }: AccountProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [displayName, setDisplayName] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(isSupabaseConfigured);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const readDisplayName = async (userId: string): Promise<void> => {
      const client = await getSupabaseClient();
      if (client === null) return;
      const { data } = await client.from('profiles').select('display_name').eq('user_id', userId).maybeSingle();
      if (isMounted) setDisplayName(typeof data?.display_name === 'string' ? data.display_name : null);
    };

    const initializeSession = async (): Promise<void> => {
      const client = await getSupabaseClient();
      if (client === null) return;
      const { data, error } = await client.auth.getSession();
      if (error !== null) {
        if (isMounted) setErrorMessage(error.message);
        return;
      }

      if (data.session !== null) {
        if (isMounted) setUser(data.session.user);
        void readDisplayName(data.session.user.id);
        return;
      }

      const anonymousResult = await client.auth.signInAnonymously();
      if (isMounted) {
        setUser(anonymousResult.data.user);
        setDisplayName(null);
        setErrorMessage(anonymousResult.error?.message ?? null);
      }
    };

    let unsubscribe: (() => void) | undefined;
    void initializeSession().then(async () => {
      const client = await getSupabaseClient();
      if (client === null || !isMounted) return;
      const { data: subscription } = client.auth.onAuthStateChange((_event, session) => {
        if (!isMounted) return;
        setUser(session?.user ?? null);
        if (session?.user.is_anonymous ?? true) {
          setDisplayName(null);
        } else if (session !== null) {
          void readDisplayName(session.user.id);
        }
      });
      unsubscribe = () => subscription.subscription.unsubscribe();
    }).finally(() => {
      if (isMounted) setIsLoading(false);
    });

    return () => {
      isMounted = false;
      unsubscribe?.();
    };
  }, []);

  const signUpWithEmail = useCallback(async (email: string, password: string, displayName?: string): Promise<boolean> => {
    const client = await getSupabaseClient();
    if (client === null) return false;
    const normalizedDisplayName = displayName?.trim() ?? '';
    if (normalizedDisplayName.length === 0) {
      setErrorMessage('请填写用户名。');
      return false;
    }
    setErrorMessage(null);
    const { data: currentUserData } = await client.auth.getUser();
    if (currentUserData.user === null || !currentUserData.user.is_anonymous) {
      setErrorMessage('当前游客会话不存在，请刷新页面后重试。');
      return false;
    }
    const normalizedEmail = email.trim().toLowerCase();
    const { data, error } = await client.auth.updateUser({
      email: normalizedEmail,
      password,
      data: { display_name: normalizedDisplayName },
    });
    if (error !== null) {
      setErrorMessage(error.message);
      return false;
    }

    // updateUser 在开启邮箱确认时也可能返回成功；必须确认会话已实际从匿名身份升级。
    const { data: sessionData, error: sessionError } = await client.auth.getSession();
    const upgradedUser = sessionData.session?.user ?? data.user;
    if (
      sessionError !== null
      || upgradedUser === null
      || upgradedUser.is_anonymous
      || upgradedUser.email?.toLowerCase() !== normalizedEmail
    ) {
      setErrorMessage('注册尚未完成。请确认 Supabase 已关闭 Email provider 的 Confirm email，然后使用新的测试邮箱重试。');
      return false;
    }

    const { error: profileError } = await client
      .from('profiles')
      .update({ display_name: normalizedDisplayName })
      .eq('user_id', upgradedUser.id);
    if (profileError !== null) {
      setErrorMessage(`账户已升级，但用户名保存失败：${profileError.message}`);
      return false;
    }

    setUser(upgradedUser);
    setDisplayName(normalizedDisplayName);
    return true;
  }, []);

  const signInWithEmail = useCallback(async (email: string, password: string): Promise<boolean> => {
    const client = await getSupabaseClient();
    if (client === null) return false;
    setErrorMessage(null);
    const guestClaim = await readGuestMigrationClaim();
    saveGuestMigrationClaim(guestClaim);
    const { error } = await client.auth.signInWithPassword({ email: email.trim(), password });
    if (error !== null) setErrorMessage(error.message);
    if (error === null) {
      const { data: sessionData } = await client.auth.getSession();
      const activeUser = sessionData.session?.user ?? null;
      const savedClaim = getSavedGuestMigrationClaim();
      const migrationError = activeUser !== null && savedClaim !== null && activeUser.id !== savedClaim.guestId
        ? await claimGuestProgress(savedClaim)
        : null;
      if (migrationError !== null) {
        setErrorMessage(`已登录，但游客学习记录尚未迁移：${migrationError}`);
        return false;
      }
      clearSavedGuestMigrationClaim();
    }
    return error === null;
  }, []);

  const updateDisplayName = useCallback(async (nextDisplayName: string): Promise<boolean> => {
    const client = await getSupabaseClient();
    const normalizedDisplayName = nextDisplayName.trim();
    if (client === null || user === null || user.is_anonymous) return false;
    if (normalizedDisplayName.length === 0) {
      setErrorMessage('用户名不能为空。');
      return false;
    }

    setErrorMessage(null);
    const { error: profileError } = await client
      .from('profiles')
      .update({ display_name: normalizedDisplayName })
      .eq('user_id', user.id);
    if (profileError !== null) {
      setErrorMessage(`用户名保存失败：${profileError.message}`);
      return false;
    }

    const { error: metadataError } = await client.auth.updateUser({ data: { display_name: normalizedDisplayName } });
    if (metadataError !== null) setErrorMessage(`用户名已保存，但账户资料同步失败：${metadataError.message}`);
    setDisplayName(normalizedDisplayName);
    return true;
  }, [user]);

  const deleteAccount = useCallback(async (): Promise<boolean> => {
    const client = await getSupabaseClient();
    if (client === null || user === null || user.is_anonymous) return false;
    setErrorMessage(null);

    // 删除 auth 用户会通过数据库外键级联删除其学习记录；管理员密钥仅在 Edge Function 内使用。
    const { error } = await client.functions.invoke('delete-own-account', { method: 'POST' });
    if (error !== null) {
      setErrorMessage(`账户注销失败：${error.message}`);
      return false;
    }

    await client.auth.signOut({ scope: 'local' });
    const { data: anonymousData, error: anonymousError } = await client.auth.signInAnonymously();
    setUser(anonymousData.user);
    setDisplayName(null);
    if (anonymousError !== null) setErrorMessage(anonymousError.message);
    return anonymousError === null;
  }, [user]);

  const signOut = useCallback(async (): Promise<void> => {
    const client = await getSupabaseClient();
    if (client === null) return;
    const { error } = await client.auth.signOut();
    if (error !== null) setErrorMessage(error.message);
    if (error === null) {
      const { data: anonymousData, error: anonymousError } = await client.auth.signInAnonymously();
      setUser(anonymousData.user);
      setDisplayName(null);
      if (anonymousError !== null) setErrorMessage(anonymousError.message);
    }
  }, []);

  const value = useMemo(() => ({
    isConfigured: isSupabaseConfigured,
    isLoading,
    user,
    displayName,
    errorMessage,
    signUpWithEmail,
    signInWithEmail,
    updateDisplayName,
    deleteAccount,
    signOut,
  }), [deleteAccount, displayName, errorMessage, isLoading, signInWithEmail, signOut, signUpWithEmail, updateDisplayName, user]);

  return <AccountContext.Provider value={value}>{children}</AccountContext.Provider>;
}

export { AccountProvider };
