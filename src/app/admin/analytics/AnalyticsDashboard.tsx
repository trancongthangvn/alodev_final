'use client'

import { useEffect, useState } from 'react'
import AdminShell from '../AdminShell'

/**
 * Self-hosted analytics dashboard. Polls /api/admin/analytics every 30s
 * for fresh numbers (realtime card shows last-5-min visitor count).
 *
 * Charts: pure CSS bars + SVG sparkline. No chart library — keeps the
 * admin bundle small and stays maintenance-free.
 */

type Daily = { date: string; pageviews: number; visitors: number }
type Row = { [k: string]: string | number | null }

type AnalyticsData = {
  range: string
  days: number
  totals: { pageviews: number; visitors: number; sessions: number; avg_duration_ms: number; bounce_rate: number }
  realtime: { visitors_now: number }
  daily: Daily[]
  top_pages: Row[]
  top_referrers: Row[]
  top_countries: Row[]
  devices: Row[]
  browsers: Row[]
  os: Row[]
  utm: Row[]
}

const RANGES = ['7d', '30d', '90d'] as const
type Range = typeof RANGES[number]

function formatDuration(ms: number | null | undefined): string {
  if (!ms || ms < 1000) return '—'
  const s = Math.round(ms / 1000)
  if (s < 60) return `${s}s`
  const m = Math.floor(s / 60); const rs = s % 60
  return rs ? `${m}m ${rs}s` : `${m}m`
}
function formatNum(n: number | null | undefined): string {
  if (n == null) return '0'
  if (n >= 10000) return `${(n / 1000).toFixed(1)}K`
  return n.toLocaleString('vi-VN')
}
function formatDateShort(iso: string): string {
  const [, m, d] = iso.split('-')
  return `${d}/${m}`
}
function flagEmoji(code: string | null): string {
  if (!code || code.length !== 2) return '🌐'
  return String.fromCodePoint(...[...code.toUpperCase()].map((c) => 0x1F1A5 + c.charCodeAt(0)))
}

export default function AnalyticsDashboard() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [range, setRange] = useState<Range>('7d')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let aborted = false
    let timer: number | undefined

    const load = () => {
      fetch(`/api/admin/analytics?range=${range}`, { credentials: 'same-origin' })
        .then((r) => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json() as Promise<AnalyticsData> })
        .then((d) => { if (!aborted) { setData(d); setLoading(false); setError(null) } })
        .catch((e) => { if (!aborted) { setError((e as Error).message); setLoading(false) } })
    }
    load()
    // Realtime refresh every 30s
    timer = window.setInterval(load, 30_000) as unknown as number
    return () => { aborted = true; if (timer) clearInterval(timer) }
  }, [range])

  return (
    <AdminShell>
      <header className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Analytics</h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-zinc-400">
            Tự host · privacy-friendly · không cookie · cập nhật mỗi 30s
          </p>
        </div>
        <div className="flex items-center gap-2">
          {RANGES.map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-3 py-1.5 text-sm font-medium rounded-lg transition ${
                range === r
                  ? 'bg-ink-900 dark:bg-white text-white dark:text-ink-900'
                  : 'bg-white dark:bg-ink-900 border border-gray-200 dark:border-ink-800 text-gray-600 dark:text-zinc-400 hover:bg-gray-50 dark:hover:bg-ink-800'
              }`}
            >
              {r === '7d' ? '7 ngày' : r === '30d' ? '30 ngày' : '90 ngày'}
            </button>
          ))}
        </div>
      </header>

      {error && <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800 dark:bg-rose-500/10 dark:border-rose-500/30 dark:text-rose-300">Lỗi: {error}</div>}

      {/* Realtime banner */}
      {data && (
        <div className="mb-6 flex flex-wrap items-center gap-4 rounded-2xl border border-emerald-200 dark:border-emerald-500/30 bg-emerald-50/60 dark:bg-emerald-500/10 px-5 py-3">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75 animate-ping" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
          </span>
          <span className="text-sm font-semibold text-emerald-800 dark:text-emerald-300">
            {data.realtime.visitors_now} người đang online
          </span>
          <span className="text-xs text-emerald-700/70 dark:text-emerald-400/70">(5 phút qua)</span>
        </div>
      )}

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-6">
        <Kpi label="Lượt xem" value={formatNum(data?.totals.pageviews)} loading={loading} />
        <Kpi label="Khách unique" value={formatNum(data?.totals.visitors)} loading={loading} hint="Mỗi ngày" />
        <Kpi label="Sessions" value={formatNum(data?.totals.sessions)} loading={loading} />
        <Kpi label="Thời gian TB" value={formatDuration(data?.totals.avg_duration_ms)} loading={loading} hint="Mỗi page" />
        <Kpi label="Bounce rate" value={`${data?.totals.bounce_rate ?? 0}%`} loading={loading} hint="Single-page sessions" />
      </div>

      {/* Daily sparkline */}
      {data && <DailyChart daily={data.daily} />}

      {/* Top tables */}
      {data && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-6">
          <Card title="Trang được xem nhiều nhất">
            <RowTable
              rows={data.top_pages}
              columns={[
                { key: 'path', label: 'Path', render: (v) => <code className="text-xs">{String(v)}</code> },
                { key: 'pageviews', label: 'Views', align: 'right', render: (v) => formatNum(Number(v)) },
                { key: 'visitors', label: 'Khách', align: 'right', render: (v) => formatNum(Number(v)) },
                { key: 'avg_duration_ms', label: 'TB', align: 'right', render: (v) => formatDuration(Number(v)) },
              ]}
            />
          </Card>
          <Card title="Nguồn truy cập (referrer)">
            {data.top_referrers.length === 0 ? <Empty msg="Chủ yếu direct traffic." /> :
              <RowTable
                rows={data.top_referrers}
                columns={[
                  { key: 'host', label: 'Domain', render: (v) => <span className="text-sm">{String(v)}</span> },
                  { key: 'pageviews', label: 'Views', align: 'right', render: (v) => formatNum(Number(v)) },
                ]}
              />
            }
          </Card>
          <Card title="Quốc gia">
            {data.top_countries.length === 0 ? <Empty msg="Chưa có data." /> :
              <RowTable
                rows={data.top_countries}
                columns={[
                  { key: 'country', label: 'Country', render: (v) => <span className="text-sm">{flagEmoji(String(v))} {String(v)}</span> },
                  { key: 'visitors', label: 'Khách', align: 'right', render: (v) => formatNum(Number(v)) },
                ]}
              />
            }
          </Card>
          <Card title="Thiết bị">
            <PieRow rows={data.devices} keyField="device" valueField="pageviews" />
            <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
              <div>
                <div className="font-semibold text-gray-700 dark:text-zinc-300 mb-2">Browsers</div>
                <ul className="space-y-1">{data.browsers.map((b) => <li key={String(b.browser)} className="flex justify-between text-xs"><span>{String(b.browser)}</span><span className="text-gray-500">{formatNum(Number(b.pageviews))}</span></li>)}</ul>
              </div>
              <div>
                <div className="font-semibold text-gray-700 dark:text-zinc-300 mb-2">OS</div>
                <ul className="space-y-1">{data.os.map((o) => <li key={String(o.os)} className="flex justify-between text-xs"><span>{String(o.os)}</span><span className="text-gray-500">{formatNum(Number(o.pageviews))}</span></li>)}</ul>
              </div>
            </div>
          </Card>
          {data.utm.length > 0 && (
            <Card title="UTM sources">
              <RowTable
                rows={data.utm}
                columns={[
                  { key: 'source', label: 'Source', render: (v) => <span className="text-sm font-mono">{String(v)}</span> },
                  { key: 'pageviews', label: 'Views', align: 'right', render: (v) => formatNum(Number(v)) },
                ]}
              />
            </Card>
          )}
        </div>
      )}
    </AdminShell>
  )
}

function Kpi({ label, value, hint, loading }: { label: string; value: string; hint?: string; loading?: boolean }) {
  return (
    <div className="rounded-xl border border-gray-200 dark:border-ink-800 bg-white dark:bg-ink-900 p-4">
      <div className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-zinc-500">{label}</div>
      <div className={`mt-1 text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white tabular-nums ${loading ? 'opacity-40' : ''}`}>{value}</div>
      {hint && <div className="mt-0.5 text-[11px] text-gray-400 dark:text-zinc-500">{hint}</div>}
    </div>
  )
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-gray-200 dark:border-ink-800 bg-white dark:bg-ink-900 p-5 lg:p-6">
      <h2 className="text-base font-bold text-gray-900 dark:text-white mb-4">{title}</h2>
      {children}
    </div>
  )
}

function Empty({ msg }: { msg: string }) {
  return <div className="text-sm text-gray-400 dark:text-zinc-500 py-6 text-center">{msg}</div>
}

function RowTable({ rows, columns }: {
  rows: Row[]
  columns: { key: string; label: string; align?: 'left' | 'right'; render?: (v: unknown) => React.ReactNode }[]
}) {
  if (rows.length === 0) return <Empty msg="Chưa có data." />
  const max = Math.max(1, ...rows.map((r) => Number(r[columns[1].key] || 0)))
  return (
    <div className="space-y-1">
      {rows.map((r, i) => {
        const barValue = Number(r[columns[1].key] || 0)
        const pct = (barValue / max) * 100
        return (
          <div key={i} className="relative grid grid-cols-[1fr_auto_auto_auto] gap-3 items-center px-2 py-1.5 text-sm">
            <div className="absolute inset-y-0 left-0 bg-brand-100 dark:bg-brand-500/10 rounded -z-0" style={{ width: `${pct}%` }} />
            {columns.map((c, idx) => (
              <div key={c.key} className={`relative z-10 ${c.align === 'right' ? 'text-right tabular-nums text-gray-700 dark:text-zinc-300' : 'text-gray-900 dark:text-white truncate'}`} style={idx === 0 ? { minWidth: 0 } : {}}>
                {c.render ? c.render(r[c.key]) : String(r[c.key] ?? '')}
              </div>
            ))}
          </div>
        )
      })}
    </div>
  )
}

function PieRow({ rows, keyField, valueField }: { rows: Row[]; keyField: string; valueField: string }) {
  const total = rows.reduce((s, r) => s + Number(r[valueField] || 0), 0) || 1
  const colors: Record<string, string> = {
    mobile:  'bg-brand-500',
    desktop: 'bg-blue-500',
    tablet:  'bg-emerald-500',
    unknown: 'bg-gray-400',
  }
  return (
    <>
      <div className="flex h-3 rounded-full overflow-hidden border border-gray-200 dark:border-ink-800">
        {rows.map((r) => {
          const v = Number(r[valueField] || 0)
          const pct = (v / total) * 100
          return <div key={String(r[keyField])} className={colors[String(r[keyField])] || 'bg-gray-400'} style={{ width: `${pct}%` }} />
        })}
      </div>
      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs">
        {rows.map((r) => {
          const v = Number(r[valueField] || 0)
          const pct = ((v / total) * 100).toFixed(1)
          return (
            <span key={String(r[keyField])} className="inline-flex items-center gap-1.5 text-gray-700 dark:text-zinc-300">
              <span className={`w-2.5 h-2.5 rounded-full ${colors[String(r[keyField])] || 'bg-gray-400'}`} />
              {String(r[keyField])} <span className="text-gray-400">{pct}%</span>
            </span>
          )
        })}
      </div>
    </>
  )
}

function DailyChart({ daily }: { daily: Daily[] }) {
  const maxPv = Math.max(1, ...daily.map((d) => d.pageviews))
  const W = 100, H = 40
  const points = daily.map((d, i) => {
    const x = (i / (daily.length - 1 || 1)) * W
    const y = H - (d.pageviews / maxPv) * H
    return [x, y] as const
  })
  const path = points.map((p, i) => (i === 0 ? `M${p[0]},${p[1]}` : `L${p[0]},${p[1]}`)).join(' ')
  const fill = `${path} L${W},${H} L0,${H} Z`

  return (
    <div className="rounded-2xl border border-gray-200 dark:border-ink-800 bg-white dark:bg-ink-900 p-5 lg:p-6">
      <h2 className="text-base font-bold text-gray-900 dark:text-white mb-1">Lượt xem theo ngày</h2>
      <p className="text-xs text-gray-500 dark:text-zinc-500 mb-4">{daily.length} ngày — peak {formatNum(maxPv)} views</p>
      <svg viewBox={`0 0 ${W} ${H + 8}`} className="w-full h-32" preserveAspectRatio="none">
        <path d={fill} className="fill-brand-500/15" />
        <path d={path} className="stroke-brand-600 dark:stroke-brand-400" strokeWidth={0.5} fill="none" vectorEffect="non-scaling-stroke" />
      </svg>
      <div className="mt-2 flex justify-between text-[10px] text-gray-400 dark:text-zinc-600">
        {daily.filter((_, i) => i % Math.ceil(daily.length / 7) === 0).map((d) => <span key={d.date}>{formatDateShort(d.date)}</span>)}
      </div>
    </div>
  )
}
