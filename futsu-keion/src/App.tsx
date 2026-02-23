import { Header } from './components/layout/Header'
import { Footer } from './components/layout/Footer'
import { HeroSection } from './components/sections/HeroSection'
import { StorySection } from './components/sections/StorySection'
import { CharacterSection } from './components/sections/CharacterSection'
import { BandMvSection } from './components/sections/BandMvSection'
import { PlaylistSection } from './components/sections/PlaylistSection'
import { CtaSection } from './components/sections/CtaSection'

function App() {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <StorySection />
        <CharacterSection />
        <BandMvSection />
        <PlaylistSection />
        <CtaSection />
      </main>
      <Footer />
    </>
  )
}

export default App
