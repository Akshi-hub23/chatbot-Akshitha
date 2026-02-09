import { useState, useEffect } from "react";

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}

export interface Chat {
  id: string;
  title: string;
  messages: Message[];
  lastUpdated: number;
}

export interface Settings {
  theme: "light" | "dark";
  model: string;
  responseLength: "short" | "detailed";
}

const STORAGE_KEY = "ai_assistant_chats";
const SETTINGS_KEY = "ai_assistant_settings";

export function useChat() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [settings, setSettings] = useState<Settings>({
    theme: "dark",
    model: "gpt-4o",
    responseLength: "detailed",
  });

  // Load from local storage on mount
  useEffect(() => {
    const savedChats = localStorage.getItem(STORAGE_KEY);
    const savedSettings = localStorage.getItem(SETTINGS_KEY);

    if (savedChats) {
      setChats(JSON.parse(savedChats));
    }
    if (savedSettings) {
       const parsed = JSON.parse(savedSettings);
       setSettings(parsed);
       // Apply theme immediately
       document.documentElement.setAttribute("data-theme", parsed.theme);
    } else {
        // Default theme
        document.documentElement.setAttribute("data-theme", "dark");
    }
  }, []);

  // Save to local storage whenever chats change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(chats));
  }, [chats]);

  // Save settings
  useEffect(() => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    document.documentElement.setAttribute("data-theme", settings.theme);
  }, [settings]);

  const createNewChat = () => {
    const newChat: Chat = {
      id: crypto.randomUUID(),
      title: "New Chat",
      messages: [],
      lastUpdated: Date.now(),
    };
    setChats((prev) => [newChat, ...prev]);
    setActiveChatId(newChat.id);
    return newChat.id;
  };

  const deleteChat = (id: string) => {
    setChats((prev) => prev.filter((c) => c.id !== id));
    if (activeChatId === id) {
      setActiveChatId(null);
    }
  };

  const addMessage = (chatId: string, role: "user" | "assistant", content: string) => {
    const newMessage: Message = {
      id: crypto.randomUUID(),
      role,
      content,
      timestamp: Date.now(),
    };

    setChats((prev) =>
      prev.map((chat) => {
        if (chat.id === chatId) {
          return {
            ...chat,
            messages: [...chat.messages, newMessage],
            lastUpdated: Date.now(),
            // Auto-generate title if first user message
            title: chat.messages.length === 0 && role === "user" 
                ? content.slice(0, 30) + (content.length > 30 ? "..." : "")
                : chat.title
          };
        }
        return chat;
      })
    );
    return newMessage;
  };
  
  const updateMessageContent = (chatId: string, messageId: string, newContent: string) => {
      setChats((prev) => 
        prev.map(chat => {
            if (chat.id === chatId) {
                return {
                    ...chat,
                    messages: chat.messages.map(m => 
                        m.id === messageId ? { ...m, content: newContent } : m
                    )
                }
            }
            return chat;
        })
      )
  }

  const activeChat = chats.find((c) => c.id === activeChatId) || null;

  return {
    chats,
    activeChat,
    activeChatId,
    setActiveChatId,
    createNewChat,
    deleteChat,
    addMessage,
    updateMessageContent,
    isLoading,
    setIsLoading,
    settings,
    setSettings
  };
}
