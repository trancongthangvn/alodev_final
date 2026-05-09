'use client'

import { useEffect, useRef, type ReactNode } from 'react'

type Card = {
  /** Background gradient classes (Tailwind), e.g. "from-brand-500 to-fuchsia-500". */
  bg: string
  /** Step number / index (e.g. "01"). */
  index: string
  /** Card title. */
  title: string
  /** Body content. */
  body: ReactNode
}

type Props = {
  cards: Card[]
  /** Optional className on outer section. */
  className?: string
}

/**
 * Stack-reveal — cards stack on top of each other while the wrapper is
 * sticky-pinned. Each card scales-in + fades-in with a small offset; once
 * fully revealed, the next overlays. Pattern: Apple Vision Pro feature
 * stack, lusion sliders.
 *
 * Implementation: each card is `position: sticky; top: 80px` with a small
 * offset increment. As user scrolls, earlier cards stay pinned at top while
 * later cards slide in over them, creating a stacked card-deck feel.
 *
 * Mobile/reduced-motion: cards stack normally, no sticky, regular scroll.
 */
export default function StackReveal({ cards, className = '' }: Props) {
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const small = window.matchMedia('(max-width: 1023px)').matches
    if (reduced || small) {
      root.classList.add('stack-reveal-fallback')
      return
    }
  }, [])

  return (
    <div ref={rootRef} className={`stack-reveal ${className}`}>
      {cards.map((c, i) => (
        <div
          key={i}
          className="stack-reveal-card"
          style={{
            // Each card sticks ~24px lower than the previous so the stack
            // shows a peek of the underlying card's edge — readable
            // hierarchy. With max ~6 cards the visible offset stays small.
            top: `calc(80px + ${i * 24}px)`,
            zIndex: i + 1,
          }}
        >
          <article className={`stack-reveal-inner bg-gradient-to-br ${c.bg}`}>
            <div className="text-sm font-mono tabular text-white/70">{c.index}</div>
            <h3 className="mt-4 text-2xl lg:text-4xl font-bold tracking-tight text-white leading-tight">
              {c.title}
            </h3>
            <div className="mt-4 text-white/90 leading-relaxed max-w-2xl">{c.body}</div>
          </article>
        </div>
      ))}
    </div>
  )
}
