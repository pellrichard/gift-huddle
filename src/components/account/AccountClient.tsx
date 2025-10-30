'use client'
import React from 'react'

type Id = string | number

type Item = {
  id?: Id
  name?: string
  title?: string
  value?: Id
  [key: string]: unknown
}

type Props = Readonly<{
  allCategories?: ReadonlyArray<Item>
  allShops?: ReadonlyArray<Item>
  children?: React.ReactNode
}> &
  Record<string, unknown>

// Minimal, type-safe passthrough client component to satisfy Next.js default export
// without introducing lint errors. Replace with your full implementation when ready.
export default function AccountClient({ children }: Props) {
  return <>{children}</>
}
