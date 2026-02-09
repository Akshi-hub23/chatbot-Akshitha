import React from "react";
import { Button } from "../ui/Button";
import { Chat } from "@/hooks/useChat";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  chats: Chat[];
  activeChatId: string | null;
  onSelectChat: (id: string) => void;
  onNewChat: () => void;
  className?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  chats,
  activeChatId,
  onSelectChat,
  onNewChat,
  className = "",
}) => {
  // Group chats by date (simplified)
  const today = new Date().toDateString();
  const recentChats = chats.filter(c => new Date(c.lastUpdated).toDateString() === today);
  const olderChats = chats.filter(c => new Date(c.lastUpdated).toDateString() !== today);

  const renderChatList = (list: Chat[], title: string) => {
      if (list.length === 0) return null;
      return (
        <div className="mb-6">
            <h3 className="mb-2 px-3 text-xs font-semibold uppercase text-muted tracking-wider">{title}</h3>
            <ul className="space-y-1">
                {list.map((chat) => (
                    <li key={chat.id}>
                        <button 
                            onClick={() => onSelectChat(chat.id)}
                            className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all text-left group ${
                                activeChatId === chat.id 
                                ? "bg-surface text-white" 
                                : "text-text-secondary hover:text-white hover:bg-white/5"
                            }`}
                        >
                            <svg stroke="currentColor" fill="none" strokeWidth={2} viewBox="0 0 24 24" className={`h-4 w-4 shrink-0 transition-colors ${activeChatId === chat.id ? "text-primary" : "text-muted group-hover:text-white"}`} ><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                            <span className="truncate">{chat.title || "New Chat"}</span>
                        </button>
                    </li>
                ))}
            </ul>
        </div>
      );
  };

  return (
    <>
      {/* Mobile Overlay */}
      <div
        className={`fixed inset-0 z-40 bg-black/50 transition-opacity md:hidden ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={onClose}
      />

      {/* Sidebar Container */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[var(--nav-width)] flex-col bg-page border-r border-border transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } ${className}`}
      >
        {/* Brand Header */}
        <div className="p-4 flex items-center gap-2 mb-2">
            <div className="text-primary">
                <svg stroke="currentColor" fill="none" strokeWidth={2} viewBox="0 0 24 24" className="h-6 w-6"><path d="M12 2L2 7l10 5 10-5-10-5zm0 9l2.5-1.25L12 8.5l-2.5 1.25L12 11zm0 2.5l-5-2.5-5 2.5L12 22l10-8.5-5-2.5-5 2.5z"/></svg>
            </div>
            <span className="font-bold text-lg tracking-tight text-white">AI Assistant</span>
        </div>

        {/* New Chat Button (Pill Style) */}
        <div className="px-4 mb-6">
          <Button
            onClick={onNewChat}
            className="w-full justify-start gap-3 rounded-full bg-primary hover:bg-primary/90 text-black font-semibold h-10 shadow-[0_0_15px_rgba(45,212,191,0.3)] transition-all active:scale-[0.98]"
          >
             <svg stroke="currentColor" fill="none" strokeWidth={2.5} viewBox="0 0 24 24" className="h-5 w-5"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
            New chat
          </Button>
        </div>

        {/* Conversation List */}
        <div className="flex-1 overflow-y-auto px-2 scrollbar-thin scrollbar-thumb-white/10">
          {renderChatList(recentChats, "Today")}
          {renderChatList(olderChats, "Previous")}
          
          {chats.length === 0 && (
              <div className="px-4 py-8 text-center text-muted text-sm">
                  <p>No chats yet.</p>
                  <p>Start a new conversation!</p>
              </div>
          )}
        </div>

        {/* User Profile (Dropdown Trigger) */}
        <div className="p-4 mt-auto border-t border-white/5">
          <button className="flex items-center gap-3 w-full p-2 rounded-lg hover:bg-white/5 transition-colors text-left group">
            <div className="h-9 w-9 rounded-full bg-surface border border-white/10 flex items-center justify-center text-text-secondary">
                  <svg stroke="currentColor" fill="none" strokeWidth={2} viewBox="0 0 24 24" className="h-5 w-5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
            </div>
            <div className="flex-1 overflow-hidden">
                <p className="text-sm font-medium text-white truncate">Assistant</p>
                <p className="text-xs text-muted truncate">Pro Plan</p>
            </div>
             <svg stroke="currentColor" fill="none" strokeWidth={2} viewBox="0 0 24 24" className="h-4 w-4 text-muted group-hover:text-white"><path d="M12 15l-5-5h10l-5 5z"/></svg>
          </button>
        </div>
      </aside>
    </>
  );
};
