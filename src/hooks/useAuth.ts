import { useState, useEffect } from 'react';

const SESSION_CHANGE = 'hl_session_change';

export type AuthProvider = 'email' | 'google';

export interface AuthUser {
  email: string;
  name: string;
  provider: AuthProvider;
}

interface StoredUser {
  email: string;
  name: string;
  passwordHash: string; // base64 of password (demo only — no real hashing)
}

const SESSION_KEY = 'hl_session';
const USERS_KEY   = 'hl_users';

function readSession(): AuthUser | null {
  try { return JSON.parse(localStorage.getItem(SESSION_KEY) ?? 'null'); } catch { return null; }
}

function readUsers(): StoredUser[] {
  try { return JSON.parse(localStorage.getItem(USERS_KEY) ?? '[]'); } catch { return []; }
}

function writeUsers(users: StoredUser[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function writeSession(user: AuthUser | null) {
  if (user) localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  else localStorage.removeItem(SESSION_KEY);
  window.dispatchEvent(new CustomEvent(SESSION_CHANGE));
}

function encode(pw: string) { return btoa(unescape(encodeURIComponent(pw))); }

export type AuthError = 'email_taken' | 'invalid_credentials' | 'email_not_found';

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(readSession);

  // Stay in sync when any component calls writeSession (same tab)
  useEffect(() => {
    function onSessionChange() { setUser(readSession()); }
    window.addEventListener(SESSION_CHANGE, onSessionChange);
    return () => window.removeEventListener(SESSION_CHANGE, onSessionChange);
  }, []);

  function signUp(email: string, password: string, name: string): AuthError | null {
    const users = readUsers();
    if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) return 'email_taken';
    const newUser: StoredUser = { email: email.toLowerCase(), name, passwordHash: encode(password) };
    writeUsers([...users, newUser]);
    const session: AuthUser = { email: email.toLowerCase(), name, provider: 'email' };
    writeSession(session);
    setUser(session);
    return null;
  }

  function signIn(email: string, password: string): AuthError | null {
    const users = readUsers();
    const found = users.find(u => u.email === email.toLowerCase());
    if (!found) return 'email_not_found';
    if (found.passwordHash !== encode(password)) return 'invalid_credentials';
    const session: AuthUser = { email: found.email, name: found.name, provider: 'email' };
    writeSession(session);
    setUser(session);
    return null;
  }

  function signInWithGoogle() {
    // Demo: simulate Google OAuth with a mock account
    const session: AuthUser = { email: 'garywong@gmail.com', name: 'Gary Wong', provider: 'google' };
    writeSession(session);
    setUser(session);
  }

  function signOut() {
    writeSession(null);
    setUser(null);
  }

  function updateName(name: string) {
    const current = readSession();
    if (!current) return;
    const updated: AuthUser = { ...current, name };
    writeSession(updated);
    setUser(updated);
  }

  return { user, signUp, signIn, signInWithGoogle, signOut, updateName };
}
