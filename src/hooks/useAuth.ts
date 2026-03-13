import { useState, useEffect, useCallback } from 'react';
import { api, setToken, clearToken, getToken } from '../api/client';

const SESSION_CHANGE = 'hl_session_change';
const SESSION_KEY = 'hl_session';

export type AuthProvider = 'email';

export interface AuthUser {
  id: number;
  email: string;
  name: string;
  provider: AuthProvider;
}

export type AuthError = 'email_taken' | 'invalid_credentials' | 'email_not_found' | 'unknown';

function readSession(): AuthUser | null {
  try { return JSON.parse(localStorage.getItem(SESSION_KEY) ?? 'null'); } catch { return null; }
}

function writeSession(user: AuthUser | null) {
  if (user) localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  else localStorage.removeItem(SESSION_KEY);
  window.dispatchEvent(new CustomEvent(SESSION_CHANGE));
}

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(readSession);

  // Stay in sync when any component calls writeSession (same tab)
  useEffect(() => {
    function onSessionChange() { setUser(readSession()); }
    window.addEventListener(SESSION_CHANGE, onSessionChange);
    return () => window.removeEventListener(SESSION_CHANGE, onSessionChange);
  }, []);

  // On mount, if we have a token but no session, try to restore from /auth/me
  useEffect(() => {
    if (getToken() && !readSession()) {
      api.get('/auth/me').then(({ data }) => {
        const session: AuthUser = {
          id: data.id,
          email: data.email,
          name: data.name,
          provider: data.provider,
        };
        writeSession(session);
        setUser(session);
      }).catch(() => {
        clearToken();
      });
    }
  }, []);

  const signUp = useCallback(async (email: string, password: string, name: string): Promise<AuthError | null> => {
    try {
      const { data } = await api.post('/auth/signup', { email, password, name });
      setToken(data.accessToken);
      const session: AuthUser = {
        id: data.user.id,
        email: data.user.email,
        name: data.user.name,
        provider: data.user.provider,
      };
      writeSession(session);
      setUser(session);
      return null;
    } catch (err: any) {
      const status = err.response?.status;
      if (status === 409) return 'email_taken';
      return 'unknown';
    }
  }, []);

  const signIn = useCallback(async (email: string, password: string): Promise<AuthError | null> => {
    try {
      const { data } = await api.post('/auth/signin', { email, password });
      setToken(data.accessToken);
      const session: AuthUser = {
        id: data.user.id,
        email: data.user.email,
        name: data.user.name,
        provider: data.user.provider,
      };
      writeSession(session);
      setUser(session);
      return null;
    } catch (err: any) {
      const msg = err.response?.data?.message ?? '';
      if (msg.includes('找不到')) return 'email_not_found';
      if (msg.includes('密碼')) return 'invalid_credentials';
      return 'unknown';
    }
  }, []);

  const signOut = useCallback(() => {
    clearToken();
    writeSession(null);
    setUser(null);
  }, []);

  const updateName = useCallback(async (name: string) => {
    try {
      await api.patch('/profile', { name });
      const current = readSession();
      if (current) {
        const updated: AuthUser = { ...current, name };
        writeSession(updated);
        setUser(updated);
      }
    } catch {
      // fallback: update locally
      const current = readSession();
      if (current) {
        const updated: AuthUser = { ...current, name };
        writeSession(updated);
        setUser(updated);
      }
    }
  }, []);

  return { user, signUp, signIn, signOut, updateName };
}
