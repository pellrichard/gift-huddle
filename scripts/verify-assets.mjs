// scripts/verify-assets.mjs
import { readFileSync, existsSync } from 'node:fs'
import path from 'node:path'
import process from 'node:process'

const required = [
  '/public/favicon.ico',
  '/public/apple-touch-icon.png',
  '/public/manifest.webmanifest',
  '/public/images/characters/hero-female.webp',
  '/app/layout.tsx',
  '/app/page.tsx',
  '/app/components/Header.tsx',
]

const repo = process.cwd()
let missing = []
for (const p of required) {
  const full = path.join(repo, p)
  if (!existsSync(full)) missing.push(p)
}

if (missing.length) {
  console.error('❌ Missing required files:\n' + missing.join('\n'))
  process.exit(1)
} else {
  console.log('✅ Asset verification passed.')
}
