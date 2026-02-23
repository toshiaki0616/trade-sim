import { useRef } from "react";
import { motion } from "framer-motion";
import type { AnimeData } from "../../data/sampleAnime";

interface Props {
  anime: AnimeData;
}

export default function CharacterCarousel({ anime }: Props) {
  const trackRef = useRef<HTMLDivElement>(null);
  // ドラッグ状態（マウス）
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);
  // タッチ状態
  const touchStartX = useRef(0);
  const touchScrollLeft = useRef(0);
  const lastTouchX = useRef(0);
  const velocity = useRef(0);
  let momentumId = useRef<number>(0);

  // --- マウス ---
  const onMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    startX.current = e.pageX - (trackRef.current?.offsetLeft ?? 0);
    scrollLeft.current = trackRef.current?.scrollLeft ?? 0;
    cancelAnimationFrame(momentumId.current);
  };
  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current || !trackRef.current) return;
    e.preventDefault();
    const x = e.pageX - trackRef.current.offsetLeft;
    trackRef.current.scrollLeft = scrollLeft.current - (x - startX.current) * 1.4;
  };
  const onMouseUp = () => { isDragging.current = false; };

  // --- タッチ（慣性スクロール付き）---
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    lastTouchX.current = e.touches[0].clientX;
    touchScrollLeft.current = trackRef.current?.scrollLeft ?? 0;
    velocity.current = 0;
    cancelAnimationFrame(momentumId.current);
  };
  const onTouchMove = (e: React.TouchEvent) => {
    if (!trackRef.current) return;
    const dx = e.touches[0].clientX - touchStartX.current;
    velocity.current = e.touches[0].clientX - lastTouchX.current;
    lastTouchX.current = e.touches[0].clientX;
    trackRef.current.scrollLeft = touchScrollLeft.current - dx;
  };
  const onTouchEnd = () => {
    const track = trackRef.current;
    if (!track) return;
    // フリック後の慣性
    const applyMomentum = () => {
      if (Math.abs(velocity.current) < 0.5) return;
      track.scrollLeft -= velocity.current * 0.95;
      velocity.current *= 0.92;
      momentumId.current = requestAnimationFrame(applyMomentum);
    };
    applyMomentum();
  };

  const characters = anime.characters.nodes;

  if (characters.length === 0) {
    return (
      <section className="character-section">
        <h2 className="section-title">キャラクター</h2>
        <p className="no-characters">キャラクター情報を取得できませんでした</p>
      </section>
    );
  }

  return (
    <section className="character-section">
      <h2 className="section-title">キャラクター</h2>
      <div
        ref={trackRef}
        className="character-track"
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {characters.map((char, i) => {
          const voiceActor = anime.characters.edges[i]?.voiceActors[0];
          return (
            <motion.div
              key={char.id}
              className="character-card"
              whileHover={{ scale: 1.06, y: -4 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <img src={char.image.large} alt={char.name.full} className="char-image" />
              <div className="char-info">
                <p className="char-name">{char.name.native || char.name.full}</p>
                {voiceActor && <p className="char-cv">CV: {voiceActor.name.full}</p>}
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
