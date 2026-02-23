import { playlistItems } from '../../data/playlist'
import { PlaylistCard } from '../music/PlaylistCard'
import { SectionTitle } from '../ui/SectionTitle'

export const PlaylistSection = () => {
  return (
    <section className="py-24 px-6 bg-amber-50">
      <div className="container mx-auto max-w-2xl">
        <SectionTitle en="PLAYLIST" ja="作中登場曲まとめ" />

        <p className="text-center text-gray-500 text-sm mb-10 -mt-6">
          ちひろたちが奏でた名曲たち
        </p>

        <div className="space-y-3">
          {playlistItems.map((item) => (
            <PlaylistCard key={item.id} item={item} />
          ))}
        </div>

        <p className="text-center text-xs text-gray-400 mt-8">
          ※ 各リンクは外部サービス（YouTube）に遷移します
        </p>
      </div>
    </section>
  )
}
