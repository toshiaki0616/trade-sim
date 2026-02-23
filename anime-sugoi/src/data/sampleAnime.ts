export interface AnimeData {
  id: number;
  title: {
    romaji: string;
    english: string;
    native: string;
  };
  description: string;
  coverImage: {
    extraLarge: string;
    large: string;
    color: string;
  };
  bannerImage: string | null;
  genres: string[];
  averageScore: number;
  episodes: number;
  status: string;
  season: string;
  seasonYear: number;
  studios: { nodes: { name: string }[] };
  characters: {
    nodes: {
      id: number;
      name: { full: string; native: string };
      image: { large: string; medium: string };
    }[];
    edges: {
      role: string;
      voiceActors: {
        id: number;
        name: { full: string; native: string };
      }[];
    }[];
  };
  themeColor: string;
  accentColor: string;
  mood: string;
  twitterHashtag: string;
  youtubeTrailerId?: string;
}

export const sampleAnimeList: AnimeData[] = [
  {
    id: 227,
    title: { romaji: "FLCL", english: "FLCL", native: "フリクリ" },
    description: "ナオ太は普通の小学6年生。ある日、ベスパに乗った謎の女・ハルハラ ハル子にギターで殴られ、額からロボットが生えてくる。GAINAXが放つ、予測不能なハイテンションOVA。作画、音楽、演出、すべてが規格外。",
    coverImage: {
      extraLarge: "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx227-sHdPWoGFuRYF.jpg",
      large: "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx227-sHdPWoGFuRYF.jpg",
      color: "#FF6B35",
    },
    bannerImage: "https://s4.anilist.co/file/anilistcdn/media/anime/banner/227.jpg",
    genres: ["Action", "Comedy", "Mecha", "Sci-Fi"],
    averageScore: 80,
    episodes: 6,
    status: "FINISHED",
    season: "SPRING",
    seasonYear: 2000,
    studios: { nodes: [{ name: "Gainax" }] },
    characters: { nodes: [], edges: [] },
    themeColor: "#FF6B35",
    accentColor: "#FFD600",
    mood: "chaotic-pop",
    twitterHashtag: "フリクリ",
    youtubeTrailerId: "t7Gz5XXgGhw",
  },
  {
    id: 9253,
    title: { romaji: "Steins;Gate", english: "Steins;Gate", native: "シュタインズ・ゲート" },
    description: "秋葉原を拠点に活動する「未来ガジェット研究所」のメンバーが偶然タイムマシンを発明してしまう。次第に明らかになる陰謀と、仲間を救うための孤独な戦い。緻密な伏線と構成が織りなすSFスリラーの傑作。",
    coverImage: {
      extraLarge: "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx9253-wMBvEkgAYcFD.jpg",
      large: "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx9253-wMBvEkgAYcFD.jpg",
      color: "#00C853",
    },
    bannerImage: "https://s4.anilist.co/file/anilistcdn/media/anime/banner/9253.jpg",
    genres: ["Drama", "Sci-Fi", "Thriller"],
    averageScore: 91,
    episodes: 24,
    status: "FINISHED",
    season: "SPRING",
    seasonYear: 2011,
    studios: { nodes: [{ name: "White Fox" }] },
    characters: { nodes: [], edges: [] },
    themeColor: "#00C853",
    accentColor: "#FFAB00",
    mood: "dark-tech",
    twitterHashtag: "シュタインズゲート",
    youtubeTrailerId: "27OZc-ku6is",
  },
  {
    id: 2104,
    title: { romaji: "Seto no Hanayome", english: "My Bride is a Mermaid", native: "瀬戸の花嫁" },
    description: "瀬戸内海で溺れていた中学生・サンの命を救ったのは人魚のサン。しかし人魚を人間に見せると掟により消さなければならない。サンの父は「結婚すれば許す」と言い出して…。ギャグ全開の人魚ラブコメ。",
    coverImage: {
      extraLarge: "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx2104-BFoxWEObM2PO.jpg",
      large: "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx2104-BFoxWEObM2PO.jpg",
      color: "#00B0FF",
    },
    bannerImage: null,
    genres: ["Comedy", "Romance", "Fantasy"],
    averageScore: 78,
    episodes: 26,
    status: "FINISHED",
    season: "SPRING",
    seasonYear: 2007,
    studios: { nodes: [{ name: "Gonzo" }] },
    characters: { nodes: [], edges: [] },
    themeColor: "#00B0FF",
    accentColor: "#FF4081",
    mood: "comedy-chaos",
    twitterHashtag: "瀬戸の花嫁",
    youtubeTrailerId: "EFcs-kVNpos",
  },
  {
    id: 16664,
    title: { romaji: "Kaguya-hime no Monogatari", english: "The Tale of the Princess Kaguya", native: "かぐや姫の物語" },
    description: "竹から生まれた姫が、都へと連れていかれ、貴族として育てられていく。しかし彼女の心は、幼い頃に過ごした山里への想いとともにあった。高畑勲監督による、命の輝きと哀しみを描くジブリの傑作。",
    coverImage: {
      extraLarge: "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx16664-EkDn3G7HHiQj.jpg",
      large: "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx16664-EkDn3G7HHiQj.jpg",
      color: "#8D6E63",
    },
    bannerImage: "https://s4.anilist.co/file/anilistcdn/media/anime/banner/16664.jpg",
    genres: ["Drama", "Fantasy", "Historical"],
    averageScore: 87,
    episodes: 1,
    status: "FINISHED",
    season: "FALL",
    seasonYear: 2013,
    studios: { nodes: [{ name: "Studio Ghibli" }] },
    characters: { nodes: [], edges: [] },
    themeColor: "#8D6E63",
    accentColor: "#A5D6A7",
    mood: "serene-melancholy",
    twitterHashtag: "かぐや姫の物語",
    youtubeTrailerId: "W71mtorCZDw",
  },
  {
    id: 2321,
    title: { romaji: "Giant Robo the Animation", english: "Giant Robo The Animation", native: "ジャイアントロボ THE ANIMATION" },
    description: "地球の平和を守る国際警察機構と秘密結社BFの戦い。少年・草間大作が操る巨大ロボット「ジャイアントロボ」が地球の運命をかけた戦いに挑む。今川泰宏が描く、壮大なスペクタクル叙事詩。",
    coverImage: {
      extraLarge: "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx2321-1ILAF72Ee2gK.jpg",
      large: "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx2321-1ILAF72Ee2gK.jpg",
      color: "#D32F2F",
    },
    bannerImage: null,
    genres: ["Action", "Adventure", "Mecha", "Sci-Fi"],
    averageScore: 82,
    episodes: 7,
    status: "FINISHED",
    season: "SUMMER",
    seasonYear: 1992,
    studios: { nodes: [{ name: "Mu Animation Studio" }] },
    characters: { nodes: [], edges: [] },
    themeColor: "#D32F2F",
    accentColor: "#FFD600",
    mood: "epic-retro",
    twitterHashtag: "ジャイアントロボ",
  },
];
