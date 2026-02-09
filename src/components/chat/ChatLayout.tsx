"use client";

import React, { useState, useRef, useEffect } from "react";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { Message } from "./Message";
import { Composer } from "./Composer";
import { RightPanel } from "./RightPanel";
import { useChat } from "@/hooks/useChat";

export const ChatLayout: React.FC = () => {
  // Layout State
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Mobile drawer / Desktop sidebar
  const [isRightPanelOpen, setIsRightPanelOpen] = useState(false); // Mobile modal / Desktop panel

  // Core Logic
  const { 
    chats, 
    activeChat, 
    activeChatId,
    setActiveChatId, 
    createNewChat, 
    addMessage, 
    updateMessageContent,
    isLoading, 
    setIsLoading,
    settings,
    setSettings
  } = useChat();

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeChat?.messages, isLoading]);

  const handleSendMessage = async (content: string) => {
    // 1. Ensure active chat exists (create if null)
    let currentChatId = activeChatId;
    if (!currentChatId) {
        currentChatId = createNewChat();
    }

    // 2. Add user message
    addMessage(currentChatId, "user", content);
    setIsLoading(true);

    // 3. Simulate API Call (or real one)
    try {
      // Placeholder for Assistant Message to stream into
      const assistantMsg = addMessage(currentChatId, "assistant", "");
      
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{ role: "user", content }], // TODO: Send history
          responseLength: settings.responseLength,
        }),
      });

      if (!response.ok) throw new Error("Failed");

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let fullContent = "";

      if (reader) {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            const chunk = decoder.decode(value);
            fullContent += chunk;
            updateMessageContent(currentChatId, assistantMsg.id, fullContent);
          }
      }
    } catch (error) {
       console.error(error);
       addMessage(currentChatId, "assistant", "Sorry, I encountered an error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-page text-text-primary">
      
      {/* LEFT: Sidebar (Fixed width or Drawer) */}
      <Sidebar
        className="shrink-0"
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        chats={chats}
        activeChatId={activeChatId}
        onSelectChat={(id) => {
            setActiveChatId(id);
            if (window.innerWidth < 1024) setIsSidebarOpen(false); // Close on mobile select
        }}
        onNewChat={() => {
            createNewChat();
            if (window.innerWidth < 1024) setIsSidebarOpen(false);
        }}
      />

      {/* CENTER: Chat Area (Flexible) */}
      <main className="relative flex min-w-0 flex-1 flex-col overflow-hidden transition-all">
        
        {/* Mobile/Tablet Topbar */}
        <Topbar 
            onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
            onToggleSettings={() => setIsRightPanelOpen(!isRightPanelOpen)}
        />

        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto scroll-smooth p-4 custom-scrollbar">
          {!activeChat || activeChat.messages.length === 0 ? (
            // EMPTY STATE
            <div className="flex h-full flex-col items-center justify-center p-8 text-center animate-in fade-in duration-500">
                <div className="mb-6 rounded-full bg-primary/10 p-4 ring-1 ring-primary/20">
                     <svg stroke="currentColor" fill="none" strokeWidth={1.5} viewBox="0 0 24 24" className="h-10 w-10 text-primary"><path d="M12 2L2 7l10 5 10-5-10-5zm0 9l2.5-1.25L12 8.5l-2.5 1.25L12 11zm0 2.5l-5-2.5-5 2.5L12 22l10-8.5-5-2.5-5 2.5z"/></svg>
                </div>
                <h2 className="mb-2 text-2xl font-semibold text-white">How can I help you today?</h2>
                <p className="mb-8 text-muted max-w-md">I can write code, draft emails, summarize documents, and help you brainstorm ideas.</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl">
                    {[
                        { icon: "📝", label: "Draft a project proposal" },
                        { icon: "💻", label: "Write a React component" },
                        { icon: "✈️", label: "Plan a trip to Japan" },
                        { icon: "🧠", label: "Explain quantum computing" }
                    ].map((chip, i) => (
                        <button 
                            key={i}
                            onClick={() => handleSendMessage(chip.label)}
                            className="flex items-center gap-3 p-4 rounded-xl border border-white/5 bg-surface hover:bg-white/5 hover:border-primary/30 transition-all text-left group"
                        >
                            <span className="text-xl group-hover:scale-110 transition-transform">{chip.icon}</span>
                            <span className="text-sm font-medium text-text-secondary group-hover:text-white">{chip.label}</span>
                        </button>
                    ))}
                </div>
            </div>
          ) : (
            // MESSAGE LIST
            <div className="mx-auto max-w-3xl flex flex-col pb-32 pt-4">
               {activeChat.messages.map((msg) => (
                  <Message
                    key={msg.id}
                    role={msg.role}
                    content={msg.content}
                    isStreaming={isLoading && msg.id === activeChat.messages[activeChat.messages.length - 1].id}
                  />
               ))}
               <div ref={messagesEndRef} className="h-1" />
            </div>
          )}
        </div>

        {/* Sticky Composer */}
        <div className="w-full bg-gradient-to-t from-page via-page to-transparent p-4 md:p-6 pt-10">
             <div className="mx-auto max-w-3xl">
                 <Composer onSend={handleSendMessage} isDisabled={isLoading} />
                 <p className="mt-3 text-center text-[10px] text-muted opacity-60">The assistant can make mistakes. Please verify important information.</p>
             </div>
        </div>
      </main>

      {/* RIGHT: Utility Panel (Desktop: Fixed, Mobile: Modal) */}
       <RightPanel
           isOpen={isRightPanelOpen}
           onClose={() => setIsRightPanelOpen(false)}
           currentSettings={settings}
           onUpdateSettings={setSettings}
       />
       {/* Desktop toggle button for panel if closed? (Optional, kept simple for now) */}
       <div className="hidden lg:flex fixed top-4 right-4 z-50">
           <button 
                onClick={() => setIsRightPanelOpen(!isRightPanelOpen)}
                className={`p-2 rounded-lg text-muted hover:text-white transition-colors ${isRightPanelOpen ? "text-primary bg-primary/10" : "bg-surface border border-white/5"}`}
           >
                <svg stroke="currentColor" fill="none" strokeWidth={2} viewBox="0 0 24 24" className="h-5 w-5"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.1a2 2 0 0 1-1-1.72v-.51a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
           </button>
       </div>

    </div>
  );
};
