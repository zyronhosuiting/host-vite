import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useAvatar } from '../hooks/useAvatar';
import { getInitials } from '../utils/getInitials';
import type { Conversation } from '../types';

interface ChatPanelProps {
  conversation: Conversation | null;
  onSend: (convId: number, text: string, imageUrl?: string) => void;
  onBack?: () => void;
}

export default function ChatPanel({ conversation, onSend, onBack }: ChatPanelProps) {
  const [text, setText] = useState('');
  const [pendingImages, setPendingImages] = useState<string[]>([]);
  const bottomRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();
  const { avatarUrl } = useAvatar();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation?.messages.length]);

  if (!conversation) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-3 text-t3">
        <svg viewBox="0 0 24 24" fill="none" width="56" height="56">
          <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"
                stroke="#ccc" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <p className="text-sm">選擇對話開始聊天</p>
      </div>
    );
  }

  function send() {
    if (!conversation) return;
    if (pendingImages.length > 0) {
      pendingImages.forEach(img => onSend(conversation.id, '', img));
      setPendingImages([]);
    }
    if (text.trim()) {
      onSend(conversation.id, text.trim());
      setText('');
    }
  }

  function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = () => setPendingImages(prev => [...prev, reader.result as string]);
      reader.readAsDataURL(file);
    });
    e.target.value = '';
  }

  function removePending(idx: number) {
    setPendingImages(prev => prev.filter((_, i) => i !== idx));
  }

  return (
    <div className="flex-1 flex flex-col min-h-0">
      {/* Header */}
      <div className="px-4 py-3 border-b border-border flex items-center gap-3">
        {onBack && (
          <button onClick={onBack} className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full hover:bg-off-white transition-colors">
            <svg viewBox="0 0 24 24" fill="none" width="18" height="18">
              <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        )}
        {avatarUrl ? (
          <img src={avatarUrl} alt="avatar" className="w-10 h-10 rounded-full object-cover flex-shrink-0" />
        ) : (
          <div className="w-10 h-10 rounded-full bg-slate text-lime flex items-center justify-center text-sm font-bold flex-shrink-0">
            {getInitials(user?.name)}
          </div>
        )}
        <div className="min-w-0">
          <p className="text-sm font-semibold text-t1 truncate">{user?.name || '房東'}</p>
          <p className="text-xs text-t3 truncate">{conversation.property}</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-4">
        {conversation.messages.map((m, i) => (
          <div key={i} className={`flex items-end gap-2 ${m.from === 'me' ? 'flex-row-reverse' : ''}`}>
            {m.from === 'them' && (
              <div className="w-7 h-7 rounded-full bg-off-white flex items-center justify-center text-sm flex-shrink-0">
                {conversation.avatar}
              </div>
            )}
            {m.imageUrl ? (
              <img
                src={m.imageUrl}
                alt="sent"
                className="max-w-[60%] rounded-2xl object-cover cursor-pointer"
                onClick={() => window.open(m.imageUrl, '_blank')}
              />
            ) : (
              <div className={`max-w-[70%] px-4 py-2 rounded-2xl text-sm ${
                m.from === 'me'
                  ? 'bg-slate text-lime rounded-br-sm'
                  : 'bg-off-white text-t1 rounded-bl-sm'
              }`}>
                {m.text}
              </div>
            )}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Image preview strip */}
      {pendingImages.length > 0 && (
        <div className="px-4 pt-3 pb-1 border-t border-border flex items-center gap-2 flex-wrap">
          {pendingImages.map((src, i) => (
            <div key={i} className="relative flex-shrink-0">
              <img src={src} alt="preview" className="w-16 h-16 rounded-xl object-cover border border-border" />
              <button
                onClick={() => removePending(i)}
                className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-slate text-lime flex items-center justify-center shadow-sm"
              >
                <svg viewBox="0 0 24 24" fill="none" width="10" height="10">
                  <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
                </svg>
              </button>
            </div>
          ))}
          <button
            onClick={() => fileRef.current?.click()}
            className="w-16 h-16 rounded-xl border-2 border-dashed border-border flex items-center justify-center text-t3 hover:border-slate hover:text-t1 transition-colors flex-shrink-0"
            title="再加相片"
          >
            <svg viewBox="0 0 24 24" fill="none" width="20" height="20">
              <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
      )}

      {/* Input bar */}
      <div className={`px-4 py-3 flex items-center gap-2 ${pendingImages.length > 0 ? '' : 'border-t border-border'}`}>
        <button
          onClick={() => fileRef.current?.click()}
          className="w-9 h-9 rounded-full flex items-center justify-center text-t3 hover:bg-off-white hover:text-t1 transition-colors flex-shrink-0"
          title="傳送相片"
        >
          <svg viewBox="0 0 24 24" fill="none" width="20" height="20">
            <rect x="3" y="3" width="18" height="18" rx="3" stroke="currentColor" strokeWidth="1.8"/>
            <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor"/>
            <path d="M21 15l-5-5L5 21" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <input ref={fileRef} type="file" accept="image/*" multiple className="sr-only" onChange={handleImageUpload} />
        <input
          type="text"
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && (text.trim() || pendingImages.length > 0)) send(); }}
          placeholder="輸入訊息…"
          className="flex-1 border border-border rounded-pill px-4 py-2 text-sm text-t1 outline-none focus:border-slate transition-colors"
        />
        <button
          onClick={send}
          className="w-9 h-9 rounded-full bg-slate text-lime flex items-center justify-center hover:bg-slate-mid transition-colors flex-shrink-0"
        >
          <svg viewBox="0 0 24 24" fill="none" width="16" height="16">
            <line x1="22" y1="2" x2="11" y2="13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <polygon points="22 2 15 22 11 13 2 9 22 2" fill="currentColor"/>
          </svg>
        </button>
      </div>
    </div>
  );
}
