"use client";
import * as React from "react";
import { cn } from "@/lib/utils";
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}
export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          "block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-pink-500 focus:ring-pink-500",
          className
        )}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";
