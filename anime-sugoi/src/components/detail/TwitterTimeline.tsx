import { useEffect, useRef } from "react";
import type { AnimeData } from "../../data/sampleAnime";

interface Props {
  anime: AnimeData;
}

declare global {
  interface Window {
    twttr?: { widgets: { load: () => void } };
  }
}

export default function TwitterTimeline({ anime }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const existing = document.querySelector(
      'script[src="https://platform.twitter.com/widgets.js"]'
    );
    if (!existing) {
      const s = document.createElement("script");
      s.src = "https://platform.twitter.com/widgets.js";
      s.async = true;
      s.charset = "utf-8";
      document.body.appendChild(s);
    } else if (window.twttr) {
      window.twttr.widgets.load();
    }
  }, [anime.id]);

  return (
    <section className="twitter-section">
      <h2 className="section-title">タイムライン</h2>
      <div ref={containerRef} className="twitter-container">
        <a
          className="twitter-timeline"
          data-theme="dark"
          data-height="500"
          data-chrome="noheader nofooter"
          href={`https://twitter.com/search?q=%23${encodeURIComponent(
            anime.twitterHashtag
          )}&src=typed_query&f=live`}
        >
          #{anime.twitterHashtag} のツイートを読み込み中...
        </a>
      </div>
    </section>
  );
}
