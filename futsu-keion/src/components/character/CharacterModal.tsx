import type { Character } from '../../types'
import { Modal } from '../ui/Modal'
import { Badge } from '../ui/Badge'

interface CharacterModalProps {
  character: Character
  onClose: () => void
}

const bandAccentColor: Record<Character['band'], string> = {
  'はーとぶれいく': '#E8201A',
  'protocol.': '#1a1a1a',
  '七道高校': '#7c3aed',
}

export const CharacterModal = ({ character, onClose }: CharacterModalProps) => {
  const accentColor = bandAccentColor[character.band]

  return (
    <Modal onClose={onClose} wide>
      <div className="flex flex-col md:flex-row" style={{ maxHeight: '88vh' }}>

        {/* ===== 左パネル：全身イラスト ===== */}
        <div
          className={`relative md:w-2/5 flex-shrink-0 bg-gradient-to-b ${character.imagePlaceholderColor}`}
          style={{ minHeight: 260 }}
        >
          <div
            className="absolute inset-0 opacity-15 pointer-events-none"
            style={{
              backgroundImage: `repeating-linear-gradient(
                -45deg,
                ${accentColor} 0px, ${accentColor} 3px,
                transparent 3px, transparent 20px
              )`,
            }}
          />
          <img
            src={character.imageUrl}
            alt={character.name}
            className="relative z-10 w-full h-full object-cover object-top"
            style={{ minHeight: 260 }}
          />
          <div
            className="absolute top-4 left-4 px-3 py-1 rounded-full text-white text-xs font-black shadow-lg z-20"
            style={{ backgroundColor: accentColor }}
          >
            {character.band}
          </div>
          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 text-xs font-bold text-gray-800 z-20">
            {character.part}
          </div>
        </div>

        {/* ===== 右パネル：詳細情報 ===== */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="p-6 pb-4 flex-shrink-0 text-white" style={{ backgroundColor: accentColor }}>
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-xs tracking-[0.25em] opacity-70 mb-0.5">{character.nameKana}</p>
                <h2 className="text-3xl font-black leading-tight">{character.name}</h2>
                <p className="text-sm opacity-75 mt-1">{character.grade} · {character.instrument}</p>
              </div>
              <button
                onClick={onClose}
                className="flex-shrink-0 w-8 h-8 bg-white/20 hover:bg-white/40 rounded-full flex items-center justify-center font-bold transition-colors text-base"
                aria-label="閉じる"
              >
                ×
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-5">
            <p className="text-sm text-gray-700 leading-relaxed">{character.description}</p>

            <div>
              <p className="text-[10px] font-black tracking-[0.3em] text-gray-400 uppercase mb-2">TRAITS</p>
              <div className="flex flex-wrap gap-1.5">
                {character.traits.map((trait) => (
                  <Badge key={trait} label={trait} variant="outline" />
                ))}
              </div>
            </div>

            <div>
              <p className="text-[10px] font-black tracking-[0.3em] text-gray-400 uppercase mb-2">FAVORITE BANDS</p>
              <div className="flex flex-wrap gap-1.5">
                {character.favoriteBands.map((band) => (
                  <span
                    key={band}
                    className="text-xs font-bold px-3 py-1 rounded-full text-white"
                    style={{ backgroundColor: accentColor }}
                  >
                    {band}
                  </span>
                ))}
              </div>
            </div>

            {character.scenes.length > 0 && (
              <div>
                <p className="text-[10px] font-black tracking-[0.3em] text-gray-400 uppercase mb-2">SCENES</p>
                <div className="grid grid-cols-2 gap-2">
                  <img src={character.scenes[0]} alt="scene 1" className="col-span-2 w-full aspect-video object-cover rounded-xl" />
                  {character.scenes[1] && (
                    <img src={character.scenes[1]} alt="scene 2" className="w-full aspect-video object-cover rounded-xl" />
                  )}
                  {character.scenes[2] && (
                    <img src={character.scenes[2]} alt="scene 3" className="w-full aspect-video object-cover rounded-xl" />
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Modal>
  )
}
