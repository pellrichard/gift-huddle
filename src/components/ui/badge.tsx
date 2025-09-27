import * as React from "react";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "outline" | "success" | "warning";
}

const styles: Record<NonNullable<BadgeProps["variant"]>, string> = {
  default: "bg-gray-900 text-white",
  outline: "border border-gray-300 text-gray-800",
  success: "bg-emerald-100 text-emerald-800",
  warning: "bg-amber-100 text-amber-800",
};

export const Badge = ({ className = "", variant = "default", ...props }: BadgeProps) => (
  <span
    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${styles[variant]} ${className}`}
    {...props}
  />
);

export default Badge;
