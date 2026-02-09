import React from "react";

interface AvatarProps {
  role: "user" | "assistant";
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({ role, className = "" }) => {
  const isUser = role === "user";

  return (
    <div
      className={`relative flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-sm text-white ${
        isUser ? "bg-accent" : "bg-primary"
      } ${className}`}
    >
      {isUser ? (
        <svg
          stroke="currentColor"
          fill="none"
          strokeWidth={2}
          viewBox="0 0 24 24"
          className="h-5 w-5"
        >
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx={12} cy={7} r={4} />
        </svg>
      ) : (
        <svg
          stroke="currentColor"
          fill="none"
          strokeWidth={2}
          viewBox="0 0 24 24"
          className="h-5 w-5"
        >
          <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 3a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm0 6.5a4.5 4.5 0 1 1 0 9 4.5 4.5 0 0 1 0-9z" />
        </svg>
      )}
    </div>
  );
};
