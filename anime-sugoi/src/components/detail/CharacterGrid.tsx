import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { AnimeData } from "../../data/sampleAnime";

const FALLBACK_IMAGE =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='130' height='180' viewBox='0 0 130 180'%3E%3Crect width='130' height='180' fill='%230e1018'/%3E%3Ccircle cx='65' cy='65' r='30' fill='%231a1d2e'/%3E%3Cellipse cx='65' cy='160' rx='45' ry='30' fill='%231a1d2e'/%3E%3C/svg%3E";

interface CharacterDetail {
  name: string;
  cvName: string;
  description?: string;
  imageSrc: string;
  labMemberNo?: string;
}

interface Props {
  anime: AnimeData;
}

/** 円形クロップ用インラインスタイル（mask-image: radial-gradient） */
const circleClipStyle = {
  WebkitMaskImage: "radial-gradient(circle, #000 62%, transparent 63%)",
  maskImage: "radial-gradient(circle, #000 62%, transparent 63%)",
} as React.CSSProperties;

/** ホバー時に拡張する mask */
const circleClipHoverStyle = {
  WebkitMaskImage: "radial-gradient(circle, #000 72%, transparent 73%)",
  maskImage: "radial-gradient(circle, #000 72%, transparent 73%)",
} as React.CSSProperties;

export default function CharacterGrid({ anime }: Props) {
  const [selected, setSelected] = useState<CharacterDetail | null>(null);
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  const characters = anime.characters.nodes;
  if (characters.length === 0) return null;

  return (
    <>
      <section className="cg-section">
        {/* ── 4隅コーナーフレーム（cs-corner と共有） ── */}
        <span className="cs-corner cs-corner--tl" aria-hidden="true" />
        <span className="cs-corner cs-corner--tr" aria-hidden="true" />
        <span className="cs-corner cs-corner--bl" aria-hidden="true" />
        <span className="cs-corner cs-corner--br" aria-hidden="true" />

        {/* ── 見出し ── */}
        <div className="cg-heading">
          <p className="cg-heading-en">CHARACTER</p>
          <p className="cg-heading-ja">登場人物</p>
        </div>

        {/* ── キャラクターグリッド ── */}
        <div className="cg-grid">
          {characters.map((char, i) => {
            const voiceActor = anime.characters.edges[i]?.voiceActors?.[0];
            const isHovered = hoveredId === char.id;

            return (
              <motion.div
                key={char.id}
                className="cg-card"
                /* stagger フェードイン */
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.45, delay: i * 0.055, ease: "easeOut" }}
                onClick={() =>
                  setSelected({
                    name: char.name.native || char.name.full,
                    cvName:
                      voiceActor?.name.native || voiceActor?.name.full || "—",
                    description: char.description,
                    imageSrc: char.image.large,
                    labMemberNo: char.labMemberNo,
                  })
                }
                onHoverStart={() => setHoveredId(char.id)}
                onHoverEnd={() => setHoveredId(null)}
              >
                {/* 円形アバター（mask-image でシャープな円） */}
                <motion.div
                  className="cg-avatar-wrap"
                  animate={{ scale: isHovered ? 1.08 : 1 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                >
                  {/* 外枠リング（accent-color） */}
                  <div className="cg-avatar-ring" />

                  <img
                    src={char.image.medium}
                    alt={char.name.native || char.name.full}
                    className="cg-avatar"
                    style={isHovered ? circleClipHoverStyle : circleClipStyle}
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = FALLBACK_IMAGE;
                    }}
                  />
                </motion.div>

                {/* キャラクター名 */}
                <motion.p
                  className="cg-card-name"
                  animate={{ opacity: isHovered ? 1 : 0.7 }}
                  transition={{ duration: 0.2 }}
                >
                  {char.name.native || char.name.full}
                </motion.p>

                {/* CV（ホバー時のみ表示） */}
                <AnimatePresence>
                  {isHovered && voiceActor && (
                    <motion.p
                      className="cg-card-cv"
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 4 }}
                      transition={{ duration: 0.18 }}
                    >
                      CV: {voiceActor.name.native || voiceActor.name.full}
                    </motion.p>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ── キャラクター詳細モーダル ── */}
      <AnimatePresence>
        {selected && (
          <motion.div
            className="cg-modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => setSelected(null)}
          >
            {/* clip-path ダイヤモンド→長方形アニメーション */}
            <motion.div
              className="cg-modal"
              initial={{
                clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)",
                opacity: 0,
                scale: 0.92,
              }}
              animate={{
                clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
                opacity: 1,
                scale: 1,
              }}
              exit={{
                clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)",
                opacity: 0,
                scale: 0.92,
              }}
              transition={{ duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* 閉じるボタン */}
              <button
                className="cg-modal-close"
                onClick={() => setSelected(null)}
              >
                ✕
              </button>

              {/* 左: キャラクター画像（なるべく全体図） */}
              <div className="cg-modal-img-wrap">
                <img
                  src={selected.imageSrc}
                  alt={selected.name}
                  className="cg-modal-img"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = FALLBACK_IMAGE;
                  }}
                />
                {/* 下部グラデーションフェード */}
                <div className="cg-modal-img-fade" />
              </div>

              {/* 右: 名前・CV・説明 */}
              <div className="cg-modal-info">
                {/* 縦書き名前 + CV カプセル */}
                <div className="cg-modal-identity">
                  <p className="cg-modal-name-vert">{selected.name}</p>

                  <div className="cg-modal-cv-pill">
                    <span className="cg-modal-cv-badge">CV</span>
                    <span className="cg-modal-cv-text">{selected.cvName}</span>
                  </div>
                </div>

                {/* ラボメン番号など追加情報 */}
                {selected.labMemberNo && (
                  <p className="cg-modal-lab">{selected.labMemberNo}</p>
                )}

                {/* 紹介文 */}
                {selected.description && (
                  <p className="cg-modal-desc">{selected.description}</p>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
