import Image from 'next/image'

/**
 * Brand assets section for /ve-chung-toi — 3 export-ready cards in
 * proper social-media aspect ratios. Each card combines the new
 * angle-bracket logo (public/brand/logo-symbol.svg) with an isometric
 * Rubik symbol that mirrors the homepage hero cube.
 *
 * Aspect ratios match the platforms users typically need:
 *   1. Avatar (1:1) — Facebook profile, Zalo, LinkedIn personal
 *   2. Cover (1.91:1, ≈ 1640×856) — Facebook cover, LinkedIn page banner
 *   3. Group photo (16:9, ≈ 1920×1080) — Facebook group cover, LinkedIn
 *      org banner, YouTube channel art (safe area)
 *
 * To export: right-click the card → "Save image as" works on a static
 * snapshot, or use the browser's element-screenshot feature (DevTools
 * → Inspect → ⋮ → Capture node screenshot) which gives a pixel-perfect
 * render at the card's CSS dimensions. The card CSS dimensions match
 * the export resolution 1:1 so screenshots are deploy-ready.
 */
export default function BrandAssets() {
  return (
    <section
      id="brand-assets"
      className="py-12 lg:py-24 bg-cream-50 dark:bg-ink-950 border-y border-gray-200 dark:border-ink-800"
      data-section-name="Bộ nhận diện"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="reveal max-w-2xl mb-8 lg:mb-12">
          <div className="inline-flex items-center gap-2">
            <span className="w-6 h-px bg-brand-600 dark:bg-brand-400" />
            <span className="text-xs font-bold uppercase tracking-widest text-brand-600 dark:text-brand-400">
              Bộ nhận diện
            </span>
          </div>
          <h2 className="h-section mt-3 text-gray-900 dark:text-white">
            Logo. Biểu tượng. Avatar.
          </h2>
          <p className="mt-4 text-base lg:text-lg text-gray-600 dark:text-ink-400 leading-relaxed">
            Logo Alodev (cặp ngoặc nhọn xanh — biểu trưng cho code) và biểu tượng Rubik (sáu mặt một sản phẩm).
            Ba phiên bản dưới đây là social card sẵn dùng cho Facebook profile, cover và group.
            Click chuột phải → <em>Lưu ảnh</em>, hoặc DevTools → <em>Capture node screenshot</em> trên từng card.
          </p>
        </div>

        <div className="reveal-stagger grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {/* ─── 1. AVATAR 1:1 ─── */}
          <BrandCard
            label="Avatar — 1:1 · 1080×1080"
            sublabel="Facebook profile · Zalo · LinkedIn personal"
            aspect="aspect-square"
            id="brand-avatar"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#0b1426] via-[#0d1a35] to-[#1b2a5a] flex items-center justify-center">
              {/* Subtle grid backdrop */}
              <div
                className="absolute inset-0 opacity-[0.18]"
                style={{
                  backgroundImage:
                    'linear-gradient(to right, rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.4) 1px, transparent 1px)',
                  backgroundSize: '48px 48px',
                  maskImage:
                    'radial-gradient(ellipse at center, #000 35%, transparent 75%)',
                }}
              />
              {/* Cube symbol — isometric SVG */}
              <div className="absolute right-[10%] bottom-[10%] w-[28%] opacity-30">
                <IsoCube />
              </div>
              {/* Logo + wordmark */}
              <div className="relative z-10 flex flex-col items-center gap-5">
                <Image
                  src="/brand/logo-symbol.svg"
                  alt="Alodev logo"
                  width={180}
                  height={219}
                  className="drop-shadow-[0_8px_24px_rgba(95,148,247,0.45)]"
                />
                <div className="text-white text-5xl font-bold tracking-tight">alodev</div>
                <div className="text-white/55 text-xs font-mono uppercase tracking-[0.28em]">
                  studio · web · app
                </div>
              </div>
            </div>
          </BrandCard>

          {/* ─── 2. COVER 1.91:1 (Facebook cover) ─── */}
          <BrandCard
            label="Cover — 1.91:1 · 1640×856"
            sublabel="Facebook cover · LinkedIn page banner"
            aspect="aspect-[820/428]"
            id="brand-cover"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#070c1a] via-[#0d1a35] to-[#1f2f6a] flex items-center">
              {/* Right-side cube */}
              <div className="absolute right-[5%] top-1/2 -translate-y-1/2 w-[26%] opacity-40">
                <IsoCube />
              </div>
              {/* Atmospheric blob lower-left */}
              <div
                className="absolute -left-[15%] -bottom-[35%] w-[55%] aspect-square rounded-full"
                style={{
                  background: 'radial-gradient(circle, rgba(95,148,247,0.20) 0%, transparent 65%)',
                  filter: 'blur(40px)',
                }}
              />
              {/* Grid */}
              <div
                className="absolute inset-0 opacity-[0.15]"
                style={{
                  backgroundImage:
                    'linear-gradient(to right, rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.4) 1px, transparent 1px)',
                  backgroundSize: '40px 40px',
                  maskImage:
                    'linear-gradient(to right, transparent 0%, #000 25%, #000 100%)',
                }}
              />
              {/* Content — left-aligned */}
              <div className="relative z-10 pl-[6%] pr-[35%] flex items-center gap-7">
                <Image
                  src="/brand/logo-symbol.svg"
                  alt="Alodev logo"
                  width={120}
                  height={146}
                  className="drop-shadow-[0_8px_24px_rgba(95,148,247,0.45)]"
                />
                <div>
                  <div className="text-white text-5xl lg:text-6xl font-bold tracking-tight leading-[0.9]">
                    alodev
                  </div>
                  <div className="mt-3 text-white/85 text-base lg:text-lg font-medium leading-snug">
                    Studio thiết kế &amp; phát triển web/app
                  </div>
                  <div className="mt-2 text-white/50 text-xs font-mono uppercase tracking-[0.22em]">
                    Hà Nội · Việt Nam · alodev.vn
                  </div>
                </div>
              </div>
            </div>
          </BrandCard>

          {/* ─── 3. GROUP COVER 16:9 ─── */}
          <BrandCard
            label="Group cover — 16:9 · 1920×1080"
            sublabel="Facebook group · LinkedIn organization · YouTube channel"
            aspect="aspect-video"
            id="brand-group"
            fullWidth
          >
            <div className="absolute inset-0 bg-[#06091a] flex items-center">
              {/* Big atmospheric blob upper-left */}
              <div
                className="absolute -left-[8%] -top-[35%] w-[45%] aspect-square rounded-full"
                style={{
                  background:
                    'radial-gradient(circle, rgba(95,148,247,0.32) 0%, rgba(60,92,186,0.16) 35%, transparent 70%)',
                  filter: 'blur(48px)',
                }}
              />
              {/* Cube symbol — large, right side */}
              <div className="absolute right-[6%] top-1/2 -translate-y-1/2 w-[26%] opacity-65">
                <IsoCube />
              </div>
              {/* Grid background */}
              <div
                className="absolute inset-0 opacity-[0.12]"
                style={{
                  backgroundImage:
                    'linear-gradient(to right, rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.4) 1px, transparent 1px)',
                  backgroundSize: '52px 52px',
                  maskImage:
                    'radial-gradient(ellipse at left, #000 0%, #000 50%, transparent 90%)',
                }}
              />
              {/* Content */}
              <div className="relative z-10 pl-[7%] pr-[40%] flex flex-col gap-6">
                <div className="flex items-center gap-5">
                  <Image
                    src="/brand/logo-symbol.svg"
                    alt="Alodev logo"
                    width={88}
                    height={107}
                    className="drop-shadow-[0_8px_24px_rgba(95,148,247,0.45)]"
                  />
                  <div className="text-white text-5xl lg:text-7xl font-bold tracking-tight leading-[0.9]">
                    alodev
                  </div>
                </div>
                <div className="text-white/90 text-xl lg:text-2xl font-medium leading-snug max-w-xl">
                  Founder-led studio — biến ý tưởng thành sản phẩm thật.
                </div>
                <div className="flex items-center gap-3 mt-2">
                  <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur text-white/80 text-xs font-mono">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    Đang nhận dự án Q2/2026
                  </span>
                  <span className="text-white/40 text-xs font-mono uppercase tracking-[0.2em]">
                    alodev.vn
                  </span>
                </div>
              </div>
            </div>
          </BrandCard>
        </div>

        {/* Export tip */}
        <div className="mt-8 text-sm text-gray-500 dark:text-ink-500">
          <strong className="text-gray-700 dark:text-ink-300">Mẹo export pixel-perfect</strong>:
          mở DevTools (F12) → Inspect element trên card → ⋮ menu → <em>Capture node screenshot</em>.
          Browser sẽ render ở exact CSS resolution. Hoặc dùng tool như{' '}
          <a
            href="https://www.figma.com/community/plugin/735098390272716124/html-to-figma"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-brand-600 dark:hover:text-brand-400"
          >
            html-to-figma
          </a>{' '}
          để bring card vào Figma chỉnh sửa thêm.
        </div>
      </div>
    </section>
  )
}

function BrandCard({
  label,
  sublabel,
  aspect,
  id,
  fullWidth,
  children,
}: {
  label: string
  sublabel: string
  aspect: string
  id: string
  fullWidth?: boolean
  children: React.ReactNode
}) {
  return (
    <figure
      className={`${fullWidth ? 'lg:col-span-2' : ''} group rounded-2xl border border-gray-200 dark:border-ink-800 overflow-hidden bg-white dark:bg-ink-900`}
    >
      <div id={id} className={`relative ${aspect} w-full overflow-hidden`}>
        {children}
      </div>
      <figcaption className="px-5 py-4 flex items-center justify-between border-t border-gray-100 dark:border-ink-800">
        <div>
          <div className="text-sm font-semibold text-gray-900 dark:text-white">{label}</div>
          <div className="text-xs text-gray-500 dark:text-ink-500 mt-0.5">{sublabel}</div>
        </div>
        <a
          href={`#${id}`}
          className="text-xs font-mono text-brand-600 dark:text-brand-400 hover:underline"
          aria-label={`Anchor đến ${label}`}
        >
          #{id}
        </a>
      </figcaption>
    </figure>
  )
}

/**
 * IsoCube — static isometric Rubik 3×3 illustration. Mirrors the homepage
 * hero cube symbolically without loading three.js. Pure SVG so it scales
 * cleanly and screenshots crisp at any export resolution.
 */
function IsoCube() {
  // Three faces: top, left, right. Each face is a 3×3 grid of tiles drawn
  // in isometric projection (30° angles). Tile colors stay close to the
  // brand palette (saffron + slate) and the homepage cube material.
  return (
    <svg viewBox="0 0 200 220" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
      <defs>
        <linearGradient id="iso-top" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#8aa0d8" />
          <stop offset="1" stopColor="#5a73b8" />
        </linearGradient>
        <linearGradient id="iso-left" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3a4a78" />
          <stop offset="1" stopColor="#1f2a52" />
        </linearGradient>
        <linearGradient id="iso-right" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#283450" />
          <stop offset="1" stopColor="#0e1530" />
        </linearGradient>
      </defs>

      {/* TOP face — 3×3 diamond grid */}
      {[0, 1, 2].flatMap((row) =>
        [0, 1, 2].map((col) => {
          const cx = 100 + (col - row) * 30
          const cy = 30 + (col + row) * 17
          return (
            <polygon
              key={`t-${row}-${col}`}
              points={`${cx},${cy - 14} ${cx + 28},${cy} ${cx},${cy + 14} ${cx - 28},${cy}`}
              fill="url(#iso-top)"
              stroke="#0b1326"
              strokeWidth="1.5"
            />
          )
        }),
      )}

      {/* LEFT face — 3×3 parallelograms */}
      {[0, 1, 2].flatMap((row) =>
        [0, 1, 2].map((col) => {
          const x = 16 + col * 30
          const y = 95 + col * 17 + row * 28
          return (
            <polygon
              key={`l-${row}-${col}`}
              points={`${x},${y} ${x + 28},${y - 16} ${x + 28},${y + 12} ${x},${y + 28}`}
              fill="url(#iso-left)"
              stroke="#0b1326"
              strokeWidth="1.5"
            />
          )
        }),
      )}

      {/* RIGHT face — 3×3 parallelograms */}
      {[0, 1, 2].flatMap((row) =>
        [0, 1, 2].map((col) => {
          const x = 100 + col * 30
          const y = 78 - col * 17 + row * 28
          return (
            <polygon
              key={`r-${row}-${col}`}
              points={`${x},${y} ${x + 28},${y + 16} ${x + 28},${y + 44} ${x},${y + 28}`}
              fill="url(#iso-right)"
              stroke="#0b1326"
              strokeWidth="1.5"
            />
          )
        }),
      )}
    </svg>
  )
}
