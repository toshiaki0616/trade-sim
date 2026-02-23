import { useState, useRef, useEffect } from 'react'
import { heartbreakMembers, protocolMembers, shichidouMembers } from '../../data/characters'
import { CharacterCard } from '../character/CharacterCard'
import { CharacterModal } from '../character/CharacterModal'
import { SectionTitle } from '../ui/SectionTitle'
import type { Character } from '../../types'

interface BandGroupProps {
  label: string
  emoji: string
  members: Character[]
  bgClass: string
  textClass: string
  borderClass: string
  onSelect: (id: string) => void
}

const BandGroup = ({ label, emoji, members, bgClass, textClass, borderClass, onSelect }: BandGroupProps) => {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.querySelectorAll<HTMLElement>('.reveal').forEach((child, i) => {
            setTimeout(() => child.classList.add('is-visible'), i * 80)
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
    <div ref={ref} className="mb-14">
      <div className={`flex items-center gap-3 mb-6`}>
        <div className={`h-0.5 flex-1 ${borderClass}`} />
        <div className={`flex items-center gap-2 ${bgClass} px-5 py-2 rounded-full shadow-sm`}>
          <span className="text-lg">{emoji}</span>
          <span className={`font-black ${textClass} text-sm tracking-wider`}>{label}</span>
        </div>
        <div className={`h-0.5 flex-1 ${borderClass}`} />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
        {members.map((character) => (
          <div key={character.id} className="reveal">
            <CharacterCard character={character} onSelect={onSelect} />
          </div>
        ))}
      </div>
    </div>
  )
}

export const CharacterSection = () => {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const allCharacters = [...heartbreakMembers, ...protocolMembers, ...shichidouMembers]
  const selectedChar: Character | null = selectedId
    ? allCharacters.find((c) => c.id === selectedId) ?? null
    : null

  return (
    <section id="characters" className="py-24 px-6 bg-white">
      <div className="container mx-auto max-w-5xl">
        <SectionTitle en="CHARACTERS" ja="登場キャラクター" />

        <p className="text-center text-gray-500 text-sm mb-12 -mt-6">
          カードをクリックして詳細を確認しよう
        </p>

        <BandGroup
          label="はーとぶれいく"
          emoji="🎸"
          members={heartbreakMembers}
          bgClass="bg-[#FBDB3E]"
          textClass="text-gray-900"
          borderClass="bg-[#E8201A]/20"
          onSelect={setSelectedId}
        />

        <BandGroup
          label="protocol."
          emoji="🎵"
          members={protocolMembers}
          bgClass="bg-gray-900"
          textClass="text-white"
          borderClass="bg-gray-200"
          onSelect={setSelectedId}
        />

        <BandGroup
          label="七道高校"
          emoji="🏫"
          members={shichidouMembers}
          bgClass="bg-purple-600"
          textClass="text-white"
          borderClass="bg-purple-100"
          onSelect={setSelectedId}
        />
      </div>

      {selectedChar && (
        <CharacterModal
          character={selectedChar}
          onClose={() => setSelectedId(null)}
        />
      )}
    </section>
  )
}
