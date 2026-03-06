import { useState } from "react";
import { motion } from "framer-motion";
import type { AnimeData } from "../../data/sampleAnime";

const CARD_W = 240;
const CARD_H = 135; // 16:9

interface Props {
  anime: AnimeData;
}

// カード枚数に応じてカルーセル半径を計算
function computeRadius(count: number): number {
  return Math.max(220, Math.round((CARD_W + 50) * count / (2 * Math.PI)));
}

export default function VideoGallery({ anime }: Props) {
  const [activeIdx, setActiveIdx] = useState(0);
  // 累積回転角度（最短経路回転のため符号を追跡）
  const [ringRotation, setRingRotation] = useState(0);

  const videos = anime.promotionalVideos;
  if (!videos || videos.length === 0 || videos.every((v) => !v.youtubeId)) {
    return null;
  }

  const count = videos.length;
  const angleStep = 360 / count;
  const radius = computeRadius(count);
  const active = videos[activeIdx];

  const handleCardClick = (idx: number) => {
    if (idx === activeIdx) return;
    // 最短回転方向を選択（コイン回転の自然な動き）
    let delta = idx - activeIdx;
    if (delta > count / 2) delta -= count;
    if (delta < -count / 2) delta += count;
    setRingRotation((prev) => prev - delta * angleStep);
    setActiveIdx(idx);
  };

  // 1本だけなら通常プレーヤーを表示
  if (count === 1) {
    return (
      <section className="video-gallery-section">
        <h2 className="section-title">動画ギャラリー</h2>
        <div className="youtube-wrapper">
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
            </div>
          )}
        </div>
      </section>
    );
  }

  return (
    <section className="video-gallery-section">
      <h2 className="section-title">動画ギャラリー</h2>

      {/* ── 3D カルーセルステージ ── */}
      <div className="vg-scene">
        <motion.div
          className="vg-ring"
          animate={{ rotateY: ringRotation }}
          transition={{ type: "spring", stiffness: 60, damping: 12 }}
        >
          {videos.map((v, i) => {
            const cardAngle = i * angleStep;
            const isActive = i === activeIdx;
            return (
              <div
                key={i}
                className={`vg-card ${isActive ? "vg-card--active" : ""}`}
                style={{
                  transform: `rotateY(${cardAngle}deg) translateZ(${radius}px)`,
                  width: `${CARD_W}px`,
                  height: `${CARD_H}px`,
                }}
                onClick={() => handleCardClick(i)}
              >
                {v.youtubeId ? (
                  <img
                    src={`https://img.youtube.com/vi/${v.youtubeId}/mqdefault.jpg`}
                    alt={v.title}
                    className="vg-card-thumb"
                  />
                ) : (
                  <div className="vg-card-placeholder">▶</div>
                )}
                <div className="vg-card-label">{v.title}</div>
                {/* アクティブでないカードを暗くするオーバーレイ */}
                <div className="vg-card-overlay" />
              </div>
            );
          })}
        </motion.div>
      </div>

      {/* ── プレーヤー（カルーセル下） ── */}
      <motion.div
        key={activeIdx}
        className="youtube-wrapper vg-player"
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1, ease: "easeOut" }}
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
            <span className="vg-placeholder-hint">
              sampleAnime.ts の youtubeId に動画IDを設定してください
            </span>
          </div>
        )}
      </motion.div>
    </section>
  );
}
