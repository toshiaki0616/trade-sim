export interface Character {
  id: string
  name: string
  nameKana: string
  grade: string
  role: 'main' | 'sub'
  band: 'はーとぶれいく' | 'protocol.' | '七道高校'
  part: string
  instrument: string
  description: string
  traits: string[]
  favoriteBands: string[]
  imageUrl: string
  imagePlaceholderColor: string
  // モーダル用シーン画像（後で差し替え可能なプレースホルダー）
  scenes: string[]
}

export interface BandCardData {
  id: string
  bandName: string
  songTitle: string
  genre: string[]
  youtubeUrl: string
  thumbnailUrl: string
  appearanceNote: string
}

export interface PlaylistItem {
  id: string
  order: number
  bandName: string
  songTitle: string
  youtubeUrl: string
  episodeNote: string
  sceneDescription: string
}
