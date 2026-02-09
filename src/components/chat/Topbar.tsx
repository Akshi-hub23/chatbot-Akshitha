import React from "react";
import { Button } from "../ui/Button";

interface TopbarProps {
  onToggleSidebar: () => void;
  onToggleSettings: () => void;
  title?: string;
}

export const Topbar: React.FC<TopbarProps> = ({ onToggleSidebar, onToggleSettings, title = "AI Assistant" }) => {
  return (
    <div className="sticky top-0 z-30 flex h-[var(--topbar-height)] items-center justify-between border-b border-white/5 bg-page p-2 md:hidden">
      <Button variant="ghost" size="icon" onClick={onToggleSidebar} aria-label="Toggle sidebar">
        <svg stroke="currentColor" fill="none" strokeWidth={2} viewBox="0 0 24 24" className="h-6 w-6"><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" /></svg>
      </Button>
      <div className="font-semibold text-text-primary text-sm">{title}</div>
      <Button variant="ghost" size="icon" onClick={onToggleSettings} aria-label="Toggle settings">
        <svg stroke="currentColor" fill="none" strokeWidth={2} viewBox="0 0 24 24" className="h-6 w-6"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.1a2 2 0 0 1-1-1.72v-.51a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
      </Button>
    </div>
  );
};

// Desktop topbar (model selector) is typically part of the main area top or hidden in simplified views
export const DesktopTopbar: React.FC = () => {
    return (
        <div className="sticky top-0 z-10 hidden md:flex h-[var(--topbar-height)] w-full items-center justify-between p-2 pl-4">
             <div className="flex items-center gap-2 rounded-lg bg-surface p-1">
                 <Button variant="secondary" size="sm" className="bg-page shadow-sm">GPT-4</Button>
                 <Button variant="ghost" size="sm" className="text-text-secondary">GPT-3.5</Button>
             </div>
             <div className="flex items-center gap-2">
                 <Button variant="ghost" size="icon">
                     <svg stroke="currentColor" fill="none" strokeWidth={2} viewBox="0 0 24 24" className="h-5 w-5"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>
                 </Button>
             </div>
        </div>
    )
}
