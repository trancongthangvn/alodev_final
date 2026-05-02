'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import AdminShell from '../AdminShell'

type Post = {
  id: string
  slug: string
  title: string
  description: string | null
  status: string
  tags: string | null
  reading_min: number | null
  published_at: string | null
  created_at: string
  updated_at: string
}

const STATUS_LABEL: Record<string, string> = {
  draft: 'Nháp', published: 'Đã đăng', archived: 'Lưu trữ',
}
const STATUS_COLOR: Record<string, string> = {
  draft:     'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-500/15 dark:text-gray-300 dark:border-gray-500/30',
  published: 'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-300 dark:border-emerald-500/30',
  archived:  'bg-rose-100 text-rose-800 border-rose-200 dark:bg-rose-500/15 dark:text-rose-300 dark:border-rose-500/30',
}

function formatDate(iso: string | null): string {
  if (!iso) return '—'
  try { return new Date(iso).toLocaleString('vi-VN', { dateStyle: 'short', timeStyle: 'short', hour12: false }) }
  catch { return iso }
}

export default function BlogList() {
  const [posts, setPosts] = useState<Post[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState('')
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    let aborted = false
    const params = new URLSearchParams()
    if (statusFilter) params.set('status', statusFilter)
    fetch(`/api/admin/blog?${params}`, { credentials: 'same-origin' })
      .then((r) => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json() })
      .then((d) => { if (!aborted) setPosts(d.results) })
      .catch((e) => { if (!aborted) setError((e as Error).message) })
    return () => { aborted = true }
  }, [statusFilter, refreshKey])

  async function handleDelete(id: string, title: string) {
    if (!confirm(`Xoá vĩnh viễn bài "${title}"?\n\nKhông thể phục hồi.`)) return
    const r = await fetch(`/api/admin/blog/${id}`, { method: 'DELETE', credentials: 'same-origin' })
    if (!r.ok) { alert('Xoá thất bại.'); return }
    setRefreshKey((k) => k + 1)
  }

  return (
    <AdminShell>
      <header className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Blog</h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-zinc-400">
            {posts === null ? 'Đang tải…' : `${posts.length} bài viết`}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-lg border border-gray-200 dark:border-ink-800 bg-white dark:bg-ink-900 text-gray-900 dark:text-white px-3 py-2 text-sm"
          >
            <option value="">Tất cả</option>
            <option value="draft">Nháp</option>
            <option value="published">Đã đăng</option>
            <option value="archived">Lưu trữ</option>
          </select>
          <Link
            href="/admin/blog/new"
            className="rounded-lg bg-ink-900 dark:bg-white text-white dark:text-ink-900 px-4 py-2 text-sm font-semibold hover:bg-ink-800 dark:hover:bg-zinc-100"
          >
            + Bài mới
          </Link>
        </div>
      </header>

      {error && (
        <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800 dark:bg-rose-500/10 dark:border-rose-500/30 dark:text-rose-300">
          Lỗi: {error}
        </div>
      )}

      <div className="rounded-2xl border border-gray-200 dark:border-ink-800 bg-white dark:bg-ink-900 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-ink-950 text-gray-600 dark:text-zinc-400 text-left">
              <tr>
                <th className="px-4 py-3 font-semibold">Tiêu đề</th>
                <th className="px-4 py-3 font-semibold">Slug</th>
                <th className="px-4 py-3 font-semibold">Trạng thái</th>
                <th className="px-4 py-3 font-semibold">Cập nhật</th>
                <th className="px-4 py-3 font-semibold w-32">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {posts && posts.length === 0 && (
                <tr><td colSpan={5} className="px-4 py-12 text-center text-gray-400">
                  Chưa có bài viết nào. <Link href="/admin/blog/new" className="text-brand-700 dark:text-brand-400 hover:underline">Tạo bài đầu tiên →</Link>
                </td></tr>
              )}
              {posts?.map((p) => (
                <tr key={p.id} className="border-t border-gray-100 dark:border-ink-800 hover:bg-cream-50/60 dark:hover:bg-ink-950/40 transition">
                  <td className="px-4 py-3">
                    <Link href={`/admin/blog/edit?id=${p.id}`} className="font-semibold text-gray-900 dark:text-white hover:text-brand-700 dark:hover:text-brand-400">{p.title}</Link>
                    {p.description && <div className="text-xs text-gray-500 dark:text-zinc-500 mt-0.5 line-clamp-1">{p.description}</div>}
                    {p.tags && <div className="text-xs text-brand-700 dark:text-brand-400 mt-1">#{p.tags.split(',').filter(Boolean).slice(0, 3).join(' #')}</div>}
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-500 dark:text-zinc-500 font-mono">{p.slug}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-block text-xs font-semibold px-2 py-0.5 rounded-full border ${STATUS_COLOR[p.status] || STATUS_COLOR.draft}`}>{STATUS_LABEL[p.status] || p.status}</span>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-500 dark:text-zinc-500 whitespace-nowrap">{formatDate(p.updated_at)}</td>
                  <td className="px-4 py-3 text-xs">
                    <Link href={`/admin/blog/edit?id=${p.id}`} className="text-brand-700 dark:text-brand-400 hover:underline mr-3">Sửa</Link>
                    <a
                      href={p.status === 'published' ? `/blog/${p.slug}` : `/admin/blog/preview?id=${p.id}`}
                      target="_blank"
                      rel="noopener"
                      className="text-gray-500 dark:text-zinc-500 hover:underline mr-3"
                      title={p.status === 'published' ? 'Mở bản công khai' : 'Xem trước (chưa publish)'}
                    >Xem{p.status === 'published' ? ' ↗' : ' (preview)'}</a>
                    <button onClick={() => handleDelete(p.id, p.title)} className="text-rose-600 dark:text-rose-400 hover:underline">Xoá</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminShell>
  )
}
