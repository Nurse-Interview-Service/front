// components/ui/button.jsx
import React, { forwardRef } from "react";
import { cn } from "../../lib/utils"; // 상대경로로 변경

const _button = forwardRef(
  ({ className, variant = "default", size = "md", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-2xl text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
          {
            "bg-blue-500 text-white hover:bg-blue-600": variant === "default",
            "bg-transparent border border-gray-300 text-gray-700 hover:bg-gray-100": variant === "outline",
            "bg-transparent text-gray-500 hover:bg-gray-100": variant === "ghost",
            "bg-red-500 text-white hover:bg-red-600": variant === "destructive",
          },
          {
            "h-8 px-3": size === "sm",
            "h-10 px-4": size === "md",
            "h-12 px-6 text-base": size === "lg",
          },
          className
        )}
        {...props}
      />
    );
  }
);

_button.displayName = "Button";

export { _button };