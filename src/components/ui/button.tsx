"use client";
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "size"> {
  variant?: "default" | "secondary" | "ghost" | "outline" | "destructive" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  asChild?: boolean;
}

const base =
  "inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none disabled:opacity-50 disabled:pointer-events-none rounded-md";

const variantClasses: Record<NonNullable<ButtonProps["variant"]>, string> = {
  default: "bg-gray-900 text-white hover:bg-gray-800",
  secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200",
  ghost: "hover:bg-gray-100",
  outline: "border border-gray-300 hover:bg-gray-50",
  destructive: "bg-red-600 text-white hover:bg-red-700",
  link: "underline underline-offset-4 text-blue-600 hover:text-blue-700",
};

const sizeClasses: Record<NonNullable<ButtonProps["size"]>, string> = {
  default: "h-10 px-4 py-2",
  sm: "h-9 px-3",
  lg: "h-11 px-8",
  icon: "h-10 w-10",
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, asChild, variant = "default", size = "default", ...props }, ref) => {
    const Comp: React.ElementType = asChild ? Slot : "button";
    const classes = cn(base, variantClasses[variant], sizeClasses[size], className);
    return <Comp ref={ref} className={classes} {...props} />;
  }
);

Button.displayName = "Button";
