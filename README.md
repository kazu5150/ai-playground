# AI Playground

最先端のAI技術を体験できるWebプラットフォームです。様々なAIプロダクトとツールを一つの場所で試すことができます。

## 🚀 機能一覧

### 📊 ランディングページ分析ツール
- **概要**: ランディングページをAIが詳細分析し、改善提案を提供
- **特徴**: 
  - 辛口でリアルな評価
  - 具体的な改善点の提案
  - コンバージョン率向上のための戦略的アドバイス
- **技術**: N8N webhook + AI分析エンジン

### 🤖 AIチャットボット  
- **概要**: OpenAI GPT-4を活用したインタリジェントな会話AI
- **特徴**:
  - 自然言語での対話
  - 文脈を理解した回答
  - 様々なトピックに対応
- **技術**: OpenAI API + Next.js

### 🎯 ペルソナ・マーケティング戦略ジェネレーター
- **概要**: サービス情報から顧客ペルソナとマーケティング戦略を自動生成
- **特徴**:
  - 日本市場向けペルソナ作成
  - ペルソナ別マーケティング施策提案
  - 実用的なアクションプラン
- **技術**: OpenAI GPT-4 + カスタムプロンプト

### 🗣️ AI音声会話エージェント
- **概要**: ElevenLabsの音声技術を使った自然な音声対話
- **特徴**:
  - リアルタイム音声会話
  - 高品質な音声合成
  - 直感的なインターフェース
- **技術**: ElevenLabs ConvAI Widget

### 📍 スマート場所検索
- **概要**: AIと位置情報を組み合わせた高度な場所検索サービス
- **特徴**:
  - 自然言語での検索クエリ
  - Google Places APIとの連携
  - AIによる検索結果の最適化
- **技術**: OpenAI API + Google Places API

## 🛠️ 技術スタック

- **フロントエンド**: Next.js 15, React 19, TypeScript
- **スタイリング**: Tailwind CSS 4
- **AI/ML**: OpenAI GPT-4, ElevenLabs
- **APIs**: Google Places API, N8N webhooks
- **デプロイ**: Vercel

## 📦 セットアップ

### 1. リポジトリのクローン
```bash
git clone <repository-url>
cd ai-playground
```

### 2. 依存関係のインストール
```bash
npm install
```

### 3. 環境変数の設定
`.env.local`ファイルを作成し、以下の環境変数を設定してください：

```env
OPENAI_API_KEY=your_openai_api_key
GOOGLE_PLACES_API_KEY=your_google_places_api_key
```

### 4. 開発サーバーの起動
```bash
npm run dev
```

http://localhost:3000 でアプリケーションにアクセスできます。

## 🚀 デプロイ

### Vercelへのデプロイ
1. Vercelアカウントにプロジェクトをインポート
2. 環境変数を設定（`OPENAI_API_KEY`, `GOOGLE_PLACES_API_KEY`）
3. デプロイを実行

### ビルドコマンド
```bash
npm run build
```

## 📁 プロジェクト構造

```
ai-playground/
├── src/
│   ├── app/
│   │   ├── api/                 # API routes
│   │   │   ├── analyze-website/ # ウェブサイト分析API
│   │   │   ├── chat/           # チャットボットAPI  
│   │   │   ├── generate-persona/ # ペルソナ生成API
│   │   │   ├── generate-marketing-strategy/ # マーケティング戦略API
│   │   │   └── smart-search-places/ # 場所検索API
│   │   ├── products/           # 各プロダクトページ
│   │   │   ├── ai-chatbot/
│   │   │   ├── persona-generator/
│   │   │   ├── place-finder/
│   │   │   ├── voice-chat/
│   │   │   └── website-analyzer/
│   │   ├── page.tsx            # メインページ
│   │   └── layout.tsx          # レイアウト
│   └── components/             # 共通コンポーネント
├── public/                     # 静的ファイル
└── README.md
```

## 🔧 開発

### コーディング規約
- TypeScriptを使用
- ESLintとNext.jsの設定に従う
- Tailwind CSSでスタイリング
- コンポーネントベースの設計

### API仕様
各APIエンドポイントは`/api`配下に配置され、Next.js API Routesとして実装されています。

## 📝 今後の予定

- [ ] 新しいAIツールの追加
- [ ] ユーザー認証機能
- [ ] 使用履歴の保存機能
- [ ] APIレート制限の実装
- [ ] モバイル対応の改善

## 🤝 コントリビューション

1. このリポジトリをフォーク
2. 機能ブランチを作成 (`git checkout -b feature/AmazingFeature`)
3. 変更をコミット (`git commit -m 'Add some AmazingFeature'`)
4. ブランチにプッシュ (`git push origin feature/AmazingFeature`)
5. プルリクエストを作成

## 📄 ライセンス

このプロジェクトはMITライセンスの下で公開されています。

## 📞 サポート

質問や問題がある場合は、GitHubのIssuesページでお知らせください。

---

**AI Playground** - 最先端AI技術の実験場へようこそ！
