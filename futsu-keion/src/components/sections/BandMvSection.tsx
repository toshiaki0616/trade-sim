import { useRef, useEffect } from 'react'
import { bandCards } from '../../data/bands'
import { BandCard } from '../music/BandCard'
import { SectionTitle } from '../ui/SectionTitle'

export const BandMvSection = () => {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.querySelectorAll<HTMLElement>('.reveal').forEach((child, i) => {
            setTimeout(() => child.classList.add('is-visible'), i * 60)
          })
          observer.disconnect()
        }
      },
      { threshold: 0.05 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <section id="music" className="py-24 px-6 bg-[#FBDB3E]">
      <div ref={ref} className="container mx-auto max-w-5xl">
        <div className="reveal">
          <SectionTitle en="MUSIC" ja="登場バンドMV" />
        </div>

        <p className="reveal reveal-delay-1 text-center text-gray-700 text-sm mb-10 -mt-6 font-medium">
          作中に登場した楽曲のMVはこちら
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
          {bandCards.map((band) => (
            <div key={band.id} className="reveal">
              <BandCard band={band} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
