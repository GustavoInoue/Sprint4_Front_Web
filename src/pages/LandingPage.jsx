import AccessibilitySection from '../components/landing/AccessibilitySection'
import Audience from '../components/landing/Audience'
import Contact from '../components/landing/Contact'
import Formats from '../components/landing/Formats'
import Gallery from '../components/landing/Gallery'
import Hero from '../components/landing/Hero'
import Problem from '../components/landing/Problem'
import Process from '../components/landing/Process'
import Solution from '../components/landing/Solution'
import Team from '../components/landing/Team'
import TrySection from '../components/landing/TrySection'
import ScrollProgress from '../components/ui/ScrollProgress'

export default function LandingPage() {
  return (
    <>
      <ScrollProgress />
      <Hero />
      <Problem />
      <Solution />
      <Process />
      <Formats />
      <Audience />
      <AccessibilitySection />
      <Gallery />
      <TrySection />
      <Team />
      <Contact />
    </>
  )
}
