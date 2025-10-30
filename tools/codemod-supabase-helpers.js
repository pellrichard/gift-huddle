/**
 * Codemod: migrate legacy Supabase helpers to explicit safe factories.
 * Usage:
 *   node tools/codemod-supabase-helpers.js .
 */
const fs = require('fs')
const path = require('path')

const root = process.argv[2] || '.'

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      walk(p, out)
    } else if (/\.(ts|tsx)$/.test(entry.name)) {
      out.push(p)
    }
  }
  return out
}

const files = walk(root)
const changed = []

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8')
  if (!/from\s+['"]@\/lib\/supabase\/server['"]/.test(content)) continue

  const original = content

  // Import renames
  content = content.replace(
    /\bcreateServerSupabase\b/g,
    'createServerComponentClient'
  )
  content = content.replace(
    /\bcreateRouteHandlerSupabase\b/g,
    'createRouteHandlerClient'
  )
  content = content.replace(/\bcreateClient\b/g, 'createRouteHandlerClient')

  // Callsite fixes: strip any arguments
  content = content.replace(
    /\bcreateServerComponentClient\s*\([^)]*\)/g,
    'createServerComponentClient()'
  )
  content = content.replace(
    /\bcreateRouteHandlerClient\s*\([^)]*\)/g,
    'createRouteHandlerClient()'
  )
  content = content.replace(
    /\bcreateServerActionClient\s*\([^)]*\)/g,
    'createServerActionClient()'
  )

  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8')
    changed.push(file)
  }
}

console.log('\nUpdated files:\n' + changed.join('\n'))
