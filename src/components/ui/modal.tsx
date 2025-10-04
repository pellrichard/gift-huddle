'use client';
import * as React from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/lib/utils';

type ModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
  className?: string;
};

export function Modal({ open, onOpenChange, children }: ModalProps) {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onOpenChange(false);
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onOpenChange]);

  if (!mounted) return null;
  return createPortal(
    <div
      aria-hidden={!open}
      className={cn('fixed inset-0 z-[1000]', open ? 'pointer-events-auto' : 'pointer-events-none')}
    >
      {/* Overlay */}
      <div
        className={cn(
          'absolute inset-0 transition-opacity duration-200',
          open ? 'bg-black/40 opacity-100' : 'opacity-0'
        )}
        onClick={() => onOpenChange(false)}
      />
      {/* Panel */}
      <div
        role="dialog"
        aria-modal="true"
        className={cn(
          'absolute left-1/2 top-1/2 w-[min(640px,92vw)] -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white shadow-xl transition-all duration-200',
          open ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        )}
      >
        {children}
      </div>
    </div>,
    document.body
  );
}

export function ModalHeader({ children, className }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('px-5 pt-5', className)}>{children}</div>;
}
export function ModalTitle({ children, className }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={cn('text-lg font-semibold', className)}>{children}</h3>;
}
export function ModalDescription({ children, className }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn('mt-1 text-sm text-gray-600', className)}>{children}</p>;
}
export function ModalBody({ children, className }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('px-5 py-4', className)}>{children}</div>;
}
export function ModalFooter({ children, className }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('flex items-center justify-end gap-2 px-5 pb-5', className)}>{children}</div>;
}
