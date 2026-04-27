// Server component — renders synchronously, no Suspense boundary, so the
// page content lands BEFORE the footer in the static HTML (critical for SEO).
// Client interactivity (palette, motion) is opt-in via inner client components.
import Navbar from './Navbar'
import Footer from './Footer'
import BackToTop from '@/components/BackToTop'
import CommandPalette from '@/components/CommandPalette'
import MotionLayer from '@/components/MotionLayer'
import MobileStickyCTA from '@/components/MobileStickyCTA'
import PaletteHint from '@/components/PaletteHint'
import QuoteChoice from '@/components/QuoteChoice'
import IntroAnimation from '@/components/IntroAnimation'
import SectionFrame from '@/components/SectionFrame'

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
      <PaletteHint />
      <QuoteChoice />
      <MotionLayer />
      <SectionFrame />
      <IntroAnimation />
      <MobileStickyCTA />
      <BackToTop />
    </>
  )
}
