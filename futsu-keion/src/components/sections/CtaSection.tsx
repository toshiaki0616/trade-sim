export const CtaSection = () => {
  return (
    <section className="py-24 px-6 bg-[#E8201A]">
      <div className="container mx-auto max-w-2xl text-center">
        {/* 装飾 */}
        <div className="text-6xl mb-6 animate-float inline-block">🎸</div>

        <h2 className="text-3xl md:text-4xl font-black text-white mb-4 leading-tight">
          最新話を今すぐ読もう
        </h2>
        <p className="text-red-100 text-base mb-10 leading-relaxed">
          少年ジャンプ＋で毎週日曜更新。最新3話は無料！
        </p>

        <a
          href="https://shonenjumpplus.com/episode/16457717013869519536"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-3 bg-[#FBDB3E] hover:bg-yellow-300 text-gray-900 font-black px-10 py-5 rounded-2xl text-lg shadow-2xl hover:shadow-yellow-500/50 transition-all duration-200 hover:-translate-y-1"
        >
          <span>📖</span>
          ジャンプ＋で読む（無料）
        </a>

        <p className="mt-6 text-red-200 text-xs">
          原作：クワハリ　漫画：出内テツオ<br />
          © クワハリ・出内テツオ/集英社
        </p>
      </div>
    </section>
  )
}
