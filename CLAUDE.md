# CLAUDE.md

# 基本方針
- 必ず日本語で応対してください
- 調査やデバッグにはサブエージェントを活用してコンテキストを節約してください
- 重要な決定事項は定期的にマークダウンファイルに記録してください

# コード規約
- TypeScriptを使用
- テストはVitestで書く
- コミットメッセージは日本語で簡潔に

# Core Rules (絶対遵守)
- **Language**: 
  - Thinking Process: English (for better logic)
  - Final Response: Japanese (丁寧語で回答すること)
- **Security**: 
  - `.env` ファイルやAPIキーの中身は絶対に出力しないこと。
  - 認証情報は環境変数から読み込むコードのみを提案すること。
