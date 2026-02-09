import React from "react";
import { Button } from "../ui/Button";
import { Settings } from "@/hooks/useChat";

interface RightPanelProps {
    isOpen: boolean;
    onClose: () => void;
    currentSettings: Settings;
    onUpdateSettings: (s: Settings) => void;
}

export const RightPanel: React.FC<RightPanelProps> = ({ 
    isOpen, 
    onClose, 
    currentSettings,
    onUpdateSettings 
}) => {
  if (!isOpen) return null;

  return (
    <aside className="fixed inset-y-0 right-0 z-40 w-[var(--right-panel-width)] flex-col border-l border-border bg-surface shadow-xl transition-transform lg:static lg:flex lg:shadow-none animate-in slide-in-from-right duration-300">
      
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/5">
        <h2 className="text-sm font-semibold text-white">Settings</h2>
        <Button variant="ghost" size="icon" onClick={onClose} className="lg:hidden text-muted hover:text-white">
            <svg stroke="currentColor" fill="none" strokeWidth={2} viewBox="0 0 24 24" className="h-5 w-5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        
        {/* Model Selection */}
        <section>
            <h3 className="text-xs font-semibold text-muted uppercase tracking-wider mb-3">Model</h3>
            <div className="space-y-2">
                {["gpt-4o", "gpt-3.5-turbo", "claude-3"].map(model => (
                    <button
                        key={model}
                        onClick={() => onUpdateSettings({ ...currentSettings, model })}
                        className={`w-full flex items-center justify-between p-3 rounded-lg border text-sm transition-all ${
                            currentSettings.model === model 
                            ? "border-primary bg-primary/10 text-primary" 
                            : "border-white/10 text-text-secondary hover:bg-white/5"
                        }`}
                    >
                        <span className="capitalize">{model}</span>
                        {currentSettings.model === model && (
                            <div className="h-2 w-2 rounded-full bg-primary" />
                        )}
                    </button>
                ))}
            </div>
        </section>

        {/* Appearance */}
        <section>
             <h3 className="text-xs font-semibold text-muted uppercase tracking-wider mb-3">Appearance</h3>
             <div className="flex items-center justify-between p-3 rounded-lg border border-white/10 bg-page/50">
                <span className="text-sm text-text-primary">Theme</span>
                <div className="flex bg-black/20 rounded-lg p-1">
                    <button 
                        onClick={() => onUpdateSettings({ ...currentSettings, theme: "light" })}
                        className={`p-1.5 rounded-md transition-all ${currentSettings.theme === 'light' ? 'bg-white text-black shadow' : 'text-muted hover:text-white'}`}
                    >
                        <svg stroke="currentColor" fill="none" strokeWidth={2} viewBox="0 0 24 24" className="h-4 w-4"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
                    </button>
                    <button 
                        onClick={() => onUpdateSettings({ ...currentSettings, theme: "dark" })}
                        className={`p-1.5 rounded-md transition-all ${currentSettings.theme === 'dark' ? 'bg-surface text-white shadow' : 'text-muted hover:text-white'}`}
                    >
                        <svg stroke="currentColor" fill="none" strokeWidth={2} viewBox="0 0 24 24" className="h-4 w-4"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
                    </button>
                </div>
             </div>
        </section>

        {/* Response Style */}
        <section>
             <h3 className="text-xs font-semibold text-muted uppercase tracking-wider mb-3">Response Preference</h3>
             <div className="grid grid-cols-2 gap-2">
                 {(["short", "detailed"] as const).map(style => (
                     <button
                        key={style}
                        onClick={() => onUpdateSettings({ ...currentSettings, responseLength: style })}
                        className={`py-2 px-3 rounded-lg border text-xs font-medium capitalize transition-all ${
                            currentSettings.responseLength === style
                            ? "border-primary text-primary bg-primary/5"
                            : "border-white/10 text-muted hover:bg-white/5"
                        }`}
                     >
                         {style}
                     </button>
                 ))}
             </div>
        </section>

      </div>

      {/* Footer Info */}
      <div className="p-4 border-t border-white/5 text-center">
        <p className="text-[10px] text-muted">AI Assistant v2.0.1</p>
      </div>
    </aside>
  );
};
