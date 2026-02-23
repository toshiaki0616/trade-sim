import type { PlaylistItem } from '../../types'

interface PlaylistCardProps {
  item: PlaylistItem
}

export const PlaylistCard = ({ item }: PlaylistCardProps) => {
  return (
    <div className="flex items-center gap-4 p-4 bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-200 group">
      {/* 番号バッジ */}
      <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center text-white font-black text-sm">
        {item.order}
      </div>

      {/* 曲情報 */}
      <div className="flex-1 min-w-0">
        <p className="text-xs text-gray-400 mb-0.5 truncate">
          <span className="text-pink-500 font-bold">{item.episodeNote}</span>
          {' '}· {item.sceneDescription}
        </p>
        <h4 className="text-base font-black text-gray-900 truncate">「{item.songTitle}」</h4>
        <p className="text-sm text-purple-600 font-bold truncate">{item.bandName}</p>
      </div>

      {/* 再生ボタン */}
      <a
        href={item.youtubeUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex-shrink-0 flex items-center gap-1.5 bg-red-50 hover:bg-red-500 text-red-500 hover:text-white text-xs font-bold px-3 py-2 rounded-xl transition-all duration-200"
        aria-label={`${item.songTitle}をYouTubeで聴く`}
      >
        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M8 5v14l11-7z" />
        </svg>
        <span className="hidden sm:inline">再生</span>
      </a>
    </div>
  )
}
