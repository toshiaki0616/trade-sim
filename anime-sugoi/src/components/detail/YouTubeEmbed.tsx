import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { AnimeData } from "../../data/sampleAnime";
import { parseYouTubeId } from "../../lib/parseYouTubeId";

interface StoredVideo {
  id: string;
  title: string;
}

interface VideoTab {
  id: string;
  label: string;
  isUserAdded: boolean;
}

interface Props {
  anime: AnimeData;
}

function loadStored(animeId: number): StoredVideo[] {
  try {
    const raw = localStorage.getItem(`yt-user-${animeId}`);
    return raw ? (JSON.parse(raw) as StoredVideo[]) : [];
  } catch {
    return [];
  }
}

function saveStored(animeId: number, videos: StoredVideo[]): void {
  try {
    localStorage.setItem(`yt-user-${animeId}`, JSON.stringify(videos));
  } catch {
    /* silent */
  }
}

export default function YouTubeEmbed({ anime }: Props) {
  const [stored, setStored] = useState<StoredVideo[]>(() => loadStored(anime.id));
  const [urlInput, setUrlInput] = useState("");
  const [urlError, setUrlError] = useState<string | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);

  // タブ一覧: 公式トレーラー → ユーザー追加
  const tabs: VideoTab[] = [
    ...(anime.youtubeTrailerId
      ? [{ id: anime.youtubeTrailerId, label: "トレーラー", isUserAdded: false }]
      : []),
    ...stored.map((v) => ({ id: v.id, label: v.title, isUserAdded: true })),
  ];

  const [activeId, setActiveId] = useState<string | null>(tabs[0]?.id ?? null);

  // activeId がタブ一覧に存在するか保証
  const resolvedId = tabs.find((t) => t.id === activeId)?.id ?? tabs[0]?.id ?? null;

  const handleAdd = useCallback(() => {
    const videoId = parseYouTubeId(urlInput);
    if (!videoId) {
      setUrlError("有効な YouTube URL または動画ID を入力してください");
      return;
    }
    if (tabs.some((t) => t.id === videoId)) {
      setUrlError("この動画はすでに登録されています");
      return;
    }
    const newVideo: StoredVideo = {
      id: videoId,
      title: `マイ動画 ${stored.length + 1}`,
    };
    const updated = [...stored, newVideo];
    setStored(updated);
    saveStored(anime.id, updated);
    setActiveId(videoId);
    setUrlInput("");
    setUrlError(null);
    setIsAddOpen(false);
  }, [urlInput, stored, tabs, anime.id]);

  const handleDelete = useCallback(
    (id: string) => {
      const updated = stored.filter((v) => v.id !== id);
      setStored(updated);
      saveStored(anime.id, updated);
      if (activeId === id) {
        const remaining = tabs.filter((t) => t.id !== id);
        setActiveId(remaining[0]?.id ?? null);
      }
    },
    [stored, anime.id, activeId, tabs]
  );

  // 公式トレーラーも追加動画もない場合は追加パネルのみ表示
  const hasVideo = resolvedId !== null;

  return (
    <section className="movie-section">
      {/* ── ヘッダー ── */}
      <div className="movie-header">
        <h2 className="movie-title">MOVIE</h2>
        <motion.button
          className="movie-add-btn"
          onClick={() => {
            setIsAddOpen((p) => !p);
            setUrlError(null);
          }}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
        >
          {isAddOpen ? "✕ 閉じる" : "＋ URL を追加"}
        </motion.button>
      </div>

      {/* ── URL 入力パネル (slide-down) ── */}
      <AnimatePresence>
        {isAddOpen && (
          <motion.div
            className="movie-add-panel"
            key="add-panel"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
          >
            <p className="movie-add-hint">
              YouTube URL を貼り付けて「追加」を押してください
            </p>
            <div className="movie-add-row">
              <input
                className="movie-url-input"
                type="text"
                placeholder="https://youtu.be/xxxxx  または  動画ID"
                value={urlInput}
                onChange={(e) => {
                  setUrlInput(e.target.value);
                  setUrlError(null);
                }}
                onKeyDown={(e) => e.key === "Enter" && handleAdd()}
                autoFocus
              />
              <button className="movie-add-confirm" onClick={handleAdd}>
                追加
              </button>
            </div>
            {urlError && (
              <motion.p
                className="movie-add-error"
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
              >
                ❌ {urlError}
              </motion.p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── 動画なし ── */}
      {!hasVideo && !isAddOpen && (
        <motion.div
          className="movie-empty"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <span className="movie-empty-icon">▶</span>
          <p>動画がまだ登録されていません</p>
          <span className="movie-empty-hint">
            ＋ URL を追加 から YouTube URL を登録できます
          </span>
        </motion.div>
      )}

      {/* ── タブ（複数動画のとき） ── */}
      {tabs.length > 1 && (
        <div className="movie-tabs">
          {tabs.map((tab) => (
            <div key={tab.id} className="movie-tab-item">
              <button
                className={`movie-tab ${tab.id === resolvedId ? "movie-tab--active" : ""}`}
                onClick={() => setActiveId(tab.id)}
              >
                {tab.label}
              </button>
              {tab.isUserAdded && (
                <button
                  className="movie-tab-delete"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(tab.id);
                  }}
                  title="削除"
                >
                  ×
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ── 動画プレーヤー（コインフリップ切り替え） ── */}
      <div className="youtube-flip-stage">
        <AnimatePresence mode="wait">
          {resolvedId && (
            <motion.div
              key={resolvedId}
              className="youtube-wrapper"
              initial={{ rotateY: -90, opacity: 0.3 }}
              animate={{ rotateY: 0, opacity: 1 }}
              exit={{ rotateY: 90, opacity: 0.3 }}
              transition={{ duration: 0.42, ease: [0.23, 1, 0.32, 1] }}
            >
            <iframe
              className="youtube-iframe"
              src={`https://www.youtube.com/embed/${resolvedId}?rel=0&modestbranding=1`}
              title={tabs.find((t) => t.id === resolvedId)?.label ?? "動画"}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
