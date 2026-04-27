import Link from 'next/link'

export default function Breadcrumbs({ items }: { items: Array<{ name: string; href: string }> }) {
  return (
    <nav aria-label="Breadcrumb" className="text-sm">
      <ol className="flex flex-wrap items-center gap-1.5 text-gray-500 dark:text-ink-500">
        {items.map((it, i) => {
          const isLast = i === items.length - 1
          return (
            <li key={it.href} className="flex items-center gap-1.5">
              {i > 0 && (
                <svg className="w-3.5 h-3.5 text-gray-300 dark:text-ink-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              )}
              {isLast ? (
                <span className="text-gray-900 dark:text-ink-200 font-medium" aria-current="page">{it.name}</span>
              ) : (
                <Link href={it.href} className="inline-flex items-center min-h-9 py-1 hover:text-brand-600 dark:hover:text-brand-400 transition">{it.name}</Link>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
