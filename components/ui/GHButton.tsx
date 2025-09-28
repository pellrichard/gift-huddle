import * as React from "react";

type Variant = "primary" | "secondary" | "outline" | "ghost" | "link";
type Size = "sm" | "md" | "lg";

export type GHButtonProps = {
  children: React.ReactNode;
  variant?: Variant;
  size?: Size;
  className?: string;
  href?: string;
  target?: string;
  rel?: string;
  disabled?: boolean;
  fullWidth?: boolean;
  onClick?: React.MouseEventHandler<HTMLElement>;
  type?: "button" | "submit" | "reset";
  ariaLabel?: string;
};

function cx(...parts: Array<string | false | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

export const GHButton = React.forwardRef<HTMLElement, GHButtonProps>(function GHButton(
  {
    children,
    variant = "primary",
    size = "md",
    className,
    href,
    target,
    rel,
    disabled,
    fullWidth,
    onClick,
    type = "button",
    ariaLabel,
  },
  ref
) {
  const base = "gh-btn";
  const cls = cx(
    base,
    variant && `${base}--${variant}`,
    size && `${base}--${size}`,
    fullWidth && `${base}--block`,
    disabled && "is-disabled",
    className
  );

  if (href) {
    return (
      <a
        ref={ref as React.Ref<HTMLAnchorElement>}
        href={href}
        target={target}
        rel={rel}
        className={cls}
        aria-label={ariaLabel}
        onClick={onClick as React.MouseEventHandler<HTMLAnchorElement>}
      >
        {children}
      </a>
    );
  }

  return (
    <button
      ref={ref as React.Ref<HTMLButtonElement>}
      type={type}
      className={cls}
      aria-label={ariaLabel}
      disabled={disabled}
      onClick={onClick as React.MouseEventHandler<HTMLButtonElement>}
    >
      {children}
    </button>
  );
});
