import { useState } from "react";
import { motion } from "framer-motion";
import type { AnimeData } from "../../data/sampleAnime";

interface Props {
  anime: AnimeData;
}

export default function YouTubeEmbed({ anime }: Props) {
  const [loaded, setLoaded] = useState(false);

  if (!anime.youtubeTrailerId) return null;

  const embedUrl = `https://www.youtube.com/embed/${anime.youtubeTrailerId}?rel=0&modestbranding=1`;

  return (
    <section className="youtube-section">
      <h2 className="section-title">トレーラー</h2>
      <motion.div
        className="youtube-wrapper"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {!loaded && <div className="youtube-skeleton" />}
        <iframe
          className="youtube-iframe"
          src={embedUrl}
          title={`${anime.title.native} トレーラー`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          onLoad={() => setLoaded(true)}
          style={{ opacity: loaded ? 1 : 0 }}
        />
      </motion.div>
    </section>
  );
}
