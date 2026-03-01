import type { AnimeData } from "../data/sampleAnime";
import { sampleAnimeList } from "../data/sampleAnime";

// 開発時は Vite proxy 経由で CORS 回避、本番は直接リクエスト
const ANILIST_API =
  import.meta.env.DEV ? "/api/anilist" : "https://graphql.anilist.co";

// セッション中のインメモリキャッシュ（API レート制限・重複フェッチ防止）
const cache = new Map<number, AnimeData>();

const ANIME_QUERY = `
query ($id: Int) {
  Media(id: $id, type: ANIME) {
    id
    title {
      romaji
      english
      native
    }
    description(asHtml: false)
    coverImage {
      extraLarge
      large
      color
    }
    bannerImage
    genres
    averageScore
    episodes
    status
    season
    seasonYear
    studios {
      nodes {
        name
      }
    }
    trailer {
      id
      site
    }
    characters(page: 1, perPage: 12, sort: [ROLE, RELEVANCE]) {
      nodes {
        id
        name {
          full
          native
        }
        image {
          large
          medium
        }
      }
      edges {
        role
        voiceActors(language: JAPANESE) {
          id
          name {
            full
            native
          }
        }
      }
    }
  }
}
`;

export async function fetchAnimeById(id: number): Promise<AnimeData | null> {
  if (cache.has(id)) return cache.get(id)!;

  const sample = sampleAnimeList.find((a) => a.id === id);
  try {
    const res = await fetch(ANILIST_API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: ANIME_QUERY, variables: { id } }),
    });
    if (!res.ok) throw new Error("API error");
    const json = await res.json();
    const media = json.data?.Media;
    if (!media) throw new Error("No data");
    // API が null を返しうるフィールドを空配列・空文字にノーマライズ
    const normalizedMedia = {
      ...media,
      genres: media.genres ?? [],
      studios: { nodes: media.studios?.nodes ?? [] },
      characters: {
        nodes: (media.characters?.nodes ?? []).map((node: AnimeData["characters"]["nodes"][number]) => {
          // sampleAnime のキャラクター説明・ラボメン番号を API データにマージ
          const sampleChar = sample?.characters.nodes.find((c) => c.id === node.id);
          return sampleChar
            ? { ...node, description: sampleChar.description, labMemberNo: sampleChar.labMemberNo }
            : node;
        }),
        edges: media.characters?.edges ?? [],
      },
    };

    const result: AnimeData = {
      ...normalizedMedia,
      themeColor: sample?.themeColor ?? media.coverImage?.color ?? "#00e5ff",
      accentColor: sample?.accentColor ?? "#ff2d78",
      mood: sample?.mood ?? "default",
      twitterHashtag: sample?.twitterHashtag ?? media.title.native,
      youtubeTrailerId:
        sample?.youtubeTrailerId ??
        (media.trailer?.site === "youtube" ? media.trailer.id : undefined),
      // sampleAnime にしか存在しないフィールドを引き継ぐ
      music: sample?.music,
      fanVideos: sample?.fanVideos,
    };
    cache.set(id, result);
    return result;
  } catch {
    if (sample) cache.set(id, sample);
    return sample ?? null;
  }
}

// 並列フェッチ（一度に全件取得してレート制限を抑える）
export async function fetchAnimeList(ids: number[]): Promise<AnimeData[]> {
  const results = await Promise.all(ids.map(fetchAnimeById));
  return results.filter((a): a is AnimeData => a !== null);
}
