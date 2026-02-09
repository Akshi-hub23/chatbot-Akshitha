import React, { useState, useRef } from "react";
import { Textarea } from "../ui/Textarea";
import { Button } from "../ui/Button";

interface ComposerProps {
  onSend: (message: string) => void;
  isDisabled?: boolean;
}

export const Composer: React.FC<ComposerProps> = ({ onSend, isDisabled }) => {
  const [input, setInput] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(chunksRef.current, { type: "audio/webm" });
        const formData = new FormData();
        formData.append("file", audioBlob, "recording.webm");

        try {
          // Visual feedback that we are processing
          setInput("Transcribing...");
          
          const response = await fetch("/api/transcribe", {
            method: "POST",
            body: formData,
          });

          if (!response.ok) throw new Error("Transcription failed");

          const data = await response.json();
          if (data.text) {
            setInput(data.text);
            // Auto resize textarea
            if (textareaRef.current) {
                textareaRef.current.style.height = "auto";
                textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
            }
          }
        } catch (error) {
          console.error("Transcription error:", error);
          setInput(""); // Clear generic loading text
          alert("Failed to transcribe audio. Please try again.");
        } finally {
            // Cleanup stream tracks
            stream.getTracks().forEach(track => track.stop());
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Error accessing microphone:", error);
      alert("Microphone access denied or not available.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isDisabled) return;
    onSend(input);
    setInput("");
    if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="w-full pt-2 px-4 pb-4">
      <div className="mx-auto max-w-[var(--content-max-width)] stretch">
        <div className="relative flex w-full flex-col rounded-xl border border-black/10 bg-white p-3 shadow-md dark:border-white/10 dark:bg-gray-800 dark:shadow-none ring-offset-2 focus-within:ring-2 ring-primary/50">
           {/* Upload & Input Row */}
           <div className="flex items-end gap-2">
                <Button variant="ghost" size="icon" className="mb-0.5 rounded-full text-text-secondary">
                     <svg stroke="currentColor" fill="none" strokeWidth={2} viewBox="0 0 24 24" className="h-5 w-5"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>
                </Button>
                
                <div className="relative flex-1">
                    <Textarea
                        ref={textareaRef}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={isRecording ? "Listening..." : "Message Assistant..."}
                        className={`max-h-[200px] w-full ${isRecording ? "animate-pulse placeholder:text-red-500" : ""}`}
                        disabled={isDisabled || isRecording}
                        aria-label="Message input"
                    />
                </div>
                
                {input.trim() ? (
                     <Button 
                        onClick={() => handleSubmit()}
                        disabled={!input.trim() || isDisabled}
                        variant="primary" 
                        size="icon" 
                        className="mb-0.5 rounded-lg transition-all"
                        aria-label="Send message"
                    >
                        <svg stroke="currentColor" fill="none" strokeWidth={2} viewBox="0 0 24 24" className="h-4 w-4"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                    </Button>
                ) : (
                    <Button 
                        onClick={isRecording ? stopRecording : startRecording}
                        disabled={isDisabled}
                        variant="ghost" 
                        size="icon" 
                        className={`mb-0.5 rounded-lg transition-all ${isRecording ? "text-red-500 bg-red-500/10 hover:bg-red-500/20" : "text-text-secondary hover:text-white"}`}
                        aria-label={isRecording ? "Stop recording" : "Start recording"}
                    >
                        {isRecording ? (
                             <svg stroke="currentColor" fill="none" strokeWidth={2} viewBox="0 0 24 24" className="h-5 w-5 animate-pulse"><rect x="6" y="6" width="12" height="12" rx="2" /></svg>
                        ) : (
                             <svg stroke="currentColor" fill="none" strokeWidth={2} viewBox="0 0 24 24" className="h-5 w-5"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>
                        )}
                    </Button>
                )}
           </div>
        </div>
        <div className="px-2 py-2 text-center text-xs text-text-secondary/50">
             The assistant can make mistakes. Consider checking important information.
        </div>
      </div>
    </div>
  );
};
