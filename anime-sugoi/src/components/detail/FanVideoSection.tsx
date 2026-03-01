import { motion } from "framer-motion";
import type { AnimeData } from "../../data/sampleAnime";

interface Props {
  anime: AnimeData;
}

export default function FanVideoSection({ anime }: Props) {
  if (!anime.fanVideos || anime.fanVideos.length === 0) return null;

  return (
    <section className="fan-video-section">
      <h2 className="section-title">人気ファン動画</h2>
      <p className="fan-video-note">
        ▶ タイトルをクリックするとYouTube検索が開きます
      </p>
      <div className="fan-video-grid">
        {anime.fanVideos.map((video, i) => {
          const searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(video.youtubeSearchQuery)}`;
          return (
            <motion.a
              key={i}
              href={searchUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="fan-video-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              whileHover={{ y: -4, boxShadow: "0 12px 40px rgba(0,0,0,0.5)" }}
              whileTap={{ scale: 0.97 }}
            >
              <div className="fan-video-icon">
                <svg viewBox="0 0 24 24" fill="currentColor" width="28" height="28">
                  <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.16 8.16 0 004.77 1.52V6.76a4.85 4.85 0 01-1-.07z" />
                </svg>
              </div>
              <div className="fan-video-info">
                <p className="fan-video-title">{video.title}</p>
                <p className="fan-video-desc">{video.description}</p>
                {video.views !== "—" && (
                  <span className="fan-video-views">再生 {video.views}</span>
                )}
              </div>
              <span className="fan-video-arrow">→</span>
            </motion.a>
          );
        })}
      </div>
    </section>
  );
}
