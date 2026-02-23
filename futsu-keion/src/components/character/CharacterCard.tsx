import type { Character } from '../../types'
import { Badge } from '../ui/Badge'

interface CharacterCardProps {
  character: Character
  onSelect: (id: string) => void
}

export const CharacterCard = ({ character, onSelect }: CharacterCardProps) => {
  return (
    <button
      onClick={() => onSelect(character.id)}
      className="group relative w-full text-left bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 focus:outline-none focus:ring-4 focus:ring-pink-300"
      aria-label={`${character.name}の詳細を見る`}
    >
      {/* キャラクター画像エリア */}
      <div className={`relative h-72 bg-gradient-to-b ${character.imagePlaceholderColor} overflow-hidden`}>
        <img
          src={character.imageUrl}
          alt={character.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {/* グラデーションオーバーレイ */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

        {/* パートバッジ */}
        <div className="absolute top-4 right-4">
          <span className="bg-white/90 backdrop-blur-sm text-purple-700 text-xs font-bold px-3 py-1 rounded-full">
            🎸 {character.part}
          </span>
        </div>

        {/* ロールバッジ */}
        {character.role === 'main' && (
          <div className="absolute top-4 left-4">
            <span className="bg-gradient-to-r from-pink-500 to-purple-600 text-white text-xs font-bold px-3 py-1 rounded-full">
              主人公
            </span>
          </div>
        )}
      </div>

      {/* テキストエリア */}
      <div className="p-6">
        <p className="text-xs text-gray-400 font-medium tracking-widest mb-1">{character.nameKana}</p>
        <h3 className="text-2xl font-black text-gray-900 mb-1">{character.name}</h3>
        <p className="text-sm text-purple-500 font-bold mb-3">{character.grade} · {character.part}</p>
        <p className="text-sm text-gray-600 leading-relaxed mb-4 line-clamp-2">{character.description}</p>

        <div className="flex flex-wrap gap-2">
          {character.traits.slice(0, 3).map((trait) => (
            <Badge key={trait} label={trait} variant="secondary" />
          ))}
        </div>

        <div className="mt-4 flex items-center text-pink-500 text-sm font-bold group-hover:gap-2 transition-all">
          <span>詳細を見る</span>
          <span className="ml-1 group-hover:translate-x-1 transition-transform">→</span>
        </div>
      </div>
    </button>
  )
}
