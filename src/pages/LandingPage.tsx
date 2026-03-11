import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function LandingPage() {
  const [email, setEmail]     = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [count, setCount]     = useState(328);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setSubmitted(true);
    setCount(c => c + 1);
  }

  return (
    <div className="home-hero">
      <div className="w-full max-w-xl mx-auto flex flex-col items-center text-center gap-8">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-[10px] no-underline">
          <svg viewBox="0 0 40 40" fill="none" width="44" height="44">
            <circle cx="20" cy="20" r="20" fill="#c5ff3f"/>
            <path d="M20 8L8 18h4v14h7v-8h2v8h7V18h4L20 8z" fill="#111827"/>
          </svg>
          <span className="text-xl font-bold text-white tracking-tight">
            host<em className="not-italic text-white/50">living</em>
          </span>
        </Link>

        {/* Headline */}
        <h1 className="text-2xl md:text-[36px] font-bold text-white leading-tight">
          「租樓，原來可以咁簡單」
        </h1>

        {/* Sub */}
        <div className="flex flex-col gap-2">
          <p className="text-md text-white/70">全港第一免佣金租屋平台</p>
          <p className="text-sm text-white/50">港九新界，一睇即知邊區有免佣盤適合你</p>
        </div>

        {/* Form / Success */}
        {!submitted ? (
          <form onSubmit={handleSubmit} className="w-full flex flex-col sm:flex-row gap-3">
            <div className="flex-1 flex items-center gap-3 bg-white rounded-pill px-4 py-3 shadow-md">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-t3 flex-shrink-0">
                <rect width="20" height="16" x="2" y="4" rx="2"/>
                <path d="m22 7-8.97 5.7a1.94 1.94 0 01-2.06 0L2 7"/>
              </svg>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="輸入電郵，用HOST搵優惠免佣租盤"
                required
                className="flex-1 text-sm text-t1 outline-none placeholder:text-t3"
              />
            </div>
            <button type="submit" className="px-6 py-3 bg-lime text-slate font-bold text-sm rounded-pill hover:brightness-95 transition-all whitespace-nowrap">
              搶先使用
            </button>
          </form>
        ) : (
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-lime/20 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#c5ff3f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/>
                <polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
            </div>
            <h3 className="text-lg font-bold text-white">歡迎你加入 Host Living！</h3>
            <p className="text-sm text-white/60">我哋會在平台上線後，馬上通知你並為你提供更多優惠免佣租盤！</p>
          </div>
        )}

        {/* Count */}
        <p className="text-sm text-white/50">
          已有 <span className="text-lime font-bold">{count}+</span> 人搶先使用HOST
        </p>

        {/* Explore link */}
        <Link to="/search" className="flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors">
          立即搵樓
          <svg viewBox="0 0 24 24" fill="none" width="14" height="14">
            <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </Link>
      </div>
    </div>
  );
}
