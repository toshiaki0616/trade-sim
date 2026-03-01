/**
 * YouTube の URL または動画ID から 11文字の動画ID を抽出する
 * 対応フォーマット:
 *   - https://youtu.be/xxxxx
 *   - https://www.youtube.com/watch?v=xxxxx
 *   - https://www.youtube.com/embed/xxxxx
 *   - xxxxx（11文字の生ID）
 */
export function parseYouTubeId(input: string): string | null {
  const s = input.trim();
  const patterns = [
    /youtu\.be\/([a-zA-Z0-9_-]{11})/,
    /[?&]v=([a-zA-Z0-9_-]{11})/,
    /embed\/([a-zA-Z0-9_-]{11})/,
  ];
  for (const re of patterns) {
    const m = s.match(re);
    if (m) return m[1];
  }
  // 生ID（11文字英数字）
  if (/^[a-zA-Z0-9_-]{11}$/.test(s)) return s;
  return null;
}
