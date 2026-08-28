import { createContext, useContext } from 'react';
import type { User } from '@supabase/supabase-js';

interface AccountContextValue {
  isConfigured: boolean;
  isLoading: boolean;
  user: User | null;
  displayName: string | null;
  errorMessage: string | null;
  restoreGuestSession: () => Promise<boolean>;
  signUpWithEmail: (email: string, password: string, displayName: string) => Promise<boolean>;
  signInWithEmail: (email: string, password: string) => Promise<boolean>;
  updateDisplayName: (displayName: string) => Promise<boolean>;
  deleteAccount: () => Promise<boolean>;
  signOut: () => Promise<void>;
}

const AccountContext = createContext<AccountContextValue | null>(null);

function useAccount(): AccountContextValue {
  const context = useContext(AccountContext);
  if (context === null) throw new Error('useAccount 必须在 AccountProvider 内使用。');
  return context;
}

export { AccountContext, useAccount };
