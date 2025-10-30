'use client'
import * as React from 'react'

// Use a type alias to avoid @typescript-eslint/no-empty-object-type
export type InputProps = React.InputHTMLAttributes<HTMLInputElement>

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => (
    <input ref={ref} className={className} {...props} />
  )
)
Input.displayName = 'Input'
