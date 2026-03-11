import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import SiteHeader from '../components/SiteHeader';
import ConversationList from '../components/ConversationList';
import ChatPanel from '../components/ChatPanel';
import type { Conversation } from '../types';

const INITIAL_CONVERSATIONS: Conversation[] = [
  {
    id: 1,
    name: '張先生',
    property: '中環豪華公寓',
    lastMessage: '請問這個單位還有嗎？',
    time: '10分鐘前',
    unread: 2,
    avatar: '👨',
    messages: [
      { from: 'them', text: '你好，請問呢個單位係咪仲有？', time: '14:22' },
      { from: 'them', text: '請問這個單位還有嗎？', time: '14:23' },
    ],
  },
  {
    id: 2,
    name: '李小姐',
    property: '銅鑼灣兩房單位',
    lastMessage: '好的，謝謝你的回覆',
    time: '1小時前',
    unread: 0,
    avatar: '👩',
    messages: [
      { from: 'me',   text: '你好！呢個單位係 2 月 15 號起租，月租 $18,000。', time: '12:05' },
      { from: 'them', text: '好的，謝謝你的回覆', time: '12:10' },
    ],
  },
  {
    id: 3,
    name: '王先生',
    property: '太子精品一房',
    lastMessage: '可以預約睇樓嗎？',
    time: '昨天',
    unread: 1,
    avatar: '🧑',
    messages: [
      { from: 'them', text: '你好，我對呢個單位有興趣！', time: '昨天 18:30' },
      { from: 'them', text: '可以預約睇樓嗎？', time: '昨天 18:31' },
    ],
  },
];

export default function MessagesPage() {
  const [searchParams] = useSearchParams();
  const [conversations, setConversations] = useState<Conversation[]>(INITIAL_CONVERSATIONS);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [mobileView, setMobileView] = useState<'list' | 'chat'>('list');

  const selected = conversations.find(c => c.id === selectedId) ?? null;

  // Auto-open conversation from property detail "聯絡房東" button
  useEffect(() => {
    const listingId = Number(searchParams.get('listingId'));
    const property  = searchParams.get('property') ?? '';
    const host      = searchParams.get('host') ?? '房東';
    if (!listingId) return;

    setConversations(prev => {
      const existing = prev.find(c => c.listingId === listingId);
      if (existing) {
        setSelectedId(existing.id);
        return prev.map(c => c.id === existing.id ? { ...c, unread: 0 } : c);
      }
      // Create a new conversation with an opening message from the host
      const newId = Date.now();
      const newConv: Conversation = {
        id: newId,
        name: '房東',
        property,
        lastMessage: `你好，我對「${property}」有興趣，請問仲有冇呢個單位？`,
        time: '剛才',
        unread: 0,
        avatar: '🏠',
        listingId,
        messages: [
          {
            from: 'me',
            text: `你好，我對「${property}」有興趣，請問仲有冇呢個單位？`,
            time: '剛才',
          },
        ],
      };
      setSelectedId(newId);
      return [newConv, ...prev];
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  function handleSelect(id: number) {
    setConversations(prev => prev.map(c => c.id === id ? { ...c, unread: 0 } : c));
    setSelectedId(id);
    setMobileView('chat');
  }

  function handleSend(convId: number, text: string, imageUrl?: string) {
    setConversations(prev => prev.map(c => {
      if (c.id !== convId) return c;
      return {
        ...c,
        lastMessage: imageUrl ? '📷 相片' : text,
        messages: [...c.messages, { from: 'me', text, time: '剛才', imageUrl }],
      };
    }));
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <SiteHeader showCategoryBar={false} />
      <div className="flex flex-1 max-w-layout mx-auto w-full shadow-sm bg-white rounded-b-xl overflow-hidden" style={{ height: 'calc(100vh - 82px)' }}>
        {/* Sidebar — full width on mobile when showing list, hidden when showing chat */}
        <div className={`flex-shrink-0 border-r border-border flex flex-col w-full md:w-[320px] ${mobileView === 'chat' ? 'hidden md:flex' : 'flex'}`}>
          <div className="px-4 py-4 border-b border-border">
            <h1 className="text-lg font-bold text-t1 mb-3">訊息</h1>
            <div className="flex items-center gap-2 border border-border rounded-pill px-3 py-2">
              <svg viewBox="0 0 24 24" fill="none" width="16" height="16">
                <circle cx="11" cy="11" r="7" stroke="#aaa" strokeWidth="2"/>
                <path d="M20 20l-3-3" stroke="#aaa" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              <input type="text" placeholder="搜尋訊息" className="text-sm outline-none flex-1 text-t1 placeholder:text-t3" />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            <ConversationList
              conversations={conversations}
              selectedId={selectedId}
              onSelect={handleSelect}
            />
          </div>
        </div>

        {/* Chat area — full width on mobile when showing chat, hidden when showing list */}
        <div className={`flex-1 flex flex-col min-w-0 ${mobileView === 'list' ? 'hidden md:flex' : 'flex'}`}>
          <ChatPanel
            conversation={selected}
            onSend={handleSend}
            onBack={() => setMobileView('list')}
          />
        </div>
      </div>
    </div>
  );
}
