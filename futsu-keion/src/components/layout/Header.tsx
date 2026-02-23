import { useState, useEffect } from 'react'

export const Header = () => {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'bg-[#FBDB3E]/95 backdrop-blur-sm shadow-md'
          : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        {/* ロゴ */}
        <a href="#" className="font-black text-[#E8201A] text-xl tracking-tight hover:opacity-80 transition-opacity">
          ふつうの軽音部
        </a>

        {/* ナビゲーション */}
        <nav className="hidden sm:flex items-center gap-6">
          <a href="#story" className="text-sm font-bold text-gray-800 hover:text-[#E8201A] transition-colors">
            あらすじ
          </a>
          <a href="#characters" className="text-sm font-bold text-gray-800 hover:text-[#E8201A] transition-colors">
            キャラクター
          </a>
          <a href="#music" className="text-sm font-bold text-gray-800 hover:text-[#E8201A] transition-colors">
            音楽
          </a>
          <a
            href="https://shonenjumpplus.com/episode/16457717013869519536"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#E8201A] hover:bg-red-700 text-white text-sm font-bold px-4 py-2 rounded-xl transition-colors"
          >
            読む
          </a>
        </nav>
      </div>
    </header>
  )
}
