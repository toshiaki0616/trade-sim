// キービジュアル画像URL（差し替え可能）
const KEY_VISUAL_URL = 'https://placehold.co/480x640/FBDB3E/E8201A?text=%E3%81%A1%E3%81%B2%E3%82%8D'

export const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-[#FBDB3E]">

      {/* ===== 背景装飾（網状グリッド） ===== */}
      <div
        className="absolute inset-0 opacity-[0.06] pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(#1a1a1a 1px, transparent 1px),
            linear-gradient(90deg, #1a1a1a 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px',
        }}
      />

      {/* ===== 装飾円（背景） ===== */}
      <div className="absolute top-[-80px] right-[-80px] w-[360px] h-[360px] rounded-full bg-[#E8201A] opacity-10 pointer-events-none" />
      <div className="absolute bottom-[-60px] left-[-60px] w-[280px] h-[280px] rounded-full bg-[#E8201A] opacity-8 pointer-events-none" />

      {/* ===== メインレイアウト：左テキスト／右キービジュアル ===== */}
      <div className="relative z-10 container mx-auto px-6 py-20 flex flex-col md:flex-row items-center gap-8 md:gap-0">

        {/* ── 左：テキストブロック ── */}
        <div className="flex-1 flex flex-col items-start md:items-start text-left max-w-xl">

          {/* 受賞バッジ：下からポップイン */}
          <div className="animate-slideInBottom anim-delay-200 inline-flex items-center gap-2 bg-[#E8201A] text-white text-xs font-black px-5 py-2 rounded-full mb-6 shadow-lg">
            <span>🏆</span>
            <span>次にくるマンガ大賞2024 Web漫画部門 第1位</span>
          </div>

          {/* タイトル：左からスライド */}
          <div className="animate-slideInLeft anim-delay-100 mb-4">
            <h1
              className="font-black leading-none text-[#E8201A]"
              style={{
                fontSize: 'clamp(3.5rem, 10vw, 7rem)',
                textShadow: '4px 4px 0 rgba(0,0,0,0.12)',
                fontFamily: "'M PLUS Rounded 1c', sans-serif",
              }}
            >
              ふつうの<br />軽音部
            </h1>
            <p className="text-base md:text-lg font-bold text-gray-700 mt-2 tracking-widest">
              Futsuu no Keionbu
            </p>
          </div>

          {/* キャッチコピー：左からスライド（遅め） */}
          <p className="animate-slideInLeft anim-delay-300 text-sm md:text-base text-gray-800 mb-8 leading-relaxed max-w-sm">
            ちょっと渋めの邦ロックを愛する新高1・鳩野ちひろ。<br />
            新品のギターを背に、軽音部の門を叩く——
          </p>

          {/* 原作情報 */}
          <p className="animate-slideInLeft anim-delay-400 text-xs font-bold text-gray-600 mb-6">
            原作：クワハリ　漫画：出内テツオ　少年ジャンプ＋連載中
          </p>

          {/* CTAボタン：下からポップイン */}
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <a
              href="https://shonenjumpplus.com/episode/16457717013869519536"
              target="_blank"
              rel="noopener noreferrer"
              className="animate-slideInBottom anim-delay-500 inline-flex items-center justify-center gap-2 bg-[#E8201A] hover:bg-red-700 text-white font-black px-7 py-4 rounded-2xl text-sm shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-200"
            >
              📖 ジャンプ＋で読む
            </a>
            <a
              href="#characters"
              className="animate-slideInBottom anim-delay-600 inline-flex items-center justify-center gap-2 bg-black/15 hover:bg-black/25 text-gray-900 font-bold px-7 py-4 rounded-2xl text-sm transition-all duration-200 hover:-translate-y-1"
            >
              👥 キャラクターを見る
            </a>
          </div>
        </div>

        {/* ── 右：キービジュアル（右から飛び込む） ── */}
        <div className="relative flex-shrink-0 md:w-[44%]">
          {/* 背景の斜め装飾ブロック */}
          <div className="animate-slideInRight anim-delay-100 absolute -inset-4 bg-white/25 rounded-[40px] rotate-3 pointer-events-none" />

          {/* キービジュアル本体 */}
          <div className="animate-slideInRight relative">
            <img
              src={KEY_VISUAL_URL}
              alt="鳩野ちひろ キービジュアル"
              className="relative z-10 w-full max-w-[400px] mx-auto object-contain drop-shadow-[8px_12px_20px_rgba(0,0,0,0.2)]"
              style={{ transform: 'rotate(-2deg)' }}
            />

            {/* 浮遊する装飾バッジ */}
            <div className="animate-zoomPopIn anim-delay-700 absolute top-8 -right-2 md:-right-8 bg-[#E8201A] text-white text-xs font-black px-3 py-2 rounded-2xl shadow-lg rotate-6 z-20">
              🎸 邦ロック
            </div>
            <div className="animate-zoomPopIn anim-delay-800 absolute bottom-12 -left-2 md:-left-8 bg-gray-900 text-white text-xs font-black px-3 py-2 rounded-2xl shadow-lg -rotate-3 z-20">
              ジャンプ＋連載中
            </div>
          </div>
        </div>
      </div>

      {/* ===== 下部の波形区切り ===== */}
      <div className="absolute bottom-0 left-0 right-0 pointer-events-none">
        <svg viewBox="0 0 1440 70" className="w-full fill-amber-50">
          <path d="M0,40 C240,70 480,10 720,40 C960,70 1200,10 1440,40 L1440,70 L0,70 Z" />
        </svg>
      </div>

      {/* ===== スクロールインジケーター ===== */}
      <div className="animate-slideInBottom anim-delay-800 absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-gray-600 opacity-70">
        <span className="text-xs font-bold tracking-widest">SCROLL</span>
        <div className="w-0.5 h-8 bg-gray-600 rounded-full animate-bounce" />
      </div>
    </section>
  )
}
