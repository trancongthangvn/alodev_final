'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import Icon from '@/components/Icon'
import {
  projectTypes,
  designTiers,
  timelineModes,
  formatVND,
  formatVNDCompact,
  type ProjectType,
  type Preset,
} from '@/data/quote-features'

type Step = 1 | 2 | 3 | 4

const STEPS: { id: Step; label: string; sub: string }[] = [
  { id: 1, label: 'Loại dự án',     sub: 'Bạn muốn làm gì?' },
  { id: 2, label: 'Mục đích',       sub: 'Phù hợp nhất với bạn' },
  { id: 3, label: 'Tuỳ chỉnh',      sub: 'Thêm bớt tính năng' },
  { id: 4, label: 'Hoàn tất',       sub: 'Xem báo giá' },
]

export default function QuoteBuilder() {
  const router = useRouter()
  const [step, setStep] = useState<Step>(1)
  const [typeId, setTypeId] = useState<ProjectType['id'] | null>(null)
  const [presetId, setPresetId] = useState<string | null>(null)
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [designId, setDesignId] = useState('std')
  const [timelineId, setTimelineId] = useState('standard')

  const type = typeId ? projectTypes.find((t) => t.id === typeId)! : null

  function pickType(id: ProjectType['id']) {
    setTypeId(id)
    setPresetId(null)
    // Auto-select required features for that type
    const t = projectTypes.find((x) => x.id === id)!
    const req = new Set<string>()
    for (const g of t.groups) for (const f of g.features) {
      if (f.required) req.add(f.id)
    }
    setSelected(req)
    setStep(2)
  }

  function pickPreset(p: Preset) {
    setPresetId(p.id)
    // Apply preset features + always-required
    const next = new Set<string>(p.features)
    if (type) {
      for (const g of type.groups) for (const f of g.features) {
        if (f.required) next.add(f.id)
      }
    }
    setSelected(next)
    setStep(3)
  }

  function pickEmptyPreset() {
    setPresetId('_blank')
    if (type) {
      const next = new Set<string>()
      for (const g of type.groups) for (const f of g.features) {
        if (f.required) next.add(f.id)
      }
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

  // Pricing — depend on raw IDs (stable primitives) instead of derived `type`.
  const calc = useMemo(() => {
    if (!typeId) return null
    const t = projectTypes.find((x) => x.id === typeId)
    if (!t) return null
    const items: { id: string; name: string; price: number }[] = [
      { id: '_base', name: `${t.name} — bao gồm sẵn`, price: t.basePrice },
    ]
    for (const g of t.groups) {
      for (const f of g.features) {
        if (f.required || selected.has(f.id)) {
          items.push({ id: f.id, name: f.name, price: f.price })
        }
      }
    }
    const subtotal = items.reduce((s, l) => s + l.price, 0)
    const designMul = designTiers.find((d) => d.id === designId)!.multiplier
    const timelineMul = timelineModes.find((m) => m.id === timelineId)!.multiplier
    const total = subtotal * designMul * timelineMul
    return {
      items,
      subtotal,
      total,
      totalLow: total * 0.85,
      totalHigh: total * 1.15,
      designMul,
      timelineMul,
    }
  }, [typeId, selected, designId, timelineId])

  function buildSummary(): string {
    if (!type) return ''
    const lines: string[] = []
    lines.push(`Loại dự án: ${type.name}`)
    if (presetId && presetId !== '_blank') {
      const p = type.presets.find((x) => x.id === presetId)
      if (p) lines.push(`Mục đích: ${p.name} — ${p.desc}`)
    }
    lines.push('')
    lines.push('TÍNH NĂNG:')
    lines.push(`  • ${type.name} — base (${formatVNDCompact(type.basePrice)})`)
    for (const g of type.groups) for (const f of g.features) {
      if (selected.has(f.id) && !f.required) {
        lines.push(`  • ${f.name} (${formatVNDCompact(f.price)})`)
      }
    }
    const dt = designTiers.find((d) => d.id === designId)!
    const tm = timelineModes.find((m) => m.id === timelineId)!
    lines.push('')
    lines.push(`Mức thiết kế: ${dt.label}${dt.multiplier !== 1 ? ` (×${dt.multiplier})` : ''}`)
    lines.push(`Tiến độ: ${tm.label}${tm.multiplier !== 1 ? ` (×${tm.multiplier})` : ''}`)
    if (calc) {
      lines.push('')
      lines.push(`ƯỚC TÍNH: ${formatVND(calc.totalLow)} — ${formatVND(calc.totalHigh)}`)
      lines.push(`Báo giá chính thức ±15% sau khi xác nhận chi tiết scope.`)
    }
    return lines.join('\n')
  }

  function submit() {
    if (!type || !calc) return
    try {
      sessionStorage.setItem('alodev-quote-summary', buildSummary())
      sessionStorage.setItem('alodev-quote-service', type.name)
      sessionStorage.setItem('alodev-quote-budget', pickBudgetBucket(calc.total))
    } catch {}
    router.push('/lien-he?from=bao-gia')
  }

  // ─────────────── RENDER ───────────────
  return (
    <>
      {/* Sticky progress + total bar */}
      <div className="sticky top-14 z-30 bg-white/95 dark:bg-ink-950/95 backdrop-blur-xl border-b border-ink-100 dark:border-ink-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3">
          <div className="flex items-center justify-between gap-3">
            <ProgressBar currentStep={step} />
            {calc && step >= 3 && (
              <div className="text-right shrink-0">
                <div className="text-[10px] font-bold uppercase tracking-widest text-ink-500 dark:text-ink-400">Ước tính</div>
                <div className="tabular text-base sm:text-lg font-bold text-ink-900 dark:text-white leading-tight">
                  {formatVNDCompact(calc.totalLow)}–{formatVNDCompact(calc.totalHigh)}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <section className="py-8 lg:py-14 bg-cream-50 dark:bg-ink-950 min-h-[calc(100vh-140px)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">

          {step === 1 && (
            <StepShell title="Bạn muốn làm gì?" subtitle="Chọn loại sản phẩm — không sao nếu chưa chắc, bạn đổi sau được">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {projectTypes.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => pickType(t.id)}
                    className="group text-left rounded-2xl border-2 border-ink-100 dark:border-ink-800 bg-white dark:bg-ink-900 p-6 hover:border-brand-400 dark:hover:border-brand-500/50 hover:shadow-lg transition"
                  >
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-brand-50 dark:bg-brand-500/10 text-brand-700 dark:text-brand-400 mb-4">
                      <Icon name={t.icon} className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-bold text-ink-900 dark:text-white">{t.name}</h3>
                    <p className="mt-1 text-sm text-ink-500 dark:text-ink-300">{t.tagline}</p>
                    <p className="mt-3 text-xs text-ink-400 dark:text-ink-500 italic">{t.example}</p>
                    <div className="mt-4 flex items-center gap-1 text-sm font-semibold text-brand-700 dark:text-brand-400">
                      Từ {formatVNDCompact(t.basePrice)}
                      <Icon name="arrow-right" className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition" />
                    </div>
                  </button>
                ))}
              </div>
            </StepShell>
          )}

          {step === 2 && type && (
            <StepShell
              title="Mục đích chính của bạn?"
              subtitle="Chọn template gần nhất — Alodev tự chọn tính năng phù hợp"
              onBack={() => setStep(1)}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {type.presets.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => pickPreset(p)}
                    className="group text-left rounded-2xl border-2 border-ink-100 dark:border-ink-800 bg-white dark:bg-ink-900 p-5 hover:border-brand-400 dark:hover:border-brand-500/50 hover:shadow-lg transition"
                  >
                    <div className="flex items-start gap-3">
                      <div className="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-brand-50 dark:bg-brand-500/10 text-brand-700 dark:text-brand-400 shrink-0">
                        <Icon name={p.icon} className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base font-bold text-ink-900 dark:text-white">{p.name}</h3>
                        <p className="mt-1 text-sm text-ink-500 dark:text-ink-300 leading-relaxed">{p.desc}</p>
                      </div>
                    </div>
                    <div className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-brand-700 dark:text-brand-400">
                      Auto-tick {p.features.length} tính năng phù hợp
                      <Icon name="arrow-right" className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition" />
                    </div>
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={pickEmptyPreset}
                className="mt-4 w-full text-center text-sm text-ink-500 dark:text-ink-400 hover:text-ink-900 dark:hover:text-white py-3"
              >
                Tôi muốn tự chọn từng tính năng từ đầu →
              </button>
            </StepShell>
          )}

          {step === 3 && type && (
            <StepShell
              title="Thêm hoặc bớt tính năng"
              subtitle={presetId === '_blank' ? 'Chọn các tính năng bạn cần' : 'Đã chọn sẵn theo template — bỏ bớt nếu không cần, hoặc thêm vào'}
              onBack={() => setStep(2)}
              onNext={() => setStep(4)}
              nextLabel="Tiếp tục"
            >
              {/* Always-included note */}
              <div className="mb-6 rounded-xl border border-brand-100 dark:border-brand-500/20 bg-brand-50/60 dark:bg-brand-500/5 px-5 py-4 flex items-start gap-3">
                <Icon name="check" className="w-5 h-5 mt-0.5 text-brand-700 dark:text-brand-400 shrink-0" strokeWidth={2.5} />
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-ink-900 dark:text-white">Đã bao gồm — không cần lo</div>
                  <p className="mt-1 text-sm text-ink-600 dark:text-ink-300 leading-relaxed">{type.baseDesc}</p>
                </div>
                <div className="tabular text-sm font-bold text-ink-900 dark:text-white shrink-0 whitespace-nowrap">
                  {formatVNDCompact(type.basePrice)}
                </div>
              </div>

              {/* Feature groups as visual cards */}
              <div className="space-y-7">
                {type.groups.map((g) => (
                  <div key={g.id}>
                    <h3 className="text-sm font-bold uppercase tracking-widest text-ink-500 dark:text-ink-400 mb-3">{g.title}</h3>
                    <div className="space-y-2">
                      {g.features.map((f) => {
                        const checked = selected.has(f.id) || f.required
                        return (
                          <button
                            key={f.id}
                            type="button"
                            disabled={f.required}
                            onClick={() => toggle(f.id, f.required)}
                            className={`group w-full text-left rounded-xl border-2 p-4 transition flex items-start gap-3 ${
                              checked
                                ? 'border-brand-400 bg-brand-50/40 dark:border-brand-500/40 dark:bg-brand-500/5'
                                : 'border-ink-100 dark:border-ink-800 bg-white dark:bg-ink-900 hover:border-ink-200 dark:hover:border-ink-700'
                            } ${f.required ? 'opacity-90 cursor-default' : 'cursor-pointer'}`}
                          >
                            {/* Checkbox visual */}
                            <span
                              aria-hidden="true"
                              className={`shrink-0 mt-0.5 w-6 h-6 rounded-md border-2 flex items-center justify-center transition ${
                                checked
                                  ? 'border-brand-600 bg-brand-600 dark:border-brand-500 dark:bg-brand-500'
                                  : 'border-ink-200 dark:border-ink-700 bg-white dark:bg-ink-800'
                              }`}
                            >
                              {checked && <Icon name="check" className="w-4 h-4 text-white" strokeWidth={3} />}
                            </span>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-baseline justify-between gap-2 flex-wrap">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="text-base font-semibold text-ink-900 dark:text-white">{f.name}</span>
                                  {f.popular && (
                                    <span className="text-[10px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded-full bg-brand-100 text-brand-800 dark:bg-brand-500/20 dark:text-brand-300">
                                      Phổ biến
                                    </span>
                                  )}
                                  {f.required && (
                                    <span className="text-[10px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded-full bg-ink-100 text-ink-600 dark:bg-ink-800 dark:text-ink-300">
                                      Bắt buộc
                                    </span>
                                  )}
                                </div>
                                <span className="tabular shrink-0 text-sm font-bold text-brand-700 dark:text-brand-400">
                                  +{formatVNDCompact(f.price)}
                                </span>
                              </div>
                              <p className="mt-1 text-sm text-ink-500 dark:text-ink-300 leading-relaxed">{f.desc}</p>
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

          {step === 4 && type && calc && (
            <StepShell
              title="Tổng kết & gửi yêu cầu"
              subtitle="Xem lại cấu hình rồi gửi cho Alodev — báo giá chính thức trong 24h"
              onBack={() => setStep(3)}
            >
              {/* Modifier choices first */}
              <div className="space-y-6 mb-8">
                <ModifierChoice label="Mức độ thiết kế" options={designTiers} value={designId} onChange={setDesignId} />
                <ModifierChoice label="Tiến độ" options={timelineModes} value={timelineId} onChange={setTimelineId} />
              </div>

              {/* Big total */}
              <div className="rounded-2xl border-2 border-ink-900 dark:border-white bg-ink-900 dark:bg-white text-white dark:text-ink-900 p-6 sm:p-8">
                <div className="text-xs font-bold uppercase tracking-widest text-white/60 dark:text-ink-500">Báo giá ước tính</div>
                <div className="tabular mt-2 text-3xl sm:text-5xl font-bold leading-tight">
                  {formatVNDCompact(calc.totalLow)} <span className="opacity-50 text-2xl sm:text-3xl">—</span> {formatVNDCompact(calc.totalHigh)}
                </div>
                <div className="mt-2 text-sm text-white/70 dark:text-ink-600">
                  Trung bình {formatVND(calc.total)} · ±15% tuỳ scope chi tiết
                </div>

                <button
                  type="button"
                  onClick={submit}
                  className="mt-6 w-full inline-flex items-center justify-center gap-2 rounded-xl bg-white dark:bg-ink-900 px-5 py-4 text-ink-900 dark:text-white text-base font-bold hover:bg-cream-50 dark:hover:bg-ink-800 transition"
                >
                  Gửi cấu hình này cho Alodev
                  <Icon name="arrow-right" className="w-4 h-4" strokeWidth={2.5} />
                </button>
                <p className="mt-3 text-xs text-white/60 dark:text-ink-500 text-center">
                  Phản hồi báo giá chính thức kèm hợp đồng + scope of work trong 24h
                </p>
              </div>

              {/* Itemized breakdown */}
              <details className="mt-6 rounded-xl border border-ink-100 dark:border-ink-800 bg-white dark:bg-ink-900 overflow-hidden">
                <summary className="cursor-pointer px-5 py-4 flex items-center justify-between font-semibold text-ink-900 dark:text-white">
                  <span>Xem chi tiết {calc.items.length} hạng mục</span>
                  <Icon name="chevron-down" className="w-4 h-4 text-ink-400" />
                </summary>
                <div className="px-5 py-4 border-t border-ink-100 dark:border-ink-800 space-y-2">
                  {calc.items.map((it) => (
                    <div key={it.id} className="flex items-baseline justify-between text-sm gap-3">
                      <span className="text-ink-700 dark:text-ink-200">{it.name}</span>
                      <span className="tabular font-mono text-ink-900 dark:text-white shrink-0">{formatVNDCompact(it.price)}</span>
                    </div>
                  ))}
                  {(calc.designMul !== 1 || calc.timelineMul !== 1) && (
                    <div className="pt-3 mt-3 border-t border-dashed border-ink-200 dark:border-ink-700 space-y-1.5 text-xs text-ink-500 dark:text-ink-400">
                      {calc.designMul !== 1 && (
                        <div className="flex justify-between"><span>Hệ số thiết kế</span><span className="tabular font-mono">×{calc.designMul}</span></div>
                      )}
                      {calc.timelineMul !== 1 && (
                        <div className="flex justify-between"><span>Hệ số tiến độ gấp</span><span className="tabular font-mono">×{calc.timelineMul}</span></div>
                      )}
                    </div>
                  )}
                </div>
              </details>

              <div className="mt-6 rounded-xl border border-ink-100 dark:border-ink-800 bg-white dark:bg-ink-900 p-4 flex items-start gap-3">
                <Icon name="message-circle" className="w-4 h-4 mt-0.5 text-brand-700 dark:text-brand-400" />
                <div className="text-xs text-ink-600 dark:text-ink-300 leading-relaxed">
                  Hoặc <a href="https://zalo.me/0364234936" target="_blank" rel="noopener noreferrer" className="font-semibold text-brand-700 dark:text-brand-400 hover:underline">chat Zalo 0364 234 936</a> để trao đổi nhanh — Alodev phản hồi 5–10 phút.
                </div>
              </div>
            </StepShell>
          )}
        </div>
      </section>
    </>
  )
}

// ─────────────── Sub-components ───────────────

function ProgressBar({ currentStep }: { currentStep: Step }) {
  return (
    <div className="flex items-center gap-1.5 sm:gap-2 flex-1 min-w-0">
      {STEPS.map((s, i) => {
        const done = currentStep > s.id
        const active = currentStep === s.id
        return (
          <div key={s.id} className="flex items-center gap-1.5 sm:gap-2 flex-1 min-w-0">
            <div
              className={`shrink-0 w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-xs font-bold transition ${
                done
                  ? 'bg-brand-600 dark:bg-brand-500 text-white'
                  : active
                    ? 'bg-ink-900 dark:bg-white text-white dark:text-ink-900'
                    : 'bg-ink-100 dark:bg-ink-800 text-ink-400 dark:text-ink-500'
              }`}
            >
              {done ? <Icon name="check" className="w-3.5 h-3.5" strokeWidth={3} /> : s.id}
            </div>
            <div className="hidden sm:block flex-1 min-w-0">
              <div className={`text-xs font-semibold leading-tight ${active ? 'text-ink-900 dark:text-white' : 'text-ink-400 dark:text-ink-500'}`}>{s.label}</div>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`flex-1 h-px ${done ? 'bg-brand-500 dark:bg-brand-400' : 'bg-ink-200 dark:bg-ink-700'}`} />
            )}
          </div>
        )
      })}
    </div>
  )
}

function StepShell({
  title, subtitle, children, onBack, onNext, nextLabel,
}: {
  title: string
  subtitle: string
  children: React.ReactNode
  onBack?: () => void
  onNext?: () => void
  nextLabel?: string
}) {
  return (
    <div className="animate-[stepFade_.25s_cubic-bezier(0.22,1,0.36,1)]">
      <div className="mb-7 sm:mb-9">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-ink-900 dark:text-white tracking-tight">{title}</h1>
        <p className="mt-2 text-sm sm:text-base text-ink-500 dark:text-ink-300">{subtitle}</p>
      </div>
      {children}
      {(onBack || onNext) && (
        <div className="mt-8 flex items-center gap-3 flex-wrap">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="inline-flex items-center gap-2 rounded-xl border border-ink-100 dark:border-ink-800 bg-white dark:bg-ink-900 px-5 py-3 text-ink-900 dark:text-white text-sm font-semibold hover:bg-cream-50 dark:hover:bg-ink-800 transition"
            >
              <Icon name="arrow-left" className="w-4 h-4" />
              Quay lại
            </button>
          )}
          {onNext && (
            <button
              type="button"
              onClick={onNext}
              className="ml-auto inline-flex items-center gap-2 rounded-xl bg-ink-900 dark:bg-white px-6 py-3 text-white dark:text-ink-900 text-sm font-bold hover:bg-ink-800 dark:hover:bg-ink-100 shadow-lg shadow-ink-900/10 transition"
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
      <div className="text-sm font-bold text-ink-900 dark:text-white mb-2.5">{label}</div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        {options.map((o) => {
          const active = o.id === value
          return (
            <button
              key={o.id}
              type="button"
              onClick={() => onChange(o.id)}
              className={`text-left rounded-xl border-2 p-4 transition ${
                active
                  ? 'border-ink-900 dark:border-white bg-white dark:bg-ink-900'
                  : 'border-ink-100 dark:border-ink-800 bg-white dark:bg-ink-900 hover:border-ink-200 dark:hover:border-ink-700'
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-semibold text-ink-900 dark:text-white">{o.label}</span>
                <span className={`tabular text-xs font-mono ${active ? 'text-brand-700 dark:text-brand-400' : 'text-ink-400 dark:text-ink-500'}`}>
                  {o.multiplier === 1 ? 'cơ bản' : `×${o.multiplier}`}
                </span>
              </div>
              <p className="mt-1 text-xs text-ink-500 dark:text-ink-400 leading-relaxed">{o.desc}</p>
            </button>
          )
        })}
      </div>
    </div>
  )
}

function pickBudgetBucket(total: number): string {
  if (total < 10_000_000) return '< 10 triệu'
  if (total < 30_000_000) return '10–30 triệu'
  if (total < 80_000_000) return '30–80 triệu'
  if (total < 200_000_000) return '80–200 triệu'
  return '> 200 triệu'
}
