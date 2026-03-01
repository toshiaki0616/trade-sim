import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // AniList GraphQL API の CORS を回避するため開発サーバー経由でプロキシ
      "/api/anilist": {
        target: "https://graphql.anilist.co",
        changeOrigin: true,
        rewrite: () => "/",
      },
    },
  },
  build: {
    rollupOptions: {
      output: {
        // ライブラリを役割ごとに分割してブラウザのキャッシュを有効活用する
        // ライブラリは更新頻度が低いため、アプリ側のコードが変わっても再ダウンロード不要になる
        manualChunks: {
          // アニメーションライブラリ群
          "vendor-animation": ["gsap", "@gsap/react", "framer-motion"],
          // React 本体
          "vendor-react": ["react", "react-dom", "react-router-dom"],
          // パーティクル（重いので別チャンクに）
          "vendor-particles": [
            "@tsparticles/engine",
            "@tsparticles/react",
            "@tsparticles/slim",
          ],
          // その他ライブラリ
          "vendor-misc": ["lenis", "split-type"],
        },
      },
    },
  },
})
