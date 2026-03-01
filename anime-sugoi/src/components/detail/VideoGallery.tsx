import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { AnimeData } from "../../data/sampleAnime";

interface Props {
  anime: AnimeData;
}

export default function VideoGallery({ anime }: Props) {
  const [activeIdx, setActiveIdx] = useState(0);

  const videos = anime.promotionalVideos;
  // すべて youtubeId 未設定なら非表示
  if (!videos || videos.length === 0 || videos.every((v) => !v.youtubeId)) {
    return null;
  }

  const active = videos[activeIdx];

  return (
    <section className="video-gallery-section">
      <h2 className="section-title">動画ギャラリー</h2>

      {/* タブ: 動画を切り替える */}
      <div className="vg-tabs">
        {videos.map((v, i) => (
          <button
            key={i}
            className={`vg-tab ${i === activeIdx ? "vg-tab--active" : ""}`}
            onClick={() => setActiveIdx(i)}
          >
            {v.title}
          </button>
        ))}
      </div>

      {/* 動画エリア */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeIdx}
          className="youtube-wrapper"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -14 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
        >
          {active.youtubeId ? (
            <iframe
              className="youtube-iframe"
              src={`https://www.youtube.com/embed/${active.youtubeId}?rel=0&modestbranding=1`}
              title={active.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <div className="vg-placeholder">
              <span className="vg-placeholder-icon">▶</span>
              <p>動画を準備中</p>
              <span className="vg-placeholder-hint">sampleAnime.ts の youtubeId に動画IDを設定してください</span>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </section>
  );
}
