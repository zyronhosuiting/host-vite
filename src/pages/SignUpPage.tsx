import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Logo from '../components/Logo';

function InputRow({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 bg-white/10 border border-white/15 rounded-xl px-4 py-3 focus-within:border-lime/60 transition-colors">
      <span className="text-white/30 flex-shrink-0">{icon}</span>
      {children}
    </div>
  );
}

export default function SignUpPage() {
  const navigate = useNavigate();
  const { signUp } = useAuth();

  const [name, setName]         = useState('');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm]   = useState('');
  const [showPw, setShowPw]     = useState(false);
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    if (password.length < 8) { setError('密碼需至少 8 位字元'); return; }
    if (password !== confirm)  { setError('兩次輸入的密碼不符'); return; }
    setLoading(true);
    const err = await signUp(email, password, name);
    setLoading(false);
    if (err === 'email_taken') { setError('此電郵地址已被使用'); return; }
    if (err === 'unknown')     { setError('註冊失敗，請稍後再試'); return; }
    navigate('/');
  }

  const eyeOff = (
    <svg viewBox="0 0 24 24" fill="none" width="15" height="15">
      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <line x1="1" y1="1" x2="23" y2="23" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
  const eyeOn = (
    <svg viewBox="0 0 24 24" fill="none" width="15" height="15">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="2"/>
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
    </svg>
  );

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
          <h2 className="text-lg font-bold text-white mb-1">建立免費帳號</h2>
          <p className="text-sm text-white/40">加入香港最大免佣租屋平台</p>
        </div>

        <div className="px-8 pb-8 flex flex-col gap-4">
          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <InputRow icon={
              <svg viewBox="0 0 24 24" fill="none" width="16" height="16">
                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
              </svg>
            }>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="你的名字"
                required
                className="flex-1 bg-transparent text-sm text-white placeholder:text-white/30 outline-none"
              />
            </InputRow>

            <InputRow icon={
              <svg viewBox="0 0 24 24" fill="none" width="16" height="16">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="currentColor" strokeWidth="2"/>
                <polyline points="22,6 12,13 2,6" stroke="currentColor" strokeWidth="2"/>
              </svg>
            }>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="電郵地址（登入後不可更改）"
                required
                className="flex-1 bg-transparent text-sm text-white placeholder:text-white/30 outline-none"
              />
            </InputRow>

            <InputRow icon={
              <svg viewBox="0 0 24 24" fill="none" width="16" height="16">
                <rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" strokeWidth="2"/>
                <path d="M7 11V7a5 5 0 0110 0v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            }>
              <input
                type={showPw ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="密碼（至少 8 位字元）"
                required
                className="flex-1 bg-transparent text-sm text-white placeholder:text-white/30 outline-none"
              />
              <button type="button" onClick={() => setShowPw(v => !v)} className="text-white/30 hover:text-white/70 flex-shrink-0">
                {showPw ? eyeOff : eyeOn}
              </button>
            </InputRow>

            <InputRow icon={
              <svg viewBox="0 0 24 24" fill="none" width="16" height="16">
                <rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" strokeWidth="2"/>
                <path d="M7 11V7a5 5 0 0110 0v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            }>
              <input
                type={showPw ? 'text' : 'password'}
                value={confirm}
                onChange={e => setConfirm(e.target.value)}
                placeholder="確認密碼"
                required
                className="flex-1 bg-transparent text-sm text-white placeholder:text-white/30 outline-none"
              />
            </InputRow>

            {error && (
              <p className="text-xs text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-lime text-slate rounded-xl font-bold text-sm hover:brightness-110 transition-all disabled:opacity-60 mt-1"
            >
              {loading ? '建立帳號中…' : '搶先使用'}
            </button>

            <p className="text-[11px] text-white/25 text-center">
              建立帳號即代表你同意我們的服務條款及私隱政策
            </p>
          </form>
        </div>

        <div className="px-8 py-5 border-t border-white/10 text-center">
          <p className="text-sm text-white/40">
            已有帳號？{' '}
            <Link to="/signin" className="font-semibold text-lime hover:brightness-110 transition-all">立即登入</Link>
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
