import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Logo from '../components/Logo';

export default function SignInPage() {
  const navigate = useNavigate();
  const { signIn, signInWithGoogle } = useAuth();

  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw]     = useState(false);
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    await new Promise(r => setTimeout(r, 400));
    const err = signIn(email, password);
    setLoading(false);
    if (err === 'email_not_found')    { setError('找不到此電郵地址'); return; }
    if (err === 'invalid_credentials') { setError('密碼不正確'); return; }
    navigate('/');
  }

  function handleGoogle() {
    signInWithGoogle();
    navigate('/');
  }

  return (
    <div className="min-h-screen bg-slate flex flex-col items-center justify-center px-4 py-12">
      {/* Logo */}
      <div className="mb-10">
        <Logo light />
      </div>

      {/* Hero copy */}
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-white mb-4 leading-snug">
          「租樓，原來可以咁簡單」
        </h1>
        <p className="text-sm text-white/50 mb-1">全港第一免佣金租屋平台</p>
        <p className="text-sm text-white/40">港九新界，一睇即知邊區有免佣盤適合你</p>
      </div>

      {/* Card */}
      <div className="w-full max-w-[420px] bg-white/[0.06] border border-white/10 rounded-2xl overflow-hidden backdrop-blur-sm">
        <div className="px-8 pt-8 pb-6">
          <h2 className="text-lg font-bold text-white mb-1">歡迎回來</h2>
          <p className="text-sm text-white/40">登入你的帳號繼續使用</p>
        </div>

        <div className="px-8 pb-8 flex flex-col gap-4">
          {/* Google */}
          <button
            onClick={handleGoogle}
            className="w-full flex items-center justify-center gap-3 py-3 bg-white/10 border border-white/15 rounded-xl text-sm font-semibold text-white hover:bg-white/15 transition-colors"
          >
            <svg viewBox="0 0 24 24" width="18" height="18">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            以 Google 繼續
          </button>

          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-xs text-white/30">或</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <div className="flex items-center gap-3 bg-white/10 border border-white/15 rounded-xl px-4 py-3 focus-within:border-lime/60 transition-colors">
              <svg viewBox="0 0 24 24" fill="none" width="16" height="16" className="text-white/30 flex-shrink-0">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="currentColor" strokeWidth="2"/>
                <polyline points="22,6 12,13 2,6" stroke="currentColor" strokeWidth="2"/>
              </svg>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="電郵地址"
                required
                className="flex-1 bg-transparent text-sm text-white placeholder:text-white/30 outline-none"
              />
            </div>

            <div className="flex items-center gap-3 bg-white/10 border border-white/15 rounded-xl px-4 py-3 focus-within:border-lime/60 transition-colors">
              <svg viewBox="0 0 24 24" fill="none" width="16" height="16" className="text-white/30 flex-shrink-0">
                <rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" strokeWidth="2"/>
                <path d="M7 11V7a5 5 0 0110 0v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              <input
                type={showPw ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="密碼"
                required
                className="flex-1 bg-transparent text-sm text-white placeholder:text-white/30 outline-none"
              />
              <button type="button" onClick={() => setShowPw(v => !v)} className="text-white/30 hover:text-white/70 flex-shrink-0">
                {showPw ? (
                  <svg viewBox="0 0 24 24" fill="none" width="15" height="15">
                    <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    <line x1="1" y1="1" x2="23" y2="23" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" fill="none" width="15" height="15">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="2"/>
                    <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                )}
              </button>
            </div>

            <div className="flex justify-end">
              <button type="button" className="text-xs text-white/40 hover:text-white/70 transition-colors">忘記密碼？</button>
            </div>

            {error && (
              <p className="text-xs text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-lime text-slate rounded-xl font-bold text-sm hover:brightness-110 transition-all disabled:opacity-60 mt-1"
            >
              {loading ? '登入中…' : '登入'}
            </button>
          </form>
        </div>

        <div className="px-8 py-5 border-t border-white/10 text-center">
          <p className="text-sm text-white/40">
            還沒有帳號？{' '}
            <Link to="/signup" className="font-semibold text-lime hover:brightness-110 transition-all">立即免費註冊</Link>
          </p>
        </div>
      </div>

      {/* Back to browse */}
      <Link to="/search" className="mt-8 text-sm text-white/30 hover:text-white/60 transition-colors flex items-center gap-1.5">
        立即搵樓
        <svg viewBox="0 0 24 24" fill="none" width="14" height="14">
          <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </Link>
    </div>
  );
}
