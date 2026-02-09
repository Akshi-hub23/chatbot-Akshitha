import React, { useRef, useEffect } from "react";

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  maxRows?: number;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className = "", maxRows = 5, onChange, ...props }, ref) => {
    const innerRef = useRef<HTMLTextAreaElement | null>(null);

    const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const textarea = e.target;
      textarea.style.height = "auto";
      textarea.style.height = `${Math.min(textarea.scrollHeight, maxRows * 24)}px`;
      if (onChange) onChange(e);
    };

    // Forward ref handling
    React.useImperativeHandle(ref, () => innerRef.current!);

    useEffect(() => {
        if(innerRef.current && props.value === "") {
             innerRef.current.style.height = "auto";
        }
    }, [props.value]);


    return (
      <textarea
        ref={innerRef}
        rows={1}
        className={`flex w-full resize-none bg-transparent py-3 px-0 text-sm placeholder:text-text-secondary focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
        onChange={handleInput}
        style={{ maxHeight: `${maxRows * 24}px` }}
        {...props}
      />
    );
  }
);

Textarea.displayName = "Textarea";
