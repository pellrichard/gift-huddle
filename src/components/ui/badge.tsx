'use client'
import * as React from 'react'
import { cn } from '@/lib/utils'

type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline'
}

const base =
  'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium'
const variants: Record<NonNullable<BadgeProps['variant']>, string> = {
  default: 'bg-gray-900 text-white',
  secondary: 'bg-gray-100 text-gray-800',
  destructive: 'bg-red-600 text-white',
  outline: 'border border-gray-200 text-gray-800',
}

export function Badge({
  className,
  variant = 'secondary',
  ...props
}: BadgeProps) {
  return <span className={cn(base, variants[variant], className)} {...props} />
}
