"use client";
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "secondary" | "ghost" | "outline" | "destructive" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, asChild, ...props }, ref) => {
    const Comp: React.ElementType = asChild ? Slot : "button";
    return <Comp ref={ref} className={className} {...props} />;
  }
);

Button.displayName = "Button";