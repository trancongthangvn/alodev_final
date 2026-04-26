'use client'

/**
 * EmailLink — renders email + mailto link CLIENT-SIDE only.
 *
 * Why: Cloudflare Email Obfuscation rewrites any email-looking string in
 * server-rendered HTML into <a href="/cdn-cgi/l/email-protection#hash">
 * [email&#160;protected]</a>. That mutated DOM doesn't match React's
 * tree, throwing hydration error #418, which makes React fall back to
 * full client-side re-render — wiping the inline theme script's
 * data-theme attribute on <html> in the process.
 *
 * Fix: don't ship the email in server HTML. Render a stable placeholder
 * server-side, then swap to the real email after mount. Cloudflare's
 * obfuscator only acts on the static HTML, so it leaves us alone.
 *
 * The user/domain split + post-mount join is also a defense-in-depth —
 * even if a future build path leaks the props, Cloudflare's pattern
 * match needs a contiguous email string and won't find one here.
 */

import { useEffect, useState } from 'react'

type Props = {
  user: string
  domain: string
  className?: string
  children?: React.ReactNode  // optional override for visible text
  prefixIcon?: React.ReactNode
}

export default function EmailLink({ user, domain, className = '', children, prefixIcon }: Props) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  // Server (and pre-mount client) render: no email visible. Cloudflare's
  // obfuscator sees nothing to rewrite. Hydration matches between server
  // and first client render because both produce the same placeholder.
  const email = mounted ? `${user}@${domain}` : ''
  const href = mounted ? `mailto:${email}` : '#'
  const visible = children ?? (mounted ? email : ' ')  // nbsp keeps layout stable

  return (
    <a href={href} className={className}>
      {prefixIcon}
      {visible}
    </a>
  )
}
