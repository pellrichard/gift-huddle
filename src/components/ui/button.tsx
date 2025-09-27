"use client";
import * as React from "react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Matches common shadcn variants; kept optional so existing code compiles */
  variant?: "default" | "secondary" | "ghost" | "outline" | "destructive" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    // We ignore variant/size for now. Add classes here later if you want styling.
    return <button ref={ref} className={className} {...props} />;
  }
);
Button.displayName = "Button";