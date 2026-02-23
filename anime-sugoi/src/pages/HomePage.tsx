import { useLenis } from "../hooks/useLenis";
import { useAnimeList } from "../hooks/useAnimeData";
import Hero from "../components/home/Hero";
import AnimeGrid from "../components/home/AnimeGrid";
import PageTransition from "../components/layout/PageTransition";

export default function HomePage() {
  useLenis();
  const { data, loading } = useAnimeList();

  return (
    <PageTransition>
      <main className="home-page">
        <Hero />
        <section className="grid-section">
          <div className="section-header">
            <h2 className="section-heading">
              <span className="section-num">// 001</span>
              作品一覧
            </h2>
          </div>
          <AnimeGrid animeList={data} loading={loading} />
        </section>
      </main>
    </PageTransition>
  );
}
