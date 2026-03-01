import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { AnimeData } from "../../data/sampleAnime";

interface Props {
  anime: AnimeData;
}

const TYPE_LABEL: Record<string, string> = {
  OP: "OPENING",
  ED: "ENDING",
  INSERT: "INSERT",
};

export default function MusicSection({ anime }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);
  // トレーラーと同様: iframe の読み込み完了を追跡してフェードイン
  const [loaded, setLoaded] = useState(false);

  if (!anime.music || anime.music.length === 0) return null;

  const activeTrack = anime.music[activeIndex];

  const handleTabChange = (i: number) => {
    // タブ切替時にロード状態をリセット
    setLoaded(false);
    setActiveIndex(i);
  };

  return (
    <section className="music-section">
      <h2 className="section-title">主題歌</h2>

      {/* トラック選択タブ */}
      <div className="music-tabs">
        {anime.music.map((track, i) => (
          <button
            key={i}
            className={`music-tab ${i === activeIndex ? "music-tab--active" : ""}`}
            onClick={() => handleTabChange(i)}
          >
            <span className="music-tab-type">{TYPE_LABEL[track.type]}</span>
            <span className="music-tab-title">{track.title}</span>
            <span className="music-tab-artist">{track.artist}</span>
          </button>
        ))}
      </div>

      {/* 動画プレイヤー or テキスト表示 */}
      {/* AnimatePresence でタブ切替時の exit アニメを有効化 */}
      <AnimatePresence mode="wait">
        {activeTrack.youtubeId ? (
          <motion.div
            key={activeIndex}
            className="youtube-wrapper music-player"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            {/* トレーラーと同じスケルトン: 読み込み中に表示 */}
            {!loaded && <div className="youtube-skeleton" />}
            <iframe
              className="youtube-iframe"
              src={`https://www.youtube.com/embed/${activeTrack.youtubeId}?rel=0&modestbranding=1`}
              title={`${activeTrack.title} — ${activeTrack.artist}`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              onLoad={() => setLoaded(true)}
              style={{ opacity: loaded ? 1 : 0 }}
            />
          </motion.div>
        ) : (
          <motion.div
            key={`no-video-${activeIndex}`}
            className="music-no-video"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <p>動画は準備中です</p>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
