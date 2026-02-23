import type { BandCardData } from '../../types'

interface BandCardProps {
  band: BandCardData
}

export const BandCard = ({ band }: BandCardProps) => {
  return (
    <a
      href={band.youtubeUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="group block bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
    >
      {/* サムネイル */}
      <div className="relative overflow-hidden">
        <img
          src={band.thumbnailUrl}
          alt={`${band.bandName} - ${band.songTitle}`}
          className="w-full aspect-video object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {/* YouTubeアイコン風オーバーレイ */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/20 transition-colors duration-300">
          <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-lg">
            <svg className="w-5 h-5 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>

        {/* 登場メモバッジ */}
        {band.appearanceNote && (
          <div className="absolute top-2 left-2">
            <span className="bg-pink-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
              {band.appearanceNote}
            </span>
          </div>
        )}
      </div>

      {/* テキスト */}
      <div className="p-4">
        <p className="text-xs text-gray-400 font-medium mb-0.5 truncate">
          {band.genre.join(' / ')}
        </p>
        <h3 className="text-sm font-black text-gray-900 leading-tight truncate">{band.bandName}</h3>
        <p className="text-xs text-purple-500 font-bold mt-0.5 truncate">「{band.songTitle}」</p>

        <div className="mt-3 flex items-center gap-1 text-red-500 text-xs font-bold">
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
            <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.27 8.27 0 004.84 1.56V6.8a4.85 4.85 0 01-1.07-.11z" />
          </svg>
          YouTubeで観る
        </div>
      </div>
    </a>
  )
}
