'use client'

import { useEffect, useMemo, useRef, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { projects } from '@/data/projects'
import Icon, { type IconName } from '@/components/Icon'

type CommandItem = {
  id: string
  group: string
  label: string
  hint?: string
  icon: IconName
  keywords?: string
  action: () => void
}

export default function CommandPalette() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)

  const items = useMemo<CommandItem[]>(() => [
    // Pages
    { id: 'home',     group: 'Trang', icon: 'home',       label: 'Trang chủ',                keywords: 'home homepage',        action: () => router.push('/') },
    { id: 'dich-vu',  group: 'Trang', icon: 'briefcase',  label: 'Dịch vụ & bảng giá',       keywords: 'services pricing gia', action: () => router.push('/dich-vu') },
    { id: 'bao-gia',  group: 'Trang', icon: 'gauge',      label: 'Tự cấu hình & xem báo giá', keywords: 'calculator quote bao gia tu cau hinh', action: () => router.push('/bao-gia') },
    { id: 'du-an',    group: 'Trang', icon: 'folder',     label: 'Portfolio dự án',          keywords: 'portfolio projects',   action: () => router.push('/du-an') },
    { id: 've',       group: 'Trang', icon: 'handshake',  label: 'Về chúng tôi',             keywords: 'about ve chung toi',   action: () => router.push('/ve-chung-toi') },
    { id: 'lien-he',  group: 'Trang', icon: 'mail',       label: 'Liên hệ — Yêu cầu báo giá', keywords: 'contact bao gia quote',action: () => router.push('/lien-he') },

    // Services anchors
    { id: 'svc-web',      group: 'Dịch vụ', icon: 'globe',  label: 'Website doanh nghiệp',           keywords: 'web landing ecommerce',         action: () => router.push('/dich-vu#website') },
    { id: 'svc-mobile',   group: 'Dịch vụ', icon: 'phone',  label: 'App Mobile (iOS / Android)',     keywords: 'mobile app ios android',        action: () => router.push('/dich-vu#mobile') },
    { id: 'svc-system',   group: 'Dịch vụ', icon: 'cpu',    label: 'Hệ thống quản trị (CRM / ERP)',  keywords: 'system crm erp dashboard',      action: () => router.push('/dich-vu#system') },
    { id: 'svc-ai',       group: 'Dịch vụ', icon: 'bot',    label: 'Tự động hoá & AI',               keywords: 'automation ai bot chatgpt claude', action: () => router.push('/dich-vu#automation') },
    { id: 'svc-maintain', group: 'Dịch vụ', icon: 'wrench', label: 'Bảo trì & nâng cấp',             keywords: 'maintenance upgrade',           action: () => router.push('/dich-vu#maintenance') },
    { id: 'svc-design',   group: 'Dịch vụ', icon: 'brush',  label: 'Thiết kế UI/UX',                 keywords: 'design ui ux figma',            action: () => router.push('/dich-vu#design') },

    // Projects
    ...projects.map<CommandItem>((p) => ({
      id: `proj-${p.slug}`,
      group: 'Dự án',
      icon: 'arrow-up-right',
      label: p.name,
      hint: p.domain,
      keywords: `${p.slug} ${p.domain} ${p.category}`,
      action: () => router.push(`/du-an/${p.slug}`),
    })),

    // Quick actions
    { id: 'zalo',  group: 'Liên hệ nhanh', icon: 'message-circle', label: 'Mở Zalo 0364 234 936',     keywords: 'zalo phone goi', action: () => window.open('https://zalo.me/0364234936', '_blank') },
    { id: 'mail',  group: 'Liên hệ nhanh', icon: 'mail',           label: 'Email hello@alodev.vn',     keywords: 'email mail',     action: () => window.open('mailto:hello@alodev.vn') },
    { id: 'theme', group: 'Tuỳ chỉnh',     icon: 'moon',           label: 'Đảo chế độ sáng / tối',     keywords: 'theme dark light mode', action: () => {
      const isDark = document.documentElement.classList.toggle('dark')
      try { localStorage.setItem('alodev-theme', isDark ? 'dark' : 'light') } catch {}
    } },
  ], [router])

  // Filter
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return items
    return items.filter((it) => {
      const hay = `${it.label} ${it.group} ${it.keywords || ''} ${it.hint || ''}`.toLowerCase()
      return hay.includes(q)
    })
  }, [query, items])

  const grouped = useMemo(() => {
    const m = new Map<string, CommandItem[]>()
    for (const it of filtered) {
      if (!m.has(it.group)) m.set(it.group, [])
      m.get(it.group)!.push(it)
    }
    return Array.from(m.entries())
  }, [filtered])

  const close = useCallback(() => {
    setOpen(false)
    setQuery('')
    setActive(0)
  }, [])

  // Global ⌘K / Ctrl+K shortcut + custom event from buttons
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const isMeta = e.metaKey || e.ctrlKey
      if (isMeta && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setOpen((o) => !o)
        return
      }
      if (e.key === 'Escape' && open) {
        e.preventDefault()
        close()
      }
    }
    function onOpen() { setOpen(true) }
    window.addEventListener('keydown', onKey)
    window.addEventListener('alodev:open-palette', onOpen)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('alodev:open-palette', onOpen)
    }
  }, [open, close])

  // Focus input when opened
  useEffect(() => {
    if (open) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setActive(0)
      setTimeout(() => inputRef.current?.focus(), 10)
    }
  }, [open])

  // Reset active when query changes — intended pattern, derived state would over-complicate keyboard nav
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { setActive(0) }, [query])

  // Arrow navigation
  function onInputKey(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActive((a) => Math.min(a + 1, filtered.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActive((a) => Math.max(a - 1, 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      const item = filtered[active]
      if (item) {
        item.action()
        close()
      }
    }
  }

  // Scroll active item into view
  useEffect(() => {
    if (!listRef.current) return
    const el = listRef.current.querySelector<HTMLElement>(`[data-idx="${active}"]`)
    el?.scrollIntoView({ block: 'nearest' })
  }, [active])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[12vh] px-4" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-gray-900/40 dark:bg-black/60 backdrop-blur-sm animate-[fadeIn_.15s_ease]" onClick={close} />
      {/* Panel */}
      <div className="relative w-full max-w-xl rounded-2xl border border-gray-200 dark:border-ink-800 bg-white dark:bg-ink-900 shadow-2xl overflow-hidden animate-[slideIn_.18s_ease]">
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-gray-200 dark:border-ink-800">
          <svg className="w-5 h-5 text-gray-400 dark:text-ink-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onInputKey}
            placeholder="Tìm trang, dự án, dịch vụ…"
            className="flex-1 bg-transparent outline-none text-base text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-zinc-500"
          />
          <span className="kbd shrink-0">ESC</span>
        </div>

        <div ref={listRef} className="max-h-[55vh] overflow-y-auto py-2">
          {grouped.length === 0 ? (
            <div className="px-4 py-12 text-center text-sm text-gray-500 dark:text-ink-500">
              Không có kết quả cho <b className="text-gray-700 dark:text-ink-300">&ldquo;{query}&rdquo;</b>
            </div>
          ) : (
            grouped.map(([group, list]) => (
              <div key={group} className="mb-1">
                <div className="px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest text-gray-500 dark:text-ink-500">{group}</div>
                {list.map((it) => {
                  const idx = filtered.indexOf(it)
                  const isActive = idx === active
                  return (
                    <button
                      key={it.id}
                      data-idx={idx}
                      onMouseEnter={() => setActive(idx)}
                      onClick={() => { it.action(); close() }}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 text-left text-sm transition ${isActive ? 'bg-gray-100 dark:bg-ink-800/80 text-gray-900 dark:text-white' : 'text-gray-700 dark:text-ink-300 hover:bg-gray-50 dark:hover:bg-ink-800/50'}`}
                    >
                      <Icon name={it.icon} className="w-4 h-4 shrink-0 text-ink-500 dark:text-ink-300" />
                      <span className="flex-1 truncate">{it.label}</span>
                      {it.hint && <span className="text-xs text-gray-400 dark:text-ink-500 font-mono shrink-0">{it.hint}</span>}
                      {isActive && <svg className="w-3.5 h-3.5 text-gray-400 dark:text-ink-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>}
                    </button>
                  )
                })}
              </div>
            ))
          )}
        </div>

        <div className="border-t border-gray-200 dark:border-ink-800 px-4 py-2 flex items-center gap-3 text-xs text-gray-500 dark:text-ink-500">
          <span className="inline-flex items-center gap-1"><span className="kbd">↑</span><span className="kbd">↓</span> di chuyển</span>
          <span className="inline-flex items-center gap-1"><span className="kbd">↵</span> chọn</span>
          <span className="ml-auto inline-flex items-center gap-1"><span className="kbd">⌘</span><span className="kbd">K</span> mở</span>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes slideIn { from { opacity: 0; transform: translateY(-8px) scale(0.98) } to { opacity: 1; transform: translateY(0) scale(1) } }
      `}</style>
    </div>
  )
}
