import { useEffect, useRef, useState, type FormEvent } from 'react';
import { useLocation } from 'react-router-dom';

import { useAccount } from './accountContext';

import './AccountMenu.css';

function AccountMenu() {
  const {
    isConfigured,
    isLoading,
    user,
    displayName,
    errorMessage,
    restoreGuestSession,
    signInWithEmail,
    signOut,
    signUpWithEmail,
    updateDisplayName,
    deleteAccount,
  } = useAccount();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<'sign-in' | 'sign-up'>('sign-in');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [isDeleteConfirming, setIsDeleteConfirming] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const isAnonymous = user?.is_anonymous === true;
  const isAccountUnavailable = !isLoading && user === null;
  const closeMenu = (): void => {
    setIsOpen(false);
    setIsEditingName(false);
    setIsDeleteConfirming(false);
    window.requestAnimationFrame(() => triggerRef.current?.focus());
  };

  useEffect(() => {
    if (!isOpen) return undefined;
    const handleEscape = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') closeMenu();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    setIsSubmitting(true);
    const didSucceed = mode === 'sign-in'
      ? await signInWithEmail(email, password)
      : await signUpWithEmail(email, password, username);
    setIsSubmitting(false);
    if (didSucceed) {
      setPassword('');
      closeMenu();
    }
  };

  const handleNameSave = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    setIsSubmitting(true);
    const didSucceed = await updateDisplayName(username);
    setIsSubmitting(false);
    if (didSucceed) setIsEditingName(false);
  };

  const handleDeleteAccount = async (): Promise<void> => {
    setIsDeleting(true);
    const didSucceed = await deleteAccount();
    setIsDeleting(false);
    if (didSucceed) closeMenu();
  };

  const handleRestoreGuest = async (): Promise<void> => {
    setIsSubmitting(true);
    const didRestore = await restoreGuestSession();
    setIsSubmitting(false);
    if (didRestore) {
      setMode('sign-up');
      setPassword('');
    }
  };

  if (!isConfigured || location.pathname === '/') return null;

  return (
    <>
      <button
        ref={triggerRef}
        className={`account-menu__trigger${isAccountUnavailable ? ' account-menu__trigger--error' : ''}`}
        type="button"
        onClick={() => setIsOpen(true)}
      >
        {isLoading ? '连接中…' : isAccountUnavailable ? (
          <><UserIcon /><span>账户连接异常</span></>
        ) : isAnonymous ? (
          <><UserIcon /><span>游客账户</span></>
        ) : (
          <span className="account-menu__identity"><UserIcon /><span>{displayName ?? '水生态工程师'}</span></span>
        )}
      </button>
      {isOpen && (
        <div className="account-menu__backdrop" role="presentation" onClick={closeMenu}>
          <section className="account-menu" role="dialog" aria-modal="true" aria-labelledby="account-menu-title" onClick={(event) => event.stopPropagation()}>
            <button className="account-menu__close" type="button" aria-label="关闭账户面板" onClick={closeMenu}>×</button>
            {(isAnonymous || isAccountUnavailable) ? (
              <>
                <p className="account-menu__eyebrow">WATER ENGINEER ID</p>
                <h2 id="account-menu-title">{isAccountUnavailable ? '账户连接异常' : mode === 'sign-in' ? '登录账户' : '创建账户'}</h2>
                <p className="account-menu__description">
                  {isAccountUnavailable
                    ? '未能建立游客会话。你仍可登录已有账户，或重新连接后注册。'
                    : '登录后可保留当前游客学习记录，并在不同设备继续体验。'}
                </p>
                <form onSubmit={handleSubmit}>
                  {isAnonymous && mode === 'sign-up' && <label>用户名<input value={username} maxLength={24} autoComplete="nickname" onChange={(event) => setUsername(event.target.value)} required /></label>}
                  <label>邮箱<input value={email} type="email" autoComplete="email" onChange={(event) => setEmail(event.target.value)} required /></label>
                  <label>密码<input value={password} type="password" minLength={6} autoComplete={isAnonymous && mode === 'sign-up' ? 'new-password' : 'current-password'} onChange={(event) => setPassword(event.target.value)} required /></label>
                  {errorMessage !== null && <p className="account-menu__error" role="alert">{errorMessage}</p>}
                  <button className="account-menu__submit" type="submit" disabled={isSubmitting || isLoading || (isAccountUnavailable && mode === 'sign-up')}>
                    {isSubmitting ? '处理中…' : isAnonymous && mode === 'sign-up' ? '注册并绑定记录' : '登录'}
                  </button>
                </form>
                {isAccountUnavailable ? (
                  <button className="account-menu__switch" type="button" disabled={isSubmitting} onClick={() => void handleRestoreGuest()}>
                    {isSubmitting ? '正在重新连接…' : '重新连接游客会话'}
                  </button>
                ) : (
                  <button className="account-menu__switch" type="button" disabled={isLoading || isSubmitting} onClick={() => setMode(mode === 'sign-in' ? 'sign-up' : 'sign-in')}>
                    {mode === 'sign-in' ? '还没有账户？创建账户' : '已有账户？返回登录'}
                  </button>
                )}
              </>
            ) : (
              <>
                <p className="account-menu__eyebrow">WATER ENGINEER ID</p>
                <div className="account-menu__title-row">
                  <h2 id="account-menu-title">{displayName ?? '水生态工程师'}</h2>
                  <button
                    className="account-menu__edit-name"
                    type="button"
                    aria-label="编辑用户名"
                    title="编辑用户名"
                    onClick={() => { setUsername(displayName ?? ''); setIsEditingName(true); }}
                  >
                    <PencilIcon />
                  </button>
                </div>
                <p className="account-menu__description">{user?.email ?? '当前学习记录已绑定至此账户。'}</p>
                {errorMessage !== null && <p className="account-menu__error" role="alert">{errorMessage}</p>}
                {isEditingName && (
                  <form className="account-menu__name-form" onSubmit={handleNameSave}>
                    <label>用户名<input value={username} maxLength={24} autoComplete="nickname" onChange={(event) => setUsername(event.target.value)} required autoFocus /></label>
                    <div className="account-menu__inline-actions">
                      <button className="account-menu__submit" type="submit" disabled={isSubmitting}>{isSubmitting ? '保存中…' : '保存用户名'}</button>
                      <button className="account-menu__text-button" type="button" onClick={() => setIsEditingName(false)}>取消</button>
                    </div>
                  </form>
                )}
                {isDeleteConfirming ? (
                  <div className="account-menu__danger-zone" role="alert">
                    <p>确认永久注销此账户？云端积分与答题记录将无法恢复。</p>
                    <div className="account-menu__confirm-actions">
                      <button className="account-menu__confirm-icon account-menu__confirm-icon--danger" type="button" aria-label="确认永久注销账户" title="确认永久注销" disabled={isDeleting} onClick={() => void handleDeleteAccount()}>{isDeleting ? '…' : '√'}</button>
                      <button className="account-menu__confirm-icon" type="button" aria-label="取消注销账户" title="取消" disabled={isDeleting} onClick={() => setIsDeleteConfirming(false)}>×</button>
                    </div>
                  </div>
                ) : (
                  <div className="account-menu__account-actions">
                    <button className="account-menu__account-action account-menu__logout-button" type="button" onClick={() => void signOut()}>退出登录</button>
                    <button className="account-menu__account-action account-menu__delete-button" type="button" onClick={() => setIsDeleteConfirming(true)}>注销账户</button>
                  </div>
                )}
              </>
            )}
          </section>
        </div>
      )}
    </>
  );
}

function UserIcon() {
  return (
    <svg className="account-menu__avatar" viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="8" r="3.25" />
      <path d="M5.75 20c.65-3.35 3.04-5.1 6.25-5.1s5.6 1.75 6.25 5.1" />
    </svg>
  );
}

function PencilIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m14.6 5.3 4.1 4.1M5 19l3.1-.7L19 7.4a1.45 1.45 0 0 0 0-2.05l-.35-.35a1.45 1.45 0 0 0-2.05 0L5.7 15.9 5 19Z" />
    </svg>
  );
}

export default AccountMenu;
