'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

/**
 * Shared admin chrome: top nav with Inbox / Blog / Settings, plus a
 * "Deploy" button that triggers CF Pages rebuild. Sits inside the public
 * LayoutShell for now (Phase 2 will move admin to its own route group
 * with no public chrome).
 */

const NAV = [
  { href: '/admin',           label: 'Inbox' },
  { href: '/admin/analytics', label: 'Analytics' },
  { href: '/admin/blog',      label: 'Blog' },
  { href: '/admin/settings',  label: 'Cài đặt' },
]

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || '/admin'
  const [deploying, setDeploying] = useState(false)
  const [deployMsg, setDeployMsg] = useState<string | null>(null)

  async function triggerDeploy() {
    setDeploying(true)
    setDeployMsg(null)
    try {
      const r = await fetch('/api/admin/deploy', { method: 'POST', credentials: 'same-origin' })
      const j = await r.json()
      if (!r.ok) throw new Error(j.error || `HTTP ${r.status}`)
      setDeployMsg('Đã queue deploy — site cập nhật trong ~60s.')
      setTimeout(() => setDeployMsg(null), 8000)
    } catch (e) {
      setDeployMsg('Lỗi: ' + (e as Error).message)
    } finally {
      setDeploying(false)
    }
  }

  return (
    <div className="min-h-screen bg-cream-50 dark:bg-ink-950">
      <header className="bg-white dark:bg-ink-900 border-b border-gray-200 dark:border-ink-800 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-6 flex-wrap">
            <span className="font-bold text-gray-900 dark:text-white">Admin · Alodev</span>
            <nav className="flex gap-1">
              {NAV.map((n) => {
                const active = n.href === '/admin'
                  ? pathname === '/admin'
                  : pathname === n.href || pathname.startsWith(n.href + '/')
                return (
                  <Link
                    key={n.href}
                    href={n.href}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                      active
                        ? 'bg-brand-50 text-brand-700 dark:bg-brand-500/15 dark:text-brand-400'
                        : 'text-gray-600 dark:text-zinc-400 hover:bg-gray-100 dark:hover:bg-ink-800'
                    }`}
                  >
                    {n.label}
                  </Link>
                )
              })}
            </nav>
          </div>
          <div className="flex items-center gap-3">
            {deployMsg && (
              <span className="text-xs text-gray-600 dark:text-zinc-400 hidden sm:inline">{deployMsg}</span>
            )}
            <button
              onClick={triggerDeploy}
              disabled={deploying}
              className="text-sm font-semibold rounded-lg bg-ink-900 dark:bg-white text-white dark:text-ink-900 px-3 py-1.5 hover:bg-ink-800 dark:hover:bg-zinc-100 disabled:opacity-50"
            >
              {deploying ? 'Deploying…' : 'Deploy'}
            </button>
            <Link href="/" className="text-xs text-gray-500 dark:text-zinc-500 hover:underline">↗ Xem site</Link>
          </div>
        </div>
        {deployMsg && (
          <div className="sm:hidden border-t border-gray-100 dark:border-ink-800 px-4 py-2 text-xs text-gray-600 dark:text-zinc-400">{deployMsg}</div>
        )}
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">{children}</main>
    </div>
  )
}
