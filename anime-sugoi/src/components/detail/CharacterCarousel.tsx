import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { AnimeData } from "../../data/sampleAnime";

const FALLBACK_IMAGE = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='130' height='180' viewBox='0 0 130 180'%3E%3Crect width='130' height='180' fill='%230e1018'/%3E%3Ccircle cx='65' cy='65' r='30' fill='%231a1d2e'/%3E%3Cellipse cx='65' cy='160' rx='45' ry='30' fill='%231a1d2e'/%3E%3C/svg%3E";

interface CharacterModalData {
  name: string;
  cvName: string;
  labMemberNo?: string;
  description?: string;
  imageSrc: string;
}

interface Props {
  anime: AnimeData;
}

export default function CharacterCarousel({ anime }: Props) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [selectedChar, setSelectedChar] = useState<CharacterModalData | null>(null);

  // ドラッグ状態（マウス）
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);
  const dragDistance = useRef(0);
  // タッチ状態
  const touchStartX = useRef(0);
  const touchScrollLeft = useRef(0);
  const lastTouchX = useRef(0);
  const velocity = useRef(0);
  const momentumId = useRef<number>(0);

  // --- マウス ---
  const onMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    dragDistance.current = 0;
    startX.current = e.pageX - (trackRef.current?.offsetLeft ?? 0);
    scrollLeft.current = trackRef.current?.scrollLeft ?? 0;
    cancelAnimationFrame(momentumId.current);
  };
  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current || !trackRef.current) return;
    e.preventDefault();
    const x = e.pageX - trackRef.current.offsetLeft;
    const delta = x - startX.current;
    dragDistance.current = Math.abs(delta);
    trackRef.current.scrollLeft = scrollLeft.current - delta * 1.4;
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
    <>
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
            const voiceActor = anime.characters.edges[i]?.voiceActors?.[0];
            return (
              <motion.div
                key={char.id}
                className="character-card"
                whileHover={{ scale: 1.06, y: -4 }}
                transition={{ type: "spring", stiffness: 400 }}
                // ドラッグと区別するため距離が小さい時のみクリック扱い
                onMouseUp={() => {
                  if (dragDistance.current < 6) {
                    setSelectedChar({
                      name: char.name.native || char.name.full,
                      cvName: voiceActor?.name.native || voiceActor?.name.full || "—",
                      labMemberNo: char.labMemberNo,
                      description: char.description,
                      imageSrc: char.image.large,
                    });
                  }
                }}
                style={{ cursor: "pointer" }}
              >
                <img
                  src={char.image.large}
                  alt={char.name.native || char.name.full}
                  className="char-image"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = FALLBACK_IMAGE;
                  }}
                />
                <div className="char-info">
                  <p className="char-name">{char.name.native || char.name.full}</p>
                  {voiceActor && (
                    <p className="char-cv">
                      CV: {voiceActor.name.native || voiceActor.name.full}
                    </p>
                  )}
                  {char.labMemberNo && (
                    <p className="char-lab-no">{char.labMemberNo}</p>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* キャラクター詳細モーダル */}
      <AnimatePresence>
        {selectedChar && (
          <motion.div
            className="modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedChar(null)}
          >
            <motion.div
              className="char-modal-content"
              initial={{ scale: 0.88, opacity: 0, y: 24 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.88, opacity: 0, y: 24 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="char-modal-left">
                <img
                  src={selectedChar.imageSrc}
                  alt={selectedChar.name}
                  className="char-modal-image"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = FALLBACK_IMAGE;
                  }}
                />
              </div>
              <div className="char-modal-right">
                {selectedChar.labMemberNo && (
                  <p className="char-modal-lab">{selectedChar.labMemberNo}</p>
                )}
                <h3 className="char-modal-name">{selectedChar.name}</h3>
                <p className="char-modal-cv">CV: {selectedChar.cvName}</p>
                {selectedChar.description && (
                  <p className="char-modal-desc">{selectedChar.description}</p>
                )}
              </div>
              <button className="modal-close" onClick={() => setSelectedChar(null)}>
                ✕
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
