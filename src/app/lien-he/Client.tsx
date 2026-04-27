'use client'

import { useEffect, useState } from 'react'
import Icon, { type IconName } from '@/components/Icon'
import EmailLink from '@/components/EmailLink'

const services = [
  'Website doanh nghiệp',
  'App Mobile',
  'Hệ thống quản trị',
  'Tự động hoá / AI',
  'Bảo trì / nâng cấp',
  'Thiết kế UI/UX',
  'Khác',
]

const budgets = ['< 10 triệu', '10–30 triệu', '30–80 triệu', '80–200 triệu', '> 200 triệu', 'Chưa rõ']

// Map service names from /bao-gia to dropdown values
const SERVICE_MAP: Record<string, string> = {
  'Website': 'Website doanh nghiệp',
  'App Mobile': 'App Mobile',
  'Hệ thống quản trị': 'Hệ thống quản trị',
}

type FieldErrors = { name?: string; email?: string; phone?: string; message?: string }

// Vietnamese-specific phone regex: starts with 0, 10 digits total (handles
// optional spaces / dashes). Covers Viettel/Mobifone/Vinaphone/Vietnamobile.
const PHONE_RE = /^0\d{9}$/
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

function validate(form: { name: string; email: string; phone: string; message: string }): FieldErrors {
  const e: FieldErrors = {}
  if (!form.name.trim()) e.name = 'Vui lòng nhập họ tên.'
  else if (form.name.trim().length < 2) e.name = 'Họ tên quá ngắn.'
  if (!form.email.trim()) e.email = 'Vui lòng nhập email.'
  else if (!EMAIL_RE.test(form.email.trim())) e.email = 'Email không hợp lệ — kiểm tra lại định dạng.'
  if (!form.phone.trim()) e.phone = 'Vui lòng nhập số điện thoại.'
  else if (!PHONE_RE.test(form.phone.replace(/[\s-]/g, ''))) e.phone = 'Số điện thoại không hợp lệ (cần 10 số, bắt đầu bằng 0).'
  if (!form.message.trim()) e.message = 'Vui lòng mô tả dự án.'
  else if (form.message.trim().length < 10) e.message = 'Mô tả quá ngắn — tối thiểu 10 ký tự.'
  return e
}

export default function LienHeClient() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', service: services[0], budget: budgets[0], message: '' })
  const [status, setStatus] = useState<'idle' | 'sending' | 'ok' | 'error'>('idle')
  const [errMsg, setErrMsg] = useState('')
  const [fromQuote, setFromQuote] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})

  // Hydrate form from /bao-gia quote builder handoff (sessionStorage)
  useEffect(() => {
    try {
      const summary = sessionStorage.getItem('alodev-quote-summary')
      const svc = sessionStorage.getItem('alodev-quote-service')
      const bud = sessionStorage.getItem('alodev-quote-budget')
      if (summary) {
        setForm((f) => ({
          ...f,
          message: summary + '\n\n— Mô tả thêm về nhu cầu cụ thể (deadline, đặc thù nghiệp vụ…):\n',
          service: (svc && SERVICE_MAP[svc]) || f.service,
          budget: (bud && budgets.includes(bud)) ? bud : f.budget,
        }))
        setFromQuote(true)
        sessionStorage.removeItem('alodev-quote-summary')
        sessionStorage.removeItem('alodev-quote-service')
        sessionStorage.removeItem('alodev-quote-budget')
      }
    } catch {}
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    // Inline validation gate. If any field invalid, mark all as touched so
    // every error becomes visible at once, focus the first invalid input,
    // and DON'T submit.
    const errs = validate(form)
    if (Object.keys(errs).length) {
      setFieldErrors(errs)
      setTouched({ name: true, email: true, phone: true, message: true })
      const firstKey = Object.keys(errs)[0]
      const el = document.querySelector<HTMLInputElement>(`[data-field="${firstKey}"]`)
      el?.focus()
      el?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      return
    }
    setStatus('sending')
    setErrMsg('')
    try {
      const r = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!r.ok) {
        const j = await r.json().catch(() => ({}))
        throw new Error(j.error || `HTTP ${r.status}`)
      }
      setStatus('ok')
      setForm({ name: '', email: '', phone: '', service: services[0], budget: budgets[0], message: '' })
      setFieldErrors({})
      setTouched({})
      // Scroll the success banner into view on mobile where the submit
      // button is below the fold; users otherwise wonder if anything happened.
      setTimeout(() => {
        document.querySelector('[data-status-banner]')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }, 50)
    } catch (err) {
      setStatus('error')
      setErrMsg((err as Error).message || 'Không gửi được. Hãy thử Zalo bên dưới.')
    }
  }

  // Re-validate on every change once the field has been touched/blurred so
  // the error message disappears as soon as the user fixes the input.
  function onFieldChange<K extends keyof typeof form>(key: K, value: typeof form[K]) {
    const next = { ...form, [key]: value }
    setForm(next)
    if (touched[key as string]) {
      setFieldErrors(validate(next))
    }
  }
  function onFieldBlur(key: keyof typeof form) {
    setTouched((t) => ({ ...t, [key]: true }))
    setFieldErrors(validate(form))
  }

  return (
    <>
      <section className="bg-gradient-to-br from-cream-50 via-white to-cream-100 border-b border-gray-100 dark:from-ink-950 dark:via-ink-950 dark:to-ink-900 dark:border-ink-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-20">
          <div className="max-w-3xl">
            <div className="text-sm font-semibold text-brand-600 dark:text-brand-400 uppercase tracking-wider">Liên hệ</div>
            <h1 className="mt-2 text-4xl sm:text-5xl font-bold tracking-tight text-gray-900 dark:text-white leading-tight">Gửi yêu cầu — chúng tôi gọi lại trong 24h</h1>
            <p className="mt-5 text-lg text-gray-600 dark:text-ink-400">Mô tả ngắn ý tưởng, ngân sách dự kiến, deadline (nếu có). Alodev sẽ phản hồi kèm báo giá sơ bộ và đề xuất giải pháp.</p>
          </div>
        </div>
      </section>

      <section className="py-10 lg:py-16 bg-white dark:bg-ink-950">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2">
            {fromQuote && (
              <div className="mb-4 flex items-start gap-3 rounded-xl border border-brand-200 bg-brand-50/60 px-4 py-3 text-sm text-brand-900 dark:border-brand-500/30 dark:bg-brand-500/10 dark:text-brand-200">
                <Icon name="check" className="w-4 h-4 mt-0.5 shrink-0" strokeWidth={2.25} />
                <span>Cấu hình từ trang báo giá đã được điền vào ô <b>Mô tả dự án</b>. Bạn có thể chỉnh sửa trước khi gửi.</span>
              </div>
            )}
            <form onSubmit={handleSubmit} noValidate className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-8 space-y-4 sm:space-y-5 dark:bg-ink-900 dark:border-ink-800">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Họ và tên" required error={touched.name ? fieldErrors.name : undefined}>
                  <input data-field="name" required type="text" autoComplete="name"
                    value={form.name}
                    onChange={(e) => onFieldChange('name', e.target.value)}
                    onBlur={() => onFieldBlur('name')}
                    className={`input ${touched.name && fieldErrors.name ? 'input-error' : ''}`}
                    placeholder="Nguyễn Văn A" />
                </Field>
                <Field label="Số điện thoại" required error={touched.phone ? fieldErrors.phone : undefined}>
                  <input data-field="phone" required type="tel" autoComplete="tel" inputMode="numeric"
                    value={form.phone}
                    onChange={(e) => onFieldChange('phone', e.target.value)}
                    onBlur={() => onFieldBlur('phone')}
                    className={`input ${touched.phone && fieldErrors.phone ? 'input-error' : ''}`}
                    placeholder="0364 xxx xxx" />
                </Field>
              </div>
              <Field label="Email" required error={touched.email ? fieldErrors.email : undefined}>
                <input data-field="email" required type="email" autoComplete="email" inputMode="email"
                  value={form.email}
                  onChange={(e) => onFieldChange('email', e.target.value)}
                  onBlur={() => onFieldBlur('email')}
                  className={`input ${touched.email && fieldErrors.email ? 'input-error' : ''}`}
                  placeholder="ban@congty.vn" />
              </Field>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Dịch vụ quan tâm">
                  <select value={form.service} onChange={(e) => setForm({ ...form, service: e.target.value })} className="input">
                    {services.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </Field>
                <Field label="Ngân sách dự kiến">
                  <select value={form.budget} onChange={(e) => setForm({ ...form, budget: e.target.value })} className="input">
                    {budgets.map((b) => <option key={b} value={b}>{b}</option>)}
                  </select>
                </Field>
              </div>
              <Field label="Mô tả dự án" required error={touched.message ? fieldErrors.message : undefined}>
                <textarea data-field="message" required rows={4}
                  value={form.message}
                  onChange={(e) => onFieldChange('message', e.target.value)}
                  onBlur={() => onFieldBlur('message')}
                  className={`input resize-y min-h-[96px] sm:min-h-[120px] ${touched.message && fieldErrors.message ? 'input-error' : ''}`}
                  placeholder="Mô tả ngắn về sản phẩm bạn muốn làm, mục tiêu, deadline mong muốn..." />
              </Field>

              {status === 'ok' && (
                <div data-status-banner className="flex items-start gap-2 rounded-xl bg-emerald-50 border border-emerald-200 p-4 text-sm text-emerald-800 dark:bg-emerald-500/10 dark:border-emerald-500/30 dark:text-emerald-300 animate-[banner-in_300ms_cubic-bezier(0.22,1,0.36,1)]">
                  <Icon name="check" className="w-4 h-4 mt-0.5 shrink-0" strokeWidth={2.25} />
                  <span>Đã nhận yêu cầu. Alodev sẽ liên hệ trong vòng 24h. Trong thời gian chờ, bạn có thể chat Zalo bên cạnh.</span>
                </div>
              )}
              {status === 'error' && (
                <div data-status-banner className="flex items-start gap-2 rounded-xl bg-rose-50 border border-rose-200 p-4 text-sm text-rose-800 dark:bg-rose-500/10 dark:border-rose-500/30 dark:text-rose-300 animate-[banner-in_300ms_cubic-bezier(0.22,1,0.36,1)]">
                  <Icon name="x" className="w-4 h-4 mt-0.5 shrink-0" strokeWidth={2.25} />
                  <span>{errMsg}</span>
                </div>
              )}

              <button type="submit" disabled={status === 'sending'} className="w-full sm:w-auto inline-flex items-center justify-center gap-2 min-h-12 rounded-xl bg-ink-900 dark:bg-white px-6 py-3.5 text-white dark:text-ink-900 font-semibold shadow-lg shadow-ink-900/10 hover:bg-ink-800 dark:hover:bg-ink-100 disabled:opacity-60 disabled:cursor-not-allowed transition">
                {status === 'sending' ? 'Đang gửi...' : 'Gửi yêu cầu'}
                <Icon name="arrow-right" className="w-4 h-4" strokeWidth={2.25} />
              </button>
            </form>
          </div>

          <aside className="space-y-4">
            <ContactCard icon="message-circle" title="Zalo / Hotline" lines={[<a key="z" href="https://zalo.me/0364234936" target="_blank" rel="noopener noreferrer" className="text-brand-700 dark:text-brand-400 hover:underline">0364 234 936</a>, 'Online 8h–22h hằng ngày']} />
            <ContactCard icon="mail"           title="Email"          lines={[<EmailLink key="e" user="hello" domain="alodev.vn" className="text-brand-700 dark:text-brand-400 hover:underline" />, 'Phản hồi trong 24h']} />
            <ContactCard icon="map-pin"        title="Văn phòng"      lines={['Hà Nội, Việt Nam', 'Hỗ trợ remote toàn quốc']} />
            <ContactCard icon="clock"          title="Cam kết"        lines={['Phản hồi báo giá: 24h', 'Bảo hành: 6–12 tháng', 'Source code thuộc về bạn']} />
          </aside>
        </div>
      </section>

      <style>{`
        .input{width:100%;border-radius:0.75rem;border:1px solid #e4e7ec;background:white;padding:0.75rem 1rem;font-size:16px;color:#1e293b;transition:all 0.15s;min-height:44px}
        @media(min-width:768px){.input{font-size:0.95rem}}
        .input:focus{outline:none;border-color:#ad5e07;box-shadow:0 0 0 3px rgba(173,94,7,0.15)}
        .input-error{border-color:#f43f5e;box-shadow:0 0 0 3px rgba(244,63,94,0.15)}
        .input-error:focus{border-color:#f43f5e;box-shadow:0 0 0 3px rgba(244,63,94,0.25)}
        [data-theme=dark] .input{background:#13171f;border-color:#1f2330;color:#e6e9ee}
        [data-theme=dark] .input::placeholder{color:#64748b}
        [data-theme=dark] .input:focus{border-color:#ed9219;box-shadow:0 0 0 3px rgba(237,146,25,0.18)}
        [data-theme=dark] .input-error{border-color:#f87171;box-shadow:0 0 0 3px rgba(248,113,113,0.18)}
        @keyframes banner-in{from{opacity:0;transform:translateY(-6px)}to{opacity:1;transform:translateY(0)}}
      `}</style>
    </>
  )
}

function Field({
  label,
  required,
  error,
  children,
}: {
  label: string
  required?: boolean
  error?: string
  children: React.ReactNode
}) {
  return (
    <label className="block">
      <div className="text-sm font-medium text-gray-700 dark:text-ink-300 mb-1.5">
        {label}{required && <span className="text-rose-500 ml-0.5">*</span>}
      </div>
      {children}
      {error && (
        <div role="alert" className="mt-1.5 text-xs text-rose-600 dark:text-rose-400 flex items-center gap-1">
          <svg className="w-3 h-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
          </svg>
          {error}
        </div>
      )}
    </label>
  )
}

function ContactCard({ icon, title, lines }: { icon: IconName; title: string; lines: React.ReactNode[] }) {
  return (
    <div className="rounded-2xl border border-ink-100 bg-white p-5 dark:bg-ink-900 dark:border-ink-800">
      <div className="flex items-start gap-3">
        <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-cream-100 dark:bg-ink-800 text-ink-700 dark:text-ink-100 shrink-0">
          <Icon name={icon} className="w-5 h-5" />
        </div>
        <div>
          <div className="font-semibold text-gray-900 dark:text-white">{title}</div>
          <div className="mt-1 space-y-0.5 text-sm text-gray-600 dark:text-ink-400">
            {lines.map((l, i) => <div key={i}>{l}</div>)}
          </div>
        </div>
      </div>
    </div>
  )
}
