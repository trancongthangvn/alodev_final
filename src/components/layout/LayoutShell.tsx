// Server component — renders synchronously, no Suspense boundary, so the
// page content lands BEFORE the footer in the static HTML (critical for SEO).
// Client interactivity (palette, motion) is opt-in via inner client components.
import Navbar from './Navbar'
import Footer from './Footer'
import CommandPalette from '@/components/CommandPalette'
import MotionLayer from '@/components/MotionLayer'
import PaletteHint from '@/components/PaletteHint'
import QuoteChoice from '@/components/QuoteChoice'
import IntroAnimation from '@/components/IntroAnimation'
import SectionFrame from '@/components/SectionFrame'

export default function LayoutShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <CommandPalette />
      <PaletteHint />
      <QuoteChoice />
      <MotionLayer />
      <SectionFrame />
      <IntroAnimation />
    </>
  )
}
