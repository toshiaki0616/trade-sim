import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { AnimeData } from "../../data/sampleAnime";

const FALLBACK_IMAGE =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='130' height='180' viewBox='0 0 130 180'%3E%3Crect width='130' height='180' fill='%230e1018'/%3E%3Ccircle cx='65' cy='65' r='30' fill='%231a1d2e'/%3E%3Cellipse cx='65' cy='160' rx='45' ry='30' fill='%231a1d2e'/%3E%3C/svg%3E";

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

/**
 * offset (index - activeIdx) に基づいて 3D カルーセルカードのスタイルを算出。
 * coverflow スタイル: 中央カードが正面、両サイドは奥に引いて回転。
 */
const getCarouselCardStyle = (offset: number): React.CSSProperties => {
  const abs = Math.abs(offset);
  const xOffset = offset * 160; // px — 横スプレッド
  const rotateY = -offset * 50; // deg — Y軸回転（左右対称）
  const translateZ = -abs * 140; // px — 奥行き（サイドカードを後退）
  const opacity = abs === 0 ? 1 : abs === 1 ? 0.78 : 0.52;
  const brightness = abs === 0 ? 1 : abs === 1 ? 0.6 : 0.38;

  return {
    transform: `translateX(calc(-50% + ${xOffset}px)) translateY(-50%) rotateY(${rotateY}deg) translateZ(${translateZ}px)`,
    opacity,
    filter: `brightness(${brightness})`,
  };
};

export default function CharacterShowcase({ anime }: Props) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [selectedChar, setSelectedChar] = useState<CharacterModalData | null>(null);

  const characters = anime.characters.nodes;
  if (characters.length === 0) return null;

  const activeChar = characters[activeIdx];
  const voiceActor = anime.characters.edges[activeIdx]?.voiceActors?.[0];

  const openModal = () =>
    setSelectedChar({
      name: activeChar.name.native || activeChar.name.full,
      cvName: voiceActor?.name.native || voiceActor?.name.full || "—",
      labMemberNo: activeChar.labMemberNo,
      description: activeChar.description,
      imageSrc: activeChar.image.large,
    });

  return (
    <>
      <section className="cs-section">
        {/* ── 4隅コーナーフレーム ── */}
        <span className="cs-corner cs-corner--tl" aria-hidden="true" />
        <span className="cs-corner cs-corner--tr" aria-hidden="true" />
        <span className="cs-corner cs-corner--bl" aria-hidden="true" />
        <span className="cs-corner cs-corner--br" aria-hidden="true" />

        {/* ── セクション見出し ── */}
        <div className="cs-heading">
          <p className="cs-heading-en">CHARACTER</p>
          <p className="cs-heading-ja">登場人物</p>
        </div>

        {/* ── 3D カルーセル + ナビ ── */}
        <div className="cs-carousel-layout">
          {/* PREV ボタン */}
          <button
            className="cs-nav cs-nav--prev"
            onClick={() => setActiveIdx((i) => Math.max(i - 1, 0))}
            disabled={activeIdx === 0}
            aria-label="前のキャラクター"
          >
            ‹
          </button>

          {/* 3D シーン（perspective コンテナ） */}
          <div className="cs-carousel-scene">
            <div className="cs-carousel-track">
              {characters.map((char, i) => {
                const offset = i - activeIdx;
                // ±2 の範囲外は描画しない（パフォーマンス）
                if (Math.abs(offset) > 2) return null;
                const isActive = offset === 0;

                return (
                  <div
                    key={char.id}
                    className={`cs-carousel-card${isActive ? " cs-carousel-card--active" : ""}`}
                    style={getCarouselCardStyle(offset)}
                    onClick={() => (isActive ? openModal() : setActiveIdx(i))}
                    title={isActive ? "クリックして詳細を見る" : char.name.native || char.name.full}
                  >
                    <img
                      src={char.image.large}
                      alt={char.name.native || char.name.full}
                      className="cs-carousel-img"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = FALLBACK_IMAGE;
                      }}
                    />
                    {/* カード番号オーバーレイ */}
                    <span className="cs-carousel-card-no" aria-hidden="true">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* NEXT ボタン */}
          <button
            className="cs-nav cs-nav--next"
            onClick={() =>
              setActiveIdx((i) => Math.min(i + 1, characters.length - 1))
            }
            disabled={activeIdx === characters.length - 1}
            aria-label="次のキャラクター"
          >
            ›
          </button>
        </div>

        {/* ── キャラクター情報（カルーセル下） ── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeChar.id}
            className="cs-identity"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
          >
            <p className="cs-name-vert">{activeChar.name.native || activeChar.name.full}</p>

            {voiceActor && (
              <div className="cs-cv-pill">
                <span className="cs-cv-badge">CV</span>
                <span className="cs-cv-text">
                  {voiceActor.name.native || voiceActor.name.full}
                </span>
              </div>
            )}

            {activeChar.labMemberNo && (
              <p className="cs-lab-no">{activeChar.labMemberNo}</p>
            )}
          </motion.div>
        </AnimatePresence>

        {/* 詳細ボタン + 説明文 */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`desc-${activeChar.id}`}
            className="cs-desc-wrap"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, delay: 0.05 }}
          >
            {activeChar.description && (
              <p className="cs-desc">{activeChar.description}</p>
            )}
            <button className="cs-detail-btn" onClick={openModal}>
              詳細を見る
            </button>
          </motion.div>
        </AnimatePresence>

        {/* ── ドットナビ + カウンター ── */}
        <div className="cs-dots-row">
          {characters.map((char, i) => (
            <button
              key={char.id}
              className={`cs-dot ${i === activeIdx ? "cs-dot--active" : ""}`}
              onClick={() => setActiveIdx(i)}
              aria-label={char.name.native || char.name.full}
            />
          ))}
          <span className="cs-counter">
            {activeIdx + 1} / {characters.length}
          </span>
        </div>
      </section>

      {/* ── キャラクター詳細モーダル ── */}
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
              <button
                className="modal-close"
                onClick={() => setSelectedChar(null)}
              >
                ✕
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
