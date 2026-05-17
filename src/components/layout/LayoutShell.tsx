// Server component - renders synchronously, no Suspense boundary, so the
// page content lands BEFORE the footer in the static HTML (critical for SEO).
//
// Stripped (May 2026, founder feedback "skill UX UI promax → AI VIBE"):
//   - SmoothScroll (Lenis): added scroll lag, signaled "designer trying"
//   - CustomCursor: peripheral cursor swap = pure decoration
//   - MotionLayer: managed reveal/stagger fade-ins → AI-template flair
//   - SectionFrame: section-edge flourish overlay
//   - IntroAnimation: page-load curtain reveal
// Kept (functional, not decorative):
//   - CommandPalette + QuoteChoice (interactive controls users actually use)
//   - MobileStickyCTA (conversion utility)
//   - BackToTop (utility)
import Navbar from './Navbar'
import Footer from './Footer'
import BackToTop from '@/components/BackToTop'
import CommandPalette from '@/components/CommandPalette'
import MobileStickyCTA from '@/components/MobileStickyCTA'
import QuoteChoice from '@/components/QuoteChoice'

export default function LayoutShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      {/* id="main" is the skip-link target (declared in app/layout.tsx).
          Wraps the route content so a single Tab+Enter from the top of the
          page lands the user past the global navbar. */}
      <main id="main" className="flex-1">{children}</main>
      <Footer />
      <CommandPalette />
      <QuoteChoice />
      <MobileStickyCTA />
      <BackToTop />
    </>
  )
}
