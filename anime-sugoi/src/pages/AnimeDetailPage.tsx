import { useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useAnimeDetail } from "../hooks/useAnimeData";
import { useLenis } from "../hooks/useLenis";
import PosterSection from "../components/detail/PosterSection";
import CharacterShowcase from "../components/detail/CharacterShowcase";
import CharacterGrid from "../components/detail/CharacterGrid";
import YouTubeEmbed from "../components/detail/YouTubeEmbed";
import MusicSection from "../components/detail/MusicSection";
import FanVideoSection from "../components/detail/FanVideoSection";
import VideoGallery from "../components/detail/VideoGallery";
import GlitchEffect from "../components/detail/GlitchEffect";
import ParticleBackground from "../components/shared/ParticleBackground";
import PageTransition from "../components/layout/PageTransition";
import { getTheme } from "../lib/animeThemes";
import { STATUS_JA, SEASON_JA, GENRE_JA } from "../lib/labels";

gsap.registerPlugin(ScrollTrigger);

export default function AnimeDetailPage() {
  const lenisRef = useLenis();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const animeId = parseInt(id ?? "0", 10);
  const { data: anime, loading } = useAnimeDetail(animeId);
  const theme = getTheme(animeId);
  const bannerRef = useRef<HTMLDivElement>(null);
  const bannerImgRef = useRef<HTMLImageElement>(null);

  // バナー画像のスクロールパララックス
  useEffect(() => {
    if (!bannerRef.current || !bannerImgRef.current) return;
    gsap.to(bannerImgRef.current, {
      y: "25%",
      ease: "none",
      scrollTrigger: {
        trigger: bannerRef.current,
        start: "top top",
        end: "bottom top",
        scrub: true,
      },
    });
    return () => { ScrollTrigger.getAll().forEach((t) => t.kill()); };
  }, [anime]);

  if (loading) {
    return (
      <div className="detail-loading">
        <div className="loading-spinner" />
        <p>データ取得中...</p>
      </div>
    );
  }

  if (!anime) {
    return (
      <div className="detail-error">
        <p>作品が見つかりませんでした。</p>
        <button onClick={() => navigate("/")}>トップへ戻る</button>
      </div>
    );
  }

  const cssVars = {
    "--theme-color": anime.themeColor,
    "--accent-color": anime.accentColor,
  } as React.CSSProperties;

  return (
    <PageTransition themeColor={anime.themeColor}>
      {/* mood-{mood} クラスで作品ごとのビジュアルテーマを CSS で切り替え */}
      <div className={`detail-page mood-${anime.mood}`} style={cssVars}>
        {theme && <ParticleBackground config={theme.particleConfig} />}
        {theme && <GlitchEffect enabled={theme.glitchEnabled} />}

        {anime.bannerImage && (
          <div ref={bannerRef} className="detail-banner">
            <img
              ref={bannerImgRef}
              src={anime.bannerImage}
              alt=""
              className="banner-image"
            />
            <div className="banner-overlay" />
          </div>
        )}

        <div className="detail-container">
          <motion.button
            className="back-button"
            onClick={() => navigate("/")}
            whileHover={{ x: -4 }}
          >
            ← 一覧へ戻る
          </motion.button>

          <div className="detail-main">
            <PosterSection anime={anime} />

            <div className="detail-info">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <div className="detail-meta-top">
                  <span className="detail-score">{anime.averageScore ?? "—"}</span>
                  <span className="detail-status">{STATUS_JA[anime.status] ?? anime.status}</span>
                </div>
                <h1 className="detail-title">{anime.title.native}</h1>
                <p className="detail-romaji">{anime.title.romaji}</p>
                <div className="detail-stats">
                  <div className="stat">
                    <span className="stat-label">話数</span>
                    <span className="stat-value">{anime.episodes}</span>
                  </div>
                  <div className="stat">
                    <span className="stat-label">放送</span>
                    <span className="stat-value">{SEASON_JA[anime.season] ?? anime.season}{anime.seasonYear}</span>
                  </div>
                  <div className="stat">
                    <span className="stat-label">スタジオ</span>
                    <span className="stat-value">{anime.studios.nodes?.[0]?.name ?? "—"}</span>
                  </div>
                </div>
                <div className="detail-genres">
                  {(anime.genres ?? []).map((g) => (
                    <span key={g} className="genre-tag">{GENRE_JA[g] ?? g}</span>
                  ))}
                </div>
                <p className="detail-description">{anime.description}</p>
              </motion.div>
            </div>
          </div>

          {/* 超かぐや姫（201903）はグリッド表示、他は PREV/NEXT ショーケース */}
          {anime.id === 201903
            ? <CharacterGrid anime={anime} />
            : <CharacterShowcase anime={anime} />
          }
          <MusicSection anime={anime} />
          <YouTubeEmbed anime={anime} />
          <VideoGallery anime={anime} />
          <FanVideoSection anime={anime} />
        </div>
      </div>
    </PageTransition>
  );
}
