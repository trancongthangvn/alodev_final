'use client'

/**
 * QuoteBuilder - self-service quote calculator.
 *
 * Design philosophy:
 *  · User SEES the price without messaging anyone - primary value.
 *  · Contact paths exist but are OPTIONAL nudges, not gates.
 *  · 4-step wizard: Type → Preset → Customize → Result.
 *
 * Algorithm bundle (see quote-features.ts):
 *  · Price = (base + Σ features) × designMul × timelineMul · ±15% range
 *  · Timeline = minWeeks + total/12M VND, rush ×0.7
 *  · Maintenance = monthly post-launch estimate
 *  · Client costs = third-party fees (Apple Dev, hosting, etc.)
 *
 * Self-service exits at step 4:
 *  · Copy summary to clipboard - keep as note for later
 *  · Open Zalo with copied summary in clipboard - paste & chat
 *  · Share URL - bookmark-able, includes all selection state
 *  · Send formal request → /lien-he (last resort, full form)
 *
 * State sync: URL params reflect selection. Refresh / share / bookmark works.
 */

import { useEffect, useMemo, useRef, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Icon from '@/components/Icon'
import {
  projectTypes,
  designTiers,
  timelineModes,
  formatVND,
  formatVNDCompact,
  calculateQuote,
  serializeQuote,
  deserializeQuote,
  buildQuoteSummary,
  pickBudgetBucket,
  type ProjectType,
  type Preset,
} from '@/data/quote-features'

type Step = 1 | 2 | 3 | 4

const STEPS: { id: Step; label: string }[] = [
  { id: 1, label: 'Loại' },
  { id: 2, label: 'Mục đích' },
  { id: 3, label: 'Tính năng' },
  { id: 4, label: 'Báo giá' },
]

export default function QuoteBuilder() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [step, setStep] = useState<Step>(1)
  const [typeId, setTypeId] = useState<ProjectType['id'] | null>(null)
  const [presetId, setPresetId] = useState<string | null>(null)
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [designId, setDesignId] = useState('std')
  const [timelineId, setTimelineId] = useState('standard')

  // Hydrate from URL on mount (one-shot, before any user interaction)
  const hydrated = useRef(false)
  useEffect(() => {
    if (hydrated.current) return
    hydrated.current = true
    const parsed = deserializeQuote(new URLSearchParams(searchParams.toString()))
    if (!parsed) return
    setTypeId(parsed.t)
    if (parsed.p) setPresetId(parsed.p)
    setSelected(new Set(parsed.f))
    setDesignId(parsed.d)
    setTimelineId(parsed.u)
    setStep(parsed.f.length > 0 || parsed.p ? 4 : 2)
  }, [searchParams])

  // Sync URL state on every change (debounced via microtask)
  useEffect(() => {
    if (!typeId || !hydrated.current) return
    const sp = serializeQuote({
      t: typeId,
      p: presetId ?? undefined,
      f: Array.from(selected),
      d: designId,
      u: timelineId,
    })
    const url = `/bao-gia?${sp.toString()}`
    window.history.replaceState(null, '', url)
  }, [typeId, presetId, selected, designId, timelineId])

  const type = typeId ? projectTypes.find((t) => t.id === typeId)! : null

  function pickType(id: ProjectType['id']) {
    setTypeId(id)
    setPresetId(null)
    const t = projectTypes.find((x) => x.id === id)!
    const req = new Set<string>()
    for (const g of t.groups) for (const f of g.features) if (f.required) req.add(f.id)
    setSelected(req)
    setStep(2)
  }

  function pickPreset(p: Preset) {
    setPresetId(p.id)
    const next = new Set<string>(p.features)
    if (type) {
      for (const g of type.groups) for (const f of g.features) if (f.required) next.add(f.id)
    }
    setSelected(next)
    setStep(3)
  }

  function pickEmptyPreset() {
    setPresetId('_blank')
    if (type) {
      const next = new Set<string>()
      for (const g of type.groups) for (const f of g.features) if (f.required) next.add(f.id)
      setSelected(next)
    }
    setStep(3)
  }

  function toggle(featureId: string, isRequired?: boolean) {
    if (isRequired) return
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(featureId)) next.delete(featureId)
      else next.add(featureId)
      return next
    })
  }

  const quote = useMemo(() => {
    if (!typeId) return null
    return calculateQuote({ typeId, selected, designId, timelineId })
  }, [typeId, selected, designId, timelineId])

  const summary = useMemo(() => {
    if (!type || !quote) return ''
    return buildQuoteSummary({ typeId: type.id, presetId, selected, designId, timelineId, quote })
  }, [type, presetId, selected, designId, timelineId, quote])

  function sendToContactForm() {
    if (!type || !quote) return
    try {
      sessionStorage.setItem('alodev-quote-summary', summary)
      sessionStorage.setItem('alodev-quote-service', type.name)
      sessionStorage.setItem('alodev-quote-budget', pickBudgetBucket(quote.total))
    } catch {}
    router.push('/lien-he?from=bao-gia')
  }

  // ─────────────── RENDER ───────────────
  return (
    <>
      {/* Sticky progress + total bar */}
      <div className="sticky top-16 z-30 bg-white/95 dark:bg-ink-950/95 border-b border-gray-200 dark:border-ink-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3">
          <div className="flex items-center justify-between gap-3">
            <ProgressBar currentStep={step} onJump={(s) => { if (s < step && typeId) setStep(s) }} />
            {quote && step >= 3 && (
              <div className="text-right shrink-0">
                <div className="text-[10px] font-mono uppercase tracking-widest text-gray-500 dark:text-ink-400">Ước tính</div>
                <div className="tabular text-base sm:text-lg font-bold text-gray-900 dark:text-white leading-tight">
                  {formatVNDCompact(quote.low)}–{formatVNDCompact(quote.high)}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <section className="mag-section mag-bg-paper py-8 lg:py-14 min-h-[calc(100vh-200px)]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">

          {/* ── Step 1 - Type ── */}
          {step === 1 && (
            <StepShell
              index="Bước 1 / 4"
              title="Bạn muốn làm gì?"
              subtitle="Chọn loại sản phẩm - đổi sau được nếu cần"
            >
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                {projectTypes.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => pickType(t.id)}
                    className="group text-left rounded-xl border border-gray-200 dark:border-ink-800 bg-white dark:bg-ink-900 p-4 sm:p-5 hover:border-brand-400 dark:hover:border-brand-500/50 transition"
                  >
                    <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-brand-50 dark:bg-brand-500/10 text-brand-700 dark:text-brand-400 mb-3">
                      <Icon name={t.icon} className="w-5 h-5" />
                    </div>
                    <h3 className="text-base font-bold text-gray-900 dark:text-white">{t.name}</h3>
                    <p className="mt-1 text-sm text-gray-500 dark:text-ink-300 leading-relaxed">{t.tagline}</p>
                    <p className="mt-2 text-xs text-gray-400 dark:text-ink-500 italic">{t.example}</p>
                    <div className="mt-3 pt-3 border-t border-gray-100 dark:border-ink-800 flex items-center justify-between">
                      <span className="text-[10px] font-mono uppercase tracking-widest text-gray-400 dark:text-ink-500">Khởi điểm</span>
                      <span className="tabular text-sm font-bold text-brand-700 dark:text-brand-400">
                        {formatVNDCompact(t.basePrice)}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </StepShell>
          )}

          {/* ── Step 2 - Preset ── */}
          {step === 2 && type && (
            <StepShell
              index="Bước 2 / 4"
              title="Mục đích chính?"
              subtitle="Template phù hợp nhất - Alodev tự tick tính năng tương ứng"
              onBack={() => setStep(1)}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {type.presets.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => pickPreset(p)}
                    className="group text-left rounded-xl border border-gray-200 dark:border-ink-800 bg-white dark:bg-ink-900 p-4 hover:border-brand-400 dark:hover:border-brand-500/50 transition"
                  >
                    <div className="flex items-start gap-3">
                      <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-brand-50 dark:bg-brand-500/10 text-brand-700 dark:text-brand-400 shrink-0">
                        <Icon name={p.icon} className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base font-bold text-gray-900 dark:text-white">{p.name}</h3>
                        <p className="mt-1 text-sm text-gray-500 dark:text-ink-300 leading-relaxed">{p.desc}</p>
                        <p className="mt-2 text-xs font-mono text-gray-400 dark:text-ink-500">
                          Auto-tick {p.features.length} tính năng
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={pickEmptyPreset}
                className="mt-4 w-full text-center text-sm text-gray-500 dark:text-ink-400 hover:text-gray-900 dark:hover:text-white py-3 underline-offset-4 hover:underline"
              >
                Tự chọn từng tính năng từ đầu →
              </button>
            </StepShell>
          )}

          {/* ── Step 3 - Customize ── */}
          {step === 3 && type && (
            <StepShell
              index="Bước 3 / 4"
              title="Thêm hoặc bớt tính năng"
              subtitle={presetId === '_blank' ? 'Chọn các tính năng cần' : 'Đã chọn sẵn - bỏ tick nếu không cần, hoặc thêm vào'}
              onBack={() => setStep(2)}
              onNext={() => setStep(4)}
              nextLabel="Xem báo giá →"
            >
              {/* Always-included note */}
              <div className="mb-5 rounded-lg border border-brand-100 dark:border-brand-500/20 bg-brand-50/60 dark:bg-brand-500/5 px-4 py-3 flex items-start gap-3">
                <Icon name="check" className="w-4 h-4 mt-0.5 text-brand-700 dark:text-brand-400 shrink-0" strokeWidth={2.5} />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-gray-900 dark:text-white">Đã bao gồm sẵn</div>
                  <p className="mt-1 text-xs text-gray-600 dark:text-ink-300 leading-relaxed">{type.baseDesc}</p>
                </div>
                <div className="tabular text-sm font-bold text-gray-900 dark:text-white shrink-0 whitespace-nowrap font-mono">
                  {formatVNDCompact(type.basePrice)}
                </div>
              </div>

              {/* Feature groups */}
              <div className="space-y-6">
                {type.groups.map((g) => (
                  <div key={g.id}>
                    <h3 className="text-[10px] font-mono font-bold uppercase tracking-widest text-gray-500 dark:text-ink-400 mb-2 pb-2 border-b border-gray-200 dark:border-ink-800">{g.title}</h3>
                    <div className="space-y-1.5">
                      {g.features.map((f) => {
                        const checked = selected.has(f.id) || f.required
                        return (
                          <button
                            key={f.id}
                            type="button"
                            disabled={f.required}
                            onClick={() => toggle(f.id, f.required)}
                            className={`group w-full text-left rounded-lg border p-3 sm:p-3.5 transition flex items-start gap-3 ${
                              checked
                                ? 'border-brand-400 bg-brand-50/40 dark:border-brand-500/40 dark:bg-brand-500/5'
                                : 'border-gray-200 dark:border-ink-800 bg-white dark:bg-ink-900 hover:border-gray-300 dark:hover:border-ink-700'
                            } ${f.required ? 'opacity-90 cursor-default' : 'cursor-pointer'}`}
                          >
                            <span
                              aria-hidden="true"
                              className={`shrink-0 mt-0.5 w-5 h-5 rounded border-2 flex items-center justify-center transition ${
                                checked
                                  ? 'border-brand-600 bg-brand-600 dark:border-brand-500 dark:bg-brand-500'
                                  : 'border-gray-300 dark:border-ink-700 bg-white dark:bg-ink-800'
                              }`}
                            >
                              {checked && <Icon name="check" className="w-3.5 h-3.5 text-white" strokeWidth={3} />}
                            </span>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-baseline justify-between gap-2 flex-wrap">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="text-sm font-semibold text-gray-900 dark:text-white">{f.name}</span>
                                  {f.popular && (
                                    <span className="text-[10px] font-mono font-bold uppercase tracking-widest px-1.5 py-0.5 rounded bg-brand-100 text-brand-800 dark:bg-brand-500/20 dark:text-brand-300">
                                      Phổ biến
                                    </span>
                                  )}
                                  {f.required && (
                                    <span className="text-[10px] font-mono font-bold uppercase tracking-widest px-1.5 py-0.5 rounded bg-gray-100 text-gray-600 dark:bg-ink-800 dark:text-ink-300">
                                      Bắt buộc
                                    </span>
                                  )}
                                </div>
                                <span className="tabular shrink-0 text-xs font-mono font-bold text-brand-700 dark:text-brand-400">
                                  +{formatVNDCompact(f.price)}
                                </span>
                              </div>
                              <p className="mt-0.5 text-xs text-gray-500 dark:text-ink-300 leading-relaxed">{f.desc}</p>
                            </div>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </StepShell>
          )}

          {/* ── Step 4 - Result (self-service primary) ── */}
          {step === 4 && type && quote && (
            <StepShell
              index="Bước 4 / 4"
              title="Báo giá của bạn"
              subtitle="Tự xem · lưu lại · chia sẻ - không cần liên hệ ngay"
              onBack={() => setStep(3)}
            >
              {/* Modifiers - design + timeline */}
              <div className="space-y-4 mb-6">
                <ModifierChoice label="Mức độ thiết kế" options={designTiers} value={designId} onChange={setDesignId} />
                <ModifierChoice label="Tiến độ" options={timelineModes} value={timelineId} onChange={setTimelineId} />
              </div>

              {/* Big total card */}
              <div className="rounded-xl border border-gray-900 dark:border-white bg-gray-900 dark:bg-white text-white dark:text-gray-900 p-5 sm:p-7">
                <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-white/60 dark:text-gray-500">Báo giá ước tính</div>
                <div className="tabular mt-2 text-3xl sm:text-5xl font-bold leading-tight">
                  {formatVNDCompact(quote.low)} <span className="opacity-50 text-2xl sm:text-3xl">-</span> {formatVNDCompact(quote.high)}
                </div>
                <div className="mt-2 text-sm text-white/70 dark:text-gray-500">
                  Trung bình {formatVND(quote.total)} · ±15% theo scope thực tế
                </div>

                {/* Timeline + maintenance - secondary metrics */}
                <div className="mt-5 pt-5 border-t border-white/10 dark:border-gray-200 grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-[10px] font-mono uppercase tracking-widest text-white/50 dark:text-gray-500">Timeline</div>
                    <div className="tabular mt-1 text-base font-bold text-white dark:text-gray-900">
                      {quote.weeks[0]}–{quote.weeks[1]} tuần
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] font-mono uppercase tracking-widest text-white/50 dark:text-gray-500">Bảo trì sau bàn giao</div>
                    <div className="tabular mt-1 text-base font-bold text-white dark:text-gray-900">
                      ~{formatVNDCompact(quote.maintenanceMonthly)}/tháng
                    </div>
                  </div>
                </div>

                {/* Self-service action row - PRIMARY */}
                <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-2">
                  <CopyButton text={summary} />
                  <ShareButton text={summary} />
                  <PrintButton />
                </div>
              </div>

              {/* Itemized breakdown - collapsible */}
              <details className="mt-5 rounded-lg border border-gray-200 dark:border-ink-800 bg-white dark:bg-ink-900 overflow-hidden">
                <summary className="cursor-pointer px-4 py-3 flex items-center justify-between text-sm font-semibold text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-ink-800/40">
                  <span>Chi tiết {quote.items.length} hạng mục</span>
                  <Icon name="chevron-down" className="w-4 h-4 text-gray-400" />
                </summary>
                <div className="px-4 py-3 border-t border-gray-200 dark:border-ink-800 space-y-1.5">
                  {quote.items.map((it) => (
                    <div key={it.id} className="flex items-baseline justify-between text-sm gap-3">
                      <span className="text-gray-700 dark:text-ink-200">{it.name}</span>
                      <span className="tabular font-mono text-gray-900 dark:text-white shrink-0">{formatVNDCompact(it.price)}</span>
                    </div>
                  ))}
                  {(quote.designMul !== 1 || quote.timelineMul !== 1) && (
                    <div className="pt-2 mt-2 border-t border-dashed border-gray-200 dark:border-ink-700 space-y-1 text-xs text-gray-500 dark:text-ink-400">
                      {quote.designMul !== 1 && (
                        <div className="flex justify-between"><span>Hệ số thiết kế</span><span className="tabular font-mono">×{quote.designMul}</span></div>
                      )}
                      {quote.timelineMul !== 1 && (
                        <div className="flex justify-between"><span>Hệ số tiến độ gấp</span><span className="tabular font-mono">×{quote.timelineMul}</span></div>
                      )}
                      <div className="flex justify-between pt-1 border-t border-gray-100 dark:border-ink-800 font-bold text-gray-900 dark:text-white">
                        <span>Subtotal × hệ số</span>
                        <span className="tabular font-mono">{formatVND(quote.total)}</span>
                      </div>
                    </div>
                  )}
                </div>
              </details>

              {/* Client-paid third-party costs - transparency */}
              {quote.clientCosts.length > 0 && (
                <details className="mt-3 rounded-lg border border-gray-200 dark:border-ink-800 bg-white dark:bg-ink-900 overflow-hidden">
                  <summary className="cursor-pointer px-4 py-3 flex items-center justify-between text-sm font-semibold text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-ink-800/40">
                    <span>Phí bên thứ ba (bạn trả trực tiếp)</span>
                    <Icon name="chevron-down" className="w-4 h-4 text-gray-400" />
                  </summary>
                  <div className="px-4 py-3 border-t border-gray-200 dark:border-ink-800">
                    <p className="text-xs text-gray-500 dark:text-ink-400 mb-3">
                      Đăng ký tên miền, hosting, store fee - bạn trả thẳng cho nhà cung cấp, không qua Alodev. Liệt kê đầy đủ cho minh bạch.
                    </p>
                    <div className="space-y-2">
                      {quote.clientCosts.map((c) => (
                        <div key={c.label} className="flex items-baseline justify-between gap-3 text-sm">
                          <div className="flex-1 min-w-0">
                            <div className="text-gray-700 dark:text-ink-200 font-medium">{c.label}</div>
                            {c.note && <div className="text-xs text-gray-400 dark:text-ink-500">{c.note}</div>}
                          </div>
                          <div className="shrink-0 text-right">
                            <div className="tabular font-mono text-xs text-gray-900 dark:text-white">{c.amount}</div>
                            <div className="text-[10px] font-mono uppercase tracking-wider text-gray-400 dark:text-ink-500">
                              {c.frequency === 'one-time' ? '1 lần' : c.frequency === 'annual' ? '/năm' : '/tháng'}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </details>
              )}

              {/* Contact section - SECONDARY, optional */}
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-ink-800">
                <p className="text-[10px] font-mono uppercase tracking-widest text-gray-500 dark:text-ink-400 mb-3">Cần trao đổi thêm?</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <ZaloButton summary={summary} />
                  <button
                    type="button"
                    onClick={sendToContactForm}
                    className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 dark:border-ink-800 bg-white dark:bg-ink-900 px-4 py-3 text-sm font-semibold text-gray-900 dark:text-white hover:border-gray-300 dark:hover:border-ink-700 transition"
                  >
                    <Icon name="file-text" className="w-4 h-4 text-brand-700 dark:text-brand-400" />
                    Gửi form chính thức
                  </button>
                </div>
                <p className="mt-3 text-xs text-gray-500 dark:text-ink-500">
                  Báo giá chính thức + scope of work trong 24h sau khi liên hệ.
                </p>
              </div>
            </StepShell>
          )}
        </div>
      </section>
    </>
  )
}

// ─────────────── Self-service action buttons ───────────────

function CopyButton({ text }: { text: string }) {
  const [done, setDone] = useState(false)
  function copy() {
    navigator.clipboard?.writeText(text).then(() => {
      setDone(true)
      setTimeout(() => setDone(false), 2000)
    }).catch(() => {})
  }
  return (
    <button
      type="button"
      onClick={copy}
      className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-white/10 dark:bg-gray-900/10 hover:bg-white/15 dark:hover:bg-gray-900/15 px-3 py-2.5 text-xs sm:text-sm font-semibold transition"
    >
      <Icon name={done ? 'check' : 'copy'} className="w-3.5 h-3.5" strokeWidth={2.25} />
      <span>{done ? 'Đã sao chép' : 'Sao chép'}</span>
    </button>
  )
}

function ShareButton({ text }: { text: string }) {
  const [done, setDone] = useState(false)
  async function share() {
    const url = typeof window !== 'undefined' ? window.location.href : ''
    if (navigator.share) {
      try {
        await navigator.share({ title: 'Báo giá Alodev', text, url })
        return
      } catch {}
    }
    // Fallback: copy URL to clipboard
    navigator.clipboard?.writeText(url).then(() => {
      setDone(true)
      setTimeout(() => setDone(false), 2000)
    }).catch(() => {})
  }
  return (
    <button
      type="button"
      onClick={share}
      className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-white/10 dark:bg-gray-900/10 hover:bg-white/15 dark:hover:bg-gray-900/15 px-3 py-2.5 text-xs sm:text-sm font-semibold transition"
    >
      <Icon name={done ? 'check' : 'share-2'} className="w-3.5 h-3.5" strokeWidth={2.25} />
      <span>{done ? 'Đã copy URL' : 'Chia sẻ'}</span>
    </button>
  )
}

function PrintButton() {
  function print() {
    if (typeof window !== 'undefined') window.print()
  }
  return (
    <button
      type="button"
      onClick={print}
      className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-white/10 dark:bg-gray-900/10 hover:bg-white/15 dark:hover:bg-gray-900/15 px-3 py-2.5 text-xs sm:text-sm font-semibold transition col-span-2 sm:col-span-1"
    >
      <Icon name="printer" className="w-3.5 h-3.5" strokeWidth={2.25} />
      <span>In / PDF</span>
    </button>
  )
}

function ZaloButton({ summary }: { summary: string }) {
  const [copied, setCopied] = useState(false)
  async function openZalo() {
    // Copy summary to clipboard then open Zalo - user pastes it in chat
    try {
      await navigator.clipboard.writeText(summary)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    } catch {}
    setTimeout(() => {
      window.open('https://zalo.me/0364234936', '_blank', 'noopener,noreferrer')
    }, 400)
  }
  return (
    <button
      type="button"
      onClick={openZalo}
      className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 hover:bg-blue-700 px-4 py-3 text-sm font-semibold text-white transition"
    >
      <Icon name="message-circle" className="w-4 h-4" strokeWidth={2.25} />
      <span>{copied ? 'Đã copy - đang mở Zalo…' : 'Chat Zalo - paste cấu hình'}</span>
    </button>
  )
}

// ─────────────── Sub-components ───────────────

function ProgressBar({ currentStep, onJump }: { currentStep: Step; onJump: (s: Step) => void }) {
  return (
    <div className="flex items-center gap-1.5 sm:gap-2 flex-1 min-w-0">
      {STEPS.map((s, i) => {
        const done = currentStep > s.id
        const active = currentStep === s.id
        const canJump = done
        return (
          <div key={s.id} className="flex items-center gap-1.5 sm:gap-2 flex-1 min-w-0">
            <button
              type="button"
              disabled={!canJump}
              onClick={() => canJump && onJump(s.id)}
              className={`shrink-0 w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-xs font-bold transition ${
                done
                  ? 'bg-brand-600 dark:bg-brand-500 text-white hover:scale-110 cursor-pointer'
                  : active
                    ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900'
                    : 'bg-gray-100 dark:bg-ink-800 text-gray-400 dark:text-ink-500'
              }`}
              aria-label={`Bước ${s.id}: ${s.label}`}
            >
              {done ? <Icon name="check" className="w-3 h-3" strokeWidth={3} /> : s.id}
            </button>
            <div className="hidden sm:block flex-1 min-w-0">
              <div className={`text-xs font-mono uppercase tracking-wide leading-tight ${active ? 'text-gray-900 dark:text-white' : 'text-gray-400 dark:text-ink-500'}`}>{s.label}</div>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`flex-1 h-px ${done ? 'bg-brand-500 dark:bg-brand-400' : 'bg-gray-200 dark:bg-ink-700'}`} />
            )}
          </div>
        )
      })}
    </div>
  )
}

function StepShell({
  index, title, subtitle, children, onBack, onNext, nextLabel,
}: {
  index: string
  title: string
  subtitle: string
  children: React.ReactNode
  onBack?: () => void
  onNext?: () => void
  nextLabel?: string
}) {
  return (
    <div className="animate-[stepFade_.25s_cubic-bezier(0.22,1,0.36,1)]">
      <div className="mb-6 sm:mb-8">
        <p className="mag-section-index">{index}</p>
        <h1 className="mag-section-head !mt-2">{title}</h1>
        <p className="mt-2 text-sm sm:text-base text-gray-500 dark:text-ink-400">{subtitle}</p>
      </div>
      {children}
      {(onBack || onNext) && (
        <div className="mt-8 flex items-center gap-3 flex-wrap">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="inline-flex items-center gap-2 rounded-lg border border-gray-200 dark:border-ink-800 bg-white dark:bg-ink-900 px-4 py-2.5 text-sm font-semibold text-gray-900 dark:text-white hover:border-gray-300 dark:hover:border-ink-700 transition"
            >
              <Icon name="arrow-left" className="w-4 h-4" />
              Quay lại
            </button>
          )}
          {onNext && (
            <button
              type="button"
              onClick={onNext}
              className="ml-auto inline-flex items-center gap-2 rounded-lg bg-gray-900 dark:bg-white px-5 py-2.5 text-sm font-bold text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100 transition"
            >
              {nextLabel || 'Tiếp tục'}
              <Icon name="arrow-right" className="w-4 h-4" strokeWidth={2.5} />
            </button>
          )}
        </div>
      )}
      <style>{`@keyframes stepFade { from { opacity: 0; transform: translateY(8px) } to { opacity: 1; transform: translateY(0) } }`}</style>
    </div>
  )
}

function ModifierChoice({
  label, options, value, onChange,
}: {
  label: string
  options: { id: string; label: string; desc: string; multiplier: number }[]
  value: string
  onChange: (id: string) => void
}) {
  return (
    <div>
      <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-gray-500 dark:text-ink-400 mb-2">{label}</div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        {options.map((o) => {
          const active = o.id === value
          return (
            <button
              key={o.id}
              type="button"
              onClick={() => onChange(o.id)}
              className={`text-left rounded-lg border p-3 transition ${
                active
                  ? 'border-gray-900 dark:border-white bg-white dark:bg-ink-900'
                  : 'border-gray-200 dark:border-ink-800 bg-white dark:bg-ink-900 hover:border-gray-300 dark:hover:border-ink-700'
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-semibold text-gray-900 dark:text-white">{o.label}</span>
                <span className={`tabular text-[10px] font-mono ${active ? 'text-brand-700 dark:text-brand-400' : 'text-gray-400 dark:text-ink-500'}`}>
                  {o.multiplier === 1 ? 'cơ bản' : `×${o.multiplier}`}
                </span>
              </div>
              <p className="mt-1 text-xs text-gray-500 dark:text-ink-400 leading-relaxed">{o.desc}</p>
            </button>
          )
        })}
      </div>
    </div>
  )
}
