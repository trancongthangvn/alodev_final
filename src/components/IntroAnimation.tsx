'use client'

import { useEffect, useState, useCallback } from 'react'

const KEY = 'alodev-intro-last-shown'
const COOLDOWN_MS = 12 * 60 * 60 * 1000   // show once per 12h
const DURATION = 1200                      // total intro time (tightened)
const FADE_DELAY = 880                     // when fade-out starts

/**
 * Cinematic brand-reveal intro. Plays once per ~12 hours per browser.
 *
 * Choreography (1.7s total):
 *  0–250    grid pattern fades in + 3 loading dots pulse in centre
 *  250–600  loading dots fade out, saffron orb pulses behind
 *  300–800  logo "alodev" — each letter cascades in with subtle blur clearing (60ms stagger)
 *  650–1100 underline shimmer draws + sweep highlight
 *  900–1300 tagline letter-cascade (40ms stagger)
 *  1100–1500 version + locale chips fade in (corners)
 *  1350–1700 entire overlay: blur 0→8px + scale 1→1.06 + opacity 1→0
 *
 * Skipped if:
 *  - shown within last 12 hours (localStorage)
 *  - prefers-reduced-motion
 *  - user clicks anywhere or presses any key
 */
export default function IntroAnimation() {
  const [visible, setVisible] = useState(false)
  const [exiting, setExiting] = useState(false)

  const dismiss = useCallback(() => {
    setExiting(true)
    setTimeout(() => setVisible(false), 380)
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return
    try {
      const last = localStorage.getItem(KEY)
      if (last && Date.now() - parseInt(last, 10) < COOLDOWN_MS) return
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        localStorage.setItem(KEY, String(Date.now()))
        return
      }
      localStorage.setItem(KEY, String(Date.now()))
    } catch {
      return
    }

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setVisible(true)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const fadeT = setTimeout(() => setExiting(true), FADE_DELAY)
    const removeT = setTimeout(() => {
      setVisible(false)
      document.body.style.overflow = prevOverflow
    }, DURATION)

    return () => {
      clearTimeout(fadeT)
      clearTimeout(removeT)
      document.body.style.overflow = prevOverflow
    }
  }, [])

  // Click / key to skip
  useEffect(() => {
    if (!visible) return
    function skip() { dismiss() }
    window.addEventListener('click', skip, { once: true })
    window.addEventListener('keydown', skip, { once: true })
    return () => {
      window.removeEventListener('click', skip)
      window.removeEventListener('keydown', skip)
    }
  }, [visible, dismiss])

  if (!visible) return null

  // Letter cascade for logo + tagline — theme-adaptive (saffron + black/white)
  const logoChars = [
    { ch: 'a', class: 'text-brand-600 dark:text-brand-400' },
    { ch: 'l', class: 'text-brand-600 dark:text-brand-400' },
    { ch: 'o', class: 'text-brand-600 dark:text-brand-400' },
    { ch: 'd', class: 'text-ink-900 dark:text-white' },
    { ch: 'e', class: 'text-ink-900 dark:text-white' },
    { ch: 'v', class: 'text-ink-900 dark:text-white' },
  ]
  const tagline = 'STUDIO · WEB · APP'

  return (
    <div
      aria-hidden="true"
      // Theme-adaptive — bg matches the hero behind it (light cream in day,
      // Resend-style #07080c at night) so intro→hero transition is seamless.
      className={`intro-overlay fixed inset-0 z-[200] flex items-center justify-center text-ink-900 dark:text-white ${exiting ? 'intro-exit' : 'intro-enter'}`}
    >
      {/* Subtle animated grid background — theme-adaptive grid lines */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="intro-grid absolute inset-0 opacity-50 grid-bg" />
      </div>

      {/* Saffron orb behind logo for depth */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="intro-orb absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] max-w-[640px] aspect-square rounded-full"
          style={{
            background: 'radial-gradient(circle, #f4811a 0%, transparent 65%)',
            filter: 'blur(90px)',
            opacity: 0,
          }}
        />
      </div>

      {/* Top-left tiny tag */}
      <div className="intro-corner intro-corner-tl absolute top-5 left-5 sm:top-7 sm:left-7 flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.2em] text-gray-500 dark:text-zinc-400">
        <span className="relative flex h-1.5 w-1.5">
          <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75 animate-ping" />
          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
        </span>
        <span>Hà Nội · Việt Nam</span>
      </div>

      {/* Top-right version */}
      <div className="intro-corner intro-corner-tr absolute top-5 right-5 sm:top-7 sm:right-7 text-[10px] font-mono uppercase tracking-[0.2em] text-gray-500 dark:text-zinc-400">
        v2026.04
      </div>

      {/* Center stack */}
      <div className="relative text-center px-6">
        {/* Logo with letter cascade — starts immediately */}
        <div className="text-5xl sm:text-7xl lg:text-8xl font-bold tracking-tight leading-none flex justify-center" aria-label="alodev">
          {logoChars.map((c, i) => (
            <span
              key={i}
              className={`intro-letter ${c.class}`}
              style={{ animationDelay: `${80 + i * 50}ms` }}
            >
              {c.ch}
            </span>
          ))}
        </div>

        {/* Saffron underline with shimmer */}
        <div className="intro-line-wrap mt-5 mx-auto h-[3px] w-32 sm:w-44 rounded-full overflow-hidden relative">
          <div className="intro-line absolute inset-0 rounded-full" />
          <div className="intro-shimmer absolute inset-y-0 w-1/3 rounded-full" />
        </div>

        {/* Tagline letter cascade */}
        <div className="mt-5 text-[11px] sm:text-xs font-bold uppercase tracking-[0.4em] text-gray-500 dark:text-zinc-400 flex justify-center" aria-label={tagline}>
          {tagline.split('').map((ch, i) => (
            <span
              key={i}
              className="intro-tag-char inline-block"
              style={{
                animationDelay: `${550 + i * 20}ms`,
                whiteSpace: ch === ' ' ? 'pre' : 'normal',
                width: ch === ' ' ? '0.4em' : 'auto',
              }}
            >
              {ch}
            </span>
          ))}
        </div>
      </div>

      {/* Bottom-left progress bar */}
      <div className="intro-corner intro-corner-bl absolute bottom-5 left-5 sm:bottom-7 sm:left-7 flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.2em] text-gray-500 dark:text-zinc-400">
        <span>Loading</span>
        <span className="relative w-16 h-[2px] rounded-full bg-gray-200 dark:bg-zinc-800 overflow-hidden">
          <span className="intro-bar absolute inset-y-0 left-0 bg-brand-500 dark:bg-brand-400 rounded-full" />
        </span>
      </div>

      {/* Bottom-right hint */}
      <div className="intro-corner intro-corner-br absolute bottom-5 right-5 sm:bottom-7 sm:right-7 text-[10px] font-mono uppercase tracking-[0.2em] text-gray-400 dark:text-zinc-500">
        <span className="hidden sm:inline">Click hoặc bấm phím để bỏ qua</span>
        <span className="sm:hidden">Tap để bỏ qua</span>
      </div>

      <style>{`
        /* ── Overlay enter/exit ── */
        .intro-enter { animation: introFadeIn 0.22s ease-out; }
        .intro-exit  { animation: introFadeOut 0.45s cubic-bezier(0.22, 1, 0.36, 1) forwards; }
        @keyframes introFadeIn  { from { opacity: 0 } to { opacity: 1 } }
        @keyframes introFadeOut {
          from { opacity: 1; transform: scale(1); filter: blur(0px) }
          to   { opacity: 0; transform: scale(1.06); filter: blur(8px) }
        }

        /* ── Grid background slide-in ── */
        .intro-grid {
          opacity: 0;
          transform: scale(1.04);
          animation: introGrid 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
        @keyframes introGrid {
          to { opacity: 0.5; transform: scale(1); }
        }

        /* ── Saffron orb pulse ── */
        .intro-orb {
          animation: introOrb 1.0s cubic-bezier(0.22, 1, 0.36, 1) 0s forwards;
          will-change: opacity, transform;
        }
        @keyframes introOrb {
          0%   { transform: translate(-50%, -50%) scale(0.6); opacity: 0; }
          60%  { opacity: 0.55; }
          100% { transform: translate(-50%, -50%) scale(1); opacity: 0.4; }
        }

        /* ── Logo letter cascade — fade-up + blur clearing ── */
        .intro-letter {
          display: inline-block;
          opacity: 0;
          transform: translateY(14px);
          filter: blur(6px);
          animation: introLetter 0.55s cubic-bezier(0.22, 1, 0.36, 1) forwards;
          will-change: opacity, transform, filter;
        }
        @keyframes introLetter {
          /* filter: none — Lightning CSS strips blur(0) and blur(0px) to invalid blur() */
          to { opacity: 1; transform: translateY(0); filter: none; }
        }

        /* ── Underline draw + shimmer sweep ── */
        .intro-line-wrap {
          opacity: 0;
          animation: introLineWrap 0.4s cubic-bezier(0.22, 1, 0.36, 1) 0.4s forwards;
        }
        @keyframes introLineWrap { to { opacity: 1; } }
        .intro-line {
          background: linear-gradient(90deg, var(--accent), var(--accent-soft), var(--accent));
          transform: scaleX(0);
          transform-origin: center;
          animation: introLine 0.45s cubic-bezier(0.22, 1, 0.36, 1) 0.45s forwards;
        }
        @keyframes introLine { to { transform: scaleX(1); } }
        .intro-shimmer {
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.85), transparent);
          transform: translateX(-100%);
          animation: introShimmer 0.9s ease-out 0.7s forwards;
          mix-blend-mode: overlay;
        }
        @keyframes introShimmer { to { transform: translateX(400%); } }

        /* ── Tagline character cascade ── */
        .intro-tag-char {
          opacity: 0;
          transform: translateY(6px);
          filter: blur(3px);
          animation: introTagChar 0.4s cubic-bezier(0.22, 1, 0.36, 1) forwards;
          will-change: opacity, transform, filter;
        }
        @keyframes introTagChar {
          /* filter: none — Lightning CSS strips blur(0) and blur(0px) to invalid blur() */
          to { opacity: 1; transform: translateY(0); filter: none; }
        }

        /* ── Corner chips: fade-in late ── */
        .intro-corner {
          opacity: 0;
          animation: introCorner 0.3s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
        .intro-corner-tl { animation-delay: 0.65s; }
        .intro-corner-tr { animation-delay: 0.65s; }
        .intro-corner-bl { animation-delay: 0.7s; }
        .intro-corner-br { animation-delay: 0.75s; }
        @keyframes introCorner { to { opacity: 1; } }

        /* ── Loading bar 0 → 100% ── */
        .intro-bar {
          width: 0%;
          animation: introBar 0.7s cubic-bezier(0.65, 0, 0.35, 1) 0.3s forwards;
        }
        @keyframes introBar { to { width: 100%; } }

        @media (prefers-reduced-motion: reduce) {
          .intro-enter, .intro-exit, .intro-grid, .intro-orb,
          .intro-letter, .intro-line-wrap, .intro-line, .intro-shimmer,
          .intro-tag-char, .intro-corner, .intro-bar {
            animation: none !important;
            opacity: 1 !important;
            transform: none !important;
            filter: none !important;
          }
          .intro-line { transform: scaleX(1) !important; }
          .intro-bar { width: 100% !important; }
        }
      `}</style>
    </div>
  )
}
