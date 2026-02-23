import type { AnimeData } from "../../data/sampleAnime";
import AnimeCard from "../shared/AnimeCard";

interface Props {
  animeList: AnimeData[];
  loading: boolean;
}

// カードの入場アニメーションは AnimeCard 側の Framer Motion に一本化
// GSAP ScrollTrigger は Hero のパララックス等に集中させる
export default function AnimeGrid({ animeList, loading }: Props) {
  if (loading) {
    return (
      <div className="grid-loading">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="card-skeleton" />
        ))}
      </div>
    );
  }

  return (
    <div className="anime-grid">
      {animeList.map((anime, i) => (
        <AnimeCard key={anime.id} anime={anime} index={i} />
      ))}
    </div>
  );
}
