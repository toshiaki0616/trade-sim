export interface AnimeTheme {
  themeColor: string;
  accentColor: string;
  mood: string;
  particleConfig: object;
  glitchEnabled: boolean;
}

export const animeThemes: Record<number, AnimeTheme> = {
  227: {
    themeColor: "#FF6B35",
    accentColor: "#FFD600",
    mood: "chaotic-pop",
    glitchEnabled: false,
    particleConfig: {
      particles: {
        number: { value: 60 },
        color: { value: ["#FF6B35", "#FFD600", "#FF2D78", "#00E5FF"] },
        shape: { type: "circle" },
        size: { value: { min: 2, max: 6 } },
        move: {
          enable: true,
          speed: 4,
          direction: "none",
          random: true,
          outModes: { default: "bounce" },
        },
        opacity: { value: { min: 0.4, max: 0.9 } },
      },
    },
  },
  9253: {
    themeColor: "#00C853",
    accentColor: "#FFAB00",
    mood: "dark-tech",
    glitchEnabled: true,
    particleConfig: {
      particles: {
        number: { value: 80 },
        color: { value: "#00C853" },
        shape: { type: "circle" },
        size: { value: { min: 1, max: 3 } },
        move: {
          enable: true,
          speed: 1.5,
          direction: "bottom",
          outModes: { default: "out" },
        },
        opacity: { value: { min: 0.2, max: 0.7 } },
      },
    },
  },
};

export function getTheme(id: number): AnimeTheme | null {
  return animeThemes[id] ?? null;
}
