import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { AnimeData } from "../../data/sampleAnime";

interface Props {
  anime: AnimeData;
}

export default function PosterSection({ anime }: Props) {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <section className="poster-section">
      {/* layoutId が AnimeCard の card-image-wrapper と一致 → カード→詳細 FLIP */}
      <motion.div
        layoutId={`poster-wrap-${anime.id}`}
        className="poster-wrapper"
        onClick={() => setModalOpen(true)}
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.3 }}
        style={{ cursor: "zoom-in" }}
      >
        <img
          src={anime.coverImage.extraLarge}
          alt={anime.title.native}
          className="poster-image"
        />
        <div
          className="poster-glow"
          style={{ "--theme-color": anime.themeColor } as React.CSSProperties}
        />
      </motion.div>

      {/* ポスタークリックで拡大モーダル */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div
            className="modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setModalOpen(false)}
          >
            <motion.div
              className="modal-content"
              initial={{ scale: 0.85, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.85, opacity: 0, y: 20 }}
              transition={{ type: "spring", stiffness: 280, damping: 28 }}
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={anime.coverImage.extraLarge}
                alt={anime.title.native}
                className="modal-image"
              />
              <motion.div
                className="modal-info"
                initial={{ x: 32, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.15, duration: 0.4 }}
              >
                <h2 className="modal-title">{anime.title.native}</h2>
                <p className="modal-romaji">{anime.title.romaji}</p>
                <p className="modal-description">{anime.description}</p>
                <div className="modal-tags">
                  {anime.genres.map((g) => (
                    <span key={g} className="genre-tag">{g}</span>
                  ))}
                </div>
              </motion.div>
              <button className="modal-close" onClick={() => setModalOpen(false)}>
                ✕
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
