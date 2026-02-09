import React from "react";
import { Avatar } from "../ui/Avatar";
import { Button } from "../ui/Button";

interface MessageProps {
  role: "user" | "assistant";
  content: string;
  isStreaming?: boolean;
}

export const Message: React.FC<MessageProps> = ({ role, content, isStreaming }) => {
  const isUser = role === "user";

  const formatAssistantContent = (raw: string) => {
    // Split into lines and normalize list/heading markdown into clean bullets
    const lines = raw.split(/\r?\n/);
    const formattedLines = lines.map((ln) => {
      let line = ln.trim();

      // Remove markdown headings (###, ##, etc.)
      line = line.replace(/^\s*#{1,6}\s+/, "");

      // Leading star lists -> bullet
      if (/^\*+\s+/.test(line)) {
        return "• " + line.replace(/^\*+\s+/, "").trim();
      }

      // Leading dash lists -> keep dash-style
      if (/^\-\s+/.test(line)) {
        return "- " + line.replace(/^\-\s+/, "").trim();
      }

      // Leading numbered lists -> normalize spacing
      if (/^\d+\.\s+/.test(line)) {
        const m = line.match(/^(\d+)\.\s+(.*)$/);
        if (m) return `${m[1]}. ${m[2].trim()}`;
      }

      return line;
    });

    // Remove common inline emphasis markers but preserve text
    let result = formattedLines.join("\n");
    result = result.replace(/\*\*([^*]+)\*\*/g, "$1");
    result = result.replace(/\*([^*]+)\*/g, "$1");
    result = result.replace(/__([^_]+)__/g, "$1");
    result = result.replace(/_([^_]+)_/g, "$1");

    return result;
  };

  return (
    <div className={`w-full py-4 px-4 md:px-8 group ${isUser ? "bg-transparent" : "bg-transparent"}`}>
      <div className={`mx-auto max-w-3xl flex gap-4 md:gap-6 ${isUser ? "flex-row-reverse" : "flex-row"}`}>
        
        {/* Avatar */}
        <div className="shrink-0 flex flex-col items-center">
            {isUser ? (
                 <div className="h-8 w-8 rounded-full overflow-hidden border border-white/10 shadow-sm flex items-center justify-center bg-surface">
                    <svg stroke="currentColor" fill="none" strokeWidth={2} viewBox="0 0 24 24" className="h-5 w-5 text-text-secondary"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                 </div>
            ) : (
                 <div className="h-8 w-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-sm shadow-primary/20">
                    <svg stroke="currentColor" fill="none" strokeWidth={2} viewBox="0 0 24 24" className="h-5 w-5"><path d="M12 2L2 7l10 5 10-5-10-5zm0 9l2.5-1.25L12 8.5l-2.5 1.25L12 11zm0 2.5l-5-2.5-5 2.5L12 22l10-8.5-5-2.5-5 2.5z"/></svg>
                 </div>
            )}
        </div>

        {/* Content Bubble */}
        <div className={`relative max-w-[85%] md:max-w-[75%] rounded-2xl p-4 shadow-sm ${
            isUser 
            ? "bg-surface text-text-primary rounded-tr-sm" 
            : "bg-surface/50 text-text-primary rounded-tl-sm border border-white/5"
        }`}>
            {/* Sender Name */}
            <div className={`text-[10px] uppercase tracking-wider font-bold mb-2 opacity-50 ${isUser ? "text-right" : "text-left"}`}>
                {isUser ? "You" : "AI Assistant"}
            </div>

            {/* Markdown/Text Content */}
            <div className={`prose prose-sm max-w-none break-words leading-relaxed ${isUser ? "prose-invert" : "prose-invert prose-p:text-text-primary prose-a:text-primary"}`}>
              {(isUser ? content : formatAssistantContent(content)).split("\n").map((line, i) => (
                <p key={i} className="min-h-[1em] mb-2 last:mb-0">{line}</p>
              ))}
                {isStreaming && (
                    <span className="ml-1 inline-block h-2 w-2 rounded-full animate-bounce bg-primary align-baseline" />
                )}
            </div>
        </div>

      </div>
    </div>
  );
};
