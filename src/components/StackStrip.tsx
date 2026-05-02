/**
 * StackStrip — slim "Stack" section between Portfolio and WhyAlodev.
 *
 * After moving the 3D cube to the hero, the standalone Craft section was
 * downgraded to a quiet stack-categories list. Same dark Resend-flavored
 * surface, no big copy block, no metrics — just the framework names.
 *
 * Justification for keeping this around: the 5×5 grid of framework names
 * carries real SEO weight for keyword discovery ("Next.js Việt Nam",
 * "Postgres studio Hà Nội") and gives prospects a quick stack-fit check.
 */

const stackGroups = [
  { label: 'Frontend', items: ['Next.js', 'React', 'Vue', 'Nuxt', 'SwiftUI', 'Compose'] },
  { label: 'Backend',  items: ['Node.js', 'NestJS', 'Express', 'Spring Boot', 'Django'] },
  { label: 'Database', items: ['PostgreSQL', 'MySQL', 'Redis', 'ClickHouse', 'D1'] },
  { label: 'Infra',    items: ['AWS', 'Cloudflare', 'Docker', 'PM2', 'Nginx'] },
  { label: 'Mobile',   items: ['Swift', 'Kotlin', 'Flutter', 'React Native', 'Capacitor'] },
]

export default function StackStrip() {
  return (
    <section
      data-section-name="Stack"
      className="dark-strip relative py-14 lg:py-20 text-ink-900 dark:text-white overflow-hidden"
    >
      <div className="dark-strip-grid absolute inset-0" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="reveal text-center max-w-3xl mx-auto mb-10 lg:mb-14">
          <div className="text-xs font-mono font-semibold uppercase tracking-[0.2em] text-gray-500 dark:text-zinc-500">Stack</div>
          <h2 className="hero-h mt-3 text-3xl sm:text-4xl lg:text-5xl font-bold leading-[1.1] tracking-tight">
            Công nghệ chọn theo nghiệp vụ —<br className="hidden sm:inline" /> không chạy theo trend.
          </h2>
        </div>

        <div className="reveal-stagger grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {stackGroups.map((g) => (
            <div key={g.label} className="dark-card rounded-xl border backdrop-blur p-5">
              <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gray-500 dark:text-zinc-500 mb-4">
                {g.label}
              </div>
              <ul className="space-y-1.5">
                {g.items.map((it) => (
                  // Tech-cyan tint on the monospace stack names — pairs
                  // with the .kbd chip palette so all "code-y" text in
                  // the page reads as one coherent system. Section
                  // labels above stay neutral grey (they're meta, not
                  // content). On light cream the tech-700 sits readable
                  // without screaming; on dark it lifts to tech-300 for
                  // the iconic "terminal text" feel.
                  <li key={it} className="font-mono text-sm text-tech-800 dark:text-tech-300">{it}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
