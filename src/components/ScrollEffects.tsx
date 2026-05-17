'use client'
import { useEffect } from 'react'

/**
 * ScrollEffects - Apple/Linear-grade scroll choreography
 *
 * Five layers, all progressive enhancement (no JS = fully visible):
 *
 * 1. Word-split heading reveal
 *    Section headings are split into <span class="mag-hw"> words in JS.
 *    Each word rises + unblurs with a 65ms stagger between words -
 *    the "physical weight" effect Apple uses on product pages.
 *
 * 2. Stagger section items
 *    [data-stagger] children animate in when their .mag-section enters view.
 *    JS stamps per-item animation-delay; CSS keyframes handle motion.
 *
 * 3. Stats count-up
 *    Elements with [data-count="11+"] count from 0 → 11 with ease-out
 *    cubic curve (1400ms) when their section enters view.
 *
 * 4. Live TOC
 *    IntersectionObserver tracks which section is in the reading zone
 *    and stamps data-toc-active on the matching .mag-toc-link.
 *
 * CSS in globals.css drives the actual visual transforms; JS only
 * adds/removes classes and stamps inline animation-delay values.
 */
export default function ScrollEffects() {
  useEffect(() => {
    const scroll = document.querySelector<HTMLElement>('.mag-scroll')
    if (!scroll) return

    // ─────────────────────────────────────────────
    // 1. WORD-SPLIT HEADINGS
    // ─────────────────────────────────────────────
    const heads = Array.from(
      scroll.querySelectorAll<HTMLElement>('.mag-section-head')
    )

    heads.forEach(h => {
      // Preserve accessible text - SR reads textContent of inline spans naturally
      const raw = h.textContent?.trim() ?? ''
      if (!raw) return

      const frag = document.createDocumentFragment()
      raw.split(/\s+/).forEach((word, i, arr) => {
        const span = document.createElement('span')
        span.className = 'mag-hw'
        span.textContent = word
        // Stagger delay stamped inline so CSS needs zero nth-child rules
        span.style.transitionDelay = `${i * 68}ms`
        frag.appendChild(span)
        // Preserve inter-word spacing as text node
        if (i < arr.length - 1) frag.appendChild(document.createTextNode(' '))
      })
      h.innerHTML = ''
      h.appendChild(frag)
    })

    // ─────────────────────────────────────────────
    // 2. STAGGER + STATS COUNTER
    // ─────────────────────────────────────────────
    const sections = Array.from(
      scroll.querySelectorAll<HTMLElement>('.mag-section')
    )

    // Classify sections that are already in or above the viewport
    sections.forEach(s => {
      if (s.getBoundingClientRect().top < window.innerHeight * 0.9) {
        s.classList.add('section-pre-entered')
      }
    })

    // Enable hidden initial states now that JS has labelled each section
    scroll.classList.add('motion-ready')

    /** Ease-out cubic: fast start, soft landing */
    const easeOut3 = (t: number) => 1 - (1 - t) ** 3

    /** Count-up animation for [data-count] elements */
    function animateCount(el: HTMLElement) {
      const raw = el.dataset.count ?? el.textContent ?? ''
      const m = raw.match(/^(\d+)([^\d]*)$/)
      if (!m) return
      const target = parseInt(m[1], 10)
      const suffix = m[2]
      const duration = 1400
      const t0 = performance.now()
      const tick = (now: number) => {
        const p = Math.min((now - t0) / duration, 1)
        el.textContent = Math.round(target * easeOut3(p)) + suffix
        if (p < 1) requestAnimationFrame(tick)
      }
      requestAnimationFrame(tick)
    }

    function enterSection(el: HTMLElement) {
      if (el.classList.contains('section-entered')) return

      // Stamp per-item animation delays
      el.querySelectorAll<HTMLElement>('[data-stagger]').forEach((item, i) => {
        item.style.animationDelay = `${i * 55}ms`
      })

      // Kick off count-up for any stats in this section
      el.querySelectorAll<HTMLElement>('[data-count]').forEach(animateCount)

      el.classList.add('section-entered')
    }

    // Pre-enter sections already on screen (no visible flash on load)
    sections.forEach(s => {
      if (s.classList.contains('section-pre-entered')) enterSection(s)
    })

    const sectionObs = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) {
          enterSection(e.target as HTMLElement)
          sectionObs.unobserve(e.target)
        }
      }),
      // root: scroll - observe visibility within the internal scroll container
      { root: scroll, threshold: 0.04, rootMargin: '0px 0px -20px 0px' }
    )
    sections.forEach(s => sectionObs.observe(s))

    // ─────────────────────────────────────────────
    // 3. HEADING WORD REVEAL TRIGGER
    // ─────────────────────────────────────────────
    const headObs = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('head-visible')
          headObs.unobserve(e.target)
        }
      }),
      { root: scroll, threshold: 0.2 }
    )
    heads.forEach(h => headObs.observe(h))

    // ─────────────────────────────────────────────
    // 4. LIVE TOC
    // ─────────────────────────────────────────────
    const tocSections = scroll.querySelectorAll<HTMLElement>('.mag-section[id]')
    const tocLinks    = document.querySelectorAll<HTMLElement>('.mag-toc-link')
    const visibleIds  = new Set<string>()

    const tocObs = new IntersectionObserver(
      entries => {
        entries.forEach(e =>
          e.isIntersecting ? visibleIds.add(e.target.id) : visibleIds.delete(e.target.id)
        )
        let topId = '', topY = Infinity
        visibleIds.forEach(id => {
          const el = document.getElementById(id)
          if (!el) return
          const y = el.getBoundingClientRect().top
          if (y < topY) { topY = y; topId = id }
        })
        tocLinks.forEach(link =>
          link.toggleAttribute(
            'data-toc-active',
            !!topId && link.getAttribute('href') === `#${topId}`
          )
        )
      },
      // No navbar offset inside the scroll container (no fixed header inside)
      { root: scroll, rootMargin: '0px 0px -35% 0px', threshold: 0 }
    )
    tocSections.forEach(s => tocObs.observe(s))

    // ─────────────────────────────────────────────
    // 5. DARK SECTION SPOTLIGHT (mouse-tracking glow)
    // ─────────────────────────────────────────────
    const darkSection = scroll.querySelector<HTMLElement>('.mag-section--dark')
    const onSpotMove = (e: MouseEvent) => {
      if (!darkSection) return
      const r = darkSection.getBoundingClientRect()
      darkSection.style.setProperty('--spot-x', `${e.clientX - r.left}px`)
      darkSection.style.setProperty('--spot-y', `${e.clientY - r.top}px`)
    }
    if (darkSection) {
      darkSection.addEventListener('mousemove', onSpotMove, { passive: true })
    }

    return () => {
      sectionObs.disconnect()
      headObs.disconnect()
      tocObs.disconnect()
      if (darkSection) darkSection.removeEventListener('mousemove', onSpotMove)
    }
  }, [])

  return null
}
