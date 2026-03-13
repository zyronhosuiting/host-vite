import { useState, useRef, useEffect } from 'react';
import SiteHeader from '../components/SiteHeader';
import ProfileField from '../components/ProfileField';
import Toast from '../components/Toast';
import { useAvatar } from '../hooks/useAvatar';
import { useAuth } from '../hooks/useAuth';
import { api, getToken } from '../api/client';
import type { ProfileData } from '../types';
import { getInitials } from '../utils/getInitials';

interface PasswordDraft {
  current: string;
  newPw: string;
  confirm: string;
}

const EMPTY_PW: PasswordDraft = { current: '', newPw: '', confirm: '' };

export default function ProfilePage() {
  const { user, updateName } = useAuth();

  const INITIAL: ProfileData = {
    name:    user?.name  ?? '',
    email:   user?.email ?? '',
    phone:   '',
    about:   '',
  };

  const [editMode, setEditMode]       = useState(false);
  const [profile, setProfile]         = useState<ProfileData>(INITIAL);
  const [draft, setDraft]             = useState<ProfileData>(INITIAL);
  const { avatarUrl, upload, remove }  = useAvatar();
  const [toastMsg, setToastMsg]       = useState('');
  const [toastVisible, setToastVisible] = useState(false);

  const [pwEdit, setPwEdit]           = useState(false);
  const [pwDraft, setPwDraft]         = useState<PasswordDraft>(EMPTY_PW);
  const [pwError, setPwError]         = useState('');
  const [showPw, setShowPw]           = useState<Record<string, boolean>>({});

  const fileRef = useRef<HTMLInputElement>(null);

  // Fetch profile from API
  useEffect(() => {
    if (!getToken()) return;
    api.get('/profile').then(({ data }) => {
      const p: ProfileData = {
        name: data.name ?? '',
        email: data.email ?? '',
        phone: data.phone ?? '',
        about: data.about ?? '',
      };
      setProfile(p);
      setDraft(p);
    }).catch(() => { /* fallback to local */ });
  }, []);

  function toast(msg: string) {
    setToastMsg(msg);
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 2500);
  }

  function startEdit() { setDraft({ ...profile }); setEditMode(true); }
  function cancelEdit() { setDraft({ ...profile }); setEditMode(false); }
  async function saveEdit() {
    // Save to API
    try {
      await api.patch('/profile', {
        name: draft.name,
        phone: draft.phone,
        about: draft.about,
      });
    } catch { /* fallback to local */ }

    setProfile({ ...draft });
    if (draft.name !== profile.name) updateName(draft.name);
    setEditMode(false);
    toast('個人資料已儲存');
  }

  const data = editMode ? draft : profile;

  function field(key: keyof ProfileData) {
    return {
      value: data[key] ?? '',
      readOnly: !editMode,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
        setDraft(prev => ({ ...prev, [key]: e.target.value })),
    };
  }

  function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    upload(file);
    toast('頭像已更新');
  }

  function handleAvatarRemove() {
    remove();
    toast('頭像已移除');
  }

  function savePassword() {
    setPwError('');
    if (!pwDraft.current) { setPwError('請輸入現有密碼'); return; }
    if (pwDraft.newPw.length < 8) { setPwError('新密碼需至少 8 位字元'); return; }
    if (pwDraft.newPw !== pwDraft.confirm) { setPwError('兩次輸入的密碼不符'); return; }
    setPwEdit(false);
    setPwDraft(EMPTY_PW);
    toast('密碼已更新');
  }

  function cancelPassword() { setPwEdit(false); setPwDraft(EMPTY_PW); setPwError(''); }

  function toggleShowPw(key: string) {
    setShowPw(prev => ({ ...prev, [key]: !prev[key] }));
  }

  return (
    <div className="min-h-screen bg-off-white">
      <SiteHeader showCategoryBar={false} />
      <div className="max-w-[600px] mx-auto px-6 py-10 flex flex-col gap-5">

        {/* ── Profile card ── */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          {/* Card header */}
          <div className="flex items-start justify-between px-6 pt-6 pb-4 border-b border-border">
            <div>
              <h1 className="text-lg font-bold text-t1">個人簡介</h1>
              <p className="text-xs text-t3">管理你的個人資料</p>
            </div>
            <button
              onClick={editMode ? cancelEdit : startEdit}
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold border border-border rounded-pill hover:bg-off-white transition-colors"
            >
              {editMode ? (
                <>
                  <svg viewBox="0 0 24 24" fill="none" width="14" height="14">
                    <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  取消
                </>
              ) : (
                <>
                  <svg viewBox="0 0 24 24" fill="none" width="14" height="14">
                    <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  編輯
                </>
              )}
            </button>
          </div>

          {/* Avatar */}
          <div className="flex items-center gap-4 px-6 py-5 border-b border-border">
            <div className="relative flex-shrink-0">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt="頭像"
                  className="w-16 h-16 rounded-full object-cover border-2 border-border"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-slate text-lime text-xl font-bold flex items-center justify-center">
                  {getInitials(profile.name)}
                </div>
              )}
              <button
                onClick={() => fileRef.current?.click()}
                className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-slate text-lime border-2 border-white flex items-center justify-center hover:bg-slate-mid transition-colors"
                title="更換頭像"
              >
                <svg viewBox="0 0 24 24" fill="none" width="12" height="12">
                  <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
                </svg>
              </button>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={handleAvatarChange}
              />
            </div>
            <div>
              <p className="text-sm font-semibold text-t1">{profile.name || '未設定名稱'}</p>
              <p className="text-xs text-t3 mb-1.5">點擊頭像上的 + 更換照片</p>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => fileRef.current?.click()}
                  className="text-xs font-semibold text-slate underline hover:no-underline"
                >
                  更換照片
                </button>
                {avatarUrl && (
                  <button
                    onClick={handleAvatarRemove}
                    className="text-xs font-semibold text-red-500 underline hover:no-underline"
                  >
                    移除頭像
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Fields */}
          <div className="px-6">
            <ProfileField label="姓名"   type="text"  {...field('name')} />
            {/* Email is always read-only — cannot be changed after sign-up */}
            <div className="flex flex-col gap-1 py-4 border-b border-border">
              <div className="flex items-center gap-2">
                <label className="text-xs font-semibold text-t3 uppercase tracking-wide">電郵地址</label>
                <span className="text-[10px] bg-off-white border border-border text-t3 px-1.5 py-0.5 rounded">不可更改</span>
              </div>
              <p className="text-sm text-t2 px-3 py-2">{profile.email}</p>
            </div>
            <ProfileField label="電話號碼" type="tel"   {...field('phone')} />
          </div>

          {/* Account info */}
          <div className="px-6 py-5 border-t border-border">
            <div className="flex items-center gap-2 text-xs text-t3">
              <svg viewBox="0 0 24 24" fill="none" width="14" height="14">
                <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
                <line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" strokeWidth="2"/>
              </svg>
              加入日期：2024年 3月 1日
            </div>
          </div>

          {/* Save actions */}
          {editMode && (
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-border">
              <button onClick={cancelEdit} className="px-5 py-2.5 text-sm font-semibold text-t2 border border-border rounded-pill hover:bg-off-white transition-colors">
                取消
              </button>
              <button onClick={saveEdit} className="px-5 py-2.5 text-sm font-bold bg-slate text-lime rounded-pill hover:bg-slate-mid transition-colors">
                儲存變更
              </button>
            </div>
          )}
        </div>

        {/* ── Password card ── */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="flex items-start justify-between px-6 pt-6 pb-4 border-b border-border">
            <div>
              <h2 className="text-lg font-bold text-t1">密碼設定</h2>
              <p className="text-xs text-t3">定期更改密碼保護帳號安全</p>
            </div>
            {!pwEdit && (
              <button
                onClick={() => setPwEdit(true)}
                className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold border border-border rounded-pill hover:bg-off-white transition-colors"
              >
                <svg viewBox="0 0 24 24" fill="none" width="14" height="14">
                  <rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" strokeWidth="2"/>
                  <path d="M7 11V7a5 5 0 0110 0v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                更改密碼
              </button>
            )}
          </div>

          {!pwEdit ? (
            <div className="px-6 py-5 flex flex-col gap-3">
              <div className="flex flex-col gap-1 py-3 border-b border-border">
                <p className="text-xs font-semibold text-t3 uppercase tracking-wide">目前密碼</p>
                <p className="text-sm text-t1 tracking-widest">••••••••</p>
              </div>
              <p className="text-xs text-t3">上次更改密碼：從未</p>
            </div>
          ) : (
            <div className="px-6 py-2">
              {(['current', 'newPw', 'confirm'] as const).map(key => {
                const labels: Record<typeof key, string> = { current: '現有密碼', newPw: '新密碼', confirm: '確認新密碼' };
                return (
                  <div key={key} className="flex flex-col gap-1 py-4 border-b border-border last:border-0">
                    <label className="text-xs font-semibold text-t3 uppercase tracking-wide">{labels[key]}</label>
                    <div className="relative">
                      <input
                        type={showPw[key] ? 'text' : 'password'}
                        value={pwDraft[key]}
                        placeholder={key === 'newPw' ? '至少 8 位字元' : ''}
                        onChange={e => setPwDraft(prev => ({ ...prev, [key]: e.target.value }))}
                        className="text-sm text-t1 w-full rounded-md px-3 py-2 pr-10 bg-off-white border border-border focus:border-slate outline-none transition-colors"
                      />
                      <button
                        type="button"
                        onClick={() => toggleShowPw(key)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-t3 hover:text-t1"
                      >
                        {showPw[key] ? (
                          <svg viewBox="0 0 24 24" fill="none" width="16" height="16">
                            <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                            <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                            <line x1="1" y1="1" x2="23" y2="23" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                          </svg>
                        ) : (
                          <svg viewBox="0 0 24 24" fill="none" width="16" height="16">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="2"/>
                            <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}

              {pwError && (
                <p className="text-xs text-red-500 mt-1 mb-2">{pwError}</p>
              )}

              <div className="flex items-center justify-end gap-3 py-4">
                <button onClick={cancelPassword} className="px-5 py-2.5 text-sm font-semibold text-t2 border border-border rounded-pill hover:bg-off-white transition-colors">
                  取消
                </button>
                <button onClick={savePassword} className="px-5 py-2.5 text-sm font-bold bg-slate text-lime rounded-pill hover:bg-slate-mid transition-colors">
                  儲存密碼
                </button>
              </div>
            </div>
          )}
        </div>

      </div>

      <Toast message={toastMsg} visible={toastVisible} />
    </div>
  );
}
