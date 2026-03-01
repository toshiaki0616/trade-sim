import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import type { AnimeData } from "../../data/sampleAnime";
import { useMagneticHover } from "../../hooks/useMagneticHover";
import { GENRE_JA } from "../../lib/labels";

interface Props {
  anime: AnimeData;
  index: number;
}

function PosterImage({ src, alt }: { src: string; alt: string }) {
  const [error, setError] = useState(false);
  if (error) {
    return (
      <div className="card-image-placeholder">
        <span className="placeholder-text">{alt}</span>
      </div>
    );
  }
  return (
    <img
      src={src}
      alt={alt}
      className="card-image"
      loading="lazy"
      onError={() => setError(true)}
    />
  );
}

export default function AnimeCard({ anime, index }: Props) {
  const navigate = useNavigate();
  const magnetRef = useMagneticHover(0.2);

  return (
    <motion.div
      className="anime-card"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      whileTap={{ scale: 0.97 }}
      onClick={() => navigate(`/anime/${anime.id}`)}
    >
      <div ref={magnetRef} className="card-magnetic-inner">
        {/* layoutId をここに置くことで詳細ページのポスターへ FLIP する */}
        <motion.div
          layoutId={`poster-wrap-${anime.id}`}
          className="card-image-wrapper"
        >
          <PosterImage src={anime.coverImage.large} alt={anime.title.native} />
          <div
            className="card-overlay"
            style={{ "--theme-color": anime.themeColor } as React.CSSProperties}
          />
        </motion.div>
        <div className="card-info">
          <div className="card-index">#{String(index + 1).padStart(2, "0")}</div>
          <h3 className="card-title">{anime.title.native}</h3>
          <p className="card-subtitle">{anime.title.romaji}</p>
          <div className="card-meta">
            <span className="card-score">{anime.averageScore ?? "—"}</span>
            <span className="card-episodes">{anime.episodes}話</span>
            <span className="card-year">{anime.seasonYear}</span>
          </div>
          <div className="card-genres">
            {(anime.genres ?? []).slice(0, 2).map((g) => (
              <span key={g} className="genre-tag">{GENRE_JA[g] ?? g}</span>
            ))}
          </div>
        </div>
        <div className="card-corner-tl" />
        <div className="card-corner-br" />
      </div>
    </motion.div>
  );
}
