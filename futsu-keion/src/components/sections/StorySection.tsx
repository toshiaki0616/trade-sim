import { useRef, useEffect } from 'react'
import { SectionTitle } from '../ui/SectionTitle'

export const StorySection = () => {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.querySelectorAll<HTMLElement>('.reveal').forEach((child, i) => {
            setTimeout(() => child.classList.add('is-visible'), i * 120)
          })
          observer.disconnect()
        }
      },
      { threshold: 0.1 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <section id="story" className="py-24 px-6 bg-amber-50">
      <div ref={ref} className="container mx-auto max-w-3xl">
        <div className="reveal">
          <SectionTitle en="STORY" ja="あらすじ" />
        </div>

        <div className="reveal reveal-delay-2 bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-amber-100">
          <div className="text-6xl text-[#FBDB3E] font-black leading-none mb-4 select-none">"</div>

          <div className="space-y-5 text-gray-700 leading-relaxed text-base">
            <p>
              <strong className="text-[#E8201A]">ちょっと渋めの邦ロック</strong>を愛する新高1・鳩野ちひろ。
              新品のギターを背に、軽音部の門を叩く。しかし待っていたのは—！？
            </p>
            <p>
              音楽が好きなだけの「ふつう」の女の子たちが、
              <strong className="text-gray-900">バンド</strong>というかたちで繋がり、
              衝突し、成長していく青春ストーリー。
            </p>
            <p>
              BUMP OF CHICKEN、RADWIMPS、SHISHAMO、King Gnu……
              作中には数々の<strong className="text-[#E8201A]">名曲</strong>が登場し、
              邦ロックの魅力を余すことなく伝える。
            </p>
          </div>

          <div className="text-6xl text-[#FBDB3E] font-black leading-none text-right mt-4 select-none">"</div>

          <div className="mt-8 pt-6 border-t border-amber-100 flex flex-wrap gap-3">
            <div className="flex items-center gap-2 bg-[#FBDB3E]/30 px-4 py-2 rounded-xl">
              <span className="text-lg">🏆</span>
              <span className="text-sm font-bold text-gray-800">次にくるマンガ大賞2024<br />Web漫画部門 <span className="text-[#E8201A]">第1位</span></span>
            </div>
            <div className="flex items-center gap-2 bg-[#FBDB3E]/30 px-4 py-2 rounded-xl">
              <span className="text-lg">📚</span>
              <span className="text-sm font-bold text-gray-800">このマンガがすごい！2025<br />オトコ編 <span className="text-[#E8201A]">第2位</span></span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
