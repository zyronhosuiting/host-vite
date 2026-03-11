import { useAuth } from '../hooks/useAuth';
import { useAvatar } from '../hooks/useAvatar';
import { getInitials } from '../utils/getInitials';
import type { Conversation } from '../types';

interface ConversationListProps {
  conversations: Conversation[];
  selectedId: number | null;
  onSelect: (id: number) => void;
}

export default function ConversationList({ conversations, selectedId, onSelect }: ConversationListProps) {
  const { user } = useAuth();
  const { avatarUrl } = useAvatar();

  return (
    <div className="flex flex-col divide-y divide-border">
      {conversations.map(c => (
        <button
          key={c.id}
          onClick={() => onSelect(c.id)}
          className={`flex items-center gap-3 px-4 py-4 text-left hover:bg-off-white transition-colors ${
            selectedId === c.id ? 'bg-off-white' : ''
          }`}
        >
          {avatarUrl ? (
            <img src={avatarUrl} alt="avatar" className="w-10 h-10 rounded-full object-cover flex-shrink-0" />
          ) : (
            <div className="w-10 h-10 rounded-full bg-slate text-lime flex items-center justify-center text-sm font-bold flex-shrink-0">
              {getInitials(user?.name)}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-0.5">
              <span className="text-sm font-semibold text-t1">{user?.name || '房東'}</span>
              <span className="text-xs text-t3">{c.time}</span>
            </div>
            <p className="text-xs text-t3 truncate">{c.property}</p>
            <p className="text-xs text-t2 truncate">{c.lastMessage}</p>
          </div>
          {c.unread > 0 && (
            <span className="w-5 h-5 rounded-full bg-slate text-lime text-xs font-bold flex items-center justify-center flex-shrink-0">
              {c.unread}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
