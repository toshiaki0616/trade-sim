import { useState, useEffect } from "react";
import type { AnimeData } from "../data/sampleAnime";
import { fetchAnimeList, fetchAnimeById } from "../lib/anilist";

const ANIME_IDS = [227, 9253, 2104, 16664, 2321, 201903];

export function useAnimeList() {
  const [data, setData] = useState<AnimeData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAnimeList(ANIME_IDS)
      .then(setData)
      .catch((e) => setError(String(e)))
      .finally(() => setLoading(false));
  }, []);

  return { data, loading, error };
}

export function useAnimeDetail(id: number) {
  const [data, setData] = useState<AnimeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetchAnimeById(id)
      .then(setData)
      .catch((e) => setError(String(e)))
      .finally(() => setLoading(false));
  }, [id]);

  return { data, loading, error };
}
