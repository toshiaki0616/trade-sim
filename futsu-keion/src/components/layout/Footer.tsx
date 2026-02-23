export const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-400 py-12 px-6">
      <div className="container mx-auto max-w-4xl">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* ロゴ・情報 */}
          <div className="text-center md:text-left">
            <p className="font-black text-white text-xl mb-1">ふつうの軽音部</p>
            <p className="text-sm">原作：クワハリ　漫画：出内テツオ</p>
            <p className="text-sm">少年ジャンプ＋連載中</p>
          </div>

          {/* リンク */}
          <div className="flex flex-col sm:flex-row gap-4 text-sm">
            <a
              href="https://shonenjumpplus.com/episode/16457717013869519536"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#FBDB3E] transition-colors text-center"
            >
              📖 少年ジャンプ＋で読む
            </a>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-800 text-center text-xs">
          <p>© クワハリ・出内テツオ/集英社</p>
          <p className="mt-1 text-gray-600">このサイトは非公式のファンサイトです。</p>
        </div>
      </div>
    </footer>
  )
}
