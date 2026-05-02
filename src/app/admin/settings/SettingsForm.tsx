'use client'

import { useEffect, useState } from 'react'
import AdminShell from '../AdminShell'

/**
 * Site-wide settings editor. Loads all rows from site_settings table,
 * groups by key prefix (site.*, contact.*, blog.*) and renders editable
 * fields. PATCH back the changed keys only.
 *
 * After save, settings.generated.json is regenerated on next deploy.
 * Click "Deploy" in shell nav to push changes live.
 */

type Settings = Record<string, unknown>

const GROUPS: { title: string; prefix: string; description: string }[] = [
  { title: 'Site identity',  prefix: 'site.',    description: 'Tiêu đề, mô tả, URL — hiển thị trên Google SERP và OG tags.' },
  { title: 'Contact info',   prefix: 'contact.', description: 'Thông tin liên hệ public — số điện thoại, email, Zalo, địa chỉ.' },
  { title: 'Blog',           prefix: 'blog.',    description: 'Bật/tắt blog, số bài / trang, etc.' },
]

const FIELD_META: Record<string, { label: string; type: 'text' | 'textarea' | 'url' | 'tel' | 'email' | 'boolean' | 'number'; help?: string }> = {
  'site.title_default':    { label: 'Tiêu đề mặc định',  type: 'text', help: '40-60 ký tự, hiển thị khi page không override' },
  'site.title_template':   { label: 'Title template',    type: 'text', help: "Phải có `%s`, ví dụ '%s — Alodev'" },
  'site.description':      { label: 'Mô tả mặc định',    type: 'textarea', help: '120-160 ký tự (Google SERP cap)' },
  'site.url':              { label: 'Site URL',          type: 'url',  help: 'Canonical URL gốc, không trailing slash' },
  'site.locale':           { label: 'Locale',            type: 'text', help: 'vi_VN | en_US' },
  'contact.email':         { label: 'Email',             type: 'email' },
  'contact.phone':         { label: 'Điện thoại',        type: 'tel',  help: 'Định dạng E.164: +84-364-234-936' },
  'contact.zalo':          { label: 'Link Zalo',         type: 'url' },
  'contact.address':       { label: 'Địa chỉ',           type: 'text' },
  'contact.hours':         { label: 'Giờ làm việc',      type: 'text' },
  'blog.enabled':          { label: 'Bật blog',          type: 'boolean' },
  'blog.posts_per_page':   { label: 'Bài / trang',       type: 'number' },
}

export default function SettingsForm() {
  const [settings, setSettings] = useState<Settings>({})
  const [original, setOriginal] = useState<Settings>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [statusMsg, setStatusMsg] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/admin/settings', { credentials: 'same-origin' })
      .then((r) => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json() })
      .then((d) => {
        setSettings(d.settings || {})
        setOriginal(JSON.parse(JSON.stringify(d.settings || {})))
      })
      .catch((e) => setError((e as Error).message))
      .finally(() => setLoading(false))
  }, [])

  const dirtyKeys = Object.keys(settings).filter(
    (k) => JSON.stringify(settings[k]) !== JSON.stringify(original[k])
  )

  async function save() {
    setSaving(true); setError(null); setStatusMsg(null)
    const payload: Settings = {}
    for (const k of dirtyKeys) payload[k] = settings[k]
    try {
      const r = await fetch('/api/admin/settings', {
        method: 'PATCH', credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload),
      })
      const j = await r.json()
      if (!r.ok) throw new Error(j.error || `HTTP ${r.status}`)
      setOriginal(JSON.parse(JSON.stringify(settings)))
      setStatusMsg(`Đã lưu ${j.changed.length} setting${j.changed.length === 1 ? '' : 's'}. Click Deploy để áp dụng vào site.`)
    } catch (e) { setError((e as Error).message) }
    finally { setSaving(false) }
  }

  function set(key: string, value: unknown) {
    setSettings((s) => ({ ...s, [key]: value }))
  }

  if (loading) return <AdminShell><div className="text-center py-16 text-gray-400">Đang tải…</div></AdminShell>

  return (
    <AdminShell>
      <header className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Cài đặt site</h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-zinc-400">
            Sửa metadata, contact, blog config — apply qua Deploy.
          </p>
        </div>
        <button
          onClick={save}
          disabled={saving || dirtyKeys.length === 0}
          className="rounded-lg bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 text-sm font-semibold disabled:opacity-50"
        >
          {saving ? 'Đang lưu…' : `Lưu${dirtyKeys.length > 0 ? ` (${dirtyKeys.length})` : ''}`}
        </button>
      </header>

      {error && <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800 dark:bg-rose-500/10 dark:border-rose-500/30 dark:text-rose-300">{error}</div>}
      {statusMsg && <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800 dark:bg-emerald-500/10 dark:border-emerald-500/30 dark:text-emerald-300">{statusMsg}</div>}

      <div className="space-y-6">
        {GROUPS.map((g) => {
          const keys = Object.keys(settings).filter((k) => k.startsWith(g.prefix))
          if (keys.length === 0) return null
          return (
            <div key={g.prefix} className="rounded-2xl border border-gray-200 dark:border-ink-800 bg-white dark:bg-ink-900 p-6">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">{g.title}</h2>
              <p className="text-sm text-gray-500 dark:text-zinc-500 mt-1 mb-5">{g.description}</p>
              <div className="space-y-4">
                {keys.map((key) => {
                  const meta = FIELD_META[key] || { label: key, type: 'text' as const }
                  const value = settings[key]
                  return (
                    <div key={key}>
                      <label className="block">
                        <div className="text-sm font-semibold text-gray-700 dark:text-zinc-300 mb-2">
                          {meta.label}
                          <span className="ml-2 text-[11px] font-mono text-gray-400 dark:text-zinc-600">{key}</span>
                        </div>
                        {meta.type === 'textarea' ? (
                          <textarea
                            rows={3}
                            value={String(value ?? '')}
                            onChange={(e) => set(key, e.target.value)}
                            className="w-full rounded-lg border border-gray-200 dark:border-ink-800 bg-white dark:bg-ink-950 text-gray-900 dark:text-white px-3 py-2 text-sm focus:outline-none focus:border-brand-500"
                          />
                        ) : meta.type === 'boolean' ? (
                          <select
                            value={String(value ?? false)}
                            onChange={(e) => set(key, e.target.value === 'true')}
                            className="w-full rounded-lg border border-gray-200 dark:border-ink-800 bg-white dark:bg-ink-950 text-gray-900 dark:text-white px-3 py-2 text-sm focus:outline-none focus:border-brand-500"
                          >
                            <option value="true">Bật</option>
                            <option value="false">Tắt</option>
                          </select>
                        ) : meta.type === 'number' ? (
                          <input
                            type="number"
                            value={Number(value ?? 0)}
                            onChange={(e) => set(key, parseInt(e.target.value, 10) || 0)}
                            className="w-full rounded-lg border border-gray-200 dark:border-ink-800 bg-white dark:bg-ink-950 text-gray-900 dark:text-white px-3 py-2 text-sm focus:outline-none focus:border-brand-500"
                          />
                        ) : (
                          <input
                            type={meta.type}
                            value={String(value ?? '')}
                            onChange={(e) => set(key, e.target.value)}
                            className="w-full rounded-lg border border-gray-200 dark:border-ink-800 bg-white dark:bg-ink-950 text-gray-900 dark:text-white px-3 py-2 text-sm focus:outline-none focus:border-brand-500"
                          />
                        )}
                        {meta.help && <div className="mt-1 text-xs text-gray-500 dark:text-zinc-500">{meta.help}</div>}
                      </label>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </AdminShell>
  )
}
