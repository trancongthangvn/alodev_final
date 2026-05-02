'use client'

import { useEffect, useState } from 'react'
import AdminShell from './AdminShell'

/**
 * Admin lead inbox UI. Wrapped in AdminShell for nav + deploy button.
 *
 * Calls GET /api/admin/leads. Browser auto-sends Basic Auth header on
 * same-origin fetch (already exchanged for /admin), so no token plumbing.
 */

type Lead = {
  id: string
  source: string
  name: string
  email: string
  phone: string
  company: string | null
  service: string | null
  budget: string | null
  budget_vnd: number | null
  message: string
  status: string
  country: string | null
  created_at: string
  replied_at: string | null
}
type ApiResponse = { total: number; limit: number; offset: number; results: Lead[] }

const STATUS_LABEL: Record<string, string> = {
  new: 'Mới', reading: 'Đang đọc', replied: 'Đã phản hồi',
  qualified: 'Đủ điều kiện', won: 'Chốt', lost: 'Mất', spam: 'Spam',
}
const STATUS_COLOR: Record<string, string> = {
  new:        'bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-500/15 dark:text-orange-300 dark:border-orange-500/30',
  reading:    'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-500/15 dark:text-blue-300 dark:border-blue-500/30',
  replied:    'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-500/15 dark:text-purple-300 dark:border-purple-500/30',
  qualified:  'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-300 dark:border-emerald-500/30',
  won:        'bg-green-100 text-green-900 border-green-300 dark:bg-green-500/20 dark:text-green-200 dark:border-green-500/40',
  lost:       'bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-500/15 dark:text-gray-300 dark:border-gray-500/30',
  spam:       'bg-rose-100 text-rose-800 border-rose-200 dark:bg-rose-500/15 dark:text-rose-300 dark:border-rose-500/30',
}

function formatVnDateTime(iso: string): string {
  try { return new Date(iso).toLocaleString('vi-VN', { dateStyle: 'short', timeStyle: 'short', hour12: false }) }
  catch { return iso }
}
function formatVND(n: number | null): string {
  if (!n) return '—'
  if (n >= 1_000_000) return `${Math.round(n / 1_000_000)}tr`
  return n.toLocaleString('vi-VN')
}

export default function AdminInbox() {
  const [data, setData] = useState<ApiResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState<string>('')
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<Lead | null>(null)

  useEffect(() => {
    let aborted = false
    setLoading(true); setError(null)
    const params = new URLSearchParams()
    if (statusFilter) params.set('status', statusFilter)
    if (search.trim()) params.set('search', search.trim())
    params.set('limit', '200')
    fetch(`/api/admin/leads?${params}`, { credentials: 'same-origin' })
      .then((r) => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json() as Promise<ApiResponse> })
      .then((d) => { if (!aborted) setData(d) })
      .catch((e) => { if (!aborted) setError((e as Error).message) })
      .finally(() => { if (!aborted) setLoading(false) })
    return () => { aborted = true }
  }, [statusFilter, search])

  return (
    <AdminShell>
      <header className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Lead Inbox</h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-zinc-400">
            {loading ? 'Đang tải…' : data ? `${data.total} lead${data.total === 1 ? '' : 's'} tổng — hiển thị ${data.results.length}` : ''}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <input
            type="search"
            placeholder="Tìm tên / email / phone / nội dung…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="rounded-lg border border-gray-200 dark:border-ink-800 bg-white dark:bg-ink-900 text-gray-900 dark:text-white placeholder:text-gray-400 px-3 py-2 text-sm w-64 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-lg border border-gray-200 dark:border-ink-800 bg-white dark:bg-ink-900 text-gray-900 dark:text-white px-3 py-2 text-sm focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
          >
            <option value="">Tất cả trạng thái</option>
            {Object.entries(STATUS_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
        </div>
      </header>
      {error && (
        <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 dark:bg-rose-500/10 dark:border-rose-500/30 px-4 py-3 text-sm text-rose-800 dark:text-rose-300">
          Lỗi tải dữ liệu: {error}
        </div>
      )}
      <div className="rounded-2xl border border-gray-200 dark:border-ink-800 bg-white dark:bg-ink-900 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-ink-950 text-gray-600 dark:text-zinc-400 text-left">
              <tr>
                <th className="px-4 py-3 font-semibold">Khách</th>
                <th className="px-4 py-3 font-semibold">Nguồn</th>
                <th className="px-4 py-3 font-semibold">Dịch vụ / Ngân sách</th>
                <th className="px-4 py-3 font-semibold">Trạng thái</th>
                <th className="px-4 py-3 font-semibold">Thời gian</th>
              </tr>
            </thead>
            <tbody>
              {loading && <tr><td colSpan={5} className="px-4 py-12 text-center text-gray-400">Đang tải…</td></tr>}
              {!loading && data && data.results.length === 0 && <tr><td colSpan={5} className="px-4 py-12 text-center text-gray-400">Chưa có lead nào.</td></tr>}
              {!loading && data?.results.map((l) => (
                <tr key={l.id} onClick={() => setSelected(l)} className="border-t border-gray-100 dark:border-ink-800 hover:bg-cream-50/60 dark:hover:bg-ink-950/40 cursor-pointer transition">
                  <td className="px-4 py-3">
                    <div className="font-semibold text-gray-900 dark:text-white">{l.name}</div>
                    <div className="text-xs text-gray-500 dark:text-zinc-500 mt-0.5">{l.email} · {l.phone}</div>
                  </td>
                  <td className="px-4 py-3 text-gray-700 dark:text-zinc-300">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-ink-800 border border-gray-200 dark:border-ink-700">{l.source}</span>
                    {l.country && <span className="ml-2 text-xs text-gray-400">{l.country}</span>}
                  </td>
                  <td className="px-4 py-3 text-gray-700 dark:text-zinc-300">
                    {l.service || '—'}
                    <div className="text-xs text-gray-500 dark:text-zinc-500 mt-0.5">{l.budget || '—'}{l.budget_vnd ? ` (${formatVND(l.budget_vnd)})` : ''}</div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-block text-xs font-semibold px-2 py-0.5 rounded-full border ${STATUS_COLOR[l.status] || STATUS_COLOR.new}`}>{STATUS_LABEL[l.status] || l.status}</span>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-500 dark:text-zinc-500 whitespace-nowrap">{formatVnDateTime(l.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {selected && <LeadDetail lead={selected} onClose={() => setSelected(null)} />}
    </AdminShell>
  )
}

function LeadDetail({ lead, onClose }: { lead: Lead; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6 bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div className="relative w-full sm:max-w-2xl bg-white dark:bg-ink-900 rounded-t-2xl sm:rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 bg-white dark:bg-ink-900 border-b border-gray-100 dark:border-ink-800 px-6 py-4 flex items-start justify-between">
          <div>
            <div className="text-xs text-gray-500 dark:text-zinc-500">{lead.id}</div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mt-1">{lead.name}</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-white text-2xl leading-none p-1">×</button>
        </div>
        <div className="p-6 space-y-4 text-sm text-gray-700 dark:text-zinc-300">
          <Row label="Email"><a href={`mailto:${lead.email}`} className="text-brand-700 dark:text-brand-400 hover:underline">{lead.email}</a></Row>
          <Row label="Phone">
            <a href={`tel:${lead.phone}`} className="text-brand-700 dark:text-brand-400 hover:underline">{lead.phone}</a>
            {' · '}
            <a href={`https://zalo.me/${lead.phone.replace(/\D/g, '')}`} target="_blank" rel="noopener" className="text-brand-700 dark:text-brand-400 hover:underline">Zalo</a>
          </Row>
          {lead.company && <Row label="Công ty">{lead.company}</Row>}
          <Row label="Nguồn">{lead.source}{lead.country ? ` · ${lead.country}` : ''}</Row>
          <Row label="Dịch vụ">{lead.service || '—'}</Row>
          <Row label="Ngân sách">{lead.budget || '—'}{lead.budget_vnd ? ` (${formatVND(lead.budget_vnd)})` : ''}</Row>
          <Row label="Trạng thái">
            <span className={`inline-block text-xs font-semibold px-2 py-0.5 rounded-full border ${STATUS_COLOR[lead.status] || STATUS_COLOR.new}`}>{STATUS_LABEL[lead.status] || lead.status}</span>
          </Row>
          <Row label="Thời gian">{formatVnDateTime(lead.created_at)}</Row>
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-zinc-500 mb-2">Mô tả</div>
            <div className="rounded-lg bg-cream-50 dark:bg-ink-950 border border-gray-100 dark:border-ink-800 p-4 whitespace-pre-wrap leading-relaxed">{lead.message}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-wrap gap-2 items-baseline">
      <div className="w-24 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-zinc-500 shrink-0">{label}</div>
      <div className="flex-1">{children}</div>
    </div>
  )
}
