# SUGOI アニメ鑑賞サイト 引き継ぎ書

最終更新: 2026-03-01

---

## プロジェクト概要

「アニメのすごさを技術・視覚分析で伝える」鑑賞サイト。
React 19 + TypeScript + Vite 7 の SPA。作品ごとにビジュアルテーマが変わる。

**起動コマンド:**
```bash
cd C:\work\claude\anime-sugoi
npm run dev
# → http://localhost:5173
```

---

## 技術スタック

| ライブラリ | 役割 |
|---|---|
| React 19 + TypeScript | UIフレームワーク |
| Vite 7 | ビルドツール（開発サーバー・HMR） |
| Framer Motion | ページ遷移・アニメーション・FLIP |
| GSAP + ScrollTrigger | バナーパララックス |
| Lenis | 慣性スクロール |
| tsParticles | 作品別パーティクル背景 |
| react-router-dom v7 | SPAルーティング |
| AniList GraphQL API | キャラクター・アニメデータ取得 |

**CORS対策:** Vite proxy (`/api/anilist` → `https://graphql.anilist.co`) を `vite.config.ts` に設定済み。

---

## ファイル構成（重要なもの）

```
src/
├── data/
│   └── sampleAnime.ts        ← 作品データ（ここを主に編集）
├── hooks/
│   └── useAnimeData.ts       ← ANIME_IDS リスト
├── lib/
│   ├── anilist.ts            ← AniList API フェッチ・キャッシュ
│   ├── animeThemes.ts        ← 作品別パーティクルテーマ
│   └── labels.ts             ← 日本語ラベルマッピング
├── pages/
│   └── AnimeDetailPage.tsx   ← 詳細ページ（セクション配置）
└── components/
    └── detail/
        ├── CharacterCarousel.tsx  ← キャラ一覧（クリックでモーダル）
        ├── MusicSection.tsx       ← OP/EDタブ切替 + YouTube埋め込み
        ├── YouTubeEmbed.tsx       ← トレーラー埋め込み
        ├── VideoGallery.tsx       ← 複数動画タブ埋め込み（新規）
        └── FanVideoSection.tsx    ← ファン動画検索リンク
```

---

## 登録済み作品一覧

| ID | タイトル | mood テーマ | 備考 |
|---|---|---|---|
| 227 | フリクリ | `chaotic-pop` | キャラなし |
| 9253 | シュタインズ・ゲート | `dark-tech` | キャラ・音楽・ファン動画あり |
| 2104 | 瀬戸の花嫁 | `comedy-chaos` | キャラなし |
| 16664 | かぐや姫の物語 | `serene-melancholy` | キャラなし |
| 2321 | ジャイアントロボ | `epic-retro` | キャラなし |
| 201903 | 超かぐや姫！ | `cyber-moon` | 音楽・ファン動画あり（新規） |

**作品追加の手順:**
1. `sampleAnime.ts` にエントリを追加
2. `useAnimeData.ts` の `ANIME_IDS` に ID を追加
3. （任意）`animeThemes.ts` にパーティクルテーマを追加
4. （任意）`index.css` に `mood-{テーマ名}` スタイルを追加

---

## データ設計のポイント

### sampleAnime.ts の役割分担

```
sampleAnime = カスタムデータの保管場所
AniList API = 最新のキャラ画像・スコア・作品情報

ローカル固有データ（APIにない）:
  - themeColor, accentColor, mood
  - music[] → OP/ED の youtubeId
  - fanVideos[] → YouTube検索クエリ
  - promotionalVideos[] → タブ切替式 YouTube埋め込み
  - characters[].description → キャラ説明文
  - characters[].labMemberNo → バッジ表示（シュタゲのラボメン番号等）

API から取得（sampleAnime はフォールバック）:
  - キャラクター画像・名前・声優
  - averageScore, episodes, status 等
```

### YouTube ID の設定場所

| 表示箇所 | フィールド | 設定場所 |
|---|---|---|
| トレーラー | `youtubeTrailerId` | AnimeData 直下 |
| OP/ED曲のMV | `youtubeId` | `music[]` の中 |
| 動画ギャラリー（タブ切替） | `youtubeId` | `promotionalVideos[]` の中 |
| ファン動画（外部リンク） | `youtubeSearchQuery` | `fanVideos[]` の中 |

> **注意:** `youtubeTrailerId` と `youtubeId` は別フィールド。混同しないこと。
> 日本語入力ON時に `{` を打つと全角 `｛` になり構文エラーになる。

---

## 超かぐや姫！の現状（ID: 201903）

- **themeColor:** `#e46b35`（オレンジ）
- **accentColor:** `#8855ff`（紫）
- **mood:** `cyber-moon`（深宇宙グラデーション背景・月光ゴールドタイトル）
- **パーティクル:** 星降る夜空（金・白・紫・オレンジ、140個）
- **OP:** エクス=おとぎばなし / 月見ヤチヨ(CV.早見沙織) → `youtubeId: "owEBHHZg38s"`
- **ED:** ray 超かぐや姫！Version / 月見ヤチヨ → `youtubeId: "8qE2pKNR84o"`
- **promotionalVideos:** 3スロット用意済み（ID未設定）
- **キャラクター:** AniList APIが自動取得（sampleには空配列）

---

## CSS moodテーマ一覧（index.css）

| mood クラス | 作品 | 特徴 |
|---|---|---|
| `mood-chaotic-pop` | フリクリ | Dela Gothic One、斜めシャドウ、エネルギッシュ |
| `mood-dark-tech` | シュタゲ | Share Tech Mono、CRTスキャンライン、緑グロー |
| `mood-cyber-moon` | 超かぐや姫！ | 深宇宙背景、月光ゴールドタイトル、紫アクセント |

---

## カスタムスラッシュコマンド（定型作業の登録）

Claude Code では `.claude/skills/` にマークダウンを置くだけで `/コマンド名` として呼び出せる。

### ファイル構成

```
.claude/
└── skills/
    └── add-anime/          ← コマンド名がフォルダ名になる
        └── SKILL.md        ← 手順を書く（必須）
```

### SKILL.md の最低限の形式

```markdown
---
name: add-anime
description: アニメ作品をSUGOIサイトに追加する
---

ここに手順・注意点・テンプレートを書く
```

### 置き場所の違い

| 場所 | 対象範囲 |
|---|---|
| `.claude/skills/` | このプロジェクト専用 |
| `~/.claude/skills/` | PC上の全プロジェクトで使える |

### このプロジェクトで作ると便利なコマンド例

| コマンド | 用途 |
|---|---|
| `/add-anime` | 新作品追加の4ステップを自動化 |
| `/check-errors` | TypeScriptエラーチェック + よくあるミス確認 |

> **作り方:** `.claude/skills/add-anime/SKILL.md` を新規作成し、上記の形式で手順を書くだけ。
> 次回セッションから `/add-anime` で呼び出せる。

---

## 既知の注意点

- `FanVideo` 型では `views` フィールドが必須。省略すると TypeScript エラー。
- AniList API レート制限: `fetchAnimeList` は並列フェッチ。大量追加時は注意。
- YouTube 埋め込み制限: 公式邦楽 MV は埋め込み無効のことが多い。事前に `https://www.youtube.com/embed/{ID}` で確認推奨。
- ジャイアントロボの `youtubeTrailerId` は現状不正なIDが入っている可能性あり。
